import express, { request, response } from "express";
import users from "./database";
import { v4 as uuidv4 } from "uuid";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import userRoutes from "./routers/users.routes";
import sessionRoutes from "./routers/session.routes";
// const express = require("express");

const app = express();
app.use(express.json());
app.use("/users", userRoutes);
app.use("/login", sessionRoutes);

export default app;
