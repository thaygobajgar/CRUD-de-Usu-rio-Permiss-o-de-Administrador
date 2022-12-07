import express, { request, response } from "express";
import users from "./database";
import { v4 as uuidv4 } from "uuid";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
// const express = require("express");

const app = express();
app.use(express.json());

// MIDDLEWARES
const ensureAdminAuthMiddleware = (req, res, next) => {
  let authorization = req.headers.authorization;
  return jwt.verify(
    authorization.split(" ")[1],
    "SECRET_KEY",
    (error, decoded) => {
      if (!decoded.isAdm) {
        return res.status(403).json({
          message: "Missing Admin Permissions",
        });
      }
      next();
    }
  );
};
const ensureAuthMiddleware = (req, res, next) => {
  let authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      message: "Missing authorization headers",
    });
  }

  return jwt.verify(
    authorization.split(" ")[1],
    "SECRET_KEY",
    (error, decoded) => {
      if (error) {
        return res.status(401).json({
          message: "Invalid token",
        });
      }
      req.user = { uuid: decoded.sub, isAdm: decoded.isAdm };

      return next();
    }
  );
};
const ensureEmailExists = (req, res, next) => {
  const emailIndex = users.findIndex((e) => e.email === req.body.email);
  if (emailIndex >= 0) {
    return res.status(409).json({
      message: "Email already in use",
    });
  }

  return next();
};
const ensureIsOwnerOrAdmin = (req, res, next) => {
  if (!req.user.isAdm) {
    if (req.user.uuid === req.params.id) {
      next();
    }
    return res.status(403).json({ message: "AQUI Missing admin permissions" });
  }

  next();
};

// SERVICES
const createUserService = async (userData) => {
  const user = {
    uuid: uuidv4(),
    ...userData,
    password: await hash(userData.password, 12),
    createdOn: new Date(),
    updatedOn: new Date(),
  };
  users.push(user);
  const { uuid, isAdm, email, name, createdOn, updatedOn } = user;
  return [201, { uuid, isAdm, email, name, createdOn, updatedOn }];
};
const createSessionService = async (userData) => {
  const user = users.find((obj) => obj.email === userData.email);
  if (user) {
    const passwordVerify = await compare(userData.password, user.password);
    if (passwordVerify) {
      const token = jwt.sign({ isAdm: user.isAdm }, "SECRET_KEY", {
        expiresIn: "24h",
        subject: user.uuid,
      });
      return [200, { token: token }];
    }
    return [401, { message: "Email or password incorrect" }];
  }
  return [401, { message: "Email or password incorrect" }];
};
const deleteUserService = (id) => {
  const user = users.find((obj) => obj.uuid === id);
  if (!user) {
    return [
      404,
      {
        message: "User not found",
      },
    ];
  }
  const userIndex = users.findIndex((obj) => obj.uuid === id);
  users.splice(1, userIndex);
  return [204, {}];
};
const listUsersService = () => {
  return [200, users];
};
const showProfileService = (id) => {
  const user = users.find((obj) => obj.uuid === id);

  if (user) {
    const { uuid, createdOn, updatedOn, name, email, isAdm } = user;

    return [200, { uuid, createdOn, updatedOn, name, email, isAdm }];
  }

  return [404, { message: "User not found" }];
};
const updateUserService = (id, newData) => {
  const user = users.find((obj) => obj.uuid === id);
  const userIndex = users.findIndex((obj) => obj.uuid === id);
  if (user) {
    user.updatedOn = new Date();

    users[userIndex] = {
      ...user,
      ...newData,
    };
    const { uuid, isAdm, email, name, createdOn, updatedOn } = users[userIndex];

    return [200, { uuid, isAdm, email, name, createdOn, updatedOn }];
  }
  return [403, { message: "missing admin permissions" }];
};

// CONTROLLERS

const createUserController = async (req, res) => {
  const [status, data] = await createUserService(req.body);
  return res.status(status).json(data);
};

const createSessionController = async (req, res) => {
  const [status, data] = await createSessionService(req.body);
  return res.status(status).json(data);
};
const deleteUserController = (req, res) => {
  const [status, data] = deleteUserService(req.user.uuid);
  return res.status(status).json(data);
};

const listUsersController = (req, res) => {
  const [status, data] = listUsersService();
  return res.status(status).json(data);
};
const showProfileController = (req, res) => {
  const [status, data] = showProfileService(req.user.uuid);
  return res.status(status).json(data);
};

const updateUserController = (req, res) => {
  const [status, data] = updateUserService(req.user.uuid, req.body);
  return res.status(status).json(data);
};

// ROUTES
app.patch(
  "/users/:id",
  ensureAuthMiddleware,
  ensureIsOwnerOrAdmin,
  updateUserController
);

app.delete(
  "/users/:id",
  ensureAuthMiddleware,
  ensureIsOwnerOrAdmin,
  deleteUserController
);

app.listen(3000, () => {
  console.log("Server running in port 3000");
});
app.get(
  "/users",
  ensureAuthMiddleware,
  ensureAdminAuthMiddleware,
  listUsersController
);
app.get("/users/profile", ensureAuthMiddleware, showProfileController);
app.post("/users", ensureEmailExists, createUserController);
app.post("/login", createSessionController);

export default app;
