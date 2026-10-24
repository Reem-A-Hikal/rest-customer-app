export enum AddressType {
  Home = 0,
  Work = 1,
  Other = 2,
}

export const ADDRESS_TYPE_LABELS: Record<AddressType, string> = {
  [AddressType.Home]: 'address.type.home',
  [AddressType.Work]: 'address.type.work',
  [AddressType.Other]: 'address.type.other',
};

export interface Address {
  addressId: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  governorate?: string;
  addressType: AddressType;
  isDefault: boolean;
  userId: string;
}

export interface AddressCreateRequest {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  governorate: string;
  addressType: AddressType;
}
