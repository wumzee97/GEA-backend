import { Request } from 'express';
import { asyncWrapper } from '../utils/AsyncWrapper';
import { Service } from 'typedi';
import SubscriptionModule from '../modules/SubscriptionModule';

@Service()
export default class SubscriptionController {
  constructor(public requestModule: SubscriptionModule) {}

  plans = asyncWrapper(async () => {
    const response = await this.requestModule.plansRequest();
    return response;
  });

  paymentLink = asyncWrapper(async (req: Request) => {
    const { account_id, plan_id, callback_url, type } = req.body;
    const response = await this.requestModule.paymentLinkRequest(account_id, plan_id, callback_url, type);
    return response;
  });

  confirmPayment = asyncWrapper(async (req: Request) => {
    const { reference } = req.body;
    const response = await this.requestModule.confirmPaymentRequest(reference);
    return response;
  });
}
