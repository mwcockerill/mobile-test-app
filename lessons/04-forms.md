# Lesson 4 — Forms: typing, clearing and checking validation

## What you'll learn

- Typing into a field with `inputText`
- Clearing a field with `eraseText`
- Dismissing the on-screen keyboard with `hideKeyboard`
- Testing validation messages and the "happy path"

## Open the screen

On the home list, tap **4. Forms**. It's a small login form with an **Email** field, a **Password** field and a **Log in** button. A message appears under the button when you tap it.

## Inspect it

In `maestro studio`, click each part of the form:

| Element | id |
|---|---|
| Email field | `email-input` |
| Password field | `password-input` |
| Log in button | `login-button` |
| Message | `login-message` |

Try the form by hand first, and note every message you can make it show. These are the rules:

| Input | Message |
|---|---|
| Email empty | `Email is required` |
| Email without `@`, or nothing after it | `Enter a valid email` |
| Password shorter than 8 characters | `Password must be at least 8 characters` |
| Valid email and password | `Welcome, <email>!` |

Writing these rules down before you automate them is good practice. Each row is a test case.

## Write the test

Create `my-tests/04-forms.yaml`. Open the screen, then work through the rules:

```yaml
# Empty form
- tapOn:
    id: "login-button"
- assertVisible: "Email is required"

# Type into a field: tap it first so it has focus
- tapOn:
    id: "email-input"
- inputText: "tester"
- tapOn:
    id: "login-button"
- assertVisible: "Enter a valid email"
```

To change what's in a field, tap it and clear it with `eraseText` before typing again:

```yaml
- tapOn:
    id: "email-input"
- eraseText
- inputText: "tester@example.com"
```

Now finish the flow yourself:

1. Type a short password, then check the password message.
2. Replace it with `password123`, then check `Welcome, tester@example.com!`.

## The keyboard

When you type, the on-screen keyboard opens and can cover the rest of the screen, including the button you want to tap next. Use `hideKeyboard` after typing to close it:

```yaml
- inputText: "password123"
- hideKeyboard
```

## Run it

```bash
maestro test my-tests/04-forms.yaml
```

## Common failures

- **Text goes into the wrong field** — `inputText` types into whichever field has focus. Always `tapOn` the field first.
- **Old text is still in the field** — use `eraseText` before `inputText`.
- **`Element not found` for the Log in button** — the keyboard is probably covering it. Add `hideKeyboard`.
- **Your email comes out as `Tester@example.com`** — the keyboard capitalised it. This app turns that off for the email field, but other apps might not.

## Try this

Type ` tester@example.com ` with spaces at both ends. What does the app do? Should a real app accept it? Questions like this are how testers find bugs.

## Solution

[solutions/android/04-forms.yaml](../solutions/android/04-forms.yaml) · [solutions/ios/04-forms.yaml](../solutions/ios/04-forms.yaml)
