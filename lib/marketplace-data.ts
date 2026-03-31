export type ListingCategory =
  | "clothes"
  | "toys"
  | "gear"
  | "donation";

export type MarketplaceListing = {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  price: number;
  isDonation: boolean;
  category: ListingCategory;
  ageRange: string;
  location: string;
  image: string;
  condition: "new" | "very-good" | "good";
  createdAt: string;
};

export const marketplaceListings: MarketplaceListing[] = [
  {
    id: "1",
    ownerId: "user-2",
    title: "Baby clothes bundle 0-3 months",
    description:
      "Set of baby bodysuits, pajamas and small accessories in very good condition.",
    price: 20,
    isDonation: false,
    category: "clothes",
    ageRange: "0-3 months",
    location: "Brussels",
    image:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1200&auto=format&fit=crop",
    condition: "very-good",
    createdAt: "2026-03-30",
  },
  {
    id: "2",
    ownerId: "user-3",
    title: "Wooden sensory toy set",
    description:
      "Educational toy set for babies and toddlers. Clean and well maintained.",
    price: 15,
    isDonation: false,
    category: "toys",
    ageRange: "6-18 months",
    location: "Antwerp",
    image:
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=1200&auto=format&fit=crop",
    condition: "good",
    createdAt: "2026-03-29",
  },
  {
    id: "3",
    ownerId: "user-2",
    title: "Free baby walker donation",
    description: "Used baby walker offered for free. Pick-up only.",
    price: 0,
    isDonation: true,
    category: "donation",
    ageRange: "6-12 months",
    location: "Ghent",
    image:
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1200&auto=format&fit=crop",
    condition: "good",
    createdAt: "2026-03-28",
  },
  {
    id: "4",
    ownerId: "user-1",
    title: "Baby feeding chair",
    description:
      "Compact feeding chair, stable and easy to clean. Great condition.",
    price: 35,
    isDonation: false,
    category: "gear",
    ageRange: "6-24 months",
    location: "Bruges",
    image:
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1200&auto=format&fit=crop",
    condition: "very-good",
    createdAt: "2026-03-27",
  },
];