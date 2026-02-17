import { z } from 'zod';

export const UpsRateResponseSchema = z.object({
  RatingResponse: z.object({
    RatedShipment: z.array(
      z.object({
        Service: z.object({
          Code: z.string(),
          Description: z.string().optional(),
        }),
        TotalCharges: z.object({
          CurrencyCode: z.string(),
          MonetaryValue: z.string(),
        }),
        NegotiatedRateCharges: z
          .object({
            TotalCharge: z
              .object({
                CurrencyCode: z.string(),
                MonetaryValue: z.string(),
              })
              .optional(),
          })
          .optional(),
        GuaranteedDelivery: z
          .object({
            BusinessDaysInTransit: z.string().optional(),
            DeliveryByTime: z.string().optional(),
            ScheduledDeliveryDate: z.string().optional(),
          })
          .optional(),
      }),
    ),
  }),
});

export type UpsRateResponse = z.infer<typeof UpsRateResponseSchema>;
