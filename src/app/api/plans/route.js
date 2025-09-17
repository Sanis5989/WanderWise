// app/api/plans/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../auth/[...nextauth]/route" // Adjust path if needed
import connectDb from "../../Utils/db";
import Plan from "../../models/Plan";

export async function POST(req) {
  // 1. Get the server-side session
  const session = await getServerSession(authOptions);

  // 2. Protect the route - only logged-in users can proceed
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDb();

    // 3. Get the plan data from the request body
    const { title, destination, dailyPlan } = await req.json();

    if (!title || !destination || !dailyPlan) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // 4. Create a new plan, associating it with the logged-in user's ID
    const newPlan = new Plan({
      user: session.user.id, // Associate with the user
      title,
      destination,
      dailyPlan,
    });

    // 5. Save the plan to the database
    await newPlan.save();

    return NextResponse.json(
      { message: 'Plan saved successfully!', plan: newPlan },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred while saving the plan.', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDb();

    // Find all plans where the 'user' field matches the logged-in user's ID
    // Sort by 'createdAt' in descending order to show the newest trips first
    const plans = await Plan.find({ user: session.user.id }).sort({ createdAt: -1 });

    return NextResponse.json({ plans }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred while fetching plans.', error: error.message },
      { status: 500 }
    );
  }
}

