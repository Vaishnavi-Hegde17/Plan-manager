import cron from 'node-cron';
import prisma from '../config/prisma';
import { sendEmail } from '../config/email';
import { SubscriptionService } from '../services/subscription.service';

export const initCronJobs = () => {
  // Run daily at midnight (or for testing, every minute: '* * * * *')
  // We'll use a daily schedule: '0 0 * * *'
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily subscription checks...');
    await processNotificationsAndExpirations(new Date());
  });
};

export const processNotificationsAndExpirations = async (currentDate: Date) => {
  const startOfDay = new Date(currentDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(currentDate);
  endOfDay.setHours(23, 59, 59, 999);

  // 1. 3 Days Before Due Date
  const threeDaysFromNowStart = new Date(startOfDay);
  threeDaysFromNowStart.setDate(threeDaysFromNowStart.getDate() + 3);
  const threeDaysFromNowEnd = new Date(endOfDay);
  threeDaysFromNowEnd.setDate(threeDaysFromNowEnd.getDate() + 3);

  const upcomingRenewals = await prisma.subscription.findMany({
    where: {
      status: 'ACTIVE',
      currentPeriodEnd: {
        gte: threeDaysFromNowStart,
        lte: threeDaysFromNowEnd,
      }
    },
    include: { user: true }
  });

  for (const sub of upcomingRenewals) {
    await sendEmail(
      sub.user.email,
      'Upcoming Subscription Renewal',
      `<p>Your subscription will renew in 3 days on ${sub.currentPeriodEnd.toDateString()}.</p>`
    );
  }

  // 2. On Due Date (This should ideally attempt payment, we just send "Due" here)
  const dueToday = await prisma.subscription.findMany({
    where: {
      status: 'ACTIVE',
      currentPeriodEnd: {
        gte: startOfDay,
        lte: endOfDay,
      }
    },
    include: { user: true }
  });

  for (const sub of dueToday) {
    await sendEmail(
      sub.user.email,
      'Subscription Renewal Due',
      `<p>We are processing your subscription renewal today.</p>`
    );
    // In a real app, we would charge the card here.
  }

  // 3. Grace Period Reminders (Day 2 and Day 3)
  const gracePeriodSubs = await prisma.subscription.findMany({
    where: { status: 'GRACE_PERIOD' },
    include: { user: true }
  });

  for (const sub of gracePeriodSubs) {
    if (!sub.gracePeriodEnd) continue;
    const daysLeft = Math.ceil((sub.gracePeriodEnd.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
    
    if (daysLeft === 2) {
      await sendEmail(sub.user.email, 'Grace Period - Update Payment', '<p>You have 2 days left to update your payment method.</p>');
    } else if (daysLeft === 1) {
      await sendEmail(sub.user.email, 'Final Warning - Grace Period Ending', '<p>Your premium access will expire tomorrow. Please update your payment method.</p>');
    }
  }

  // 4. Grace Period Expirations (Shift to Free)
  const expiredGracePeriods = await prisma.subscription.findMany({
    where: {
      status: 'GRACE_PERIOD',
      gracePeriodEnd: {
        lt: currentDate
      }
    }
  });

  for (const sub of expiredGracePeriods) {
    await SubscriptionService.downgradeToFree(sub.id);
  }
};
