import { CarrierError } from '../../../../common/errors/carrier-error';
import { UpsRateResponse } from '../schemas/ups-rating.shemas';
import { UpsRatingResponse } from '../interfaces/ups-rating-response.interface';
import { RatingRequest } from '../../../../features/rating/interfaces/rating-request.interface';

export function toUpsRateRequest(
  request: RatingRequest,
): Record<string, unknown> {
  return {
    RatingRequest: {
      Request: { RequestOption: 'Rate' },
      Shipment: {
        Shipper: {
          Address: {
            AddressLine: [
              request.origin.street1,
              request.origin.street2,
            ].filter(Boolean),
            City: request.origin.city,
            StateProvinceCode: request.origin.state,
            PostalCode: request.origin.postalCode,
            CountryCode: request.origin.countryCode,
          },
        },
        ShipTo: {
          Address: {
            AddressLine: [
              request.destination.street1,
              request.destination.street2,
            ].filter(Boolean),
            City: request.destination.city,
            StateProvinceCode: request.destination.state,
            PostalCode: request.destination.postalCode,
            CountryCode: request.destination.countryCode,
          },
        },
        Package: request.packages.map((pkg) => ({
          PackagingType: { Code: '02' },
          PackageWeight: {
            UnitOfMeasurement: {
              Code: pkg.weight.unit === 'kg' ? 'KGS' : 'LBS',
            },
            Weight: pkg.weight.value.toString(),
          },
        })),
      },
    },
  };
}

export function fromUpsRateResponse(
  response: UpsRateResponse,
): UpsRatingResponse[] {
  return response.RatingResponse.RatedShipment.map((s) => {
    const amount = Number(s.TotalCharges.MonetaryValue);
    if (Number.isNaN(amount)) {
      throw new CarrierError(
        'CARRIER_API_ERROR',
        'Invalid UPS monetary value',
        {
          carrier: 'UPS',
          details: { rawResponse: s },
        },
      );
    }

    return {
      carrier: 'UPS',
      serviceCode: s.Service.Code,
      serviceName: s.Service.Description ?? s.Service.Code,
      totalCharge: {
        amount,
        currency: s.TotalCharges.CurrencyCode,
      },
      NegotiatedRateCharges: s.NegotiatedRateCharges,
      GuaranteedDelivery: s.GuaranteedDelivery,
    };
  });
}

//RatingRequest Example
// {
//     "RatingRequest": {
//         "Request": {
//             "TransactionReference": {
//                 "CustomerContext": "CustomerContext"
//             }
//         },
//         "Shipment": {
//             "Shipper": {
//                 "Name": "ShipperName",
//                     "ShipperNumber": "ShipperNumber",
//                         "Address": {
//                     "AddressLine": [
//                         "ShipperAddressLine",
//                         "ShipperAddressLine",
//                         "ShipperAddressLine"
//                     ],
//                         "City": "TIMONIUM",
//                             "StateProvinceCode": "MD",
//                                 "PostalCode": "21093",
//                                     "CountryCode": "US"
//                 }
//             },
//             "ShipTo": {
//                 "Name": "ShipToName",
//                     "Address": {
//                     "AddressLine": [
//                         "ShipToAddressLine",
//                         "ShipToAddressLine",
//                         "ShipToAddressLine"
//                     ],
//                         "City": "Alpharetta",
//                             "StateProvinceCode": "GA",
//                                 "PostalCode": "30005",
//                                     "CountryCode": "US"
//                 }
//             },
//             "ShipFrom": {
//                 "Name": "ShipFromName",
//                     "Address": {
//                     "AddressLine": [
//                         "ShipFromAddressLine",
//                         "ShipFromAddressLine",
//                         "ShipFromAddressLine"
//                     ],
//                         "City": "TIMONIUM",
//                             "StateProvinceCode": "MD",
//                                 "PostalCode": "21093",
//                                     "CountryCode": "US"
//                 }
//             },
//             "PaymentDetails": {
//                 "ShipmentCharge": [
//                     {
//                         "Type": "01",
//                         "BillShipper": {
//                             "AccountNumber": ""
//                         }
//                     }
//                 ]
//             },
//             "Service": {
//                 "Code": "03",
//                     "Description": "Ground"
//             },
//             "NumOfPieces": "1",
//                 "Package": {
//                 "SimpleRate": {
//                     "Description": "SimpleRateDescription",
//                         "Code": "XS"
//                 },
//                 "PackagingType": {
//                     "Code": "02",
//                         "Description": "Packaging"
//                 },
//                 "Dimensions": {
//                     "UnitOfMeasurement": {
//                         "Code": "IN",
//                             "Description": "Inches"
//                     },
//                     "Length": "5",
//                         "Width": "5",
//                             "Height": "5"
//                 },
//                 "PackageWeight": {
//                     "UnitOfMeasurement": {
//                         "Code": "LBS",
//                             "Description": "Pounds"
//                     },
//                     "Weight": "1"
//                 }
//             }
//         }
//     }
// }

