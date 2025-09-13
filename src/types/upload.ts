export interface UploadRequestDocsResponse {
  success: boolean;
  status_code: string;
  message: string;
  assets: Asset[];
}

export interface UploadLogoResponse {
  success: boolean;
  status_code: string;
  message: string;
  data: Asset;
}

export interface Asset {
  id: string;
  url: string;
  publicId: string;
  originalName: string;
  assetType: string;
  entityType: string;
  bytes: number;
  width: number;
  height: number;
  mimeType: string;
}
