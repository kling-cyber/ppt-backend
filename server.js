<<<<<<< HEAD
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../")));

/* ================= DATABASE ================= */
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected ✅"))
.catch(err=>console.log(err));

/* ================= MAIL ================= */
const transporter = nodemailer.createTransport({
service: "gmail",
auth: {
user: process.env.EMAIL,
pass: process.env.EMAIL_PASS
}
});

/* ================= MODELS ================= */
const User = mongoose.model("User", {
email: { type: String, unique: true },
password: String,
role: { type: String, default: "user" }
});

const Order = mongoose.model("Order", {
userId: String,
name: String,
phone: String,
title: String,
purpose: String,
slides: String,
deliveryDays: Number,
status: { type: String, default: "pending_confirmation" }
});

const Purchase = mongoose.model("Purchase", {
userId: String,
file: String,
title: String,
createdAt: { type: Date, default: Date.now }
});

/* ================= TOKEN VERIFY ================= */
function verifyToken(token){
try{
return jwt.verify(token, process.env.JWT_SECRET);
}catch{
return null;
}
}

/* ================= ADMIN AUTH ================= */
function verifyAdmin(req,res,next){
const token = req.headers.authorization;
const decoded = verifyToken(token);

if(!decoded || decoded.role !== "admin"){
return res.status(403).send("Admin only ❌");
}

req.user = decoded;
next();
}

/* ================= REGISTER ================= */
app.post("/register", async (req,res)=>{
const {email,password} = req.body;

const exists = await User.findOne({email});
if(exists) return res.status(400).json({message:"Email exists ❌"});

const hashed = await bcrypt.hash(password,10);

await User.create({email,password:hashed});
res.json({message:"Registered ✅"});
});

/* ================= LOGIN ================= */
app.post("/login", async (req,res)=>{
const {email,password} = req.body;

const user = await User.findOne({email});
if(!user) return res.status(400).json({message:"No user ❌"});

const match = await bcrypt.compare(password,user.password);
if(!match) return res.status(400).json({message:"Wrong password ❌"});

const token = jwt.sign(
{id:user._id, role:user.role || "user"},
process.env.JWT_SECRET,
{expiresIn:"2h"}
);

res.json({token, role:user.role});
});

/* ================= ORDER ================= */
app.post("/order", async (req,res)=>{
const token = req.headers.authorization;
const decoded = verifyToken(token);

if(!decoded){
return res.status(401).json({message:"Session expired ❌"});
}

const {name, phone, title, purpose, slides} = req.body;

await Order.create({
userId: decoded.id,
name,
phone,
title,
purpose,
slides
});

res.send("Order created ✅");
});

/* ================= ADMIN ORDERS ================= */
app.get("/admin/orders", verifyAdmin, async (req,res)=>{
const pending = await Order.find({status:"pending_confirmation"});
const confirmed = await Order.find({status:"confirmed"});
const completed = await Order.find({status:"completed"});

res.json({pending, confirmed, completed});
});

/* ================= COMPLETE (DELIVER) ================= */
app.post("/admin/complete", verifyAdmin, async (req,res)=>{

const {orderId, fileName} = req.body;

const order = await Order.findById(orderId);

await Purchase.create({
userId: order.userId,
file: fileName,
title: order.title
});

order.status = "completed";
await order.save();

res.send("Delivered ✅");
});

/* ================= DELETE SELECTED ================= */
app.post("/admin/delete-selected", verifyAdmin, async (req,res)=>{

const {ids} = req.body;

if(!ids || ids.length === 0){
return res.status(400).send("No IDs provided ❌");
}

await Order.deleteMany({
_id: { $in: ids }
});

res.send("Deleted selected ✅");
});

/* ================= CLEAR ALL ================= */
app.post("/admin/clear-all", verifyAdmin, async (req,res)=>{

await Order.deleteMany({});

res.send("All cleared 🧹");
});

/* ================= SECURE PDF ================= */
app.get("/secure-pdf/:file", async (req,res)=>{

const token = req.query.token;
const decoded = verifyToken(token);

if(!decoded){
return res.status(401).send("Unauthorized ❌");
}

const fileName = req.params.file;

/* 🆓 FREE FILES */
const freeFiles = ["ai.pdf","habits.pdf","control.pdf"];

if(!freeFiles.includes(fileName)){

```
const access = await Purchase.findOne({
  userId: decoded.id,
  file: fileName
});

if(!access){
  return res.status(403).send("Not purchased ❌");
}
```

}

const filePath = path.join(__dirname,"pdfs",fileName);

if(!fs.existsSync(filePath)){
return res.status(404).send("File not found ❌");
}

res.setHeader("Content-Type","application/pdf");
res.setHeader("Content-Disposition","inline");

fs.createReadStream(filePath).pipe(res);
});

/* ================= ROOT ================= */
app.get("/", (req,res)=>{
res.sendFile(path.join(__dirname,"../index.html"));
});

/* ================= START ================= */
app.listen(process.env.PORT || 5000, ()=>{
console.log("Server running at http://localhost:5000 🚀");
});
=======
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../")));

