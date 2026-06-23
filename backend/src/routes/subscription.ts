import { Router } from 'express';
import { SubscriptionService } from '../services/subscription.service';

const router = Router();

// In a real app, these would be protected by JWT middleware
// For this demo, we'll pass userId in the query or body for simplicity

router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    
    let sub = await SubscriptionService.getSubscriptionDetails(userId);
    // Auto-create a subscription if it doesn't exist for demo purposes
    if (!sub) {
      sub = await SubscriptionService.createSubscription(userId, 'Premium');
    }

    res.json(sub);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/update-payment', async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const updated = await SubscriptionService.recoverSubscription(subscriptionId);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
