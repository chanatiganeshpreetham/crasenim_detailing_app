# Crasenim Pharma mobile app

An Expo, React Native, and TypeScript app for presenting Crasenim Pharma
product-detailing slides to doctors. The project supports Android and includes
a browser preview for quick UI checks.

## Current app flow

1. The app opens on a welcome screen with the Crasenim Pharma logo and a
   **Open Catalogue** button.
2. **Open Catalogue** opens the catalogue. The app is intentionally public and
   does not require authentication or have a user account system.
3. Select a doctor specialty from the left sidebar on wider screens or the
   menu on compact screens.
4. Select **Detailing** (or **Start detailing**) to open that specialty's
   slides in full-screen mode.
5. Swipe left or right, or use the previous/next buttons, to move between
   slides. Use **Close** or Android's back button to return to the catalogue.

The native app is configured for landscape orientation in `app.json`. A browser
preview is useful for layout checks but does not enforce Android orientation or
reproduce all native behavior.

## Requirements

- Windows PowerShell
- Node.js and npm
- JDK 17 for native Android builds
- For an Android emulator build: Android Studio, Android SDK, and an Android
  Virtual Device (AVD). On a Snapdragon Windows laptop, use an ARM64 system
  image if available.

## Install dependencies

Open PowerShell and run:

```powershell
cd D:\pharma_crm\crasenim-mobile-app\crasenim-react-native
npm.cmd ci
```

`npm.cmd ci` installs the versions recorded in `package-lock.json`.

## Preview in a desktop browser

From the project directory, run:

```powershell
npm.cmd run web
```

Expo starts the web development server and normally opens the browser. If it
does not, open the local URL printed in the terminal (usually
`http://localhost:8081`). To inspect a phone-sized layout in Chrome or Edge,
open Developer Tools (`F12`), enable the device toolbar (`Ctrl+Shift+M`), and
choose a landscape device orientation.

This is a browser rendering of the shared React Native UI, not an Android
emulator. Some native behavior, including the Android hardware back button and
orientation lock, cannot be verified in the browser.

## Run on an Android emulator

Expo Go on the phone may report that it is incompatible with this project's
Expo SDK. Use a development build for native testing instead:

1. In Android Studio, install Android SDK Platform-Tools, Android SDK
   Build-Tools, and Android Emulator from **SDK Manager**.
2. Open **Device Manager**, create an Android Virtual Device, and start it.
   On Snapdragon hardware, select an ARM64 (`arm64-v8a`) system image if
   available.
3. In PowerShell, from this project directory, run:

   ```powershell
   npx.cmd expo install expo-dev-client
   npx.cmd expo run:android
   ```

The first build can take several minutes. This builds and launches a native
development app in the running emulator; no phone or USB connection is needed.
For subsequent JavaScript-only changes, start Metro for the development client:

```powershell
npx.cmd expo start
```

Then reload the app in the emulator. If the app configuration or native
dependencies change, rebuild the native app.

## Check the code

Run the TypeScript check from the project directory:

```powershell
npm.cmd run typecheck
```

Expo bundling can also be checked without launching a device:

```powershell
npx.cmd expo export --platform android
npx.cmd expo export --platform web
```

These commands create a generated `dist` folder; it is not the installable
Android app and should not be uploaded to Google Play.

## Edit product slides and specialties

Catalogue content is configured in `src/config/catalog.ts`:

- `products` maps a product ID and display name to a local image file.
- `specialties` defines each specialty and its ordered `productIds`.
- Each specialty's first ID must remain `crasenim-pharma` to show the company
  logo as the opening slide.
- Add or change later IDs to change the medicine slides and their sequence.
  Each ID must match an entry in `products`.
- Product images are bundled locally from `assets/meds`. To add an image,
  place it in that folder and add a corresponding `products` entry using a
  static `require(...)` path.

Current slide order (the company logo is the first slide for every specialty):

| Specialty | Medicine slides, in order |
|---|---|
| GP (General Practitioner) | Amoxsenim, Crasenim, Vimily, Pansenim, Telsenim, Metsenim |
| M.B.B.S. | Telsenim, Metsenim, Crasenim, Amoxsenim, Pansenim, Vimily |
| Gynae | Crasenim, Vimily, Amoxsenim, Pansenim, Telsenim |
| MD (Physician) | Telsenim, Metsenim, Crasenim, Amoxsenim, Pansenim, Vimily |
| Pedia | Crasenim, Babybar |
| Cardio | Telsenim, Crasenim, Metsenim |
| Diabetic | Metsenim, Crasenim, Telsenim |
| Surgeon | Amoxsenim, Crasenim, Pansenim |
| Endocrinologist | Telsenim, Metsenim, Crasenim, Amoxsenim, Pansenim |
| Gastro | Crasenim, Pansenim, Amoxsenim |
| ENT | Amoxsenim, Pansenim, Crasenim |
| Ortho | Crasenim, Amoxsenim, Pansenim, Vimily |
| Dentist | Amoxsenim, Pansenim |
| Derma | Amoxsenim, Crasenim, Babybar, Pansenim |
| Optha | Crasenim, Amoxsenim, Pansenim, Vimily |
| Pulmonologist | Amoxsenim, Telsenim, Crasenim, Pansenim |
| Urologist | Crasenim, Telsenim, Amoxsenim, Pansenim |
| Neuro | Crasenim, Pansenim |

