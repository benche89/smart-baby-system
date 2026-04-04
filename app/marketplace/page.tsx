"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MarketplaceCard from "@/components/MarketplaceCard";
import {
  marketplaceListings,
  ListingCategory,
  MarketplaceListing,
} from "@/lib/marketplace-data";
import { getStoredMarketplaceListings } from "@/lib/marketplace-storage";

type CategoryFilter = "all" | ListingCategory;
type SortOption = "latest" | "price-low" | "price-high";
type Locale = "en" | "fr";

const copy = {
  en: {
    eyebrow: "Smart Baby Marketplace",
    title: "Buy, sell or donate baby items with ease",
    description:
      "A simple community space for parents to exchange clothes, toys and useful baby products.",
    addListing: "Add listing",
    myListings: "My listings",
    messages: "Messages",
    browseDonations: "Browse donations",
    searchLabel: "Search listings",
    searchPlaceholder: "Search clothes, toys, city, age range...",
    sortLabel: "Sort by",
    latest: "Latest",
    priceLow: "Price: low to high",
    priceHigh: "Price: high to low",
    donationsOnly: "Donations only",
    showingDonationsOnly: "Showing donations only",
    all: "All",
    clothes: "Clothes",
    toys: "Toys",
    gear: "Gear",
    donations: "Donations",
    latestListings: "Latest listings",
    itemsFound: "items found",
    resetFilters: "Reset filters",
    noListings: "No listings found",
    noListingsText: "Try changing the filters or search for something else.",
  },
  fr: {
    eyebrow: "Marketplace Smart Baby",
    title: "Achetez, vendez ou donnez des articles bébé facilement",
    description:
      "Un espace simple pour permettre aux parents d’échanger des vêtements, jouets et produits utiles pour bébé.",
    addListing: "Ajouter une annonce",
    myListings: "Mes annonces",
    messages: "Messages",
    browseDonations: "Voir les dons",
    searchLabel: "Rechercher des annonces",
    searchPlaceholder: "Rechercher vêtements, jouets, ville, tranche d’âge...",
    sortLabel: "Trier par",
    latest: "Les plus récentes",
    priceLow: "Prix : croissant",
    priceHigh: "Prix : décroissant",
    donationsOnly: "Dons uniquement",
    showingDonationsOnly: "Affichage des dons uniquement",
    all: "Tous",
    clothes: "Vêtements",
    toys: "Jouets",
    gear: "Équipement",
    donations: "Dons",
    latestListings: "Dernières annonces",
    itemsFound: "articles trouvés",
    resetFilters: "Réinitialiser les filtres",
    noListings: "Aucune annonce trouvée",
    noListingsText:
      "Essayez de modifier les filtres ou de rechercher autre chose.",
  },
} satisfies Record<Locale, Record<string, string>>;

export default function MarketplacePage() {
  const pathname = usePathname();
  const locale: Locale = pathname?.startsWith("/fr") ? "fr" : "en";
  const t = copy[locale];

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

  const basePrefix = locale === "fr" ? "/fr" : "";

  const categoryTabs: { label: string; value: CategoryFilter }[] = [
    { label: t.all, value: "all" },
    { label: t.clothes, value: "clothes" },
    { label: t.toys, value: "toys" },
    { label: t.gear, value: "gear" },
    { label: t.donations, value: "donation" },
  ];

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
          <span className="marketplaceHero__eyebrow">{t.eyebrow}</span>
          <h1>{t.title}</h1>
          <p>{t.description}</p>
        </div>

        <div className="marketplaceHero__actions">
          <Link
            href={`${basePrefix}/marketplace/create`}
            className="marketplaceBtn marketplaceBtn--primary"
          >
            {t.addListing}
          </Link>

          <Link
            href={`${basePrefix}/marketplace/my-listings`}
            className="marketplaceBtn marketplaceBtn--secondary"
          >
            {t.myListings}
          </Link>

          <Link
            href={`${basePrefix}/marketplace/messages`}
            className="marketplaceBtn marketplaceBtn--secondary"
          >
            {t.messages}
          </Link>

          <button
            type="button"
            className="marketplaceBtn marketplaceBtn--secondary"
            onClick={() => {
              setSelectedCategory("donation");
              setDonationsOnly(true);
            }}
          >
            {t.browseDonations}
          </button>
        </div>
      </section>

      <section className="marketplaceFilters">
        <div className="marketplaceSearch">
          <label htmlFor="marketplace-search" className="marketplaceLabel">
            {t.searchLabel}
          </label>
          <input
            id="marketplace-search"
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="marketplaceInput"
          />
        </div>

        <div className="marketplaceControls">
          <div className="marketplaceControl">
            <label htmlFor="marketplace-sort" className="marketplaceLabel">
              {t.sortLabel}
            </label>
            <select
              id="marketplace-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="marketplaceSelect"
            >
              <option value="latest">{t.latest}</option>
              <option value="price-low">{t.priceLow}</option>
              <option value="price-high">{t.priceHigh}</option>
            </select>
          </div>

          <button
            type="button"
            className={`marketplaceToggle ${donationsOnly ? "is-active" : ""}`}
            onClick={() => setDonationsOnly((prev) => !prev)}
          >
            {donationsOnly ? t.showingDonationsOnly : t.donationsOnly}
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
            <h2>{t.latestListings}</h2>
            <p>
              {filteredListings.length} {t.itemsFound}
            </p>
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
              {t.resetFilters}
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
            <h3>{t.noListings}</h3>
            <p>{t.noListingsText}</p>
          </div>
        )}
      </section>
    </main>
  );
}