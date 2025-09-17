// app/api/auth/me/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import User from "../../../models/User";
import connectDb from "../../../Utils/db";

export async function GET(req) {
  try {
    // 1. Get token from cookies
    const token = cookies().get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. (Optional but recommended) Find user in DB to ensure they still exist
    await connectDb();
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // 4. Return user data
    return NextResponse.json({ user });

  } catch (error) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}