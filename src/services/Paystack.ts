import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const initialisePaystack = async function checkUserMobile(
  email: string,
  reference: string,
  amount: string,
  url: string,
): Promise<string> {
  const data = JSON.stringify({
    reference,
    amount: Number(amount) * 100,
    email,
    currency: 'NGN',
    callback_url: `${url}?type=paystack`,
    // metadata: {
    //   type: 'paystack',
    // },
  });

  const config: AxiosRequestConfig = {
    method: 'post',
    url: 'https://api.paystack.co/transaction/initialize',
    headers: {
      Authorization: 'Bearer ' + process.env.PAYSTACK_SK,
      'Content-Type': 'application/json',
    },
    data,
  };

  const response: AxiosResponse = await axios.request(config);
  console.log(response.data.data.authorization_url);
  return response.data.data.authorization_url;
};

const chargeCard = async function charge(
  email: string,
  amount: number,
  auth_code: string,
  reference: string,
): Promise<AxiosResponse> {
  const data = JSON.stringify({
    authorization_code: auth_code,
    amount,
    email,
    reference,
  });

  const config: AxiosRequestConfig = {
    method: 'post',
    url: 'https://api.paystack.co/transaction/charge_authorization',
    headers: {
      Authorization: 'Bearer ' + process.env.PAYSTACK_SK,
      'Content-Type': 'application/json',
    },
    data,
  };

  const response: AxiosResponse = await axios.request(config);
  return response;
};

const verifyPayment = async function verify(reference: string): Promise<AxiosResponse> {
  const url = 'https://api.paystack.co/transaction/verify/' + reference;

  const option: AxiosRequestConfig = {
    method: 'get',
    url,
    headers: {
      Authorization: 'Bearer ' + process.env.PAYSTACK_SK,
      'Content-Type': 'application/json',
    },
  };

  const result: AxiosResponse = await axios(option);
  return result;
};

export { initialisePaystack, chargeCard, verifyPayment };
