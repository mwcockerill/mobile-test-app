# Lesson 9 — Navigation: tests that move between screens

## What you'll learn

- Writing a test that moves through several screens and checks where it ends up
- Using Android's system back button with the `back` command
- Grouping steps with `runFlow`, so you can reuse them

## Open the screen

On the home list, tap **9. Navigation**. It shows `Navigation overview` and an **Open details** button. That opens a `Details page` with a **Back to overview** button.

Every practice screen also has the **‹ Back** link at the top, which returns to the home list.

## Inspect it

| Element | id |
|---|---|
| `Navigation overview` text | `nav-overview-text` |
| Open details | `open-details-button` |
| `Details page` text | `details-text` |
| Back to overview | `details-back-button` |
| ‹ Back (top of every screen) | `back-button` |

## Write the test

Create `my-tests/09-navigation.yaml`. The skill here is **checking where you are after every move**. If a tap takes you to the wrong place, you want the test to fail right there, not three steps later with a confusing error.

```yaml
- tapOn:
    id: "home-item-navigation"
- assertVisible: "Navigation overview"
- tapOn:
    id: "open-details-button"
- assertVisible:
    id: "details-text"
- tapOn:
    id: "details-back-button"
- assertVisible: "Navigation overview"
- tapOn:
    id: "back-button"
- assertVisible: "Learn Mobile Testing"
```

### Android's back button

Android phones have a system back button (or a back gesture). Users press it all the time, so test it too. Maestro's `back` command presses it:

```yaml
- back
- assertVisible: "Learn Mobile Testing"
```

iOS has no system back button, so `back` is Android-only. That's another reason this course keeps separate Android and iOS flows.

### Reusing steps with `runFlow`

As your tests grow, you'll repeat the same steps, like "open the Navigation screen", in many flows. `runFlow` groups steps together:

```yaml
- runFlow:
    commands:
      - tapOn:
          id: "home-item-navigation"
      - assertVisible: "Navigation overview"
```

`runFlow` can also run another file, for example `- runFlow: open-navigation.yaml`. Put shared steps in their own file and call it from every flow that needs them. If the steps ever change, you only fix them in one place.

## Run it

```bash
maestro test my-tests/09-navigation.yaml
```

Then run your whole folder. This is your own test suite:

```bash
maestro test my-tests/
```

## Common failures

- **A later step fails with a confusing error** — add an `assertVisible` after each move, so the test fails at the step that actually went wrong.
- **`back` does nothing on iOS** — it's Android-only. Use the app's own Back button instead.

## What next?

You've now used every core Maestro skill: launching, tapping, selectors, typing, scrolling, dialogs, waiting, patterns and navigation. Some ideas:

- Write one longer flow that visits every screen.
- Read the reference solutions for both platforms and spot the differences.
- Look at the [Maestro documentation](https://docs.maestro.dev) for commands this course didn't cover.

## Solution

[solutions/android/09-navigation.yaml](../solutions/android/09-navigation.yaml) · [solutions/ios/09-navigation.yaml](../solutions/ios/09-navigation.yaml)
