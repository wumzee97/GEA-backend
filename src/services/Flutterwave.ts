import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as dotenv from 'dotenv';
import { IUser } from '../models/user.model';

dotenv.config();

export const initialiseFlutterwave = async (
  user: IUser,
  reference: string,
  amount: string,
  url: string,
): Promise<string> => {
  const data = JSON.stringify({
    tx_ref: reference,
    amount: amount,
    currency: 'NGN',
    redirect_url: `${url}?type=flutterwave`,
    // meta: {
    //   type: 'flutterwave'
    // },
    customer: {
      email: user.email,
      phonenumber: user.phone,
      name: `${user.firstname} ${user.lastname}`,
    },
    customizations: {
      title: 'Nigerian Law Publications',
      logo: 'http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png',
    },
  });

  const config: AxiosRequestConfig = {
    method: 'post',
    url: 'https://api.flutterwave.com/v3/payments',
    headers: {
      Authorization: `${process.env.FLUTTERWAVE_SK}`,
      'Content-Type': 'application/json',
    },
    data: data,
  };

  const response: AxiosResponse<any> = await axios.request(config);

  console.log(response.data);

  return response.data.data.link;
};

export const verifyTransaction = async (reference: string): Promise<AxiosResponse<any>> => {
  const config: AxiosRequestConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${reference}`,
    headers: {
      Authorization: `${process.env.FLUTTERWAVE_SK}`,
    },
  };

  return axios.request(config);
};

export const chargeCard = async (
  email: string,
  amount: number,
  auth_code: string,
  reference: string,
): Promise<AxiosResponse<any>> => {
  const data = JSON.stringify({
    token: auth_code,
    email: email,
    currency: 'NGN',
    tx_ref: reference,
    amount: amount,
  });

  const config: AxiosRequestConfig = {
    method: 'post',
    url: 'https://api.flutterwave.com/v3/tokenized-charges',
    headers: {
      Authorization: `${process.env.FLUTTERWAVE_SK}`,
      'Content-Type': 'application/json',
    },
    data: data,
  };

  const response: AxiosResponse<any> = await axios.request(config);
  return response;
};

// Export all functions
export default {
  initialiseFlutterwave,
  verifyTransaction,
  chargeCard,
};
