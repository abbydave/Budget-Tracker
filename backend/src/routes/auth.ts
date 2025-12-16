import { Request, Response, Router } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res
      .status(422)
      .json({ message: "All fields required", success: false, data: null });
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(409)
        .json({
          message: "User already exists, login instead",
          success: false,
          data: null,
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      message: "Registered Successfuly",
      success: true,
      data: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(422)
      .json({ message: "All fields required", success: false, data: null });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(409)
        .json({
          message: "User does not exist, Register!",
          success: false,
          data: null,
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "30d",
    });

    res.status(201).json({
      message: "Sucessfully Logged In",
      success: true,
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});



export default router;
