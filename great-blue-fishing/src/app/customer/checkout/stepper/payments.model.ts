export interface PaymentData {
  paymentId: string,
  cardType: string,
  cardNumber: number,
  securityCode: string,
  expiratiion: Date,
  nameOnCard: string,
  billingStreetAddress: string,
  billingAddressLineTwo: string,
  billingCity: string,
  billingState: string,
  billingPostal: string,
  userId: string
}

interface CardType {
  value: string,
  viewValue: string
}

export const CardType: CardType[] = [
  {value: 'Visa', viewValue: 'Visa'},
  {value: 'Mastercard', viewValue: 'Mastercard'},
  {value: 'American Express', viewValue: 'American Express'},
  {value: 'Discover', viewValue: 'Discover'}
];
