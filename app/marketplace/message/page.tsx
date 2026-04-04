"use client";

import Link from "next/link";

export default function MarketplaceMessagesPage() {
  return (
    <main className="marketplacePage">
      <section className="marketplaceSection">
        <div className="marketplaceSection__header">
          <div>
            <h1>Messages</h1>
            <p>Your marketplace conversations will appear here.</p>
          </div>
        </div>

        <div className="marketplaceEmpty">
          <h3>No messages yet</h3>
          <p>
            When buyers or sellers contact each other, conversations will appear
            in this section.
          </p>

          <div style={{ marginTop: "16px" }}>
            <Link
              href="/marketplace"
              className="marketplaceBtn marketplaceBtn--primary"
            >
              Back to marketplace
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}