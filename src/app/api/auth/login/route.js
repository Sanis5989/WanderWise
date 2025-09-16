// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDb from "../../../Utils/db";
import User from "../../../models/User"

export async function POST(req) {
  try {
    await connectDb();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials." }, { status: 400 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: "Invalid credentials." }, { status: 400 });
    }

    // Create token data
    const tokenData = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    // Create token
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });

    const response = NextResponse.json({ message: "Login successful", success: true });

    // Set token in HTTP-Only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;

  } catch (error) {
    return NextResponse.json({ message: "An error occurred.", error: error.message }, { status: 500 });
  }
}