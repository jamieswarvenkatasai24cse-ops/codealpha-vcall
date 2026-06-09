import bcrypt from 'bcryptjs';
import { users } from './store/usersStore.js';

// Pre-created test users for development
export const createTestUsers = async () => {
  const testUsers = [
    {
      id: 'user1',
      email: 'alice@example.com',
      password: 'Alice@123',
      userName: 'Alice'
    },
    {
      id: 'user2',
      email: 'bob@example.com',
      password: 'Bob@123',
      userName: 'Bob'
    },
    {
      id: 'user3',
      email: 'charlie@example.com',
      password: 'Charlie@123',
      userName: 'Charlie'
    },
    {
      id: 'user4',
      email: 'diana@example.com',
      password: 'Diana@123',
      userName: 'Diana'
    },
    {
      id: 'user5',
      email: 'test@example.com',
      password: 'Test@123',
      userName: 'TestUser'
    }
  ];

  try {
    for (const user of testUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      users.set(user.id, {
        id: user.id,
        email: user.email,
        password: hashedPassword,
        userName: user.userName,
        createdAt: new Date()
      });
    }
    console.log('✓ Test users created successfully');
    console.log('Available test accounts:');
    testUsers.forEach(u => console.log(`  - ${u.userName} (${u.email}) / ${u.password}`));
    return testUsers;
  } catch (error) {
    console.error('Error creating test users:', error);
    return [];
  }
};
