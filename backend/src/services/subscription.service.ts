import prisma from '../config/prisma';
import { sendEmail } from '../config/email';

export class SubscriptionService {
  
  static async createSubscription(userId: string, planName: string) {
    const now = new Date();
    const currentPeriodEnd = new Date(now);
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1); // 1 month subscription

    return prisma.subscription.create({
      data: {
        userId,
        planName,
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd,
      }
    });
  }

  static async renewSubscription(subscriptionId: string) {
    const subscription = await prisma.subscription.findUnique({ where: { id: subscriptionId }, include: { user: true } });
    if (!subscription) throw new Error('Subscription not found');

    const newPeriodEnd = new Date(subscription.currentPeriodEnd);
    newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);

    const updated = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'ACTIVE',
        gracePeriodEnd: null,
        currentPeriodEnd: newPeriodEnd
      }
    });

    await prisma.paymentAttempt.create({
      data: {
        subscriptionId,
        status: 'SUCCESS'
      }
    });

    return updated;
  }

  static async failRenewal(subscriptionId: string) {
    const subscription = await prisma.subscription.findUnique({ where: { id: subscriptionId }, include: { user: true } });
    if (!subscription) throw new Error('Subscription not found');

    const gracePeriodEnd = new Date();
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 3);

    const updated = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'GRACE_PERIOD',
        gracePeriodEnd
      }
    });

    await prisma.paymentAttempt.create({
      data: {
        subscriptionId,
        status: 'FAILED'
      }
    });

    // Send Day 1 Failure email immediately (or let cron handle it, but we can do it here too)
    // The cron scheduler is better for daily reminders, but let's notify immediately as well.
    const htmlContent = `
      <h1>Action Required: Payment Failed</h1>
      <p>Your subscription payment failed. You have entered a 3-day grace period. Please update your payment method to avoid losing premium access.</p>
    `;
    await sendEmail(subscription.user.email, 'Action Required: Payment Failed', htmlContent);

    return updated;
  }

  static async recoverSubscription(subscriptionId: string) {
    const subscription = await prisma.subscription.findUnique({ where: { id: subscriptionId }, include: { user: true } });
    if (!subscription || subscription.status !== 'GRACE_PERIOD') {
      throw new Error('Subscription is not in grace period');
    }

    // Recovering keeps the original billing cycle date, just extends it by 1 month from original end date
    const newPeriodEnd = new Date(subscription.currentPeriodEnd);
    newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);

    const updated = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'ACTIVE',
        gracePeriodEnd: null,
        currentPeriodEnd: newPeriodEnd
      }
    });

    await prisma.paymentAttempt.create({
      data: {
        subscriptionId,
        status: 'SUCCESS'
      }
    });

    const htmlContent = `
      <h1>Membership Restored</h1>
      <p>Thank you for updating your payment method! Your subscription is active again.</p>
    `;
    await sendEmail(subscription.user.email, 'Membership Restored', htmlContent);

    return updated;
  }

  static async downgradeToFree(subscriptionId: string) {
    const subscription = await prisma.subscription.findUnique({ where: { id: subscriptionId }, include: { user: true } });
    if (!subscription) throw new Error('Subscription not found');

    const updated = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'FREE',
        planName: 'Free',
        gracePeriodEnd: null
      }
    });

    const htmlContent = `
      <h1>Membership Ended</h1>
      <p>Your grace period has expired and your account has been downgraded to the Free plan. You can restart your membership anytime.</p>
    `;
    await sendEmail(subscription.user.email, 'Membership Ended', htmlContent);

    return updated;
  }

  static async getSubscriptionDetails(userId: string) {
    const sub = await prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return sub;
  }
}
