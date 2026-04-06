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
  const [image, setImage] = useState<string>("");
  const [condition, setCondition] = useState<ConditionOption>("very-good");
  const [error, setError] = useState("");

  function handleImageUpload(file: File) {
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

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
        image ||
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
        <p>Add baby items or donations for other parents.</p>
      </section>

      <section className="marketplaceFormWrap">
        <form className="marketplaceForm" onSubmit={handleSubmit}>
          <div className="marketplaceFormGrid">

            {/* TITLE */}
            <div className="marketplaceField marketplaceField--full">
              <label className="marketplaceLabel">Title *</label>
              <input
                className="marketplaceInput"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* DESCRIPTION */}
            <div className="marketplaceField marketplaceField--full">
              <label className="marketplaceLabel">Description *</label>
              <textarea
                className="marketplaceTextarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* CATEGORY */}
            <div className="marketplaceField">
              <label className="marketplaceLabel">Category</label>
              <select
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

            {/* CONDITION */}
            <div className="marketplaceField">
              <label className="marketplaceLabel">Condition</label>
              <select
                className="marketplaceSelect"
                value={condition}
                onChange={(e) => setCondition(e.target.value as ConditionOption)}
              >
                <option value="new">New</option>
                <option value="very-good">Very good</option>
                <option value="good">Good</option>
              </select>
            </div>

            {/* AGE */}
            <div className="marketplaceField">
              <label className="marketplaceLabel">Age range *</label>
              <input
                className="marketplaceInput"
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
              />
            </div>

            {/* LOCATION */}
            <div className="marketplaceField">
              <label className="marketplaceLabel">Location *</label>
              <input
                className="marketplaceInput"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* PRICE */}
            <div className="marketplaceField">
              <label className="marketplaceLabel">Price</label>
              <input
                className="marketplaceInput"
                type="number"
                value={isDonation ? "0" : price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isDonation}
              />
            </div>

            {/* IMAGE UPLOAD */}
            <div className="marketplaceField marketplaceField--full">
              <label className="marketplaceLabel">Upload image</label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleImageUpload(e.target.files[0]);
                  }
                }}
              />

              {image && (
                <div style={{ marginTop: "12px" }}>
                  <img
                    src={image}
                    alt="preview"
                    style={{
                      width: "200px",
                      borderRadius: "12px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
            </div>

            {/* DONATION */}
            <div className="marketplaceField marketplaceField--full">
              <button
                type="button"
                className={`marketplaceDonationSwitch ${isDonation ? "is-active" : ""}`}
                onClick={() => setIsDonation((prev) => !prev)}
              >
                {isDonation ? "Donation" : "Mark as donation"}
              </button>
            </div>

          </div>

          {error && <div className="marketplaceError">{error}</div>}

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