
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const firebase = require('firebase');
const phone = require('phone');
require("dotenv").config();

const app = express();
admin.initializeApp();

const firebaseConfig = {
  apiKey: "AIzaSyAn7wPxJPpH_RcSJKbJltFBfKVYFXE0llY",
  authDomain: "skipli-interview.firebaseapp.com",
  databaseURL: "https://skipli-interview.firebaseio.com",
  projectId: "skipli-interview",
  storageBucket: "skipli-interview.appspot.com",
  messagingSenderId: "173165970388",
  appId: "1:173165970388:web:5bda2dab770a4557b80c41",
  measurementId: "G-FLLV5Y9R8K"
};

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const firestore = admin.firestore();
app.use(cors({ origin: true }));
firebase.initializeApp(firebaseConfig);

//Get all the users from database
app.get('/getUsers',(req, res) => {
    firestore.collection('users').get()
        .then(data => {
            let users = [];
            data.forEach(doc => {
                users.push({
                    userId: doc.id,
                    firstname: doc.data().firstname,
                    lastname: doc.data().lastname,
                    phone: doc.data().phone,
                    code: doc.data().code,
                    createAt: doc.data().createAt
                });
            });
            return res.json(users);
        })
        .catch(err => console.error(err));
});

//Add one user
app.post('/addUser',(req, res) => {
    const newUser = {
        firstname:req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        code: "",
        createAt: new Date().toISOString()
    };
    firestore.collection('users').add(newUser)
        .then((doc) => {
            res.json({message: `document ${doc.id} created sucessfully` });
        })
        .catch((err) => {
            res.status(500).json({error: 'something went wrong'});
            console.error(err);
        });
});

//helper functions
const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
}

//add new user through sign up
app.post('/signup',(req, res) =>{
    const newUser = {
        firstname:req.body.firstname,
        lastname: req.body.lastname,
        phone: phone(req.body.phone)[0],
        code: "",
        createAt: "" //new Date().toISOString()
    };

    //validate data
    let errors ={};

    if(isEmpty(newUser.firstname)){
        errors.firstname = 'Must not be empty'
    }
    if(isEmpty(newUser.lastname)){
        errors.lastname = 'Must not be empty'
    }
    if(isEmpty(newUser.phone)){
        errors.phone = 'Must not be empty'
    }else if(Object.keys(phone(newUser.phone)).length === 0){
        errors.phone = 'Must be a valid phone number'
    }

    if(Object.keys(errors).length > 0) return res.status(400).json(errors);

    firestore.collection('users').get()
        .then(data =>{
            let dup=0;
            data.forEach(doc =>{
                if(doc.data().phone === phone(req.body.phone)[0]){
                 dup+=1;
                }
            });
            if(dup > 0) return res.status(400).json({ phone: 'this phone number is already taken'});
            else{
                firestore.collection('users').add(newUser)
            .then((doc) => {
                res.status(200).json({message: `document ${doc.id} signed up sucessfully` });
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).json({error: err.code});
            });
            }
        })
            .catch((err) => {
            console.error(err);
            return res.status(500).json({error: err.code});
        });




});

app.post('/createNewAccessCode',(req, res) => {
    //get a random 6 digit code
    let code = Math.floor(100000 + Math.random() * 900000);
    let id;
    firestore.collection('users').get()
        .then(data =>{
                let match =[];
                data.forEach(doc => {
                    if(doc.data().phone === phone(req.body.phone)[0]){
                    match.push({
                    userId: doc.id,
                    firstname: doc.data().firstname,
                    lastname: doc.data().lastname,
                    phone: doc.data().phone,
                    code: doc.data().code,
                    createAt: doc.data().createAt
                    });
                    id = doc.id;
                    }

                });
                if(Object.keys(match).length === 0) return res.status(400).json({error: 'Unknown phone number'});
                else{
                    firestore.collection('users').doc(id).update({
                        code: code,
                        createAt: new Date().toISOString()
                    })
                }
        })
            .then(() => {
                client.messages.create({
                    body: `Validation code: ${code}, phone: ${phone(req.body.phone)[0]}`,
                    from: '+12564004397',
                    to: `${phone(req.body.phone)[0]}`
                });
            })
            .then(() => {
                return res.status(200).json({message: 'Code sent successfully.'});
            })
            .catch((err) => {
            console.error(err);
            return res.status(500).json({error: err.code});
        });

});

app.post('/ValidateAccessCode',(req, res) => {
    let id, code, timeStamp1, timeStamp2;
    firestore.collection('users').get()
        .then(data =>{
                let match =[];
                data.forEach(doc => {
                    if(doc.data().phone === phone(req.body.phone)[0]){
                    match.push({
                    userId: doc.id,
                    firstname: doc.data().firstname,
                    lastname: doc.data().lastname,
                    phone: doc.data().phone,
                    code: doc.data().code,
                    createAt: doc.data().createAt
                    });
                    id = doc.id;
                    code = doc.data().code;
                    }

                });

                if(Object.keys(match).length === 0) return res.status(400).json({error: 'Unknown phone number'});
                if(code !== parseInt(req.body.code)) {
                    return res.status(400).json({error: 'Wrong validation code'});
                }

                timeStamp1 = new Date(match['createAt']);
                timeStamp2 = new Date();
                let diffMin = Math.round((((timeStamp2 - timeStamp1) % 86400000) % 3600000) / 60000);
                if(diffMin >= 1) {
                return res.status(400).json({error: 'Validation code expired'});
                }
                else{
                    return res.status(200).json({success: true});
                }
        })
        .then(() => {
            firestore.collection('users').doc(id).update({
                        code: ""
                    });
        })
            .catch((err) => {
            console.error(err);
            return res.status(500).json({error: err.code});
    });

})

exports.app = functions.https.onRequest(app);