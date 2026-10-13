# 12. Mobile Readiness (Flutter Compatibility)

*Status:* INFERRED FROM CODE ARCHITECTURE

The upcoming BBD mobile application (built in Flutter) will consume the backend. The backend is currently designed for a React web client.

## Current Compatibility

1. **Authentication (JWTs)**:
   - **Current**: JWTs are issued as `HTTP-Only` cookies.
   - **Mobile Issue**: Flutter HTTP clients can manage cookies, but it is often much easier to manage Auth state via `Bearer` tokens in the `Authorization` header.
   - **Fix Needed**: Update `server/middleware/auth.js` to accept `Bearer <token>` in headers as a fallback if cookies are absent.

2. **API Payload Size**:
   - **Current**: Endpoints like `GET /api/operations/orders` return massive unpaginated JSON arrays.
   - **Mobile Issue**: Parsing massive JSON arrays in Dart on lower-end mobile devices causes UI stuttering and high memory usage.
   - **Fix Needed**: Implement cursor-based or offset-based pagination on all list endpoints.

3. **Push Notifications (FCM)**:
   - **Current**: The backend uses Telegram for all push alerts.
   - **Mobile Issue**: The Flutter app will require Firebase Cloud Messaging (FCM) to receive native push notifications.
   - **Fix Needed**: A new `user_devices` table to store FCM tokens, and a `NotificationService` module to dispatch to Firebase.

4. **Realtime**:
   - **Current**: WebSockets via `Socket.IO`.
   - **Mobile Issue**: Flutter has excellent `socket.io-client` support. This architecture will translate perfectly to mobile.
