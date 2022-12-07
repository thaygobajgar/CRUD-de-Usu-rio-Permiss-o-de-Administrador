import { createSessionService } from "../services/session.services";

export const createSessionController = async (req, res) => {
  const [status, data] = await createSessionService(req.body);
  return res.status(status).json(data);
};
