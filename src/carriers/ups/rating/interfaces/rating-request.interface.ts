import { DimensionUnit, WeightUnit } from './rating-request.types';

export interface Address {
  name?: string;
  companyName?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
}

export interface Package {
  weight: {
    value: number;
    unit: WeightUnit;
  };
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: DimensionUnit;
  };
}

export interface RatingRequest {
  carrier: string;
}
export interface UpsRatingRequest extends RatingRequest {
  origin: Address;
  destination: Address;
  packages: Package[];
  serviceLevel?: 'ground' | 'express' | 'overnight' | string;
}
