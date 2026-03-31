import {
  MarketplaceListing,
  marketplaceListings,
} from "@/lib/marketplace-data";

const STORAGE_KEY = "smart-baby-marketplace-listings";

function normalizeListing(raw: Partial<MarketplaceListing>): MarketplaceListing {
  return {
    id: raw.id ?? crypto.randomUUID(),
    ownerId: raw.ownerId ?? "user-1",
    title: raw.title ?? "",
    description: raw.description ?? "",
    price: typeof raw.price === "number" ? raw.price : 0,
    isDonation: Boolean(raw.isDonation),
    category: raw.category ?? "clothes",
    ageRange: raw.ageRange ?? "",
    location: raw.location ?? "",
    image:
      raw.image ??
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1200&auto=format&fit=crop",
    condition: raw.condition ?? "good",
    createdAt: raw.createdAt ?? new Date().toISOString(),
  };
}

export function getStoredMarketplaceListings(): MarketplaceListing[] {
  if (typeof window === "undefined") {
    return marketplaceListings;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return marketplaceListings;
    }

    const parsed = JSON.parse(raw) as Partial<MarketplaceListing>[];

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return marketplaceListings;
    }

    return parsed.map(normalizeListing);
  } catch {
    return marketplaceListings;
  }
}

export function saveMarketplaceListings(listings: MarketplaceListing[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
}

export function addMarketplaceListing(listing: MarketplaceListing) {
  const current = getStoredMarketplaceListings();
  const updated = [listing, ...current];
  saveMarketplaceListings(updated);
}

export function getMarketplaceListingById(id: string): MarketplaceListing | null {
  const listings = getStoredMarketplaceListings();
  return listings.find((listing) => listing.id === id) ?? null;
}

export function updateMarketplaceListing(updatedListing: MarketplaceListing) {
  const current = getStoredMarketplaceListings();

  const updated = current.map((listing) =>
    listing.id === updatedListing.id ? updatedListing : listing
  );

  saveMarketplaceListings(updated);
}

export function deleteMarketplaceListing(id: string) {
  const current = getStoredMarketplaceListings();
  const updated = current.filter((listing) => listing.id !== id);
  saveMarketplaceListings(updated);
}