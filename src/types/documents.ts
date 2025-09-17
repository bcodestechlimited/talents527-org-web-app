export interface Document {
  _id: string;
  url: string;
  publicId: string;
  assetType: string;
  entityType: string;
  originalName: string;
  bytes: number;
  width: number;
  height: number;
  mimeType: string;
}
