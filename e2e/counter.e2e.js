describe('Counter E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display counter with initial value of 0', async () => {
    await expect(element(by.text('Count: 0'))).toBeVisible();
  });

  it('should increment counter when + button is pressed', async () => {
    await element(by.text('+')).tap();
    await expect(element(by.text('Count: 1'))).toBeVisible();

    await element(by.text('+')).tap();
    await expect(element(by.text('Count: 2'))).toBeVisible();
  });

  it('should decrement counter when - button is pressed', async () => {
    // First increment to have positive number
    await element(by.text('+')).tap();
    await element(by.text('+')).tap();
    await expect(element(by.text('Count: 2'))).toBeVisible();

    // Then decrement
    await element(by.text('-')).tap();
    await expect(element(by.text('Count: 1'))).toBeVisible();
  });

  it('should reset counter to 0 when Reset button is pressed', async () => {
    // Increment counter first
    await element(by.text('+')).tap();
    await element(by.text('+')).tap();
    await element(by.text('+')).tap();
    await expect(element(by.text('Count: 3'))).toBeVisible();

    // Reset counter
    await element(by.text('Reset')).tap();
    await expect(element(by.text('Count: 0'))).toBeVisible();
  });

  it('should handle negative numbers', async () => {
    await element(by.text('-')).tap();
    await expect(element(by.text('Count: -1'))).toBeVisible();

    await element(by.text('-')).tap();
    await expect(element(by.text('Count: -2'))).toBeVisible();
  });

  it('should handle rapid taps without issues', async () => {
    // Rapidly tap increment button
    for (let i = 0; i < 10; i++) {
      await element(by.text('+')).tap();
    }
    await expect(element(by.text('Count: 10'))).toBeVisible();
  });
});
