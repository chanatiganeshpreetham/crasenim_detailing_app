# Build and publish the Crasenim app on Google Play

This guide explains how to build an Android App Bundle (`.aab`) from this Expo
and React Native project, upload it to Google Play Console, test it, and publish
it. It is written for the current project configuration and can be followed
again for later app updates.

> **Important:** You do not convert a website build or an APK into an AAB. Expo
> EAS Build creates the Play Store AAB from the React Native project source.
> Google Play then creates device-specific APKs from that AAB.

## 1. Project settings to know

The relevant settings are in `app.json`, `eas.json`, and `package.json`:

| Setting | Current value | Why it matters |
|---|---|---|
| Expo SDK | 58 | Expo/EAS tooling must support this project SDK. |
| App name | `Crasenim Pharma` | The configured app name; Play listing title can be set separately. |
| Android application ID | `com.crasenimpharma.mobile` | Permanent Play Store identity. It must match for every update. |
| User-visible app version | `1.0.0` | Shown as the app version; change when appropriate for a release. |
| Android `versionCode` | `2` | Internal release number. Every uploaded update must use a higher unused number. |
| Android target API | `36` | Configured through `expo-build-properties`; check current Play requirements before each release. |
| EAS project | Already linked in `app.json` | Use the same Expo project and signing credentials for future builds. |
| `preview` build profile | APK | For device testing; do not use this profile for a Play upload. |
| `production` build profile | Default Android store build | Produces an AAB unless configured otherwise. |

The current `versionCode` is `2` because an earlier AAB with code `1` was
rejected as already used. If Play Console says code `2` has also been used,
change it to `3` (or any integer higher than every code already used for this
app), then build a fresh AAB. The old AAB cannot be edited to change its code.

## 2. Before you build

### Accounts and access

- Have access to an Expo account that can access this project's EAS project.
- Have a Google Play Developer account and permission to create releases for
  the app. Google Play Developer registration has a separate fee.
- Create the app in Play Console before uploading if this is its first release.
- For a Play Console submission, use the app's existing application ID:
  `com.crasenimpharma.mobile`. If creating the listing for the first time, enter
  this exact ID. Application IDs are unique and cannot be changed for an
  existing listing.

### Prepare the project

Open PowerShell and change to the project folder:

```powershell
cd "D:\Crasenim detailing app"
```

Install the exact dependencies recorded in the npm lock file if they are not
already installed:

```powershell
npm.cmd ci
```

Check TypeScript before building:

```powershell
npm.cmd run typecheck
```

Optionally check that Expo can bundle the Android JavaScript:

```powershell
npx.cmd expo export --platform android
```

This export is **not** an installable app or the AAB to upload. It is only an
additional bundling check.

### Review the release settings

Before each build, check `app.json`:

```json
"version": "1.0.0",
"android": {
  "package": "com.crasenimpharma.mobile",
  "versionCode": 2
}
```

The exact surrounding formatting may differ. Do not change the Android
`package` for an update to an existing Play listing.

