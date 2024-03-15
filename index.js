import express  from "express";
import { MongoClient } from 'mongodb'
import { ObjectId } from "mongodb"
const app = express();
const url="mongodb+srv://aravindh230:oOvkOEZhq6Wleh6W@aravindh.fvyn0by.mongodb.net/?retryWrites=true&w=majority&appName=Aravindh";
const client=new MongoClient(url);
await client.connect();
console.log("Connected successfully"); 

app.use(express.json());
app.get("/",function(req,res){
    res.send("Hello World");
});

app.post("/post",async function(req,res){
    const getpostmon=req.body;
    const sendmethod=await client.db("CRUD").collection("data").insertOne(getpostmon);
    res.send(sendmethod);
   
});

app.post("/postmany",async function(req,res){
    const getpostmany=req.body;
    const sendmethod=await client.db("CRUD").collection("data").insertMany(getpostmany);
    res.send(sendmethod);
    console.log(getpostmany);
});

app.get("/get",async function(req,res){
     const sendmethod=await client.db("CRUD").collection("data").find({}).toArray();
     res.send(sendmethod);
});

app.get("/getone/:id",async function(req,res){
    const {id}=req.params;
    const sendmethod=await client.db("CRUD").collection("data").findOne({_id:new ObjectId(id)});
    res.send(sendmethod);
    console.log(sendmethod);
});

app.put("/update/:id",async function(req,res){
  const {id}=req.params;
  const getpostman=req.body;
  const updatemethod=await client.db("CRUD").collection("data").updateOne({_id:new ObjectId(id)},{$set:getpostman});
  res.send(updatemethod);
});

app.delete("/delete/:id",async function(req,res){
    const {id}=req.params;
    const deletemethod=await client.db("CRUD").collection("data").deleteOne({_id:new ObjectId(id)});
    res.send(deletemethod);
});
app.listen(4000,()=>{
    console.log("server is running");
});