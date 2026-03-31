import Link from "next/link";
import { MarketplaceListing } from "@/lib/marketplace-data";

type MarketplaceCardProps = {
  listing: MarketplaceListing;
};

function getCategoryLabel(category: MarketplaceListing["category"]) {
  switch (category) {
    case "clothes":
      return "Clothes";
    case "toys":
      return "Toys";
    case "gear":
      return "Gear";
    case "donation":
      return "Donation";
    default:
      return "Other";
  }
}

function getConditionLabel(condition: MarketplaceListing["condition"]) {
  switch (condition) {
    case "new":
      return "New";
    case "very-good":
      return "Very good";
    case "good":
      return "Good";
    default:
      return condition;
  }
}

export default function MarketplaceCard({
  listing,
}: MarketplaceCardProps) {
  const badgeLabel = listing.isDonation
    ? "Free"
    : getCategoryLabel(listing.category);

  const priceLabel = listing.isDonation ? "Free" : `€${listing.price}`;

  return (
    <Link href={`/marketplace/${listing.id}`} className="marketCard">
      <div className="marketCard__imageWrap">
        <img
          src={listing.image}
          alt={listing.title}
          className="marketCard__image"
        />

        <span
          className="marketCard__badge"
          style={
            listing.isDonation
              ? {
                  background: "rgba(37, 99, 235, 0.95)",
                  color: "#ffffff",
                }
              : undefined
          }
        >
          {badgeLabel}
        </span>
      </div>

      <div className="marketCard__content">
        <div className="marketCard__top">
          <h3 className="marketCard__title">{listing.title}</h3>
          <p
            className="marketCard__price"
            style={
              listing.isDonation
                ? {
                    color: "#16a34a",
                    fontWeight: 800,
                  }
                : undefined
            }
          >
            {priceLabel}
          </p>
        </div>

        <p className="marketCard__description">{listing.description}</p>

        <div className="marketCard__meta">
          <span>{listing.location}</span>
          <span>{listing.ageRange}</span>
          <span>{getConditionLabel(listing.condition)}</span>
        </div>
      </div>
    </Link>
  );
}