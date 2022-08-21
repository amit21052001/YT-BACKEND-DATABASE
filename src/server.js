const express = require("express");
const app = express();
import { config } from "dotenv";
import { connect } from "mongoose";
import AuthRoutes from "./Routes/Auth.routes";
import cors from "cors";
config();

//====================== Middle-Wares ================

app.use(cors());

//====================== MongoDB Connection =============

const mongoURI = process.env.mongoURI;
connect(mongoURI, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log("Connected to mongoDB database....");
});

//====================== Server EndPoints =================

app.use(AuthRoutes);

const PORT = process.env.PORT ?? 5000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
