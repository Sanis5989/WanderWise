// models/Plan.js
import mongoose, { Schema, models } from 'mongoose';

const ActivitySchema = new Schema({
  time: String,
  title: String,
  description: String,
  location: String,
});

const DayPlanSchema = new Schema({
  date: String,
  summary: String,
  activities: [ActivitySchema],
});

const PlanSchema = new Schema({
  // The user who created this plan
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This creates the relationship to the User model
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Plan title is required.'],
  },
  destination: {
    type: String,
    required: [true, 'Destination is required.'],
  },
  dailyPlan: [DayPlanSchema],
}, { timestamps: true });

const Plan = models.Plan || mongoose.model('Plan', PlanSchema);

export default Plan;