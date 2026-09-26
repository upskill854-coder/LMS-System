# LMS Student App

A production-oriented Student Learning Management System (LMS) Android app, built with React Native + Expo + TypeScript. This app is the primary student-facing interface for an online/offline computer education platform, sharing one backend with the main website and the Admin Panel.

Students never need a separate platform to attend class: browse courses, enroll, pay, learn, watch live classes, and chat with the teacher — all from this app.

---

## 1. Feature Overview

- Auth: signup, login, forgot password, secure token storage, session bootstrap
- Course discovery, full course details, syllabus, FAQs
- Enrollment form with backend-validated promo codes
- Razorpay payment, with **server-side signature verification before unlocking a course**
- My Courses, course dashboard (Overview / Lessons / Live Classes / Resources / Progress)
- Lesson player with resources and explicit "Mark as Complete"
- Class schedule (Today / Tomorrow / This Week)
- Live classes: student is a **viewer only** — no camera/microphone permission is ever requested
- Realtime live chat via Socket.IO, with reconnect handling
- Notifications center with unread counts
- Profile, payment history, edit profile

## 2. Tech Stack

| Concern | Choice |
|---|---|
| Framework | Expo (React Native) + TypeScript |
| Routing | Expo Router (file-based) |
| Styling | NativeWind (Tailwind for RN) |
| Server state | TanStack Query (React Query) |
| Client/UI state | Zustand |
| HTTP | Axios (with auth + refresh-token interceptors) |
| Realtime | Socket.IO client |
| Payments | Razorpay (`react-native-razorpay`) |
| Live video | WebRTC-compatible provider, embedded via a viewer-only WebView session |
| Secure storage | `expo-secure-store` |

## 3. Project Structure

```
app/                      # Expo Router screens (file-based routing)
  _layout.tsx             # Root providers + auth-gated navigation
  index.tsx                # Splash
  (auth)/                  # onboarding, login, signup, forgot-password
  (tabs)/                  # home, courses, schedule, notifications, profile
  course/[id].tsx           # Course details
  enrollment/[courseId].tsx # Enrollment form + promo + summary
  payment/                 # checkout (Razorpay), success, failed
  learning/                # course dashboard + lesson screen
  live/[classId].tsx        # Live class: video + realtime chat
  profile/                  # payments history, edit profile, support, legal

src/
  services/                 # One file per backend domain (axios calls only)
  hooks/                    # React Query hooks wrapping the services
  store/                    # Zustand: authStore, enrollmentDraftStore
  components/                # Reusable UI building blocks
  theme/                     # Color tokens
  types/                      # Shared TypeScript types
  utils/                       # secureStorage, local onboarding flag
```

## 4. Requirements

- Node.js 18+
- Expo CLI (`npx expo`)
- An EAS account for cloud builds (or Android Studio for local builds)
- A running backend implementing the API contract in `src/services/*.ts`

## 5. Installation

```bash
npm install
cp .env.example .env
# edit .env with your real backend URLs
npx expo start
```

> This project was generated without network access to `npm`, so
> `node_modules` is not included. Running `npm install` is required
> before the app will build or run.

## 6. Environment Variables

Set these in `.env` (never commit real secrets):

```
EXPO_PUBLIC_API_URL=https://api.yourdomain.com
EXPO_PUBLIC_WS_URL=wss://api.yourdomain.com
EXPO_PUBLIC_APP_NAME=LMS Student
EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
```

Only the Razorpay **key ID** (public) belongs in the client. The Razorpay
**secret**, `DATABASE_URL`, `JWT_SECRET`, and any live-video-provider
secret must live only on the backend, never in this Expo project.

## 7. Development Commands

```bash
npx expo start           # start the dev server
npx expo start --android # open on a connected device/emulator
npm run typecheck        # TypeScript check
npm run lint              # ESLint
```

## 8. Android Build Commands (EAS)

```bash
npx eas login
npx eas build:configure

# Development client (for testing native modules like Razorpay/WebRTC)
npm run build:dev

# Shareable preview APK
npm run build:apk

# Play Store production bundle
npm run build:aab
```

