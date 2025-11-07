// src/lib/iap.ts
// MOCK IAP for development in Expo Go (no native modules required).
// We'll swap to RevenueCat (real IAP) later in Phase B.

export type Entitlement = 'pro';

// Toggle this to false later when we add real IAP.
export const MOCK_MODE = true;

// Pretend we fetch offerings/packages
export async function getOfferings() {
  return [
    {
      identifier: 'default',
      availablePackages: [
        {
          identifier: 'pro_monthly',
          product: {
            identifier: 'pro_monthly_499',
            priceString: '$4.99',
            price: 4.99,
            currencyCode: 'USD',
            title: 'OMNIgm Pro Monthly',
            description: 'Unlock all Pro features',
          },
        },
      ],
    },
  ];
}

export async function initPurchases(userId?: string) {
  return; // mock
}

export async function isPro(): Promise<boolean> {
  return true; // mock: always pro for dev
}

export async function purchaseMonthly(): Promise<boolean> {
  return true; // mock success
}

export async function restore(): Promise<boolean> {
  return true; // mock success
}
