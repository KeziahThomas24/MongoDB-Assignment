/********************************************************************************* 
* ITE5315 – Assignment 4 
* I declare that this assignment is my own work in accordance with Humber Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source 
* (including web sites) or distributed to other students. 
* 
* Name: Keziah Thomas Student ID: N01541155 Date: 25/11/23 
* 
* 
********************************************************************************/ 

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';

async function findAll() {
    
    // const client =  MongoClient.connect(url, { useNewUrlParser: true })
    //     .catch(err => { console.log("s2");console.log(err); });
    // if (!client) return;
        
    // try {
    //     console.log('1');
    //     const db =  client.db("mydb");
    //     console.log('2');
    //     let collection =  db.collection('customers');
    //     console.log('3');
    //     let cursor =  collection.find({}).limit(10);
    //     console.log('4');
    //     await cursor.forEach(doc => console.log(doc));
    //     console.log('5');
    // } catch (err) {
    //     console.log(err);
    // } finally {
    //     client.close();
    // }
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
            if (err) {
                reject(err);
                return;
            }

            console.log('1');
            const db = client.db('Company');
            console.log('2');
            const collection = db.collection('customers');
            console.log('3');
            
            collection.find({}).limit(10).toArray((err, docs) => {
                if (err) {
                    client.close();
                    reject(err);
                    return;
                }
                console.log('4');
                resolve(docs);
                console.log('5');
                client.close(); // Close the connection after resolving the Promise
            });
        });
    });
}
// setTimeout(()=>{
//     findAll();
//     console.log('iter');
// }, 5000);

setTimeout(() => {
    findAll()
        .then(docs => {
            console.log(docs);
        })
        .catch(err => {
            console.error('Error:', err);
        });
    console.log('iter');
}, 5000);