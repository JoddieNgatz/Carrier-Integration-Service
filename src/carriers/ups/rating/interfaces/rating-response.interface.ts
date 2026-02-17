export interface RatingResponse {
  carrier: string;
}

export interface UpsRatingResponse extends RatingResponse {
  serviceCode: string;
  serviceName: string;
  totalCharge: {
    amount: number;
    currency: string;
  };
  estimatedDeliveryDate?: string;
  meta?: Record<string, unknown>;
}
