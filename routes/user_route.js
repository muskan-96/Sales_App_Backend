const express=require('express');
const router=express.Router();
const bcryptjs=require('bcryptjs');
const jwt=require("jsonwebtoken");
const mongoose =require("mongoose");
const UserModel=  mongoose.model("UserModel");
const {JWT_SECRET}=require('../config');

//Registration api
router.post("/register",(req,res)=>{
    const{firstName,lastName,email,password}=req.body;
    if(!firstName ||!lastName||!password || !email ){
     return res.status(400).json({error:"one or more mandatory fields are empty"});
    }
    UserModel.findOne({email:email})
    .then((userInDB)=>{
         if(userInDB){
           return res.status(500).json({error:"user with this email already exist "});
     }
     bcryptjs.hash(password,16)
      .then((hashedPassword)=>{
         const user= new UserModel ({firstName,lastName,email,password:hashedPassword,});
         user.save()
         .then((newUser)=>{
             res.status(201).json({result:"user Registered Scucessfully!"});
         })
      })
    })
    .catch((err)=>{
     console.log(err);
    })
 });

//login api 
 
router.post("/login",(req,res)=>{
    const{email,password,}=req.body;
    if(!password || !email ){
        return res.status(400).json({error:"one or more mandatory fields are empty"});
    }
    UserModel.findOne({email:email})
    .then((userInDB)=>{
        if(!userInDB){
            return res.status(401).json({error:"Invalid credentials"});
        }
        bcryptjs.compare(password,userInDB.password)
        .then((didMatch)=>{
            if(didMatch){
                const jwtToken=jwt.sign({_id: userInDB._id},JWT_SECRET);
                const userInfo={"email":userInDB.email,"firstName":userInDB.firstName,"lastName":userInDB.lastName};
                res.status(200).json({token:jwtToken,user:userInfo});
            }else{
                return res.status(401).json({error:"Invalid credentials"});
            }
        })
        .catch((err)=>{
            console.log(err);
        });
    })
    .catch((err)=>{
        console.log(err);
    });
});

 module.exports= router;
 