/* ================= DATABASE ================= */
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected ✅"))
.catch(err=>console.log(err));

/* ================= MAIL ================= */
const transporter = nodemailer.createTransport({
service: "gmail",
auth: {
user: process.env.EMAIL,
pass: process.env.EMAIL_PASS
}
});

/* ================= MODELS ================= */
const User = mongoose.model("User", {
email: { type: String, unique: true },
password: String,
role: { type: String, default: "user" }
});

const Order = mongoose.model("Order", {
userId: String,
name: String,
phone: String,
title: String,
purpose: String,
slides: String,
deliveryDays: Number,
status: { type: String, default: "pending_confirmation" }
});

const Purchase = mongoose.model("Purchase", {
userId: String,
file: String,
title: String,
createdAt: { type: Date, default: Date.now }
});

/* ================= TOKEN VERIFY ================= */
function verifyToken(token){
try{
return jwt.verify(token, process.env.JWT_SECRET);
}catch{
return null;
}
}

/* ================= ADMIN AUTH ================= */
function verifyAdmin(req,res,next){
const token = req.headers.authorization;
const decoded = verifyToken(token);

if(!decoded || decoded.role !== "admin"){
return res.status(403).send("Admin only ❌");
}

req.user = decoded;
next();
}

/* ================= REGISTER ================= */
app.post("/register", async (req,res)=>{
const {email,password} = req.body;

const exists = await User.findOne({email});
if(exists) return res.status(400).json({message:"Email exists ❌"});

const hashed = await bcrypt.hash(password,10);

await User.create({email,password:hashed});
res.json({message:"Registered ✅"});
});

/* ================= LOGIN ================= */
app.post("/login", async (req,res)=>{
const {email,password} = req.body;

const user = await User.findOne({email});
if(!user) return res.status(400).json({message:"No user ❌"});

const match = await bcrypt.compare(password,user.password);
if(!match) return res.status(400).json({message:"Wrong password ❌"});

const token = jwt.sign(
{id:user._id, role:user.role || "user"},
process.env.JWT_SECRET,
{expiresIn:"2h"}
);

res.json({token, role:user.role});
});

/* ================= ORDER ================= */
app.post("/order", async (req,res)=>{
const token = req.headers.authorization;
const decoded = verifyToken(token);

if(!decoded){
return res.status(401).json({message:"Session expired ❌"});
}

const {name, phone, title, purpose, slides} = req.body;

await Order.create({
userId: decoded.id,
name,
phone,
title,
purpose,
slides
});

res.send("Order created ✅");
});

/* ================= ADMIN ORDERS ================= */
app.get("/admin/orders", verifyAdmin, async (req,res)=>{
const pending = await Order.find({status:"pending_confirmation"});
const confirmed = await Order.find({status:"confirmed"});
const completed = await Order.find({status:"completed"});

res.json({pending, confirmed, completed});
});

/* ================= COMPLETE (DELIVER) ================= */
app.post("/admin/complete", verifyAdmin, async (req,res)=>{

const {orderId, fileName} = req.body;

const order = await Order.findById(orderId);

await Purchase.create({
userId: order.userId,
file: fileName,
title: order.title
});

order.status = "completed";
await order.save();

res.send("Delivered ✅");
});

/* ================= DELETE SELECTED ================= */
app.post("/admin/delete-selected", verifyAdmin, async (req,res)=>{

const {ids} = req.body;

if(!ids || ids.length === 0){
return res.status(400).send("No IDs provided ❌");
}

await Order.deleteMany({
_id: { $in: ids }
});

res.send("Deleted selected ✅");
});

/* ================= CLEAR ALL ================= */
app.post("/admin/clear-all", verifyAdmin, async (req,res)=>{

await Order.deleteMany({});

res.send("All cleared 🧹");
});

/* ================= SECURE PDF ================= */
app.get("/secure-pdf/:file", async (req,res)=>{

const token = req.query.token;
const decoded = verifyToken(token);

if(!decoded){
return res.status(401).send("Unauthorized ❌");
}

const fileName = req.params.file;

/* 🆓 FREE FILES */
const freeFiles = ["ai.pdf","habits.pdf","control.pdf"];

if(!freeFiles.includes(fileName)){

```
const access = await Purchase.findOne({
  userId: decoded.id,
  file: fileName
});

if(!access){
  return res.status(403).send("Not purchased ❌");
}
```

}

const filePath = path.join(__dirname,"pdfs",fileName);

if(!fs.existsSync(filePath)){
return res.status(404).send("File not found ❌");
}

res.setHeader("Content-Type","application/pdf");
res.setHeader("Content-Disposition","inline");

fs.createReadStream(filePath).pipe(res);
});

/* ================= ROOT ================= */
app.get("/", (req,res)=>{
res.sendFile(path.join(__dirname,"../index.html"));
});

/* ================= START ================= */
app.listen(process.env.PORT || 5000, ()=>{
console.log("Server running at http://localhost:5000 🚀");
});
>>>>>>> 1c85ea23d9d865ec4bcf7c9d85b8715aa9c8b7a4
