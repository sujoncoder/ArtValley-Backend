import express from "express";
import { getAllUser, getUser } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/users").get(getAllUser);
router.route("/user/:id").get(getUser);

export default router;
