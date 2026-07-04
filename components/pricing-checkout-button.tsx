"use client";

import { useState } from "react";

export function PricingCheckoutButton() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        mode?: string;
        url?: string;
        redirectUrl?: string;
      };
      if (data.mode === "live" && data.url) {
        window.location.href = data.url;
        return;
      }
      setStatus(data.message ?? "Checkout initiated");
    } catch {
      setStatus("Checkout request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={loading}
        onClick={() => void handleCheckout()}
        className="w-full rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-60"
      >
        {loading ? "Starting checkout…" : "Upgrade to Pro"}
      </button>
      {status && (
        <p className="mt-3 text-sm text-zinc-600" role="status">
          {status}
        </p>
      )}
    </div>
  );
}
