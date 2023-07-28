const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user')
const bcrypt = require('bcryptjs')
const app = express();
const jwt = require('jsonwebtoken')

const salt = bcrypt.genSaltSync(10);
const secret = 'ksdkhdgksdfgjjhdhk'

app.use(cors());
app.use(express.json());

const uri = 'mongodb+srv://oromena97:Mesutozil11@cluster0.ciat7bd.mongodb.net/user?retryWrites=true&w=majority'

mongoose.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("connected to DB"))
.catch(eer => {
    console.error("failed to connect to DB:", err);
    process.exit(1);
});

app.post('/register', async (req,res) => {
    const {username, password} = req.body;
    try{
      const userDoc = await User.create({
        username, 
        password:bcrypt.hashSync(password,salt),
    });
      res.json(userDoc);
    } catch(e) {
        res.status(400).json(e)
    };
   
});

app.post('/login', async (req,res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
        //logged in
        jwt.sign({username,id:userDoc._id}, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json();
        });
        //res.json
    } else {
        res.status(400).json('wrong credentials');
    }
});



app.listen(4040);
