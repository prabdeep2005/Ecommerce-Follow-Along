import express, { urlencoded } from "express";
import dotenv from "dotenv/config";
import http from "http";
import connectDB from "./config/db.js";
import UserModel from "./model/user.model.js";

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.get("/prab", (req, res) => {
  res.send("hi");
  const response = req.body();
  console.log(response);
});

//user create
app.post("/create", async (req, res) => {
  let { name, email, password } = req.body;

  try {
    const createuser = new UserModel({ name, password, email });
    await createuser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create user", error });
  }
});

connectDB();

server.listen(process.env.PORT, () => {
  console.log("running on 7000");
});