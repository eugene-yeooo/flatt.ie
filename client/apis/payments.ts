import request from 'superagent'
import { Payment } from '../../models/models'

const paymentURL = '/api/v1/payment'

export async function getAllPayments(): Promise<Payment[]> {
  const res = await request.get(paymentURL)
  return res.body
}

export async function updatePaymentStatus(
  id: number,
  paid: boolean,
): Promise<Payment[]> {
  try {
    const res = await request
      .patch(`/api/v1/payment/${id}`)
      // below, the .set says "I expect the response body to be in JSON format.""
      .set('Accept', 'application/json')
      // below, the .set says "The data I am sending in the request body is JSON."
      .set('Content-Type', 'application/json')
      .send({ paid })
    return res.body as Payment[]
    console.log('PATCH response:', res.body)
  } catch (error: any) {
    if (error.response && error.response.body && error.reponse.body.error) {
      throw new Error(error.response.body.error)
    }
    throw error
  }
}

export async function addPayments(
  billId: number,
  payments: Partial<Payment>[],
): Promise<Payment[]> {
  try {
    const res = await request
      .post('/api/v1/payment')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ billId, payments })

    return res.body as Payment[]
  } catch (error: any) {
    if (error.response && error.response.body && error.response.body.error) {
      throw new Error(error.response.body.error)
    }
    throw error
  }
}

export async function deletePayment(
  id: number,
): Promise<{ success: boolean; payment?: Payment }> {
  try {
    const res = await request.delete(`/payments/${id}`)
    return res.body
  } catch (error: any) {
    if (error.response && error.response.body && error.response.body.error) {
      throw new Error(error.response.body.error)
    }
    throw error
  }
}
