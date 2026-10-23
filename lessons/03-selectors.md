# Lesson 3 — Selectors: three ways to find an element

## What you'll learn

- The three main ways to find an element: **text**, **id** (`testID`) and **accessibility label**
- Why **id** is usually the most reliable
- Why the same button can look different on Android and iOS, and how that breaks tests

## Open the screen

On the home list, tap **3. Selectors**. The top line says `Last tapped: nothing`. Below it are three targets:

1. a **Submit** button
2. a **Find me by label** button
3. a **Tap me by text** link

Tapping a target updates the top line, so your test can check that the right one was tapped.

## Inspect it

Open the screen on **both** an Android emulator and an iOS simulator if you can. Look closely at the Submit button:

- on iOS, it says **Submit**
- on Android, it says **SUBMIT**

The app's code says `Submit`. Android's native button draws its title in capitals, so that's the text Maestro sees on Android. A test that does `tapOn: "Submit"` passes on iOS and fails on Android.

Now click each target in `maestro studio`:

| Target | Text | id | Accessibility label |
|---|---|---|---|
| Submit | `Submit` / `SUBMIT` | `submit-button` | |
| Find me by label | `Find me by label` | `label-target` | `Accessible target` |
| Tap me by text | `Tap me by text` | `text-target` | |

An **accessibility label** is the text a screen reader (VoiceOver or TalkBack) reads aloud. Developers set it for people who can't see the screen. Maestro can find elements by it just as it finds text.

## Write the test

Create `my-tests/03-selectors.yaml`. Open the screen, then:

1. **By text:** tap the Submit button using the text your platform shows, and check `Last tapped: button`.
2. **By text again:** tap `Tap me by text` and check `Last tapped: text`.
3. **By id:** tap `submit-button` by id. This step is identical on both platforms:

   ```yaml
   - tapOn:
       id: "submit-button"
   ```

4. **By accessibility label:** tap `Accessible target` and check `Last tapped: label`.

## Which selector should I use?

1. **id**, when the developers have added `testID`s. Ids don't change when the wording or the platform changes. If an element you need has no id, ask the developers to add one. That's a normal request.
2. **Accessibility label**, when there's no id. Using labels also checks that the app works with screen readers.
3. **Text**, when what you're testing *is* the text, or when you have nothing better. Watch out for platform differences like the one above.

## Run it

```bash
maestro test my-tests/03-selectors.yaml
```

If you have both platforms, run your flow on each. Then swap the text step to the other platform's spelling and see it fail.

## Common failures

- **`Element not found: Text matching regex: Submit`** on Android — the button shows `SUBMIT`. Use the id, or the Android text.
- **Tapping "Find me by label" works on one platform and not the other** — on iOS, an element's accessibility label can replace its visible text. Prefer the id or the label.

## Solution

[solutions/android/03-selectors.yaml](../solutions/android/03-selectors.yaml) · [solutions/ios/03-selectors.yaml](../solutions/ios/03-selectors.yaml). These are the first solutions that differ between platforms.
