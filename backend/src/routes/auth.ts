import { Router } from 'express';
import { AuthService } from '../services/auth.service';

const router = Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, name, password } = req.body;
    await AuthService.signup(email, name, password);
    res.status(201).json({ message: 'User created successfully. Please check your email to verify your account.' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await AuthService.login(email, password);
    res.json(data);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    await AuthService.verifyEmail(token);
    res.json({ message: 'Email verified successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
