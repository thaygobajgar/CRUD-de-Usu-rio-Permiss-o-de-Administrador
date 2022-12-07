import { hash } from "bcryptjs";
import users from "../database";
import { v4 as uuidv4 } from "uuid";

export const createUserService = async (userData) => {
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

export const deleteUserService = (id) => {
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

export const listUsersService = () => {
  return [200, users];
};

export const showProfileService = (id) => {
  const user = users.find((obj) => obj.uuid === id);

  if (user) {
    const { uuid, createdOn, updatedOn, name, email, isAdm } = user;

    return [200, { uuid, createdOn, updatedOn, name, email, isAdm }];
  }

  return [404, { message: "User not found" }];
};

export const updateUserService = (id, newData) => {
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
