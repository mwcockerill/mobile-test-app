# Lesson 7 — Waiting: content that takes time to appear

## What you'll learn

- How Maestro waits for you automatically, and how long for
- Waiting longer, but only as long as needed, with `extendedWaitUntil`
- Why a fixed pause is a bad idea

## Open the screen

On the home list, tap **7. Waiting**. Tap **Load data**. The screen shows `Loading…` for three seconds, then `Data loaded`.

Real apps do this all the time while they fetch data from a server. It's one of the most common causes of *flaky* tests: tests that pass sometimes and fail other times without the app changing.

## Inspect it

| Element | id | When it's on screen |
|---|---|---|
| Load data button | `load-button` | always |
| `Loading…` | `loading-text` | while loading |
| `Data loaded` | `loaded-text` | once loading has finished |

## Write the test

Create `my-tests/07-waiting.yaml`. Open the screen, tap **Load data**, and check the loading message:

```yaml
- tapOn:
    id: "load-button"
- assertVisible:
    id: "loading-text"
```

### Maestro already waits for you

`assertVisible` doesn't give up immediately. It keeps looking for the element for up to about **17 seconds** (in current Maestro versions) before it fails, and carries on as soon as it appears. So for this screen's 3-second load, a plain `assertVisible: "Data loaded"` works:

```yaml
- assertVisible: "Data loaded"
```

Try it. Then think about real apps, where a slow server or a big download can take longer than 17 seconds. A test that relies on the default wait passes on a good day and fails on a bad one. That's the start of a flaky test.

### Wait longer, and say how long

`extendedWaitUntil` keeps checking until the element appears, up to a `timeout` that you choose, in milliseconds:

```yaml
- extendedWaitUntil:
    visible:
      id: "loaded-text"
    timeout: 30000
```

If the data arrives after 3 seconds, the test carries on after 3 seconds. It doesn't sit waiting for all 30. The timeout is only a limit.

Use `extendedWaitUntil` when something can take longer than the default, or when you want the test to state the limit you've agreed on ("search results must appear within 30 seconds"). Anyone reading the test can see it.

Then check that the loading message has gone:

```yaml
- assertNotVisible:
    id: "loading-text"
```

### Why not just pause?

In many test tools, the first fix people reach for is a fixed pause ("wait 5 seconds"). A fixed pause of 5 seconds:

- wastes 2 seconds every run when loading takes 3
- still fails on a slow day when loading takes 6

Always wait *for something* rather than *for a length of time*.

## Run it

```bash
maestro test my-tests/07-waiting.yaml
```

## Common failures

- **Passes on your machine, fails on someone else's** — something sometimes takes longer than Maestro's default wait. Use `extendedWaitUntil` with a timeout that covers the slowest acceptable case.
- **Times out** — check that the id is right and that you tapped **Load data** first.

## Try this

Leave the screen while it says `Loading…`, then come back. What should the app show? What does it show? Write a test for it.

## Solution

[solutions/android/07-waiting.yaml](../solutions/android/07-waiting.yaml) · [solutions/ios/07-waiting.yaml](../solutions/ios/07-waiting.yaml)