Check `eas.json` and choose the `production` profile:

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}
```

The `preview` profile explicitly requests an APK. The production profile does
not, so EAS uses its default Android store artifact: an AAB.

## 3. Build the AAB with Expo EAS

### Sign in

Use the Expo account that has access to this project's EAS project:

```powershell
npx.cmd eas-cli@latest login
npx.cmd eas-cli@latest whoami
```

The project's EAS project ID is already present in `app.json`. Normally, you do
not need to run `eas build:configure` again. If EAS reports that the project is
not linked or you cannot access it, verify that you are signed into the
intended Expo account before changing project configuration.

### Start a production Android build

```powershell
npx.cmd eas-cli@latest build --platform android --profile production
```

What this command does:

1. EAS reads the project and the `production` build profile.
2. The project is uploaded to EAS Build and built on an Expo build worker.
3. EAS asks you to configure Android signing credentials if none are set up.
4. EAS creates a signed Android App Bundle when the build succeeds.
5. The CLI prints a build page/link where you can monitor the build and
   download its artifact.

EAS Build is a cloud service. The project source and assets are uploaded to
Expo's build service to perform the build. Review your organization's rules for
source-code handling before using a cloud build service.

### Android signing credentials

On the first production build, if asked how to provide an Android keystore,
select **Generate new keystore** if this is a new Play app and you do not
already have an upload key. EAS can store and use the credential for later
builds.

Keep the EAS account and Android signing credentials under the app owner's
control. Do not commit keystores, passwords, or credential JSON files to the
repository or send them in chat. For an app already released, continue using
the same configured EAS upload key. Do not reset or replace it casually.

With Play App Signing, Google manages the app-signing key used for delivery to
users, while the key used to upload new bundles is an upload key. Keep the
upload credentials consistent with the key registered for this Play app.

### Download and identify the correct artifact

1. Wait until the EAS build status is **Finished**.
2. Open the build details link printed by the CLI (or find the build on the
   Expo build dashboard).
3. Download the Android artifact ending in `.aab`.
4. Keep track of which build produced the file. Do not use an older AAB from a
   previous build or a file ending in `.apk`.
5. If the build failed, open its logs and fix the reported issue before
   uploading anything to Play Console.

An AAB is intended for app-store distribution. It is not normally installed
directly on a phone; use an internal testing release to install it through
Google Play.

## 4. Set up the Play Console app (first release only)

If the app listing does not exist yet:

1. Sign in to [Google Play Console](https://play.google.com/console/).
2. Choose **Create app**.
3. Enter the app name, default language, app/game type, free/paid status, and a
   contact email.
4. Complete the required declarations and create the app.
5. Confirm that the app's application ID/package name is
   `com.crasenimpharma.mobile`.
6. Follow the Dashboard setup tasks before creating a release.

For an existing Play listing, open that listing instead. Do not create a
second listing to work around an upload or version-code problem.

## 5. Complete store and policy setup

Play Console's Dashboard and **App content** page identify the declarations
that are required for your app. Complete them accurately; do not guess or
declare behavior that the app does not have.

Typical setup items include:

- **Store listing:** App title, short/full description, contact details, app
  icon, screenshots, and other assets requested by the listing form. Use
  screenshots of the actual app, including its landscape presentation where
  useful.
- **Privacy policy:** Provide a public HTTPS privacy-policy page and make sure
  it accurately explains the app's data practices. Google Play currently
  requires privacy-policy information in the store listing and within the app,
  even when an app does not access personal or sensitive data. Use a valid,
  accessible webpage, not a document that requires login.
- **Data safety:** Declare data collection, sharing, and security practices
  based on the app's code and all included SDKs. Revisit this if analytics,
  crash reporting, authentication, advertising, or network features are added.
- **Ads:** Declare whether the app contains ads, including ads delivered by an
  ad SDK. Answer based on the actual app.
- **App access:** If all app content is available without signing in, say so.
  If any part is restricted, give Play reviewers working access instructions
  and any required test credentials through the designated secure form.
- **Target audience and content:** Complete the target audience, content
  rating, and other app-content questionnaires as applicable.
- **App category, contact details, countries/regions, and pricing:** Set the
  values appropriate for the app and its intended distribution.
- **Permissions and sensitive data:** Explain any permissions or sensitive
  data use when Play Console asks. Request only permissions that the app needs.

This app currently configures Android target API 36. Google Play's target API
requirements change over time, so check the current [target API level
requirements](https://support.google.com/googleplay/android-developer/answer/11926878)
and the warnings shown for the uploaded bundle.

## 6. Create an internal testing release

Internal testing is a good first step to verify the Play-delivered version
before wider testing or production.

1. In Play Console, select the app.
2. Go to **Test and release > Testing > Internal testing**. Console labels can
   change; use the app's testing tracks if the wording differs.
3. If no internal testing track exists, create or configure it.
4. Choose **Create new release**.
5. If this is the first release, follow the Play App Signing setup flow. Read
   the prompts carefully and keep the upload key and EAS credentials safe.
6. Upload the newly downloaded `.aab` from the production EAS build.
7. Wait for Play Console to process the bundle. Check the package name,
   version name, version code, target API, and any warnings or errors it
   displays.
8. Add a release name if requested. Add concise release notes for the
   language(s) required by the release form.
9. Choose **Save** or **Save as draft** if you are not ready to roll it out.
10. Choose **Review release**, resolve blocking errors, and start the rollout
    to internal testing when ready.
11. Add tester email addresses or a Google Group to the internal test, then
    share the tester opt-in link with them.
12. Test the app installed from Google Play on real target devices. Check
    launch, navigation, landscape layout, slide display, Android back
    behavior, and any device-specific issues.

Internal testing is limited to a small tester group (Google currently allows
up to 100 internal testers). A tester usually needs to opt in using the link
and then install or update the app from Google Play. A newly rolled-out test
may take some time to become available.

## 7. Publish to production

After testing and after all required setup tasks are complete:

1. Open **Test and release > Production**.
2. Choose **Create new release**.
3. Upload the tested production AAB, or promote the tested release from a
   testing track if the Console offers that workflow and it matches your
   release plan.
4. Add release notes and inspect the bundle and release summary.
5. Review and resolve all blocking errors. Review warnings as well; they may
   point to issues that affect eligibility or users.
6. Select the countries/regions where the app should be available.
7. Choose the rollout percentage if a staged rollout is available and desired.
   A staged rollout limits initial availability; you can increase it after
   monitoring. Otherwise, follow the Console's full rollout option.
8. Submit the release for review or start the rollout, as prompted.
9. Monitor the release status in Play Console. The app is not necessarily
   publicly available immediately; Google must process/review it, and the
   rollout must reach users.

### Additional requirement for some personal developer accounts

Google currently requires personal Play developer accounts created after
November 13, 2023 to complete a closed test before applying for production
access. The current requirement is at least 12 testers opted in continuously
for at least 14 days, followed by an application for production access. This
is different from the optional internal test described above. Check the
[current testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465)
and your Play Console Dashboard because eligibility depends on account type
and Console requirements.

## 8. Publish a later update

For every future update:

1. Make and test the app changes.
2. Keep `expo.android.package` equal to `com.crasenimpharma.mobile`.
3. Increase `expo.android.versionCode` to a number higher than every
   version code already used for this Play app.
4. Update `expo.version` when you want to change the user-visible version
   (for example, from `1.0.0` to `1.0.1`). A version-name change does **not**
   replace the requirement to increase `versionCode`.
5. Run the TypeScript check:

   ```powershell
   npm.cmd run typecheck
   ```

6. Build a new AAB with the production profile:

   ```powershell
   npx.cmd eas-cli@latest build --platform android --profile production
   ```

7. Download the new `.aab` from that build's EAS page.
8. Create a release in the appropriate testing or production track, upload the
   new bundle, review it, and roll it out.

Do not upload an old AAB after changing `app.json`: an already-built bundle
keeps the version code it was built with. With the current project settings,
version codes are maintained in the project config. The `production` profile
does not currently enable EAS remote version auto-increment, so update
`versionCode` before each new production build.

## 9. Troubleshooting common Play Console messages

### "Version code 1 has already been used"

Play has already used that version code for this app. A version code cannot be
reused, even if the earlier release was not published. Increase
`expo.android.versionCode` above the highest code Play has used, rebuild, and
upload the newly created AAB. For this project, the config is now at `2`; if
Play reports `2` is already used, set it to `3` and rebuild.

### "You need to upload an APK or Android App Bundle for this app"

This can appear after the attempted bundle was rejected or removed and Play has
no valid artifact attached to the release. Upload a fresh, successfully
processed `.aab` from the **production** profile, wait for processing to
finish, and check the bundle section again. Do not upload the `preview` APK
profile or an AAB with a duplicate version code.

### The package name does not match

The bundle's application ID must match the Play listing. For this project it
is `com.crasenimpharma.mobile`. Do not change it for an update; if the listing
already exists, confirm you selected the correct Play app.

### Upload or signing-key error

Use the EAS project and Android upload key associated with this Play app.
Do not generate a different keystore just to get past an error. Check EAS
credentials and the Play Console **App integrity** page. If the upload key
needs to be reset, use Google's official upload-key reset process; this is
different from replacing the Play app-signing key.

### AAB was built before the version change

Changing `app.json` does not modify an AAB that was already built. Start a new
production build and upload the new artifact.

### Play Console still blocks release creation

Check the app Dashboard, unresolved draft releases, app-content declarations,
store listing, target API warnings, and any account verification or testing
tasks. Complete or discard an outstanding draft only after confirming it is
not a release you still need.

## 10. Release checklist

Before uploading:

- [ ] TypeScript check passes.
- [ ] `expo.android.package` matches the Play listing.
- [ ] `expo.android.versionCode` is higher than every code already used.
- [ ] The chosen EAS profile is `production`, not `preview`.
- [ ] The new build finished successfully and the downloaded file ends in
      `.aab`.
- [ ] The EAS project and Android upload credentials are the correct ones.

Before rollout:

- [ ] Play Console has processed the AAB and shows the expected app/version.
- [ ] Blocking errors are resolved and warnings have been reviewed.
- [ ] Store listing, privacy policy, Data safety, ads, app access, target
      audience, and content rating declarations are complete and accurate.
- [ ] Testers can opt in and install the app from Google Play.
- [ ] The release track, countries/regions, release notes, and rollout
      percentage are correct.
- [ ] Any account-specific closed-testing or production-access requirements
      are satisfied.

## Official references

- [Expo: Create your first EAS build](https://docs.expo.dev/build/setup/)
- [Expo: Configure EAS Build with `eas.json`](https://docs.expo.dev/build/eas-json/)
- [Expo: App version management](https://docs.expo.dev/build-reference/app-versions/)
- [Expo: Build APKs (and why production AAB is the default)](https://docs.expo.dev/build-reference/apk/)
- [Google Play: Create and set up your app](https://support.google.com/googleplay/android-developer/answer/9859152)
- [Google Play: Prepare and roll out a release](https://support.google.com/googleplay/android-developer/answer/9859348)
- [Google Play: Prepare your app for review](https://support.google.com/googleplay/android-developer/answer/9859455)
- [Google Play: Testing requirements for new personal accounts](https://support.google.com/googleplay/android-developer/answer/14151465)
- [Google Play: Target API level requirements](https://support.google.com/googleplay/android-developer/answer/11926878)
