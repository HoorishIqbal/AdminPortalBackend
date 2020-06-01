"use strict";
/*requiring mongodb node modules */
const mongodb = require('mongodb');
const assert = require('assert');

class Db{

	constructor(){
		this.mongoClient = mongodb.MongoClient;
		this.ObjectID = mongodb.ObjectID;
	}

	onConnect(){
		const mongoURL = "mongodb://localhost";
		const dbName = 'AdminPanel';
		return new Promise( (resolve, reject) => {
			this.mongoClient.connect((encodeURI(mongoURL)), { useUnifiedTopology: true, useNewUrlParser: true}, (err, client) => {
				if (err) {
					reject(err);
				} else {
                    assert.equal(null, err);
					console.log("Connected successfully to server");
					const db = client.db(dbName);
					resolve([db,this.ObjectID,client]);
				}
			});
		});
	}
}
module.exports = new Db();