// app/api/plans/[id]/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import connectDb from "../../../Utils/db";
import Plan from "../../../models/Plan";

export async function DELETE(req, { params }) {
  // Check if a user is logged in
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDb();

    // Get the plan ID from the URL parameters
    const { id } = params;

    // Find the plan by its ID
    const plan = await Plan.findById(id);

    // If the plan doesn't exist, return an error
    if (!plan) {
      return NextResponse.json({ message: 'Plan not found' }, { status: 404 });
    }

    // IMPORTANT: Check if the logged-in user is the owner of the plan
    // We use .toString() to compare the ObjectId with the string from the session
    if (plan.user.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // If all checks pass, delete the plan
    await Plan.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'Plan deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred.', error: error.message },
      { status: 500 }
    );
  }
}