Subscription Renewal Demo - Implementation Plan

Goal

Build a Netflix-style subscription management demo focused on a single feature:

"Handle subscription renewals with a 3-day grace period after payment failure."

Only the subscription renewal flow requires a real backend.

Everything else can be mocked or static.

---

Demo Story

A reviewer should be able to:

1. Login
2. View Netflix-like Home Page
3. Navigate to Account Settings
4. View Subscription Details
5. Trigger Renewal Success
6. Trigger Renewal Failure
7. Experience Grace Period
8. Update Payment Method
9. Recover Subscription
10. Allow Grace Period to Expire
11. Get Downgraded to Free Plan

The entire application should tell this story.

---

Architecture

Frontend:

- Next.js 15
- TypeScript
- TailwindCSS
- shadcn/ui
- Zustand

Backend:

- NestJS or Express
- PostgreSQL
- Prisma ORM

Email:

- Resend (or mocked)

Payments:

- Fake Payment Gateway Service

Deployment:

- Vercel (frontend)
- Railway/Supabase (backend)

---

Frontend Pages

Landing Page

Route:
/

Purpose:
Netflix marketing clone

Sections:

- Hero
- Pricing
- Features
- Sign In button

Backend:
No

---

Auth Pages (Login & Signup)

Route:
/login, /signup

Purpose:
User registration and authentication

Features:
- Signup with email validation
- Email verification (OTP or magic link) before login is allowed
- Sign in with verified credentials
- Frontend and backend validation for all auth forms

Backend:
Yes (Auth Service, Email Service for verification)

---

Browse Page

Route:
/browse

Purpose:
Netflix-like experience

Components:

- Hero Banner
- Continue Watching
- Trending
- Recommended

Backend:
No

Use static movie data.

---

Account Page

Route:
/account

Purpose:
Main feature entry point

Cards:

Profile Card

Subscription Card

Billing Card

Payment Method Card

Renewal Status Card

Backend:
Yes

---

Billing Page

Route:
/account/billing

Purpose:
Visualize renewal lifecycle

Shows:

Current Plan

Renewal Date

Status

Grace Period Countdown

Payment Status

Backend:
Yes

---

Admin Simulation Page

Route:
/admin

Purpose:
Control demo scenarios

Buttons:

Simulate Successful Renewal

Simulate Failed Renewal

Advance Time 1 Day

Advance Time 3 Days

Reset Subscription

Update Card

This page makes demonstrations easy.

Backend:
Yes

---

Core Backend Feature

Subscription States

ACTIVE

PAST_DUE

GRACE_PERIOD

FREE

---

Database Schema

User

- id
- email
- name
- isEmailVerified

Subscription

- id
- userId
- planName
- status
- currentPeriodStart
- currentPeriodEnd
- gracePeriodEnd

PaymentMethod

- id
- userId
- cardLast4
- valid

PaymentAttempt

- id
- subscriptionId
- status
- createdAt

---

Notification Schedule

- 3 Days Before Due Date: Send "Deadline Nearing" email.
- On Due Date: Send "Renewal Due" email.
- Grace Period Day 1 (1 day after due): Send "Payment Failed - Grace Period Started" email.
- Grace Period Day 2 (2 days after due): Send "Grace Period - Update Payment" email.
- Grace Period Day 3 (3 days after due): Send "Final Warning - Grace Period Ending" email.
- After Grace Period Expiry: Shift to FREE plan, send "Cancellation" email.

---

Renewal Flow

Scenario 1

Payment succeeds

ACTIVE

Current period extends.

---

Scenario 2

Payment fails

ACTIVE

↓

GRACE_PERIOD

Actions:

- Create failed payment record
- Set gracePeriodEnd
- Send warning email

User still has Premium access.

---

Scenario 3

User updates payment

GRACE_PERIOD

↓

ACTIVE

Important:

Keep original billing date.

Example:

Renewal Date:
June 1

Payment Updated:
June 3

Next Renewal:
July 1

NOT July 3

---

Scenario 4

Grace period expires

GRACE_PERIOD

↓

FREE

Actions:

- Downgrade account
- Remove premium access
- Send cancellation email

---

Backend Services

SubscriptionService

Responsibilities:

- renewSubscription()
- failRenewal()
- downgradeUser()
- recoverSubscription()

PaymentService

Responsibilities:

- chargeCard()
- updateCard()
- retryPayment()

EmailService

Responsibilities:

- sendFailureEmail()
- sendCancellationEmail()
- sendRecoveryEmail()

SchedulerService

Responsibilities:

- checkExpiredGracePeriods()

---

API Endpoints

GET /subscription

Returns:

- status
- plan
- renewalDate
- gracePeriodEnd

---

POST /subscription/simulate-success

Admin only

---

POST /subscription/simulate-failure

Admin only

---

POST /subscription/update-payment

Admin only

---

POST /subscription/retry-payment

Admin only

---

POST /subscription/reset

Admin only

---

UI States

ACTIVE

Green badge

"Your membership is active"

---

GRACE_PERIOD

Yellow badge

"Payment failed. Update your payment method within 3 days."

Show countdown.

---

FREE

Red badge

"Your premium membership has ended."

Show restart membership button.

---

Emails

Signup Verification

Subject:
Verify your email address

Content:
Please verify your email to complete signup.

---

Upcoming Renewal (3 Days Before)

Subject:
Upcoming Subscription Renewal

Content:
Your subscription will renew in 3 days.

---

Renewal Due (On Due Date)

Subject:
Subscription Renewal Due

Content:
We are processing your subscription renewal today.

---

Payment Failure (Grace Period Day 1-3)

Subject:
Action Required: Payment Failed

Content:
Update payment method within 3 days.

---

Recovery Email

Subject:
Membership Restored

Content:
Your subscription is active again.

---

Cancellation Email

Subject:
Membership Ended

Content:
Your account has been downgraded to Free.

---

Demo Enhancements

Show Timeline Component

ACTIVE
↓
PAYMENT FAILED
↓
GRACE PERIOD
↓
RECOVERED

or

ACTIVE
↓
PAYMENT FAILED
↓
GRACE PERIOD
↓
FREE

Animate transitions.

---

Project Structure

frontend/

app/
browse/
account/
account/billing/
admin/

components/
subscription/
billing/
timeline/

store/

backend/

src/

subscription/
payment/
email/
scheduler/

prisma/

---

MVP Completion Criteria

A reviewer can:

- Open the application
- Navigate like Netflix
- Trigger payment failure
- See grace period begin
- Update card
- Recover account
- Trigger grace expiry
- See downgrade to Free
- Receive email simulation

This demonstrates the entire subscription renewal lifecycle end-to-end.