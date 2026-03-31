"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { MarketplaceListing, ListingCategory } from "@/lib/marketplace-data";
import { addMarketplaceListing } from "@/lib/marketplace-storage";
import { currentUser } from "@/lib/mock-auth";

type ConditionOption = "new" | "very-good" | "good";

export default function CreateMarketplaceListingPage() {
  const router = useRouter();

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

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

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

    const newListing: MarketplaceListing = {
      id: crypto.randomUUID(),
      ownerId: currentUser.id,
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
      createdAt: new Date().toISOString(),
    };

    addMarketplaceListing(newListing);
    router.push("/marketplace");
  }

  return (
    <main className="marketplacePage">
      <section className="marketplaceCreateHero">
        <span className="marketplaceHero__eyebrow">New marketplace listing</span>
        <h1>Create a listing in minutes</h1>
        <p>
          Add baby clothes, toys, gear or even donations for other parents in your
          community.
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
                placeholder="Example: Baby clothes bundle 3-6 months"
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
                placeholder="Write a clear description of the item..."
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
                placeholder="Example: 6-12 months"
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
                placeholder="Example: Brussels"
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
                placeholder={isDonation ? "Free donation" : "Example: 25"}
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
                placeholder="Paste an image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            <div className="marketplaceField marketplaceField--full">
              <button
                type="button"
                className={`marketplaceDonationSwitch ${isDonation ? "is-active" : ""}`}
                onClick={() => setIsDonation((prev) => !prev)}
              >
                {isDonation ? "This listing is a donation" : "Mark as donation"}
              </button>
            </div>
          </div>

          {error ? <div className="marketplaceError">{error}</div> : null}

          <div className="marketplaceFormActions">
            <button
              type="button"
              className="marketplaceBtn marketplaceBtn--secondary"
              onClick={() => router.push("/marketplace")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="marketplaceBtn marketplaceBtn--primary"
            >
              Publish listing
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}