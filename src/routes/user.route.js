import express from "express";
import { getAllUser, singleUser } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/allUser").get(getAllUser);
router.route("/user/:id").get(singleUser);

export default router;
