# Lesson 5 — Lists: finding things you can't see yet

## What you'll learn

- Why a test can't find an element that's off-screen
- Scrolling until an element appears with `scrollUntilVisible`
- How long lists are built in mobile apps, and why that matters for testing

## Open the screen

On the home list, tap **5. Lists**. You'll see a list of 50 rows (`Item 1` to `Item 50`), with `Selected: none` above it. Tapping a row selects it.

## Inspect it

In `maestro studio`, click **Item 3**. Its id is `list-item-3`. Each row's id is `list-item-` followed by its number.

Now run `maestro hierarchy` and search the output for `list-item-40`. **It isn't there.**

On a web page, every row of a 50-row list is in the DOM, even the ones you have to scroll to see. Mobile apps usually draw only the rows that are on screen, plus a few either side. Rows further away don't exist until you scroll near them. That's called *virtualisation*, and it keeps long lists fast. For a tester, it means **an element you can't see often can't be found at all**.

## Write the test

Create `my-tests/05-lists.yaml`. Tapping a visible row works as usual:

```yaml
- tapOn:
    id: "list-item-3"
- assertVisible: "Selected: Item 3"
```

Now try `tapOn` with `id: "list-item-40"` and run the flow. It fails, because row 40 doesn't exist yet.

Use `scrollUntilVisible`. It scrolls until the element appears, and fails if it never does:

```yaml
- scrollUntilVisible:
    element:
      id: "list-item-40"
    direction: DOWN
- tapOn:
    id: "list-item-40"
- assertVisible: "Selected: Item 40"
```

## Run it

```bash
maestro test my-tests/05-lists.yaml
```

## Common failures

- **`Element not found: Id matching regex: list-item-40`** — you tapped before scrolling. Add `scrollUntilVisible` first.
- **`scrollUntilVisible` scrolls past the row** — the list scrolled too far in one swipe. Try adding `speed: 40` to the step to scroll more slowly.
- **It scrolls the wrong way** — check `direction`. `DOWN` moves *down* the list, towards higher numbers.

## Try this

Select **Item 50**, the last row, then scroll back up and select **Item 1**.

## Solution

[solutions/android/05-lists.yaml](../solutions/android/05-lists.yaml) · [solutions/ios/05-lists.yaml](../solutions/ios/05-lists.yaml)
