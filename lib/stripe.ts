/** Stripe checkout stub — wire STRIPE_SECRET_KEY for real sessions. */
export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export async function createCheckoutStub(email?: string) {
  return {
    ok: true as const,
    mode: isStripeConfigured() ? ("live" as const) : ("stub" as const),
    message: isStripeConfigured()
      ? "Stripe configured — replace stub with stripe.checkout.sessions.create"
      : "Checkout stub — set STRIPE_SECRET_KEY to enable billing",
    redirectUrl: `/pricing?checkout=stub${email ? `&email=${encodeURIComponent(email)}` : ""}`,
  };
}
