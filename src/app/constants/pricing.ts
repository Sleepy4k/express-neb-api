/* eslint-disable perfectionist/sort-objects */
const PRICING_PAYMENT_URL = "https://saweria.co/nachneb";

const TOKEN_PRICING = [
  {
    id: 1,
    name: "Basic Plan",
    price: 5000,
    displayPrice: "5K",
    token: 1,
    tokenDisplay: "1 Token",
    className: "basic-plan",
    animation: "animate__fadeInLeft",
    badge: {
      enabled: false,
      text: "Most Popular",
      className: "pricing-badge",
    },
    description: ["Standard pricing", "Supports all configurations", "Perfect for beginners"],
  },
  {
    id: 2,
    name: "Premium Plan",
    price: 25000,
    displayPrice: "25K",
    token: 6,
    tokenDisplay: "5 (+1) Tokens",
    className: "premium-plan highlighted",
    animation: "animate__zoomIn animate__delay-1s",
    badge: {
      enabled: true,
      text: "Most Popular",
      className: "pricing-badge",
    },
    description: ["6 Exam Tokens Included", "Save 5K instantly", "Scalable for bulk purchases", "Exclusive access to new features"],
  },
  {
    id: 3,
    name: "Enterprise Plan",
    price: 12000,
    displayPrice: "12K",
    token: 3,
    tokenDisplay: "3 Tokens",
    className: "middle-plan",
    animation: "animate__fadeInRight",
    badge: {
      enabled: false,
      text: "Most Popular",
      className: "pricing-badge",
    },
    description: ["Save 3k on this plan", "Supports all configurations", "Ideal for student groups"],
  },
];

export { PRICING_PAYMENT_URL, TOKEN_PRICING };
