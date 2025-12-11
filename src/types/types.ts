export type Court = {
  id: number;
  name: string;
  isIndoor: boolean;
  baseHourlyRate: number;
  isAvailable?: boolean;
};

export type Equipment = {
  id: number;
  name: string;
  availableQuantity?: number;
  pricePerUnit: number;
};

export type Coach = {
  id: number;
  name: string;
  hourlyRate: number;
  isAvailable?: boolean;
};

export type AvailabilityResponse = {
  courts: Court[];
  equipment: Equipment[];
  coaches: Coach[];
};

export type PriceBreakdown = {
  baseCourt: number;
  baseEquipment: number;
  baseCoach: number;
  adjustments: {
    ruleId: number;
    name: string;
    appliesTo: string;
    amount: number;
  }[];
  total: number;
};

export type BookingResponse = {
  bookingId: number;
  totalPrice: number;
  priceBreakdown: PriceBreakdown;
};

// Shared types for AdminPricingRuleForm
export type AppliesTo = "COURT" | "EQUIPMENT" | "COACH" | "OVERALL";
export type RuleType = "MULTIPLIER" | "FLAT";
export type IsWeekend = boolean | null;

export type CreatePricingRuleInput = {
  name?: string;
  appliesTo: AppliesTo;
  isWeekend?: IsWeekend;
  startHour?: number | null;
  endHour?: number | null;
  indoorOnly?: boolean | null;
  ruleType?: RuleType;
  value?: number;
  isActive?: boolean;
};
