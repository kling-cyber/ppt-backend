<<<<<<< HEAD
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/* ================= CONNECT ================= */
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected ✅"))
.catch(err=>console.log(err));

/* ================= MODEL ================= */
const User = mongoose.model("User", {
  email: String,
  password: String,
  role: { type: String, default: "user" }
});

/* ================= CREATE ADMIN ================= */
async function createAdmin(){

  try{

    const email = "kittyismineishipher@gmail.com";
    const password = "Kajal@98";

    // 🔍 Check if admin already exists
    const existing = await User.findOne({ email });

    if(existing){
      console.log("Admin already exists ⚠️");
      process.exit();
    }

    // 🔐 Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 🧑‍💼 Create admin
    await User.create({
      email,
      password: hashed,
      role: "admin"
    });

    console.log("Admin created successfully ✅");
    console.log("Email:", email);
    console.log("Password:", password);

    process.exit();

  }catch(err){
    console.log("Error:", err);
    process.exit();
  }
}

/* ================= RUN ================= */
=======
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/* ================= CONNECT ================= */
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected ✅"))
.catch(err=>console.log(err));

/* ================= MODEL ================= */
const User = mongoose.model("User", {
  email: String,
  password: String,
  role: { type: String, default: "user" }
});

/* ================= CREATE ADMIN ================= */
async function createAdmin(){

  try{

    const email = "kittyismineishipher@gmail.com";
    const password = "Kajal@98";

    // 🔍 Check if admin already exists
    const existing = await User.findOne({ email });

    if(existing){
      console.log("Admin already exists ⚠️");
      process.exit();
    }

    // 🔐 Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 🧑‍💼 Create admin
    await User.create({
      email,
      password: hashed,
      role: "admin"
    });

    console.log("Admin created successfully ✅");
    console.log("Email:", email);
    console.log("Password:", password);

    process.exit();

  }catch(err){
    console.log("Error:", err);
    process.exit();
  }
}

/* ================= RUN ================= */
>>>>>>> 1c85ea23d9d865ec4bcf7c9d85b8715aa9c8b7a4
createAdmin();