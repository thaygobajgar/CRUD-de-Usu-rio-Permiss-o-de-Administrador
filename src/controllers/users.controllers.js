import {
  createUserService,
  deleteUserService,
  listUsersService,
  showProfileService,
  updateUserService,
} from "../services/user.services";

export const updateUserController = (req, res) => {
  const [status, data] = updateUserService(req.user.uuid, req.body);
  return res.status(status).json(data);
};

export const showProfileController = (req, res) => {
  const [status, data] = showProfileService(req.user.uuid);
  return res.status(status).json(data);
};

export const listUsersController = (req, res) => {
  const [status, data] = listUsersService();
  return res.status(status).json(data);
};

export const deleteUserController = (req, res) => {
  const [status, data] = deleteUserService(req.user.uuid);
  return res.status(status).json(data);
};

export const createUserController = async (req, res) => {
  const [status, data] = await createUserService(req.body);
  return res.status(status).json(data);
};
