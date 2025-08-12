describe('Interactive Features E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display all main sections', async () => {
    await expect(element(by.text('🎮 Mini App Collection'))).toBeVisible();
    await expect(element(by.text('🎲 Random Number Generator'))).toBeVisible();
    await expect(element(by.text('📝 Counter App'))).toBeVisible();
    await expect(element(by.text('🎯 Quick Math'))).toBeVisible();
    await expect(element(by.text('🎨 Color Mood'))).toBeVisible();
  });

  it('should show alert when Generate Random Number is pressed', async () => {
    await element(by.text('Generate Random Number')).tap();

    // Wait for alert to appear and check for "Random Number" text in title
    await waitFor(element(by.text('Random Number')))
      .toBeVisible()
      .withTimeout(5000);

    // Dismiss alert
    await element(by.text('OK')).tap();
  });

  it('should show math problem when Give Me a Math Problem is pressed', async () => {
    await element(by.text('Give Me a Math Problem')).tap();

    // Wait for math challenge alert
    await waitFor(element(by.text('Math Challenge')))
      .toBeVisible()
      .withTimeout(5000);

    // The alert should contain a math problem like "What is X + Y?"
    // We can't predict the exact numbers, so we'll check for pattern
    await waitFor(element(by.text(/What is \d+ \+ \d+\?/)))
      .toBeVisible()
      .withTimeout(2000);

    // Tap one of the answer options (there should be 3 buttons)
    // We'll tap the first numerical option we find
    const answerButtons = await element(by.type('UIButton')).atIndex(0);
    await answerButtons.tap();

    // Should show either correct or try again message
    await waitFor(element(by.text(/🎉 Correct!|❌ Try again!/)))
      .toBeVisible()
      .withTimeout(3000);

    // Dismiss the result alert
    await element(by.text('OK')).tap();
  });

  it('should show color mood when color button is pressed', async () => {
    await element(by.text("What's My Color Mood?")).tap();

    // Wait for color mood alert
    await waitFor(element(by.text('Your Color Mood')))
      .toBeVisible()
      .withTimeout(5000);

    // Should show one of the predefined colors
    await waitFor(
      element(
        by.text(
          /Red - Passionate|Blue - Calm|Green - Peaceful|Yellow - Happy|Purple - Creative/
        )
      )
    )
      .toBeVisible()
      .withTimeout(2000);

    // Dismiss alert
    await element(by.text('OK')).tap();
  });

  it('should scroll through all sections', async () => {
    // Scroll down to see all sections
    await element(by.id('scroll-view')).scroll(300, 'down');

    // All sections should still be accessible
    await expect(element(by.text('🎨 Color Mood'))).toBeVisible();
  });

  it('should work in both orientations', async () => {
    // Test portrait mode
    await expect(element(by.text('🎮 Mini App Collection'))).toBeVisible();

    // Rotate to landscape
    await device.setOrientation('landscape');
    await expect(element(by.text('🎮 Mini App Collection'))).toBeVisible();

    // Counter should still work
    await element(by.text('+')).tap();
    await expect(element(by.text('Count: 1'))).toBeVisible();

    // Rotate back to portrait
    await device.setOrientation('portrait');
    await expect(element(by.text('Count: 1'))).toBeVisible();
  });

  it('should handle app backgrounding and foregrounding', async () => {
    // Increment counter
    await element(by.text('+')).tap();
    await element(by.text('+')).tap();
    await expect(element(by.text('Count: 2'))).toBeVisible();

    // Background app
    await device.sendToHome();
    await device.launchApp();

    // State should be preserved
    await expect(element(by.text('Count: 2'))).toBeVisible();
  });
});
