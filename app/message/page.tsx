"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { currentUser } from "@/lib/mock-auth";
import { getUserConversations, InboxItem } from "@/lib/messages-storage";

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
        {/* HEADER */}
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
              Manage private conversations with buyers and sellers.
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

        {/* EMPTY STATE */}
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
              When you contact a seller, your conversations will appear here.
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
            {items.map((item) => {
              const { conversation, listing, lastMessage, otherUser } = item;

              return (
                <Link
                  key={conversation.id}
                  href={`/message/${conversation.id}`}
                  style={{
                    display: "block",
                    padding: "18px",
                    borderRadius: "24px",
                    background: "#ffffff",
                    border: "1px solid rgba(148, 163, 184, 0.14)",
                    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)",
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
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 800,
                          color: "#2563eb",
                        }}
                      >
                        {otherUser?.name ?? "User"}
                      </span>

                      <h3
                        style={{
                          fontSize: "18px",
                          margin: "6px 0",
                        }}
                      >
                        {listing?.title ?? "Listing"}
                      </h3>

                      <p
                        style={{
                          color: "#475569",
                        }}
                      >
                        {lastMessage?.text ?? "No messages"}
                      </p>

                      <small
                        style={{
                          color: "#64748b",
                        }}
                      >
                        Updated {formatDate(conversation.updatedAt)}
                      </small>
                    </div>

                    <div
                      style={{
                        background: "#0f172a",
                        color: "#fff",
                        padding: "8px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: 800,
                      }}
                    >
                      Open
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}