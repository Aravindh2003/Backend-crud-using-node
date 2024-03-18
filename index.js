import express  from "express";
import { MongoClient } from 'mongodb'
import { ObjectId } from "mongodb"
import cors from "cors";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";
const app = express();
const url="mongodb+srv://aravindh230:oOvkOEZhq6Wleh6W@aravindh.fvyn0by.mongodb.net/?retryWrites=true&w=majority&appName=Aravindh";
const client=new MongoClient(url);
await client.connect();
console.log("Connected successfully"); 

app.use(express.json());
app.use(cors());

const auth=(req,res,next)=>{
    try{
     const token=req.header("backend-token");
     jwt.verify(token,"student");
     next();
    }catch(err){
      res.status(401).send({message:err.message});
    }
}
app.get("/",function(req,res){
    res.status(200).send("Hello World");
});

app.post("/post",async function(req,res){
    const getpostmon=req.body;
    const sendmethod=await client.db("CRUD").collection("data").insertOne(getpostmon);
    res.status(201).send(sendmethod);
   
});

app.post("/postmany",async function(req,res){
    const getpostmany=req.body;
    const sendmethod=await client.db("CRUD").collection("data").insertMany(getpostmany);
    res.status(201).send(sendmethod);
    console.log(getpostmany);
});

app.get("/get",auth,async function(req,res){
     const sendmethod=await client.db("CRUD").collection("data").find({}).toArray();
     res.status(200).send(sendmethod);
});

app.get("/getone/:id",async function(req,res){
    const {id}=req.params;
    const sendmethod=await client.db("CRUD").collection("data").findOne({_id:new ObjectId(id)});
    res.status(200).send(sendmethod);
    console.log(sendmethod);
});

app.put("/update/:id",async function(req,res){
  const {id}=req.params;
  const getpostman=req.body;
  const updatemethod=await client.db("CRUD").collection("data").updateOne({_id:new ObjectId(id)},{$set:getpostman});
  res.status(201).send(updatemethod);
});

app.delete("/delete/:id",async function(req,res){
    const {id}=req.params;
    const deletemethod=await client.db("CRUD").collection("data").deleteOne({_id:new ObjectId(id)});
    res.status(200).send(deletemethod);
});

app.post("/register",async function(req,res){
    const {username,email,password}=req.body;
    const userfind=await client.db("CRUD").collection("register").findOne({email:email});
    if(userfind){
        res.status(400).send("user already exist");
    }else{
       
        const salt=await bcrypt.genSalt(10);
        const hashPassword=await bcrypt.hash(password, salt);
            //console.log(hashPassword);
         const sendmethod=await client.db("CRUD").collection("register").insertOne({username:username,email:email,password:hashPassword});
       res.status(201).send(sendmethod);
  
    }
   
}); 


app.post("/login",async function(req, res){
    const {email,password}=req.body;
   // console.log(email);
   // console.log(password);
    const userfind=await client.db("CRUD").collection("register").findOne({email:email});
    if(userfind){
        //const salt=await bcrypt.genSalt(10);
        //const hashPassword=await bcrypt.hash(password, salt);
        const mongodbPassword=userfind.password;
        const passwordcheck=await bcrypt.compare(password,mongodbPassword);
        //console.log(passwordcheck);
        if(passwordcheck){
           // const token=Jwt.sign({id:userfind._id,email:userfind.email,username:userfind.username},process.env.JWT_SECRET);
           const token=jwt.sign({id:userfind._id},"student");
           res.status(200).send({token:token});
            //res.status(200).send(userfind);
        }else{
            res.status(400).send("wrong password");
        }
    }else{
        res.status(400).send("user not found");
    }
});


app.listen(4000,()=>{
    console.log("server is running");
});