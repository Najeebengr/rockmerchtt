import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { firstName, lastName, phone, country } = await req.json();
    
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await client.fetch(
      `*[_type == "user" && _id == $userId][0]`,
      { userId: decoded.userId }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user profile in database
    await client
      .patch(user._id)
      .set({
        firstName,
        lastName,
        phone,
        country
      })
      .commit();

    return NextResponse.json(
      { message: 'Profile updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 