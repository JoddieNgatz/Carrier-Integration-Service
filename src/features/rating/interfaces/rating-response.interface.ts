export interface RatingResponse {
  carrier: string;
  serviceCode: string;
  serviceName: string;
  totalCharge: {
    amount: number;
    currency: string;
  };
  estimatedDeliveryDate?: string;
  NegotiatedRateCharges?: {
    TotalCharge?: {
      CurrencyCode: string;
      MonetaryValue: string;
    };
  };
  GuaranteedDelivery?: {
    BusinessDaysInTransit?: string;
    DeliveryByTime?: string;
    ScheduledDeliveryDate?: string;
  };
  meta?: Record<string, unknown>;
}
