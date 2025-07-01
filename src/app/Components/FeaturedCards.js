'use client';
import Image from 'next/image';

const featuredDeals = [
  {
    image: '/sydney.jpg',
    tag: 'Weekend Escape',
    title: '2-Day Escape to Sydney – Opera House & Bondi Walk',
    description: 'Perfect for a weekend getaway with beach time, cultural spots, and iconic attractions.',
    price: 'From $299 AUD',
    plannerParams: {
      destination: 'Sydney',
      duration: 2,
      themes: ['culture', 'coastal', 'food'],
      ageGroup: 'all',
    },
  },
  {
    image: '/barossa-wine.jpg',
    tag: 'Food & Wine',
    title: 'Barossa Valley Wine & Dine Tour – Taste the Best of SA',
    description: 'Experience South Australia’s best wine region with guided tastings and gourmet food.',
    price: 'From $199 AUD',
    plannerParams: {
      destination: 'Barossa Valley',
      duration: 1,
      themes: ['food', 'wine', 'leisure'],
      ageGroup: 'adults',
    },
  },
  {
    image: '/rainforest-cairns.jpg',
    tag: 'Nature Adventure',
    title: 'Cairns Rainforest Adventure – Skyrail & Kuranda',
    description: 'Ride above the rainforest and visit the artisan village of Kuranda with wildlife experiences.',
    price: 'From $350 AUD',
    plannerParams: {
      destination: 'Cairns',
      duration: 1,
      themes: ['nature', 'wildlife', 'culture'],
      ageGroup: 'family',
    },
  },
  {
    image: '/melbourne-culture.jpg',
    tag: 'City Discovery',
    title: 'Melbourne Art & Café Culture – Street Tours & Laneways',
    description: 'Discover the artistic heartbeat of Melbourne through local-led laneway and gallery tours.',
    price: 'From $259 AUD',
    plannerParams: {
      destination: 'Melbourne',
      duration: 1,
      themes: ['art', 'urban', 'food'],
      ageGroup: 'young adults',
    },
  },
];


export default function FeaturedCards() {
  return (
    <div className=" pb-12 px-4 md:px-12 text-white cursor-pointer">
      <h2 className="text-3xl font-bold text-center mb-8">Exciting Featured Adventure Deals for Your Next Trip</h2>
      <div className="flex flex-wrap gap-6 justify-center">
        {featuredDeals.map((deal, index) => (
          <div key={index} className="bg-white text-black w-[300px] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="relative w-full h-52">
              <Image
                src={deal.image}
                alt={deal.title}
                fill
                className="object-cover"
              />
              <span className="absolute top-3 left-3 bg-yellow-400 text-xs font-semibold px-3 py-1 rounded-md shadow">
                {deal.tag}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-2">{deal.title}</h3>
              <p className="text-sm text-gray-700 mb-3">{deal.description}</p>
              <p className="font-bold text-yellow-600 text-sm">{deal.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
