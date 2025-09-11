export interface UploadLogoResponse {
  success: boolean;
  status_code: string;
  message: string;
  data: Asset;
}

export interface Asset {
  _id: string;
  url: string;
  publicId: string;
  originalName: string;
  assetType: string;
  entityType: string;
}
