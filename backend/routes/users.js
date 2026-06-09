import express from 'express';

const router = express.Router();
const users = new Map();

router.get('/profile', (req, res) => {
  try {
    const user = users.get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.get('/list', (req, res) => {
  try {
    const userList = Array.from(users.values()).map(u => ({
      id: u.id,
      userName: u.userName,
      email: u.email
    }));
    res.json(userList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
