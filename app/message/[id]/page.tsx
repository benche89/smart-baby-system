"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MarketplaceListing } from "@/lib/marketplace-data";
import {
  deleteMarketplaceListing,
  getMarketplaceListingById,
} from "@/lib/marketplace-storage";
import { currentUser, getUserById } from "@/lib/mock-auth";
import { createConversationWithFirstMessage } from "@/lib/messages-storage";

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

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Recently added";
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const quickMessages = [
  "Hi, is this still available?",
  "Hello, I’m interested in this item.",
  "Can you reserve this for me?",
  "Is pickup possible tomorrow?",
];

export default function MarketplaceListingDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [listing, setListing] = useState<MarketplaceListing | null | undefined>(
    undefined
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const id = useMemo(() => {
    if (!params?.id) return "";
    return Array.isArray(params.id) ? params.id[0] : params.id;
  }, [params]);

  useEffect(() => {
    if (!id) {
      setListing(null);
      return;
    }

    const foundListing = getMarketplaceListingById(id);
    setListing(foundListing);
  }, [id]);

  function handleDelete() {
    if (!listing) return;

    if (listing.ownerId !== currentUser.id) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirmed) return;

    setIsDeleting(true);
    deleteMarketplaceListing(listing.id);
    router.push("/marketplace");
  }

  function openMessageModal(prefill?: string) {
    setMessageText(prefill ?? "");
    setIsMessageModalOpen(true);
  }

  function closeMessageModal() {
    setIsMessageModalOpen(false);
    setMessageText("");
    setIsSendingMessage(false);
  }

  async function handleSendMessage() {
    if (!listing || !messageText.trim()) return;

    setIsSendingMessage(true);

    const conversation = createConversationWithFirstMessage({
      listingId: listing.id,
      buyerId: currentUser.id,
      sellerId: listing.ownerId,
      text: messageText,
    });

    closeMessageModal();
    router.push(`/messages/${conversation.id}`);
  }

  if (listing === undefined) {
    return (
      <main className="marketplacePage">
        <section className="marketplaceDetailsLoading">
          <div className="marketplaceDetailsLoading__card">
            <p>Loading listing...</p>
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
          <h1>This listing does not exist anymore</h1>
          <p>It may have been removed, or the link is no longer valid.</p>

          <div className="marketplaceNotFound__actions">
            <button
              type="button"
              className="marketplaceBtn marketplaceBtn--secondary"
              onClick={() => router.push("/marketplace")}
            >
              Back to marketplace
            </button>
          </div>
        </section>
      </main>
    );
  }

  const owner = getUserById(listing.ownerId);
  const isOwner = listing.ownerId === currentUser.id;

  return (
    <>
      <main className="marketplacePage">
        <div className="marketplaceBreadcrumb">
          <Link href="/marketplace" className="marketplaceBreadcrumb__link">
            ← Back to marketplace
          </Link>
        </div>

        <section className="marketplaceDetails">
          <div className="marketplaceDetails__media">
            <div className="marketplaceDetails__imageWrap">
              <img
                src={listing.image}
                alt={listing.title}
                className="marketplaceDetails__image"
              />
              <span className="marketplaceDetails__badge">
                {listing.isDonation ? "Donation" : getCategoryLabel(listing.category)}
              </span>
            </div>
          </div>

          <div className="marketplaceDetails__content">
            <div className="marketplaceDetails__top">
              <div>
                <span className="marketplaceDetails__date">
                  Added on {formatDate(listing.createdAt)}
                </span>
                <h1>{listing.title}</h1>
              </div>

              <div
                className="marketplaceDetails__price"
                style={
                  listing.isDonation
                    ? {
                        color: "#16a34a",
                      }
                    : undefined
                }
              >
                {listing.isDonation ? "Free" : `€${listing.price}`}
              </div>
            </div>

            <p className="marketplaceDetails__description">{listing.description}</p>

            <div className="marketplaceDetails__chips">
              <span>{listing.location}</span>
              <span>{listing.ageRange}</span>
              <span>{getConditionLabel(listing.condition)}</span>
              <span>{listing.isDonation ? "Community donation" : "For sale"}</span>
            </div>

            <div className="marketplaceDetails__panel">
              <h3>Listing details</h3>

              <div className="marketplaceDetails__infoGrid">
                <div className="marketplaceDetails__infoItem">
                  <span>Category</span>
                  <strong>
                    {listing.isDonation
                      ? "Donation"
                      : getCategoryLabel(listing.category)}
                  </strong>
                </div>

                <div className="marketplaceDetails__infoItem">
                  <span>Condition</span>
                  <strong>{getConditionLabel(listing.condition)}</strong>
                </div>

                <div className="marketplaceDetails__infoItem">
                  <span>Age range</span>
                  <strong>{listing.ageRange}</strong>
                </div>

                <div className="marketplaceDetails__infoItem">
                  <span>Location</span>
                  <strong>{listing.location}</strong>
                </div>

                <div className="marketplaceDetails__infoItem">
                  <span>Seller</span>
                  <strong>{owner?.name ?? "Parent seller"}</strong>
                </div>

                <div className="marketplaceDetails__infoItem">
                  <span>Member location</span>
                  <strong>{owner?.city ?? listing.location}</strong>
                </div>
              </div>
            </div>

            {!isOwner ? (
              <div
                style={{
                  padding: "20px",
                  borderRadius: "24px",
                  background:
                    "linear-gradient(135deg, rgba(239,248,255,0.96) 0%, rgba(252,253,255,0.98) 100%)",
                  border: "1px solid rgba(148, 163, 184, 0.16)",
                  boxShadow: "0 14px 34px rgba(15, 23, 42, 0.05)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "14px",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <span
                      style={{
                        display: "inline-flex",
                        padding: "6px 10px",
                        borderRadius: "999px",
                        background: "rgba(37, 99, 235, 0.10)",
                        color: "#1d4ed8",
                        fontSize: "11px",
                        fontWeight: 800,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        marginBottom: "10px",
                      }}
                    >
                      Private contact
                    </span>

                    <h3
                      style={{
                        fontSize: "22px",
                        lineHeight: 1.15,
                        marginBottom: "8px",
                      }}
                    >
                      Contact {owner?.name ?? "the seller"} safely through the platform
                    </h3>

                    <p
                      style={{
                        color: "#475569",
                        lineHeight: 1.7,
                        maxWidth: "620px",
                      }}
                    >
                      Ask if the item is still available, discuss pickup, or request the
                      donation without sharing personal contact details publicly.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="marketplaceBtn marketplaceBtn--primary"
                    onClick={() => openMessageModal("Hi, is this still available?")}
                    style={{
                      minHeight: "52px",
                      padding: "0 20px",
                      borderRadius: "18px",
                      fontSize: "15px",
                      fontWeight: 800,
                      boxShadow: "0 16px 30px rgba(37, 99, 235, 0.24)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Message seller
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      padding: "14px",
                      borderRadius: "18px",
                      background: "#ffffff",
                      border: "1px solid rgba(148, 163, 184, 0.12)",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#64748b",
                      }}
                    >
                      Safe contact
                    </span>
                    <strong
                      style={{
                        fontSize: "14px",
                        color: "#0f172a",
                      }}
                    >
                      Private via platform
                    </strong>
                  </div>

                  <div
                    style={{
                      padding: "14px",
                      borderRadius: "18px",
                      background: "#ffffff",
                      border: "1px solid rgba(148, 163, 184, 0.12)",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#64748b",
                      }}
                    >
                      Seller
                    </span>
                    <strong
                      style={{
                        fontSize: "14px",
                        color: "#0f172a",
                      }}
                    >
                      {owner?.name ?? "Parent seller"}
                    </strong>
                  </div>

                  <div
                    style={{
                      padding: "14px",
                      borderRadius: "18px",
                      background: "#ffffff",
                      border: "1px solid rgba(148, 163, 184, 0.12)",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#64748b",
                      }}
                    >
                      Recommended first message
                    </span>
                    <strong
                      style={{
                        fontSize: "14px",
                        color: "#0f172a",
                      }}
                    >
                      Is this still available?
                    </strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="marketplaceDetails__actions">
                <Link
                  href={`/marketplace/${listing.id}/edit`}
                  className="marketplaceBtn marketplaceBtn--secondary"
                >
                  Edit listing
                </Link>

                <button
                  type="button"
                  className="marketplaceBtn marketplaceBtn--danger"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete listing"}
                </button>
              </div>
            )}

            <div className="marketplaceSellerCard">
              <h3>Seller profile</h3>
              <div className="marketplaceSellerCard__grid">
                <div className="marketplaceSellerCard__item">
                  <span>Name</span>
                  <strong>{owner?.name ?? "Parent seller"}</strong>
                </div>

                <div className="marketplaceSellerCard__item">
                  <span>City</span>
                  <strong>{owner?.city ?? listing.location}</strong>
                </div>

                <div className="marketplaceSellerCard__item">
                  <span>Contact</span>
                  <strong>Private via platform chat</strong>
                </div>
              </div>
            </div>

            <div className="marketplaceDetails__notice">
              <p>
                {listing.isDonation
                  ? "This item is offered as a donation. Arrange the pickup safely through the platform chat."
                  : "Interested in this item? Contact the seller through the platform chat to discuss pickup, payment and availability."}
              </p>
            </div>
          </div>
        </section>
      </main>

      {isMessageModalOpen ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.52)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "18px",
            zIndex: 1000,
          }}
          onClick={closeMessageModal}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "720px",
              borderRadius: "30px",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,251,255,0.98) 100%)",
              border: "1px solid rgba(148, 163, 184, 0.18)",
              boxShadow: "0 30px 80px rgba(15, 23, 42, 0.24)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "22px 24px",
                borderBottom: "1px solid rgba(148, 163, 184, 0.14)",
                display: "flex",
                justifyContent: "space-between",
                gap: "16px",
                alignItems: "flex-start",
              }}
            >
              <div>
                <span
                  style={{
                    display: "inline-flex",
                    padding: "6px 10px",
                    borderRadius: "999px",
                    background: "rgba(37, 99, 235, 0.10)",
                    color: "#1d4ed8",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  Private message
                </span>

                <h3
                  style={{
                    fontSize: "28px",
                    lineHeight: 1.08,
                    letterSpacing: "-0.03em",
                    marginBottom: "8px",
                  }}
                >
                  Message {owner?.name ?? "seller"}
                </h3>

                <p
                  style={{
                    color: "#475569",
                    lineHeight: 1.7,
                    maxWidth: "560px",
                  }}
                >
                  Start a safe conversation about this listing. Your contact details stay
                  private inside the platform.
                </p>
              </div>

              <button
                type="button"
                onClick={closeMessageModal}
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "14px",
                  border: "1px solid rgba(148, 163, 184, 0.18)",
                  background: "#ffffff",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#334155",
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              <div
                style={{
                  padding: "18px",
                  borderRadius: "22px",
                  background: "#ffffff",
                  border: "1px solid rgba(148, 163, 184, 0.14)",
                  display: "flex",
                  gap: "14px",
                  alignItems: "center",
                }}
              >
                <img
                  src={listing.image}
                  alt={listing.title}
                  style={{
                    width: "74px",
                    height: "74px",
                    objectFit: "cover",
                    borderRadius: "16px",
                    flexShrink: 0,
                  }}
                />

                <div>
                  <span
                    style={{
                      display: "inline-block",
                      marginBottom: "6px",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#64748b",
                    }}
                  >
                    About this item
                  </span>
                  <h4
                    style={{
                      fontSize: "18px",
                      lineHeight: 1.2,
                      marginBottom: "6px",
                    }}
                  >
                    {listing.title}
                  </h4>
                  <p
                    style={{
                      color: listing.isDonation ? "#16a34a" : "#2563eb",
                      fontWeight: 800,
                    }}
                  >
                    {listing.isDonation ? "Free" : `€${listing.price}`}
                  </p>
                </div>
              </div>

              <div>
                <span
                  style={{
                    display: "block",
                    marginBottom: "10px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                  }}
                >
                  Quick message starters
                </span>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  {quickMessages.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setMessageText(item)}
                      style={{
                        border: "none",
                        borderRadius: "999px",
                        padding: "10px 14px",
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="message-seller-textarea"
                  style={{
                    display: "block",
                    marginBottom: "10px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                  }}
                >
                  Your message
                </label>

                <textarea
                  id="message-seller-textarea"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Write your message here..."
                  rows={6}
                  style={{
                    width: "100%",
                    borderRadius: "20px",
                    border: "1px solid rgba(148, 163, 184, 0.22)",
                    background: "#f8fbff",
                    padding: "16px 18px",
                    outline: "none",
                    resize: "vertical",
                    fontSize: "15px",
                    color: "#0f172a",
                    lineHeight: 1.6,
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "13px",
                    lineHeight: 1.6,
                    maxWidth: "420px",
                  }}
                >
                  This is a private conversation. The seller will be able to respond
                  inside the platform.
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    className="marketplaceBtn marketplaceBtn--secondary"
                    onClick={closeMessageModal}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="marketplaceBtn marketplaceBtn--primary"
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || isSendingMessage}
                    style={{
                      minWidth: "150px",
                    }}
                  >
                    {isSendingMessage ? "Sending..." : "Send message"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}