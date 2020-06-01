'use strict';
var mongoose = require('mongoose');
class QueryHandler {
    constructor() {
        this.Mongodb = require("./../config/db");
    }

    getStudents() {
        return new Promise(async (resolve, reject) => {
            try {
                const [DB, ObjectID, client] = await this.Mongodb.onConnect();
                DB.collection('students').find({}, {
                    creation_dt: 0, fullname: 1, email: 1, phone: 1, contactPreference: 1
                }).toArray((err, result) => {
                    client.close();
                    if (err) { }
                    else {
                        console.log("Results ", result);
                        resolve(result);
                    }
                })
            }
            catch (error) {
                reject(error)
            }
        });
    }

    studentDetail({ studentId }) {
        console.log("Student Id is ", studentId);
        return new Promise(async (resolve, reject) => {
            try {
                const [DB, ObjectID, client] = await this.Mongodb.onConnect();
                DB.collection('students').findOne({ _id: ObjectID(studentId) }, function (err, document) {
                    client.close();
                    if (err) {
                        reject(err);
                    }
                    resolve(document);
                })
            }
            catch (error) {
                reject(error)
            }
        })
    }

    updateStudent({ body }) {
        console.log("STU ", body);
        return new Promise(async (resolve, reject) => {
            try {
                const [DB, ObjectID, client] = await this.Mongodb.onConnect();
                DB.collection('students').updateOne({
                    '_id': ObjectID(body._id)
                }, {
                    $set: {
                        fullname: body.fullname,
                        email: body.email,
                        phone: body.phone,
                        contactPreference: body.contactPreference
                    }
                }, (err, result) => {
                    client.close();
                    if (err) {
                        console.log("ERROR");
                    }
                    resolve(result);

                });
            }
            catch (error) {
                reject(error)
            }
        })
    }

    deleteStudent({studentId}){
        return new Promise(async (resolve, reject) => {
            try{
                const [DB, ObjectID, client] = await this.Mongodb.onConnect();
                DB.collection('students').deleteOne({
                    '_id': ObjectID(studentId)
                }, (err, result) => {
                    client.close();
                    if (err) {
                        console.log("ERROR");
                    }
                    resolve(result);
                });
            }
            catch (error) {
                reject(error)
            }
        })
    }
    
    login({ email }) {
        return new Promise(async (resolve, reject) => {
            try {
                const [DB, ObjectID, client] = await this.Mongodb.onConnect();
                DB.collection('users').findOne({ email: email }, function (err, doc) {
                    client.close();
                    if (err) {
                        reject(err)
                    }
                    resolve(doc);
                })
            }
            catch (error) {
                reject(error)
            }
        });
    }
}
module.exports = new QueryHandler();