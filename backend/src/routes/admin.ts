import { Router } from 'express';
import { SubscriptionService } from '../services/subscription.service';
import { processNotificationsAndExpirations } from '../cron/scheduler';

const router = Router();

// This keeps track of a global "simulated" date for demo purposes.
// If you restart the server, it resets to real 'now'.
let simulatedCurrentDate = new Date();

router.get('/time', (req, res) => {
  res.json({ simulatedCurrentDate });
});

router.post('/simulate-success', async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const updated = await SubscriptionService.renewSubscription(subscriptionId);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/simulate-failure', async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const updated = await SubscriptionService.failRenewal(subscriptionId);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/advance-time', async (req, res) => {
  try {
    const { days } = req.body;
    simulatedCurrentDate.setDate(simulatedCurrentDate.getDate() + parseInt(days));
    
    // Trigger cron logic for the newly simulated date
    await processNotificationsAndExpirations(simulatedCurrentDate);

    res.json({ message: `Advanced time by ${days} days`, simulatedCurrentDate });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/reset', async (req, res) => {
  simulatedCurrentDate = new Date();
  res.json({ message: 'Time reset to now' });
});

export default router;
