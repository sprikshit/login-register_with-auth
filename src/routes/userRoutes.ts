import express from 'express';
import { signup, login, verifyOtp, forgotPassword, resetPassword} from '../controller/userController';

const userRouter = express.Router();

userRouter.post('/register', signup);
userRouter.post('/login', login);
userRouter.post('/verify-otp', verifyOtp);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);

export default userRouter;