//______________________________________
//______________________________________

//RatingResponse from api
// {
//     "RatingResponse": {
//         "Response": {
//             "ResponseStatus": {
//                 "Code": "s",
//                     "Description": "string"
//             },
//             "Alert": [
//                 {
//                     "Code": "string",
//                     "Description": "string"
//                 }
//             ],
//                 "AlertDetail": [
//                     {
//                         "Code": "string",
//                         "Description": "string",
//                         "ElementLevelInformation": {
//                             "Level": "s",
//                             "ElementIdentifier": [
//                                 {
//                                     "Code": null,
//                                     "Value": null
//                                 }
//                             ]
//                         }
//                     }
//                 ],
//                     "TransactionReference": {
//                 "CustomerContext": "string"
//             }
//         },
//         "RatedShipment": [
//             {
//                 "Disclaimer": [
//                     {
//                         "Code": "st",
//                         "Description": "string"
//                     }
//                 ],
//                 "Service": {
//                     "Code": "str",
//                     "Description": "string"
//                 },
//                 "RateChart": "s",
//                 "Zone": "stri",
//                 "RatedShipmentAlert": [
//                     {
//                         "Code": "string",
//                         "Description": "string"
//                     }
//                 ],
//                 "BillableWeightCalculationMethod": "st",
//                 "RatingMethod": "st",
//                 "BillingWeight": {
//                     "UnitOfMeasurement": {
//                         "Code": "str",
//                         "Description": "string"
//                     },
//                     "Weight": "strin"
//                 },
//                 "TransportationCharges": {
//                     "CurrencyCode": "str",
//                     "MonetaryValue": "string"
//                 },
//                 "BaseServiceCharge": {
//                     "CurrencyCode": "str",
//                     "MonetaryValue": "string"
//                 },
//                 "ItemizedCharges": [
//                     {
//                         "Code": "str",
//                         "Description": "string",
//                         "CurrencyCode": "str",
//                         "MonetaryValue": "string",
//                         "SubType": "string"
//                     }
//                 ],
//                 "FRSShipmentData": {
//                     "TransportationCharges": {
//                         "GrossCharge": {
//                             "CurrencyCode": "str",
//                             "MonetaryValue": "string"
//                         },
//                         "DiscountAmount": {
//                             "CurrencyCode": "str",
//                             "MonetaryValue": "string"
//                         },
//                         "DiscountPercentage": "st",
//                         "NetCharge": {
//                             "CurrencyCode": "str",
//                             "MonetaryValue": "string"
//                         }
//                     },
//                     "FreightDensityRate": {
//                         "Density": "strin",
//                         "TotalCubicFeet": "string"
//                     },
//                     "HandlingUnits": [
//                         {
//                             "Quantity": "string",
//                             "Type": {
//                                 "Code": null,
//                                 "Description": null
//                             },
//                             "Dimensions": {
//                                 "UnitOfMeasurement": null,
//                                 "Length": null,
//                                 "Width": null,
//                                 "Height": null
//                             },
//                             "AdjustedHeight": {
//                                 "Value": null,
//                                 "UnitOfMeasurement": null
//                             }
//                         }
//                     ]
//                 },
//                 "ServiceOptionsCharges": {
//                     "CurrencyCode": "str",
//                     "MonetaryValue": "string"
//                 },
//                 "TaxCharges": [
//                     {
//                         "Type": "string",
//                         "MonetaryValue": "string"
//                     }
//                 ],
//                 "TotalCharges": {
//                     "CurrencyCode": "str",
//                     "MonetaryValue": "string"
//                 },
//                 "TotalChargesWithTaxes": {
//                     "CurrencyCode": "str",
//                     "MonetaryValue": "string"
//                 },
//                 "NegotiatedRateCharges": {
//                     "BaseServiceCharge": [
//                         {
//                             "CurrencyCode": "str",
//                             "MonetaryValue": "string"
//                         }
//                     ],
//                     "RateModifier": [
//                         {
//                             "ModifierType": "str",
//                             "ModifierDesc": "string",
//                             "Amount": "string"
//                         }
//                     ],
//                     "ItemizedCharges": [
//                         {
//                             "Code": "str",
//                             "Description": "string",
//                             "CurrencyCode": "str",
//                             "MonetaryValue": "string",
//                             "SubType": "string"
//                         }
//                     ],
//                     "TaxCharges": [
//                         {
//                             "Type": "string",
//                             "MonetaryValue": "string"
//                         }
//                     ],
//                     "TotalCharge": {
//                         "CurrencyCode": "string",
//                         "MonetaryValue": "string"
//                     },
//                     "TotalChargesWithTaxes": {
//                         "CurrencyCode": "string",
//                         "MonetaryValue": "string"
//                     }
//                 },
//                 "RatedPackage": [
//                     {
//                         "BaseServiceCharge": {
//                             "CurrencyCode": "str",
//                             "MonetaryValue": "string"
//                         },
//                         "TransportationCharges": {
//                             "CurrencyCode": "string",
//                             "MonetaryValue": "string"
//                         },
//                         "ServiceOptionsCharges": {
//                             "CurrencyCode": "string",
//                             "MonetaryValue": "string"
//                         },
//                         "TotalCharges": {
//                             "CurrencyCode": "string",
//                             "MonetaryValue": "string"
//                         },
//                         "Weight": "string",
//                         "BillingWeight": {
//                             "UnitOfMeasurement": {
//                                 "Code": null,
//                                 "Description": null
//                             },
//                             "Weight": "string"
//                         },
//                         "Accessorial": [
//                             {
//                                 "Code": null,
//                                 "Description": null
//                             }
//                         ],
//                         "ItemizedCharges": [
//                             {
//                                 "Code": null,
//                                 "Description": null,
//                                 "CurrencyCode": null,
//                                 "MonetaryValue": null,
//                                 "SubType": null
//                             }
//                         ],
//                         "NegotiatedCharges": {
//                             "RateModifier": [
//                                 null
//                             ],
//                             "ItemizedCharges": [
//                                 null
//                             ]
//                         },
//                         "SimpleRate": {
//                             "Code": "st"
//                         },
//                         "RateModifier": [
//                             {
//                                 "ModifierType": null,
//                                 "ModifierDesc": null,
//                                 "Amount": null
//                             }
//                         ]
//                     }
//                 ],
//                 "TimeInTransit": {
//                     "PickupDate": "stringst",
//                     "DocumentsOnlyIndicator": "string",
//                     "PackageBillType": "st",
//                     "ServiceSummary": {
//                         "Service": {
//                             "Description": "string"
//                         },
//                         "GuaranteedIndicator": "string",
//                         "Disclaimer": "string",
//                         "EstimatedArrival": {
//                             "Arrival": {
//                                 "Date": null,
//                                 "Time": null
//                             },
//                             "BusinessDaysInTransit": "strin",
//                             "Pickup": {
//                                 "Date": null,
//                                 "Time": null
//                             },
//                             "DayOfWeek": "string",
//                             "CustomerCenterCutoff": "string",
//                             "DelayCount": "str",
//                             "HolidayCount": "st",
//                             "RestDays": "st",
//                             "TotalTransitDays": "strin"
//                         },
//                         "SaturdayDelivery": "string",
//                         "SaturdayDeliveryDisclaimer": "string",
//                         "SundayDelivery": "string",
//                         "SundayDeliveryDisclaimer": "string"
//                     },
//                     "AutoDutyCode": "st",
//                     "Disclaimer": "string"
//                 },
//                 "GuaranteedDelivery": {
//                     "BusinessDaysInTransit": "string",
//                     "DeliveryByTime": "string",
//                     "ScheduledDeliveryDate": "string"
//                 },
//                 "RoarRatedIndicator": "string"
//             }
//         ]
//     }
// }