Product spellings from the supplied list are matched to the available asset and
catalogue names (for example, "Amoxenim"/"Amoxesenim" to "Amoxsenim").

## Google Play release status

The lack of authentication is intentional for this public catalogue app. It is
not by itself a Play Store blocker; the app still needs release testing and
policy/store setup:

- The Play Console US$25 registration is a one-time developer-account fee. It
  allows you to use Play Console; it does not pay for app development, guarantee
  approval, or replace release testing and Play policy requirements.
- No backend, user accounts, analytics, or network-based catalogue is
  connected; the catalogue and product slides are bundled in the app.
- Verify all doctor/product assignments and have qualified reviewers approve
  product claims and materials.
- Test the release build on supported Android devices and complete the Play
  Console app-content declarations, store listing, privacy policy, and Data
  safety form as applicable to the app's actual behavior and SDKs.
- As of August 31, 2026, new Play submissions must target Android 16 (API 36)
  or higher. The `expo-build-properties` plugin configured in `app.json` sets
  `android.targetSdkVersion` to 36; verify the generated release artifact and
  Play Console checks before uploading.
- A production build profile is present in `eas.json`. To build the Play Store
  Android App Bundle (`.aab`) with EAS:

  ```powershell
  cd D:\pharma_crm\crasenim-mobile-app\crasenim-react-native
  npx.cmd eas-cli@latest login
  npx.cmd eas-cli@latest build:configure
  npx.cmd eas-cli@latest build --platform android --profile production
  ```

  EAS Build uploads the project source and assets to Expo's servers. Use this
  route only if you are comfortable with that. For a local build, install JDK
  17 and the Android SDK, open the generated `android` folder in Android
  Studio, set Gradle JDK to JDK 17, then choose **Build > Generate Signed
  Bundle / APK > Android App Bundle**. Create or select a dedicated upload key
  in the signing wizard; never use the generated debug key for a Play release
  or commit the upload key/passwords to source control.

  Sign in to an Expo account when prompted and follow EAS's prompts to link the
  project and configure Android signing credentials. A production Android
  build produces an `.aab` by default; download it from the build link shown by
  EAS. EAS Build has a free tier and separate paid plans/limits; the Play
  Console fee does not cover EAS services.
- Upload the `.aab` to a Play Console test track first. For a personal
  developer account created after November 13, 2023, Google currently requires
  a closed test with at least 12 testers opted in continuously for 14 days
  before you can apply for production access. Check Play Console for any
  account-specific verification tasks.
- The Android application ID is `com.crasenimpharma.mobile`. Updating an
  existing Play Store listing requires the same application ID and the
  corresponding signing credentials.

## Upload the first build and publish updates

### Upload the AAB you already built

1. In Play Console, create or open the app whose package name is
   `com.crasenimpharma.mobile`.
2. Complete the required app setup and store-listing declarations shown in the
   dashboard.
3. Open **Testing > Internal testing**, create a release, and upload the
   downloaded `.aab`. If Play Console offers Play App Signing, follow its
   setup flow.
4. Review the bundle details and any Play Console errors, save the release,
   and roll it out to internal testers. Install it using the tester opt-in
   link and check the app on the intended devices.
5. After testing, use the Play Console release flow to move toward production.
   Newer personal accounts may need to complete the closed-testing requirement
   above before production access is granted.

### Make and submit a later app update

1. Edit the app code in `App.tsx`, specialty/product order in
   `src/config/catalog.ts`, or product images in `assets/meds`. Keep the
   package name unchanged.
2. Preview the change and run the checks:

   ```powershell
   npm.cmd run typecheck
   npx.cmd expo export --platform android
   ```

3. Increase the Android `versionCode` in `app.json` to an integer higher than
   the code of every AAB already uploaded for this app. Play Console shows the
   uploaded bundle's version code in its bundle/release details. Add or update
   `expo.android.versionCode` in `app.json` before building; Google Play
   rejects a bundle whose version code was already used. You can also update
   `expo.version` (currently `1.0.0`) for the human-readable app version.
4. Build a new production AAB using the same EAS project and its existing
   Android signing credentials:

   ```powershell
   npx.cmd eas-cli@latest build --platform android --profile production
   ```

   Do not reset or replace the signing key for an app already enrolled with
   Play App Signing. Keep the EAS/Play signing credentials safe.
5. In Play Console, create a new release in the appropriate testing or
   production track, upload the new `.aab`, review the checks, and roll it out.
   Existing users receive the update through Google Play after the release is
   approved and available.

## Useful project files

- `App.tsx` — welcome screen, specialty selection, and full-screen detailing UI.
- `src/config/catalog.ts` — product images and specialty-specific slide order.
- `assets/crasenim-logo.jpeg` — company logo used in the app and opening slide.
- `assets/crasenim-app-icon.png` — branded app icon.
- `assets/crasenim-adaptive-icon.png` — Android adaptive launcher icon.
- `assets/crasenim-play-store-icon.png` — square icon asset for the store listing.
- `assets/meds/` — bundled product presentation images.
- `app.json` — app name, Android application ID, landscape orientation, and
  `expo-build-properties` configuration for target API 36.
- `eas.json` — internal APK preview and production build profiles.
- `package.json` — dependencies and development commands.
