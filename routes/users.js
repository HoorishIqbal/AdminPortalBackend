var express = require('express');
var router = express.Router();

var queryhandler = require('../handlers/queryhandler');
var jwt = require('jsonwebtoken');

var fs = require('fs');
var privateKey = fs.readFileSync('./private.key', 'utf8');
//23-02-2020 start
var User = require('../models/user');
var Student = require('../models/student');
// Route to SignUp
router.post('/sign-up', function (req, res) {
  addToDB(req, res);
})
async function addToDB(req, res) {
  var user = new User({
    username: req.body.username,
    email: req.body.email,
    password: User.hashPassword(req.body.password),
    creation_dt: Date.now()
  });
  try {
    doc = await user.save();
    return res.status(201).json(doc);
  }
  catch (err) {
    return res.status(501).json(err);
  }
}

router.post('/login', function (req, res) {
  let promise = User.findOne({ email: req.body.email }).exec();
  promise.then(function (doc) {
    console.log("DOC ", doc);
    if (doc) {
      if (doc.isValid(req.body.password)) {
        var payload = { username: doc.username };
        var signOptions = {
          expiresIn: "3h"
        };
        let token = jwt.sign(payload, privateKey, signOptions);
        return res.status(200).json(token);
      }
      else {
        return res.status(501).json({ message: 'Wrong Password' })
      }
    }
    else {
      return res.status(501).json({ message: 'Email is not registered' });
    }
  })
})

//middleware for token verification
var decodeToken = '';
function TokenVerification(req,res,next){
  let token = req.query.token; //angular send token as request query parameter
  console.log(token);
  jwt.verify(token, privateKey, function(err,tokendata){
    if(err){
      return res.status(400).json({message:'Unauthorized Token'});
    }
    if(tokendata){
      decodeToken = tokendata;
      next();
    }
  })
}

router.get('/username', TokenVerification, function(req,res){
  console.log("Decoded token ", decodeToken.username);
  return res.status(200).json(decodeToken.username);
})

//Route to Add Student
router.post('/addStudent', TokenVerification, function (req, res) {
  addToStudent(req, res);
});
async function addToStudent(req, res) {
  var student = new Student({
    fullname: req.body.fullname,
    email: req.body.email,
    phone: req.body.phone,
    contactPreference: req.body.Preference,
    creation_dt: Date.now()
  });
  try {
    doc = await student.save();
    return res.status(201).json(doc);
  }
  catch (err) {
    return res.status(501).json(err);
  }
}

//Route to Get List of Students
router.get('/get-students', TokenVerification, async function(req, res){
  const StudentsList = await queryhandler.getStudents();
  res.status(200).json({
    error : false,
    students : StudentsList
  });
})

//Route to get Student Detail
router.get('/edit-student/:id', TokenVerification, async function(req, res, next){
  console.log("REQUEST ", req.params.id);
  const studentDetail = await queryhandler.studentDetail({
    studentId: req.params.id
  });
  res.status(200).json({
    error : false,
    studentDetail : studentDetail
  });
})

router.put('/update-student/:id', TokenVerification, async function(req,res){
  const updateStudent = await queryhandler.updateStudent({
    body: req.body
  });
  console.log(" :( ");
  res.status(200).json({
    error : false,
    updatedStudent : updateStudent
  });
})

router.delete('/delete-student/:id', TokenVerification, async function(req,res){
  const deleteStudent = await queryhandler.deleteStudent({
    studentId: req.params.id
  });
  res.status(200).json({
    error : false,
    deletedStudent : {}
  });
})

module.exports = router;
