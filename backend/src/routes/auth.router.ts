import { Request, Response, Router } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail";

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
      return res.status(401).json({ message: "Invalid password!", success: false,
          data: null });
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

router.post("/request-otp",async (req: Request, res: Response) => {
   const {email} = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const user = await User.findOne({ email })
  if(!user) {
  return res
        .status(404)
        .json({
          message: "User not found",
          success: false,
          data: null,
        });
  }

    user.otp = otp
    user.otpExpiry = Date.now() + 15 * 60 * 1000;
    user.save()

    sendEmail({user, otp});

    return res
        .status(200)
        .json({
          message: "Email sent successfully",
          success: true,
          data: null,
        });

});

router.put("/password-reset", async (req: Request, res: Response) => {
  const {email, otp, password} = req.body

   if (!otp || !password || !email) {
    return res
      .status(422)
      .json({ message: "All fields required", success: false, data: null });
  }

   const user = await User.findOne({email})
     if(!user) {
  return res
        .status(404)
        .json({
          message: "User not found",
          success: false,
          data: null,
        });
  }

  if(otp !== user.otp){
     return res
        .status(401)
        .json({
          message: "Invalid OTP",
          success: false,
          data: null,
        });
  }

  if(Date.now() > Number(user.otpExpiry)) {
     return res
        .status(401)
        .json({
          message: "OTP has expired",
          success: false,
          data: null,
        });
  }  

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res
        .status(200)
        .json({
          message: "Password successfully updated",
          success: false,
          data: null,
        });
})


export default router;
