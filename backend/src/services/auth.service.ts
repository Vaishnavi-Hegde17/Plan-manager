import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/prisma';
import { sendEmail } from '../config/email';

export class AuthService {
  static async signup(email: string, name: string, password: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        verificationToken,
      },
    });

    // Send verification email
    const verificationLink = `http://localhost:5173/verify-email?token=${verificationToken}`;
    const htmlContent = `
      <h1>Welcome to Plan Renewal Demo, ${name}!</h1>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}">Verify Email</a>
    `;
    
    await sendEmail(email, 'Verify your email address', htmlContent);

    return user;
  }

  static async verifyEmail(token: string) {
    const user = await prisma.user.findFirst({ where: { verificationToken: token } });
    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        verificationToken: null,
      },
    });

    return true;
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    if (!user.isEmailVerified) {
      throw new Error('Please verify your email before logging in');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    return { user, token };
  }
}
