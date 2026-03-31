"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import MarketplaceCard from "@/components/MarketplaceCard";
import { MarketplaceListing } from "@/lib/marketplace-data";
import { getStoredMarketplaceListings } from "@/lib/marketplace-storage";
import { currentUser } from "@/lib/mock-auth";

function formatCountLabel(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export default function MyListingsPage() {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);

  useEffect(() => {
    const stored = getStoredMarketplaceListings();
    setListings(stored);
  }, []);

  const myListings = useMemo(() => {
    return listings
      .filter((listing) => listing.ownerId === currentUser.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [listings]);

  const stats = useMemo(() => {
    const total = myListings.length;
    const donations = myListings.filter((item) => item.isDonation).length;
    const selling = myListings.filter((item) => !item.isDonation).length;
    const totalValue = myListings
      .filter((item) => !item.isDonation)
      .reduce((sum, item) => sum + item.price, 0);

    return {
      total,
      donations,
      selling,
      totalValue,
    };
  }, [myListings]);

  return (
    <main className="marketplacePage">
      <section className="myListingsHero">
        <div className="myListingsHero__content">
          <span className="marketplaceHero__eyebrow">My marketplace</span>
          <h1>Manage your listings</h1>
          <p>
            See all your active marketplace posts in one place, update them
            anytime, or add new items for sale and donation.
          </p>

          <div className="myListingsHero__actions">
            <Link
              href="/marketplace/create"
              className="marketplaceBtn marketplaceBtn--primary"
            >
              Add new listing
            </Link>

            <Link
              href="/marketplace"
              className="marketplaceBtn marketplaceBtn--secondary"
            >
              Browse marketplace
            </Link>
          </div>
        </div>

        <div className="myListingsHero__profile">
          <div className="myListingsHero__avatar">
            {currentUser.name.slice(0, 1).toUpperCase()}
          </div>

          <div>
            <span className="myListingsHero__label">Logged in as</span>
            <strong className="myListingsHero__name">{currentUser.name}</strong>
            <p className="myListingsHero__email">{currentUser.email}</p>
          </div>
        </div>
      </section>

      <section className="myListingsStats">
        <div className="myListingsStatCard">
          <span>Total listings</span>
          <strong>{stats.total}</strong>
          <p>{formatCountLabel(stats.total, "listing", "listings")}</p>
        </div>

        <div className="myListingsStatCard">
          <span>For sale</span>
          <strong>{stats.selling}</strong>
          <p>{formatCountLabel(stats.selling, "active sale", "active sales")}</p>
        </div>

        <div className="myListingsStatCard">
          <span>Donations</span>
          <strong>{stats.donations}</strong>
          <p>{formatCountLabel(stats.donations, "donation", "donations")}</p>
        </div>

        <div className="myListingsStatCard">
          <span>Total selling value</span>
          <strong>€{stats.totalValue}</strong>
          <p>Visible asking price total</p>
        </div>
      </section>

      <section className="marketplaceSection">
        <div className="marketplaceSection__header">
          <div>
            <h2>Your listings</h2>
            <p>
              {myListings.length > 0
                ? `You currently have ${myListings.length} live listing${
                    myListings.length === 1 ? "" : "s"
                  }.`
                : "You have no listings yet."}
            </p>
          </div>
        </div>

        {myListings.length === 0 ? (
          <div className="myListingsEmpty">
            <div className="myListingsEmpty__icon">+</div>
            <h3>Start your first listing</h3>
            <p>
              Add clothes, toys, gear or donations and start connecting with other
              parents through the marketplace.
            </p>

            <div className="myListingsEmpty__actions">
              <Link
                href="/marketplace/create"
                className="marketplaceBtn marketplaceBtn--primary"
              >
                Create your first listing
              </Link>

              <Link
                href="/marketplace"
                className="marketplaceBtn marketplaceBtn--secondary"
              >
                Explore marketplace
              </Link>
            </div>
          </div>
        ) : (
          <div className="myListingsGrid">
            {myListings.map((listing) => (
              <div key={listing.id} className="myListingsGrid__item">
                <MarketplaceCard listing={listing} />

                <div className="myListingsGrid__actions">
                  <Link
                    href={`/marketplace/${listing.id}`}
                    className="myListingsActionBtn"
                  >
                    View
                  </Link>

                  <Link
                    href={`/marketplace/${listing.id}/edit`}
                    className="myListingsActionBtn myListingsActionBtn--primary"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}