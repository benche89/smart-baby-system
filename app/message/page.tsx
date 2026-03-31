"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { currentUser } from "@/lib/mock-auth";
import { getUserConversations } from "@/lib/messages-storage";

type InboxItem = ReturnType<typeof getUserConversations>[number];

function formatDate(dateString?: string) {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MessagesInboxPage() {
  const [items, setItems] = useState<InboxItem[]>([]);

  useEffect(() => {
    const data = getUserConversations(currentUser.id);
    setItems(data);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "28px",
        background:
          "radial-gradient(circle at top left, rgba(166, 210, 255, 0.18), transparent 26%), linear-gradient(180deg, #f7fbff 0%, #fcfdff 100%)",
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <span
              style={{
                display: "inline-flex",
                padding: "8px 12px",
                borderRadius: "999px",
                background: "#eef4ff",
                color: "#2563eb",
                fontSize: "12px",
                fontWeight: 800,
                marginBottom: "10px",
              }}
            >
              Inbox
            </span>
            <h1
              style={{
                fontSize: "40px",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                marginBottom: "10px",
              }}
            >
              Your messages
            </h1>
            <p
              style={{
                color: "#475569",
                lineHeight: 1.7,
                maxWidth: "720px",
              }}
            >
              Manage private conversations with buyers and sellers in one place.
            </p>
          </div>

          <Link
            href="/marketplace"
            style={{
              minHeight: "46px",
              padding: "0 16px",
              borderRadius: "16px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ffffff",
              border: "1px solid #dce7f3",
              fontWeight: 700,
            }}
          >
            Back to marketplace
          </Link>
        </div>

        {items.length === 0 ? (
          <div
            style={{
              padding: "30px",
              borderRadius: "28px",
              background: "#ffffff",
              border: "1px solid rgba(148, 163, 184, 0.16)",
              boxShadow: "0 18px 45px rgba(15, 23, 42, 0.05)",
            }}
          >
            <h2
              style={{
                fontSize: "26px",
                marginBottom: "10px",
              }}
            >
              No conversations yet
            </h2>
            <p
              style={{
                color: "#64748b",
                lineHeight: 1.7,
                marginBottom: "18px",
              }}
            >
              When you message a seller or receive interest in your listing, your
              conversations will appear here.
            </p>

            <Link
              href="/marketplace"
              style={{
                minHeight: "46px",
                padding: "0 16px",
                borderRadius: "16px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
                color: "#ffffff",
                fontWeight: 800,
              }}
            >
              Explore marketplace
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "14px",
            }}
          >
            {items.map(({ conversation, listing, lastMessage, otherUser }) => (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.id}`}
                style={{
                  display: "block",
                  padding: "18px",
                  borderRadius: "24px",
                  background: "#ffffff",
                  border: "1px solid rgba(148, 163, 184, 0.14)",
                  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)",
                  transition: "transform 0.18s ease, box-shadow 0.18s ease",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "90px 1fr auto",
                    gap: "16px",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={
                      listing?.image ||
                      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1200&auto=format&fit=crop"
                    }
                    alt={listing?.title || "Listing"}
                    style={{
                      width: "90px",
                      height: "90px",
                      objectFit: "cover",
                      borderRadius: "18px",
                    }}
                  />

                  <div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          padding: "6px 10px",
                          borderRadius: "999px",
                          background: "#eff6ff",
                          color: "#1d4ed8",
                          fontSize: "11px",
                          fontWeight: 800,
                        }}
                      >
                        {otherUser?.name ?? "Conversation"}
                      </span>

                      {listing?.isDonation ? (
                        <span
                          style={{
                            padding: "6px 10px",
                            borderRadius: "999px",
                            background: "#dcfce7",
                            color: "#166534",
                            fontSize: "11px",
                            fontWeight: 800,
                          }}
                        >
                          Donation
                        </span>
                      ) : null}
                    </div>

                    <h3
                      style={{
                        fontSize: "18px",
                        lineHeight: 1.25,
                        marginBottom: "6px",
                      }}
                    >
                      {listing?.title ?? "Listing conversation"}
                    </h3>

                    <p
                      style={{
                        color: "#475569",
                        lineHeight: 1.6,
                        marginBottom: "6px",
                      }}
                    >
                      {lastMessage?.text ?? "No messages yet"}
                    </p>

                    <p
                      style={{
                        color: "#64748b",
                        fontSize: "13px",
                      }}
                    >
                      {listing?.location ?? "Marketplace"} · Updated{" "}
                      {formatDate(conversation.updatedAt)}
                    </p>
                  </div>

                  <div
                    style={{
                      minHeight: "38px",
                      padding: "0 12px",
                      borderRadius: "12px",
                      background: "#0f172a",
                      color: "#ffffff",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 800,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Open chat
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}