Before building, replace the placeholder files in `assets/images/`
(see `assets/images/README.txt`) with real icon/splash art, and set the
real Android `package` name and `version`/`versionCode` in `app.json`.

## 9. API Configuration

Every network call goes through `src/services/apiClient.ts`, which:

- attaches the stored access token to every request
- transparently refreshes the token on a 401 and retries the original request
- logs the student out and clears tokens if refresh fails
- normalizes errors into user-friendly messages via `extractApiErrorMessage`

Each domain (auth, courses, enrollment, payments, promo, classes, live,
notifications, resources, lessons) has its own service file under
`src/services/`. No mock data is used anywhere — every screen calls a
real endpoint and handles loading/empty/error states explicitly.

The expected backend contract (Next.js + PostgreSQL + Prisma) should
expose endpoints matching each method in those service files, e.g.:

```
POST /auth/login
POST /auth/signup
GET  /courses
GET  /courses/:id
POST /promo/validate
POST /enrollments
POST /payments/verify
GET  /classes/schedule
POST /live/:classId/join
```

## 10. Live Class Configuration

The student app never talks to a WebRTC provider directly with its own
credentials. The flow is:

1. Student taps **Join Live Class**.
2. `liveService.joinClass(classId)` hits the backend, which checks
   authentication, enrollment, batch membership, and whether the class
   is actually live.
3. If authorized, the backend mints a **viewer-only** session token from
   your WebRTC-compatible provider (e.g. LiveKit, Agora, 100ms) and
   returns `{ roomId, token, wsUrl, provider }`.
4. `LiveVideoPlayer` loads the provider's hosted viewer page in a
   WebView using that token, with device camera/microphone capture
   explicitly denied — students can only watch and use text chat.

Swap `src/components/LiveVideoPlayer.tsx` for your provider's native
SDK if you prefer a native player over the WebView-hosted viewer; the
join/authorization contract in `live.service.ts` stays the same either
way.

Realtime chat runs over the shared Socket.IO connection in
`src/services/socket.ts`, which reconnects automatically on network
loss.

## 11. Payment Configuration

1. `enrollmentService.createEnrollment()` creates a **PENDING**
   enrollment + Razorpay order on the backend. No access is granted yet.
2. `payment/checkout.tsx` opens the native Razorpay checkout with that
   order.
3. On completion, the on-device Razorpay response is sent to
   `paymentService.verifyPayment()`.
4. **Only** when the backend verifies the Razorpay signature and
   confirms payment does the enrollment become `ACTIVE` and the course
   unlock. The frontend never trusts a local "success" callback by
   itself, and promo code discounts are always calculated server-side.

## 12. What's Implemented vs. Backend-Dependent

This repository is a complete, wired-up **client**. It has zero mock
data and will make real HTTP/WebSocket calls as soon as `EXPO_PUBLIC_API_URL`
and `EXPO_PUBLIC_WS_URL` point at a running backend that implements the
contract described in `src/services/*.ts` and `src/types/index.ts`.
Until that backend exists, screens will correctly show loading and
error states rather than any fake content — by design (see Development
Rules in the original spec).

Firebase Cloud Messaging push notifications: the client is structured
to register a device push token (`studentService.registerPushToken`)
but the Expo push/FCM setup (`expo-notifications` config plugin,
Firebase project, server key) still needs to be wired up on your
Firebase project and backend.

## 13. Troubleshooting

- **"Network request failed" everywhere** → check `EXPO_PUBLIC_API_URL`
  in `.env` and that the backend allows requests from your dev machine.
- **Razorpay checkout doesn't open** → `react-native-razorpay` requires
  a custom dev client or a real build; it will not work in Expo Go.
- **Live video WebView is blank** → confirm your WebRTC provider's
  viewer URL format and that the token/room query params match what
  your provider expects; adjust the URL construction in
  `LiveVideoPlayer.tsx`.
- **401 loops on every request** → check that `/auth/refresh` on your
  backend returns `{ accessToken, refreshToken }` in the exact shape
  expected by `apiClient.ts`.
