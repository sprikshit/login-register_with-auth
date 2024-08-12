// src/controllers/authController.ts
import { Request, Response } from 'express';
import { signupService, loginService, verifyOtpService, forgotPasswordService, resetPasswordService } from '../services/user.service';

export const signup = async (req: Request, res: Response) => {
  try {
    const { number, username, email, password, countrycode, referralCode } =
      req.body;

    const result = await signupService({
      number,
      username,
      email,
      password,
      countrycode,
      referralCode,
    });

    res.status(200).json(result);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Something went wrong' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await loginService({ email, password });

    res.status(200).json(result);
  } catch (error: any) {
    console.error(error);
    res.status(401).json({ message: error.message || 'Authentication failed' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const result = await verifyOtpService({ email, otp });

    res.status(200).json(result);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message || 'Something went wrong' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    await forgotPasswordService({ email });
    res.status(200).json({ message: 'Password reset OTP sent to email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Error'});
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, newPassword } = req.body;

  try {
    await resetPasswordService({ email, newPassword });
    res.status(200).json({ message: 'Password has been updated' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error' });
  }
};