import { Request, Response, Router } from "express";
import { authenticate } from "../middlewares/auth";
import { User } from "../models/User";


const router = Router()

router.use(authenticate)
router.get("/", async(req:Request, res:Response) => {
    const userId = (req as any).user?.id || (req as any).user?._id;

    const user = await User.findById(userId)

   if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist", success: false, data: null });
    }

    
     res.status(200).json({
      message: "Retrieved successfuly",
      success: true,
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
});

router.put("/", async(req:Request, res:Response) => {
    const userId = (req as any).user?.id || (req as any).user?._id;
    
     const { firstName, lastName, email } = req.body;

  if (!firstName || !lastName || !email) {
    return res
      .status(422)
      .json({ message: "All fields required", success: false, data: null });
  }

    const user = await User.findById(userId);

   if (!user) {
      return res
        .status(401)
        .json({ message: "User does not exist", success: false, data: null });
    }

    user.firstName = firstName
    user.lastName = lastName
    user.email = email

    await user.save();
    
     res.status(200).json({
      message: "Updated successfuly",
      success: true,
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });

})




export default router