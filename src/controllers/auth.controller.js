import bcrypt from "bcryptjs";
import errorHandler from "../middlewares/errorHandler.js";
import User from "../models/user.model.js";

export const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const existEmail = await User.findOne({ email });

    if (existEmail) return next(errorHandler(400, "User email already exist."));

    // password hash
    const hashPassword = await bcrypt.hash(password, 10);
    // create user
    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    res.status(201).json({
      message: "User created successful",
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: "User not created !",
      error: error.message,
    });
  }
};
