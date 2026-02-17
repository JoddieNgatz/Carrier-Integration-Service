export type CarrierErrorCode =
  | 'AUTH_ERROR'
  | 'VALIDATION_ERROR'
  | 'NETWORK_ERROR'
  | 'RATE_LIMITED'
  | 'CARRIER_API_ERROR'
  | 'INTERNAL_ERROR';

export interface CarrierErrorDetails {
  statusCode?: number;
  rawResponse?: unknown;
  rawRequest?: unknown;
  carrierCode?: string;
  context?: Record<string, unknown>;
}

export class CarrierError extends Error {
  readonly code: CarrierErrorCode;
  readonly carrier?: string;
  readonly details?: CarrierErrorDetails;

  constructor(
    code: CarrierErrorCode,
    message: string,
    opts?: { carrier?: string; details?: CarrierErrorDetails; cause?: unknown },
  ) {
    super(message);
    this.name = 'CarrierError';
    this.code = code;
    this.carrier = opts?.carrier;
    this.details = opts?.details;
    if (opts?.cause) {
      (this as Error & { cause?: unknown }).cause = opts.cause;
    }
  }
}
