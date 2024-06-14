import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken"; // Import jsonwebtoken
import errorHandler from "../middlewares/errorHandler.js";
import User from "../models/user.model.js";

// SIGN-UP
export const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const existEmail = await User.findOne({ email });

    if (existEmail)
      return next(errorHandler(400, "User email already exists."));

    // password hash
    const hashPassword = await bcrypt.hash(password, 10);
    // create user
    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    res.status(201).json({
      succes: true,
      message: "User created successfully",
      user: {
        name,
        email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// SIGN-IN
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // exist user
    const user = await User.findOne({ email });

    if (!user) return next(errorHandler(404, "User does not exist"));
    // match password
    const correctPass = await bcrypt.compare(password, user.password);
    if (!correctPass) return next(errorHandler(400, "Password does not match"));
    // defined access token
    const accessToken = process.env.ACCESS_TOKEN_SECRET;
    const accessTokenExpire = process.env.ACCESS_TOKEN_EXPIRE_IN;
    // create access token
    const token = Jwt.sign({ _id: user._id }, accessToken, {
      expiresIn: accessTokenExpire,
    });
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({
        user: {
          success: true,
          message: "You are successfully logged in.",
          token,
        },
      });
  } catch (error) {
    next(error);
  }
};
