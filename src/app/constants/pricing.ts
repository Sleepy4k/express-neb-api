/* eslint-disable perfectionist/sort-objects */
const PRICING_PAYMENT_URL = "https://trakteer.id/nach-neb/tip";

const TOKEN_PRICING = [
  {
    id: 1,
    name: "Basic Plan",
    price: 35000,
    displayPrice: "35K",
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
    price: 150000,
    displayPrice: "150K",
    token: 6,
    tokenDisplay: "5 (+1) Tokens",
    className: "premium-plan highlighted",
    animation: "animate__zoomIn animate__delay-1s",
    badge: {
      enabled: true,
      text: "Most Popular",
      className: "pricing-badge",
    },
    description: ["6 Exam Tokens Included", "Save 60K instantly", "Scalable for bulk purchases", "Exclusive access to new features"],
  },
  {
    id: 3,
    name: "Enterprise Plan",
    price: 90000,
    displayPrice: "90K",
    token: 3,
    tokenDisplay: "3 Tokens",
    className: "middle-plan",
    animation: "animate__fadeInRight",
    badge: {
      enabled: false,
      text: "Most Popular",
      className: "pricing-badge",
    },
    description: ["Save 15k on this plan", "Supports all configurations", "Ideal for student groups"],
  },
];

export { PRICING_PAYMENT_URL, TOKEN_PRICING };
