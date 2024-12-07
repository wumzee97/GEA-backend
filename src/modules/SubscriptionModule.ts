import { Service } from 'typedi';
import Subscription from '../models/subscription.model';
import Plan from '../models/plan.model';
import Payment from '../models/payment.model';
import User from '../models/user.model';
import { generateRandomString, formatPlans } from '../utils/Helpers';
import { SignSignature } from '../utils/UserSignature';
import { SuccessResponse, ErrorResponse } from '../utils/Response';
import { initialisePaystack, verifyPayment } from '../services/Paystack';
import { initialiseFlutterwave, verifyTransaction } from '../services/Flutterwave';
import { AxiosResponse } from 'axios';
import Parent from '../models/parents.model';

@Service()
export default class SubscriptionModule {
  async plansRequest() {
    const plans = await Plan.find({
      //attributes: ['uuid', 'name', 'amount', 'period_days', 'value'],
    });

    formatPlans(plans);

    return new SuccessResponse({
      message: 'Data fetched successfully',
      data: plans,
    });
  }

  async paymentLinkRequest(account_id: string, plan_id: string, callback_url: string, type: string) {
    const reference = await generateRandomString(10);

    const user = await User.findOne({
      uuid: account_id,
    });

    const plan = await Plan.findOne({
      //where: {
      uuid: plan_id,
      //},
    });

    if (plan && user) {
      let link = null;

      if (type == 'paystack') {
        link = await initialisePaystack(user.email, reference, plan.amount, callback_url);
      } else {
        link = await initialiseFlutterwave(user, reference, plan.amount, callback_url);
      }

      const payment = new Payment({
        user_id: user.uuid,
        school_id: user.school_id,
        reference: reference,
        amount: plan.amount,
        plan_id: plan.uuid,
        payment_link: link,
        type: type,
        status: 'pending',
      });

      await payment.save();

      return new SuccessResponse({
        message: 'Payment link generated successfully',
        data: link,
      });
    } else {
      return new ErrorResponse({
        message: 'Unable to fetch account details',
      });
    }
  }

  async confirmPaymentRequest(reference: string) {
    const payment = await Payment.findOne({
      reference: reference,
    });

    if (!payment) {
      // Handle case where payment is not found
      return new ErrorResponse({
        message: 'Invalid Payment reference',
      });
    }

    const sub = await Subscription.findOne({
      reference: reference,
    });

    if (sub) {
      // Handle case where payment is not found
      return new ErrorResponse({
        message: 'Invalid Payment reference',
      });
    }

    const user = await Parent.findById({
      id: payment.user_id,
    });

    if (!user) {
      return new ErrorResponse({
        message: 'An error ocurred, Unable to fetch user details',
      });
    }

    const token = await SignSignature(user);

    const plan = await Plan.findOne({
      uuid: payment.plan_id,
    });

    if (!plan) {
      return new ErrorResponse({
        message: 'An error ocurred, Unable to fetch plan details',
      });
    }

    if (payment.type == 'paystack') {
      const result: AxiosResponse<any> = await verifyPayment(reference);
      const status = result.data.data.status;

      if (status == 'success') {
        //const amount = result.data.data.amount;

        payment.status = 'success';
      } else {
        return new ErrorResponse({
          message: 'Payment failed. Kindly retry',
        });
      }
    } else {
      const result: AxiosResponse<any> = await verifyTransaction(reference);
      const status = result.data.data.status;

      if (status == 'successful') {
        const amount = result.data.data.amount;
      } else {
        return new ErrorResponse({
          message: 'Payment failed. Kindly retry',
        });
      }
    }
  }
}
