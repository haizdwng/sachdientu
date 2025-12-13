import { PayOS } from '@payos/node';

const payos = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID,
  apiKey: process.env.PAYOS_API_KEY,
  checksumKey: process.env.PAYOS_CHECKSUM_KEY
});

export const createPaymentLink = async (orderData) => {
  const paymentRequest = await payos.paymentRequests.create({
    orderCode: Number(orderData.code),
    amount: orderData.amount,
    description: orderData.description,
    cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/cancel?order=${orderData.code}`,
    returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success?order=${orderData.code}`
  });

  const paymentResponse = await paymentRequest;

  return paymentResponse;
};

export const verifyWebhook = async (body) => {
  const webhook = await payos.webhooks.verify(body);
  return webhook;
};

export default payos;