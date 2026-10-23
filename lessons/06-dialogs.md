# Lesson 6 — Dialogs: native alerts

## What you'll learn

- How native dialogs (alerts) differ from the rest of the screen
- Checking a dialog's title and message, and tapping its buttons
- Dismissing a dialog, and checking that it has gone

## Open the screen

On the home list, tap **6. Dialogs**. There are two buttons:

- **Give Me a Math Problem** opens a dialog titled `Math Challenge` that asks a sum, with two number buttons. One is right, one is wrong. Tapping either opens a second dialog that says `Correct!` or `Try again!`.
- **What's My Color Mood?** opens a dialog titled `Your Color Mood` with a random colour.

## Inspect it

Open a dialog, then look at it in `maestro studio`. You'll notice:

- The dialog's title, message and buttons have **no ids**. A native dialog is drawn by Android or iOS itself, not by the app's own views, so the app's developers can't give its parts `testID`s.
- That means you have to use **text** to work with dialogs.
- Dialogs look different on Android and iOS. The title and message text are the same, but Android can show button text in capitals (see Common failures).

## Write the test

Create `my-tests/06-dialogs.yaml`. Start with the colour dialog, which is the simpler one:

```yaml
- tapOn:
    id: "color-mood-button"
- assertVisible: "Your Color Mood"
- tapOn: "OK"
- assertNotVisible: "Your Color Mood"
```

`assertNotVisible` is the opposite of `assertVisible`: it fails if the text *is* on screen. Use it to prove the dialog really closed.

### A dialog with random content

The maths dialog is different every time. One run asks `What is 3 + 7?`, the next `What is 9 + 2?`. You can't write `assertVisible: "What is 3 + 7?"`, because it would fail on most runs.

Maestro treats your text as a **regular expression** (a pattern), so you can check the *shape* of the text instead:

```yaml
- assertVisible: "What is \\d+ \\+ \\d+\\?"
```

- `\\d+` means "one or more digits"
- `\\+` and `\\?` mean a literal `+` and `?`. On their own, `+` and `?` have special meanings in a pattern.
- In YAML double quotes, you write each backslash twice.

To tap an answer without knowing its number, tap whatever button is "just digits":

```yaml
- tapOn: "\\d+"
- assertVisible: "Correct!|Try again!"
```

`|` means "or". Lesson 8 covers patterns in more depth.

## Run it

```bash
maestro test my-tests/06-dialogs.yaml
```

## Common failures

- **The test taps the screen behind the dialog** — while a dialog is open, the screen behind it can't be tapped. Close the dialog first.
- **`OK` isn't found** — Android dialogs sometimes show button text in capitals, depending on the Android version and theme. Check the dialog in `maestro studio`.
- **`assertVisible: "What is 3 + 7?"` passes once, then fails** — the content is random. Use a pattern.

## Solution

[solutions/android/06-dialogs.yaml](../solutions/android/06-dialogs.yaml) · [solutions/ios/06-dialogs.yaml](../solutions/ios/06-dialogs.yaml)
