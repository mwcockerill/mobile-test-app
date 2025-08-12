package com.mobiletestapp;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import com.wix.detox.Detox;
import com.wix.detox.config.DetoxConfig;
import com.wix.detox.junit.ActivityTestRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(AndroidJUnit4.class)
public class DetoxTest {
  @Rule
  public ActivityTestRule<MainActivity> mActivityRule =
      new ActivityTestRule<>(MainActivity.class, true, false);

  @Test
  public void runDetoxTests() {
    Detox.runTests(mActivityRule, new DetoxConfig());
  }
}
