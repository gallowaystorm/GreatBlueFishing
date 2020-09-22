export interface OrderData {
  orderId: string,
  userId: string,
  datePlaced: Date,
  dateShipped: Date,
  shippingStreetAddress: string,
  shippingAddressLineTwo: string,
  shippingCity: string,
  shippingState: string,
  shippingPostal: string,
  paymentId: string
}
