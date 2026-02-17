import { RatingResponse } from '../../../../features/rating/interfaces/rating-response.interface';

export interface UpsRatingResponse extends RatingResponse {
  //These are the fields that are specific to the UPS rating response i thought best to share these
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
