# Lesson 2 — Counter: tapping and checking text

## What you'll learn

- Tapping elements by their **text** and by their **id**
- Checking an element's text with `assertVisible`
- Running a single flow, and running a whole folder of flows

## Open the screen

On the home list, tap **2. Counter**. You'll see `Count: 0` and three buttons: `+`, `Reset` and `-`.

## Inspect it

Open `maestro studio` and click each button. You'll find:

| Element | Text | id |
|---|---|---|
| Count | `Count: 0` | `count-text` |
| + button | `+` | `increment-button` |
| Reset button | `Reset` | `reset-button` |
| - button | `-` | `decrement-button` |

## Write the test

Create `my-tests/02-counter.yaml`. Start the same way as Lesson 1:

```yaml
appId: com.mobiletestapp
---
- launchApp
- tapOn:
    id: "home-item-counter"
- assertVisible: "Count: 0"
```

### Tap by text

`tapOn: "+"` finds the element whose text is exactly `+` and taps it:

```yaml
- tapOn: "+"
- tapOn: "+"
- tapOn: "+"
- assertVisible: "Count: 3"
```

### Tap by id

Text can change: a designer might relabel the button "Add". An id only changes if a developer changes it on purpose, so it's usually the more stable choice:

```yaml
- tapOn:
    id: "decrement-button"
```

### Check a specific element's text

`assertVisible: "Count: 2"` passes if that text appears *anywhere* on screen. To check that a *specific* element shows it, combine `id` and `text`:

```yaml
- assertVisible:
    id: "count-text"
    text: "Count: 2"
```

Now extend your test so that it:

1. taps `-` until the count is negative and checks `Count: -1`
2. taps **Reset** and checks `Count: 0`

## Run it

Run one flow:

```bash
maestro test my-tests/02-counter.yaml
```

Run every flow in the folder, one after another:

```bash
maestro test my-tests/
```

## Common failures

- **The count is off by one.** Each `launchApp` restarts the app, so the count starts at 0 at the beginning of every flow. Check how many taps your flow actually makes.
- **`Element not found: Text matching regex: Count: 3`** — your text is treated as a regular expression, and it has to match the element's *whole* text. `Count: 3` matches, `Count` on its own doesn't.

## Solution

[solutions/android/02-counter.yaml](../solutions/android/02-counter.yaml) · [solutions/ios/02-counter.yaml](../solutions/ios/02-counter.yaml)
