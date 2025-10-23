export interface VerifyPaymentResponse {
  success: boolean;
  status_code: number;
  message: string;
  data: {
    grossAmount: number;
    fee: number;
    netAmount: number;
    newBalance: number;
  };
}

export interface GetWalletResponse {
  success: boolean;
  status_code: number;
  message: string;
  data: {
    wallet: {
      _id: string;
      user: string;
      balance: number;
      currency: "NGN";
      holds: number;
    };
  };
}

export interface FundWalletResponse {
  message: string;
  data: {
    payment: {
      status: boolean;
      message: string;
      data: {
        authorization_url: string;
        access_code: string;
        reference: string;
      };
    };
    chargeDetails: {
      grossAmount: number;
      charge: number;
      netAmount: number;
    };
  };
}
