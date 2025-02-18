import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const users = [
  {
    _id: '67b4b523cc0885a29e3f89e6',
    username: 'doctor',
    password: '$2b$10$2KXbgS5uH.ZfL4lWySPbwOe05ckXQtXBlk4qDYj4bTr/s.PILEkHa', // hashed password for "password123"
    role: 'doctor',
  },
  {
    _id: '67b4b523cc0885a29e3f89e9',
    username: 'admin',
    password: '$2b$10$ZY4mSCWZkce/FWmRMeUE2ebRvOScrWWOjHmBvsB/0pTa0GveUonjK', // hashed password for "admin123"
    role: 'admin',
  },
  // Add more users if needed
];

// POST handler for login
export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // Check if username and password are provided
    if (!username || !password) {
      return new Response(JSON.stringify({ message: 'Username and password are required' }), { status: 400 });
    }

    // Find user in "database"
    const user = users.find((user) => user.username === username);

    if (!user) {
      return new Response(JSON.stringify({ message: 'Invalid username or password' }), { status: 401 });
    }

    // Compare provided password with hashed password in database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return new Response(JSON.stringify({ message: 'Invalid username or password' }), { status: 401 });
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET, // Make sure to set this in your environment variables
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
