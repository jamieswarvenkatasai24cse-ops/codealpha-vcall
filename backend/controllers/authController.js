import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users } from '../store/usersStore.js';

export const register = async (req, res) => {
  try {
    const { email, password, userName } = req.body;

    // Validate required fields
    if (!email || !password || !userName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Trim inputs
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedUserName = userName.trim();
    const trimmedPassword = password;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Username validation - simple
    if (trimmedUserName.length < 2) {
      return res.status(400).json({ error: 'Username must be at least 2 characters' });
    }

    // Password validation - simple
    if (trimmedPassword.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters' });
    }

    // Check if email already exists
    if (Array.from(users.values()).some(u => u.email === trimmedEmail)) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Check if username already exists
    if (Array.from(users.values()).some(u => u.userName === trimmedUserName)) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
    const userId = Date.now().toString();

    users.set(userId, {
      id: userId,
      email: trimmedEmail,
      password: hashedPassword,
      userName: trimmedUserName,
      createdAt: new Date()
    });

    const token = jwt.sign(
      { id: userId, email: trimmedEmail, userName: trimmedUserName },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: userId, email: trimmedEmail, userName: trimmedUserName }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = Array.from(users.values()).find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, userName: user.userName },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, userName: user.userName }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};
