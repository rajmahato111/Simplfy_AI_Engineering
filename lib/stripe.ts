import { siteUrl } from "./site-url";

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim() && process.env.STRIPE_PRICE_ID?.trim());
}

type CheckoutResult =
  | { ok: true; mode: "live"; url: string }
  | { ok: true; mode: "stub"; message: string; redirectUrl: string }
  | { ok: false; error: string };

/** ponytail: Stripe REST API — no stripe npm package */
export async function createCheckoutSession(email?: string): Promise<CheckoutResult> {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  const priceId = process.env.STRIPE_PRICE_ID?.trim();
  const base = siteUrl();

  if (!key || !priceId) {
    return {
      ok: true,
      mode: "stub",
      message: "Checkout stub — set STRIPE_SECRET_KEY and STRIPE_PRICE_ID",
      redirectUrl: `/pricing?checkout=stub${email ? `&email=${encodeURIComponent(email)}` : ""}`,
    };
  }

  const body = new URLSearchParams({
    mode: "subscription",
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    success_url: `${base}/pricing?checkout=success`,
    cancel_url: `${base}/pricing?checkout=cancel`,
  });
  if (email) body.set("customer_email", email);

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!res.ok) {
    const err = await res.text();
    return { ok: false, error: err.slice(0, 200) };
  }

  const data = (await res.json()) as { url?: string };
  if (!data.url) return { ok: false, error: "No checkout URL returned" };
  return { ok: true, mode: "live", url: data.url };
}
