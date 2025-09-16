// app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import {hash} from 'bcryptjs';
import connectDb from '../../../Utils/db' ;
import User from "../../../models/User"

export async function POST(req) {
  try {
    await connectDb();
    const { name, email, password } = await req.json();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: "User already exists." }, { status: 400 });
    }

    console.log(name,email,password)
    const hashedPassword = await hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();

    return NextResponse.json({ message: "User registered successfully." }, { status: 201 });

  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "An error occurred.", error: error.message }, { status: 500 });
  }
}