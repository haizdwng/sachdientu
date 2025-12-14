import { SePayPgClient } from 'sepay-pg-node';

const client = new SePayPgClient({
  env: process.env.SEPAY_ENV || 'sandbox',
  merchant_id: process.env.SEPAY_MERCHANT_ID,
  secret_key: process.env.SEPAY_SECRET_KEY,
});

export const createPayment = (orderData) => {
  const fields = client.checkout.initOneTimePaymentFields({
    operation: 'PURCHASE',
    payment_method: 'BANK_TRANSFER',
    order_invoice_number: orderData.code,
    order_amount: orderData.amount,
    currency: 'VND',
    order_description: orderData.description,
    customer_id: orderData.customerId,
    success_url: `${process.env.URL}/payment/success?order=${orderData.code}`,
    cancel_url: `${process.env.URL}/payment/cancel?order=${orderData.code}`,
  });

  const checkoutUrl = client.checkout.initCheckoutUrl();

  return { fields, checkoutUrl };
};

export const getOrderDetails = async (orderInvoiceNumber) => {
  try {
    const order = await client.order.retrieve(orderInvoiceNumber);
    return order;
  } catch (error) {
    console.error('SePay get order error:', error);
    return null;
  }
};

export const cancelOrder = async (orderInvoiceNumber) => {
  try {
    const result = await client.order.cancel(orderInvoiceNumber);
    return result;
  } catch (error) {
    console.error('SePay cancel order error:', error);
    return null;
  }
};

export default client;