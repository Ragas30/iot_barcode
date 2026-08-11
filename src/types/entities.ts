export type TokenType = "qr" | "barcode";
export type TokenStatus = "active" | "expired";

export type Admin = {
  id: string;
  name: string;
  email: string;
  password: string;
  pin?: string | null;
  pinUpdatedAt?: string | null;
  createdAt: string;
};

export type AuthPayload = {
  sub: string;
  email: string;
  name: string;
};

export type TokenRecord = {
  id: string;
  adminId: string;
  name: string;
  token: string;
  type: TokenType;
  status: TokenStatus;
  createdAt: string;
  expiredAt: string;
};

export type LoginLog = {
  id: string;
  adminId: string;
  name: string;
  email: string;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
  expiresAt: string;
  endedAt: string | null;
};

export type SafeOpenLog = {
  id: string;
  tokenId: string;
  token: string;
  tokenName: string;
  adminId: string;
  adminName: string;
  status: "opened";
  openedAt: string;
};
