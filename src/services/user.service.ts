import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import userModel from '../models/user';
import Referral from '../models/referral';
import { sendVerificationEmail } from '../utils/sendVerificationEmail';
import { createTransaction } from '../utils/createTransaction';
const SECRET_KEY = process.env.JWT_SECRET;

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '30d' });
};

const generateUniqueCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    return code;
 };

  
export async function signupService(data: any) {
    const { number, username, email, password, countrycode, referralCode } = data;
  
    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }
  
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
  
    const userId = generateUniqueCode();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
    let referrer = null;
  
    if (referralCode) {
      referrer = await userModel.findOne({ referralCode });
      if (!referrer) {
        throw new Error('Invalid referral code');
      }
    }
  
    const newUser = await userModel.create({
      userId,
      email,
      password: hashedPassword,
      username,
      countrycode,
      number,
      isVerified: false,
      otp,
      amount: 0,
      referralCode: generateUniqueCode(),
      referredBy: referrer ? referrer.userId : null,
    });
  
    if (referrer) {
      referrer.amount += 10;
      await referrer.save();
      await createTransaction(referrer.userId, 10, 'Reward from referral');
    }
  
    const token = jwt.sign(
      { email: newUser.email, userId: newUser.userId },
      SECRET_KEY as string
    );
  
    // Send verification email
    const emailSubject = 'Email Verification';
    await sendVerificationEmail({
      email: email,
      otp: otp,
      subject: emailSubject,
    });
  
    return { newUser, token };
 };
  
export const loginService = async (data: { email: string; password: string }) => {
    const { email, password } = data;
  
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
  
    const token = jwt.sign(
      { email: user.email, userId: user.userId },
      SECRET_KEY as string,
      { expiresIn: '1h' } 
    );
  
    return { user, token };
 };

export const verifyOtpService = async (data: { email: string; otp: any }) => {
  const { email, otp } = data;

  const user = await userModel.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  if (user.otp !== otp) {
    throw new Error('Invalid OTP');
  }

  user.isVerified = true;
  user.otp = null;
  await user.save();

  const token = jwt.sign(
    { email: user.email, userId: user.userId },
    SECRET_KEY as string
  );

  return { message: 'User verified successfully', token };
};

interface ForgotPasswordData {
  email: string;
}

export async function forgotPasswordService(data: ForgotPasswordData): Promise<void> {
  const { email } = data;

  const user = await userModel.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  await user.save();

  const emailSubject = 'Reset Password OTP';
  await sendVerificationEmail({
    email: email,
    otp: otp,
    subject: emailSubject,
  });
  
}

interface ResetPasswordData {
  email: string;
  newPassword: string;
}

export const resetPasswordService = async (data: ResetPasswordData): Promise<void> => {
  const { email, newPassword } = data;

  const user = await userModel.findOne({ email });
  if (!user) {
    throw new Error('User not found or password reset not verified');
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
};
