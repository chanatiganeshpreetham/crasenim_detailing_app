# Crasenim Pharma mobile app

This is the new Expo + React Native + TypeScript app. It uses the images in
`assets/meds` as product slides.

## Run and check

From this folder:

```powershell
npm.cmd run start
npm.cmd run web
npm.cmd run typecheck
```

Use `npm.cmd run web` to preview the catalogue in your desktop browser without a
phone or emulator. This is a convenient UI preview, but it does not reproduce
Android's native rendering or device behavior. Open the project in Expo Go on a
development phone, or use an Android emulator, for native testing.

The app first displays the Crasenim logo and a **Login** button. The button
currently opens the catalogue directly; authentication has not been connected.

## Doctor specialties and product slides

The catalogue data lives in `src/config/catalog.ts`:

- `products` connects a product ID and display name to an image in `assets/meds`.
- `specialties` controls the doctor-specialty menu and each specialty's
  `productIds`.
- Every specialty starts with the Crasenim Pharma logo slide, followed by its
  assigned product slides in the configured order.
- Update a specialty's `productIds` list to change its slides. Each ID must
  match an entry in `products`; the logo slide uses `crasenim-pharma`.

On phones, specialties are in a slide-out menu. On wider screens, they remain
visible in a left sidebar. Selecting a specialty opens its catalogue landing
page; it does not start the slide show. Use the **Detailing** button in the
top-right (or **Start detailing** on the landing page) to open the slides in a
full-screen presentation. Swipe across a slide or use the previous/next
controls; use **Close** or Android's back button to return to the catalogue.

## Play Store preparation

This is a functional catalogue prototype, not yet a Play Store release.
Confirm the product/specialty assignments, review the product materials and
branding, complete device testing, and configure the Play Store listing,
privacy/data-safety information, and a signed Android App Bundle before
submission. The Android application ID is `com.crasenimpharma.mobile`; to
update an existing Play Store app, its application ID and signing key must
match that listing.
