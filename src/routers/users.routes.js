import { Router } from "express";
import {
  createUserController,
  deleteUserController,
  listUsersController,
  showProfileController,
  updateUserController,
} from "../controllers/users.controllers";
import ensureAdminAuthMiddleware from "../middlewares/ensureAdminAuth.middleware";
import ensureAuthMiddleware from "../middlewares/ensureAuth.middleware";
import ensureEmailExists from "../middlewares/ensureEmailExists.middleware";
import ensureIsOwnerOrAdmin from "../middlewares/ensureIsOwnerOrAdmin.middleware";

const userRoutes = Router();

userRoutes.patch(
  "/:id",
  ensureAuthMiddleware,
  ensureIsOwnerOrAdmin,
  updateUserController
);

userRoutes.delete(
  "/:id",
  ensureAuthMiddleware,
  ensureIsOwnerOrAdmin,
  deleteUserController
);

userRoutes.get(
  "",
  ensureAuthMiddleware,
  ensureAdminAuthMiddleware,
  listUsersController
);

userRoutes.get("/profile", ensureAuthMiddleware, showProfileController);

userRoutes.post("", ensureEmailExists, createUserController);

export default userRoutes;
