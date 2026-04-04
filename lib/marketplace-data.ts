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

/**
 * Marketplace now starts empty by default.
 * Real listings should come from localStorage or future backend data.
 */
export const marketplaceListings: MarketplaceListing[] = [];