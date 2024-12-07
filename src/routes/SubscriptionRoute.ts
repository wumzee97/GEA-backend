import express from 'express';
import { Container } from 'typedi';
import SubscriptionController from '../controllers/SubscriptionController';

const router = express.Router();
const subscriptionController = Container.get(SubscriptionController);

router.get('/plans', subscriptionController.plans);
router.post('/payment-link', subscriptionController.paymentLink);
router.post('/confirm-payment', subscriptionController.confirmPayment);

export default router;
