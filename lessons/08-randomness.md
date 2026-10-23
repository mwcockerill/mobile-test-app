# Lesson 8 — Randomness: testing output you can't predict

## What you'll learn

- How to test something whose exact value changes every time
- Writing regular expressions (patterns) for `assertVisible`
- Deciding how strict a check should be

## Open the screen

On the home list, tap **8. Randomness**. It says `Press the button`. Each tap of **Generate Random Number** shows `Random number: N`, where N is a whole number from 1 to 100.

## Inspect it

| Element | id |
|---|---|
| Result text | `random-number-text` |
| Button | `generate-random-number-button` |

## Write the test

Create `my-tests/08-randomness.yaml`. Open the screen, tap the button, and then...what? `assertVisible: "Random number: 42"` passes about once in every 100 runs.

What you can check is that the result **has the right shape**:

```yaml
- assertVisible: "Random number: \\d+"
```

`\\d+` means "one or more digits" (you saw it in Lesson 6). This check passes for `Random number: 7` and `Random number: 100`. It fails for `Random number: ` with nothing after it, or for `Random number: NaN`. Those are real bugs it would catch.

### How strict should it be?

`\\d+` would also accept `Random number: 5000`, which breaks the 1–100 rule. A stricter pattern only accepts 1 to 100:

```yaml
- assertVisible: "Random number: ([1-9]|[1-9][0-9]|100)"
```

Reading it piece by piece:

- `( … | … | … )` means "one of these"
- `[1-9]` is a single digit from 1 to 9
- `[1-9][0-9]` is 10 to 99
- `100` is exactly 100

Maestro matches against the **whole** text of an element, so `Random number: 1000` doesn't sneak through.

Stricter checks catch more bugs but are harder to read and maintain. For many tests, "right shape" is enough. Use the strict version when the range really matters.

Finally, check that the prompt has gone:

```yaml
- assertNotVisible: "Press the button"
```

## Run it

```bash
maestro test my-tests/08-randomness.yaml
```

Run it several times. It should pass every time, whichever number comes up.

## Common failures

- **`Element not found: Text matching regex: Random number: \d+`** — check that you wrote each backslash twice in the YAML (`\\d+`).
- **Your pattern accepts everything** — patterns like `Random number: .*` match anything, including broken output. Make sure your pattern would *fail* on bad output. Try changing it to see.

## Solution

[solutions/android/08-randomness.yaml](../solutions/android/08-randomness.yaml) · [solutions/ios/08-randomness.yaml](../solutions/ios/08-randomness.yaml)
