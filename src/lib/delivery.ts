export const DELIVERY_FEES = {
  dhaka: 70,
  outside: 130,
} as const;

export const DELIVERY_LABELS = {
  dhaka: 'Inside Dhaka',
  outside: 'Outside Dhaka',
} as const;

export type DeliveryZone = keyof typeof DELIVERY_FEES;

export const DELIVERY_ZONES = Object.keys(DELIVERY_FEES) as DeliveryZone[];
