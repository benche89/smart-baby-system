"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import MarketplaceCard from "@/components/MarketplaceCard";
import {
  marketplaceListings,
  ListingCategory,
  MarketplaceListing,
} from "@/lib/marketplace-data";
import { getStoredMarketplaceListings } from "@/lib/marketplace-storage";

type CategoryFilter = "all" | ListingCategory;
type SortOption = "latest" | "price-low" | "price-high";

const categoryTabs: { label: string; value: CategoryFilter }[] = [
  { label: "All", value: "all" },
  { label: "Clothes", value: "clothes" },
  { label: "Toys", value: "toys" },
  { label: "Gear", value: "gear" },
  { label: "Donations", value: "donation" },
];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("all");
  const [donationsOnly, setDonationsOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [listings, setListings] = useState<MarketplaceListing[]>(marketplaceListings);

  useEffect(() => {
    const stored = getStoredMarketplaceListings();
    setListings(stored);
  }, []);

  const filteredListings = useMemo(() => {
    let results = [...listings];

    const normalizedSearch = search.trim().toLowerCase();

    if (normalizedSearch) {
      results = results.filter((listing) => {
        const content = [
          listing.title,
          listing.description,
          listing.location,
          listing.ageRange,
        ]
          .join(" ")
          .toLowerCase();

        return content.includes(normalizedSearch);
      });
    }

    if (selectedCategory !== "all") {
      if (selectedCategory === "donation") {
        results = results.filter((listing) => listing.isDonation);
      } else {
        results = results.filter(
          (listing) => listing.category === selectedCategory
        );
      }
    }

    if (donationsOnly) {
      results = results.filter((listing) => listing.isDonation);
    }

    if (sortBy === "latest") {
      results.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    if (sortBy === "price-low") {
      results.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high") {
      results.sort((a, b) => b.price - a.price);
    }

    return results;
  }, [search, selectedCategory, donationsOnly, sortBy, listings]);

  return (
    <main className="marketplacePage">
      <section className="marketplaceHero">
        <div className="marketplaceHero__text">
          <span className="marketplaceHero__eyebrow">
            Smart Baby Marketplace
          </span>
          <h1>Buy, sell or donate baby items with ease</h1>
          <p>
            A simple community space for parents to exchange clothes, toys and
            useful baby products.
          </p>
        </div>

        <div className="marketplaceHero__actions">
          <Link
            href="/marketplace/create"
            className="marketplaceBtn marketplaceBtn--primary"
          >
            Add listing
          </Link>

          <Link
            href="/marketplace/my-listings"
            className="marketplaceBtn marketplaceBtn--secondary"
          >
            My listings
          </Link>

          <Link
            href="/messages"
            className="marketplaceBtn marketplaceBtn--secondary"
          >
            Messages
          </Link>

          <button
            type="button"
            className="marketplaceBtn marketplaceBtn--secondary"
            onClick={() => {
              setSelectedCategory("donation");
              setDonationsOnly(true);
            }}
          >
            Browse donations
          </button>
        </div>
      </section>

      <section className="marketplaceFilters">
        <div className="marketplaceSearch">
          <label htmlFor="marketplace-search" className="marketplaceLabel">
            Search listings
          </label>
          <input
            id="marketplace-search"
            type="text"
            placeholder="Search clothes, toys, city, age range..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="marketplaceInput"
          />
        </div>

        <div className="marketplaceControls">
          <div className="marketplaceControl">
            <label htmlFor="marketplace-sort" className="marketplaceLabel">
              Sort by
            </label>
            <select
              id="marketplace-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="marketplaceSelect"
            >
              <option value="latest">Latest</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </div>

          <button
            type="button"
            className={`marketplaceToggle ${donationsOnly ? "is-active" : ""}`}
            onClick={() => setDonationsOnly((prev) => !prev)}
          >
            {donationsOnly ? "Showing donations only" : "Donations only"}
          </button>
        </div>

        <div className="marketplaceTabs">
          {categoryTabs.map((tab) => {
            const isActive = selectedCategory === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                className={`marketplaceTab ${isActive ? "is-active" : ""}`}
                onClick={() => setSelectedCategory(tab.value)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="marketplaceSection">
        <div className="marketplaceSection__header">
          <div>
            <h2>Latest listings</h2>
            <p>{filteredListings.length} items found</p>
          </div>

          {(search || selectedCategory !== "all" || donationsOnly) && (
            <button
              type="button"
              className="marketplaceReset"
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
                setDonationsOnly(false);
                setSortBy("latest");
              }}
            >
              Reset filters
            </button>
          )}
        </div>

        {filteredListings.length > 0 ? (
          <div className="marketplaceGrid">
            {filteredListings.map((listing) => (
              <MarketplaceCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="marketplaceEmpty">
            <h3>No listings found</h3>
            <p>Try changing the filters or search for something else.</p>
          </div>
        )}
      </section>
    </main>
  );
}