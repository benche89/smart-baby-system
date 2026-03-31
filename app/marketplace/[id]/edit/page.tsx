"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ListingCategory, MarketplaceListing } from "@/lib/marketplace-data";
import {
  getMarketplaceListingById,
  updateMarketplaceListing,
} from "@/lib/marketplace-storage";
import { currentUser } from "@/lib/mock-auth";

type ConditionOption = "new" | "very-good" | "good";

export default function EditMarketplaceListingPage() {
  const params = useParams();
  const router = useRouter();

  const id = useMemo(() => {
    if (!params?.id) return "";
    return Array.isArray(params.id) ? params.id[0] : params.id;
  }, [params]);

  const [listing, setListing] = useState<MarketplaceListing | null | undefined>(
    undefined
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isDonation, setIsDonation] = useState(false);
  const [category, setCategory] = useState<ListingCategory>("clothes");
  const [ageRange, setAgeRange] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [condition, setCondition] = useState<ConditionOption>("very-good");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setListing(null);
      return;
    }

    const foundListing = getMarketplaceListingById(id);

    if (!foundListing) {
      setListing(null);
      return;
    }

    if (foundListing.ownerId !== currentUser.id) {
      router.push(`/marketplace/${foundListing.id}`);
      return;
    }

    setListing(foundListing);
    setTitle(foundListing.title);
    setDescription(foundListing.description);
    setPrice(String(foundListing.price));
    setIsDonation(foundListing.isDonation);
    setCategory(
      foundListing.category === "donation" ? "clothes" : foundListing.category
    );
    setAgeRange(foundListing.ageRange);
    setLocation(foundListing.location);
    setImage(foundListing.image);
    setCondition(foundListing.condition);
  }, [id, router]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!listing) return;

    if (
      !title.trim() ||
      !description.trim() ||
      !ageRange.trim() ||
      !location.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    const numericPrice = isDonation ? 0 : Number(price);

    if (!isDonation && (!price || Number.isNaN(numericPrice) || numericPrice < 0)) {
      setError("Please enter a valid price.");
      return;
    }

    const updatedListing: MarketplaceListing = {
      ...listing,
      title: title.trim(),
      description: description.trim(),
      price: numericPrice,
      isDonation,
      category: isDonation ? "donation" : category,
      ageRange: ageRange.trim(),
      location: location.trim(),
      image:
        image.trim() ||
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1200&auto=format&fit=crop",
      condition,
    };

    updateMarketplaceListing(updatedListing);
    router.push(`/marketplace/${listing.id}`);
  }

  if (listing === undefined) {
    return (
      <main className="marketplacePage">
        <section className="marketplaceDetailsLoading">
          <div className="marketplaceDetailsLoading__card">
            <p>Loading listing editor...</p>
          </div>
        </section>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="marketplacePage">
        <section className="marketplaceNotFound">
          <span className="marketplaceHero__eyebrow">Listing not found</span>
          <h1>We could not edit this listing</h1>
          <p>The item may have been deleted or the link is invalid.</p>

          <div className="marketplaceNotFound__actions">
            <Link
              href="/marketplace"
              className="marketplaceBtn marketplaceBtn--secondary"
            >
              Back to marketplace
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="marketplacePage">
      <div className="marketplaceBreadcrumb">
        <Link
          href={`/marketplace/${listing.id}`}
          className="marketplaceBreadcrumb__link"
        >
          ← Back to listing
        </Link>
      </div>

      <section className="marketplaceCreateHero">
        <span className="marketplaceHero__eyebrow">Edit marketplace listing</span>
        <h1>Update your listing</h1>
        <p>
          Change the title, price, description or mark the item as a donation.
        </p>
      </section>

      <section className="marketplaceFormWrap">
        <form className="marketplaceForm" onSubmit={handleSubmit}>
          <div className="marketplaceFormGrid">
            <div className="marketplaceField marketplaceField--full">
              <label className="marketplaceLabel" htmlFor="listing-title">
                Title *
              </label>
              <input
                id="listing-title"
                className="marketplaceInput"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="marketplaceField marketplaceField--full">
              <label className="marketplaceLabel" htmlFor="listing-description">
                Description *
              </label>
              <textarea
                id="listing-description"
                className="marketplaceTextarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
              />
            </div>

            <div className="marketplaceField">
              <label className="marketplaceLabel" htmlFor="listing-category">
                Category
              </label>
              <select
                id="listing-category"
                className="marketplaceSelect"
                value={category}
                onChange={(e) => setCategory(e.target.value as ListingCategory)}
                disabled={isDonation}
              >
                <option value="clothes">Clothes</option>
                <option value="toys">Toys</option>
                <option value="gear">Gear</option>
                <option value="donation">Donation</option>
              </select>
            </div>

            <div className="marketplaceField">
              <label className="marketplaceLabel" htmlFor="listing-condition">
                Condition
              </label>
              <select
                id="listing-condition"
                className="marketplaceSelect"
                value={condition}
                onChange={(e) => setCondition(e.target.value as ConditionOption)}
              >
                <option value="new">New</option>
                <option value="very-good">Very good</option>
                <option value="good">Good</option>
              </select>
            </div>

            <div className="marketplaceField">
              <label className="marketplaceLabel" htmlFor="listing-age-range">
                Age range *
              </label>
              <input
                id="listing-age-range"
                className="marketplaceInput"
                type="text"
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
              />
            </div>

            <div className="marketplaceField">
              <label className="marketplaceLabel" htmlFor="listing-location">
                Location *
              </label>
              <input
                id="listing-location"
                className="marketplaceInput"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="marketplaceField">
              <label className="marketplaceLabel" htmlFor="listing-price">
                Price {!isDonation ? "*" : ""}
              </label>
              <input
                id="listing-price"
                className="marketplaceInput"
                type="number"
                min="0"
                step="0.01"
                value={isDonation ? "0" : price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isDonation}
              />
            </div>

            <div className="marketplaceField">
              <label className="marketplaceLabel" htmlFor="listing-image">
                Image URL
              </label>
              <input
                id="listing-image"
                className="marketplaceInput"
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            <div className="marketplaceField marketplaceField--full">
              <button
                type="button"
                className={`marketplaceDonationSwitch ${
                  isDonation ? "is-active" : ""
                }`}
                onClick={() => setIsDonation((prev) => !prev)}
              >
                {isDonation ? "This listing is a donation" : "Mark as donation"}
              </button>
            </div>
          </div>

          {error ? <div className="marketplaceError">{error}</div> : null}

          <div className="marketplaceFormActions">
            <Link
              href={`/marketplace/${listing.id}`}
              className="marketplaceBtn marketplaceBtn--secondary"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="marketplaceBtn marketplaceBtn--primary"
            >
              Save changes
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}