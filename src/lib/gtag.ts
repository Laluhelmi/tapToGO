// Lightweight helpers to fire GA4 events. No-op if gtag isn't loaded.

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
  }
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}

// Predefined events for our funnel
export const events = {
  viewSchedule: (operator: string, route: string) =>
    trackEvent("view_schedule", { operator, route }),

  startBooking: (operator: string, route: string, price: number) =>
    trackEvent("begin_checkout", {
      currency: "IDR",
      value: price * 1000,
      operator,
      route,
    }),

  bookingCompleted: (params: {
    bookingCode: string;
    operator: string;
    route: string;
    pax: number;
    total: number; // in thousands
  }) =>
    trackEvent("purchase", {
      transaction_id: params.bookingCode,
      currency: "IDR",
      value: params.total * 1000,
      operator: params.operator,
      route: params.route,
      passengers: params.pax,
    }),

  clickWhatsAppPayment: (bookingCode: string) =>
    trackEvent("click_whatsapp_payment", { bookingCode }),

  clickWhatsAppContact: () => trackEvent("click_whatsapp_contact"),

  downloadEticket: (bookingCode: string) =>
    trackEvent("download_eticket", { bookingCode }),
};
