import { PlaneTakeoff, Briefcase, Map, Users, CalendarDays, Landmark } from 'lucide-react'; // You can also use custom icons

const useCases = [
  {
    title: 'Quick Weekend Getaway',
    description: "Don't have time to plan? Tell us where, and we'll build your weekend escape in seconds.",
    icon: PlaneTakeoff,
  },
  {
    title: 'Custom 7-Day Itinerary',
    description: 'Planning a week-long adventure? We’ll map out flights, activities, food spots, and more.',
    icon: CalendarDays,
  },
  {
    title: 'One-Way Flight Plans',
    description: 'Need a plan for your travel day only? We’ll organize flights and things to do upon arrival.',
    icon: Map,
  },
  {
    title: 'Cultural Discovery Tour',
    description: 'Explore authentic food focal cuisines and immersive cultural experiences.',
    icon: Landmark,
  },
  {
    title: 'Business Trip Enhancer',
    description: 'Got free time on a work trip? We’ll suggest nearby attractions and food during breaks.',
    icon: Briefcase,
  },
  {
    title: 'Family Vacation Planner',
    description: 'Activities for all ages, balanced schedules, and relaxing time for everyone.',
    icon: Users,
  },
];

export default function UseCases() {
  return (
    <section className="py-16 bg-muted">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          What Can You Use <span className="text-primary">Wanderwise</span> For?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {useCases.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-full shadow-sm">
                <item.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
