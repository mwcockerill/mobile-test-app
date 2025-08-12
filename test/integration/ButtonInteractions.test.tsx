import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Alert } from "react-native";

// Mock Alert
jest.mock("react-native", () => ({
  ...jest.requireActual("react-native"),
  Alert: {
    alert: jest.fn(),
  },
}));

// Mock Math.random for predictable tests
const mockMath = Object.create(global.Math);
mockMath.random = jest.fn();
global.Math = mockMath;

import { Button, View } from "react-native";

// Button interaction components for testing
function RandomNumberButton(): React.JSX.Element {
  return (
    <Button
      title="Generate Random Number"
      onPress={() =>
        Alert.alert(
          "Random Number",
          `Your number: ${Math.floor(Math.random() * 100) + 1}`
        )
      }
      testID="random-number-button"
    />
  );
}

function MathProblemButton(): React.JSX.Element {
  return (
    <Button
      title="Give Me a Math Problem"
      onPress={() => {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        Alert.alert("Math Challenge", `What is ${a} + ${b}?`, [
          { text: `${a + b}`, onPress: () => Alert.alert("🎉 Correct!") },
          { text: `${a + b + 1}`, onPress: () => Alert.alert("❌ Try again!") },
          { text: `${a + b - 1}`, onPress: () => Alert.alert("❌ Try again!") },
        ]);
      }}
      testID="math-problem-button"
    />
  );
}

function ColorMoodButton(): React.JSX.Element {
  return (
    <Button
      title="What's My Color Mood?"
      onPress={() => {
        const colors = [
          "❤️ Red - Passionate",
          "💙 Blue - Calm",
          "💚 Green - Peaceful",
          "💛 Yellow - Happy",
          "💜 Purple - Creative",
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        Alert.alert("Your Color Mood", randomColor);
      }}
      testID="color-mood-button"
    />
  );
}

describe("Button Interactions Integration Tests", () => {
  const mockAlert = Alert.alert as jest.MockedFunction<typeof Alert.alert>;
  const mockRandom = Math.random as jest.MockedFunction<typeof Math.random>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Random Number Button", () => {
    it("calls Alert.alert when pressed", () => {
      mockRandom.mockReturnValue(0.5);
      const { getByTestId } = render(<RandomNumberButton />);

      fireEvent.press(getByTestId("random-number-button"));

      expect(mockAlert).toHaveBeenCalledWith(
        "Random Number",
        "Your number: 51"
      );
    });

    it("generates different numbers with different random values", () => {
      const { getByTestId } = render(<RandomNumberButton />);

      mockRandom.mockReturnValue(0.1);
      fireEvent.press(getByTestId("random-number-button"));
      expect(mockAlert).toHaveBeenCalledWith(
        "Random Number",
        "Your number: 11"

      mockAlert.mockClear();

      mockRandom.mockReturnValue(0.9);
      fireEvent.press(getByTestId("random-number-button"));
      expect(mockAlert).toHaveBeenCalledWith(
        "Random Number",
        "Your number: 91"
      );
    });
  });

  describe("Math Problem Button", () => {
    it("generates math problem and calls Alert.alert with options", () => {
      mockRandom
        .mockReturnValueOnce(0.3) // a = 4
        .mockReturnValueOnce(0.6); // b = 7

      const { getByTestId } = render(<MathProblemButton />);

      fireEvent.press(getByTestId("math-problem-button"));

      expect(mockAlert).toHaveBeenCalledWith(
        "Math Challenge",
        "What is 4 + 7?",
        expect.arrayContaining([
          expect.objectContaining({ text: "11" }), // correct answer
          expect.objectContaining({ text: "12" }), // answer + 1
          expect.objectContaining({ text: "10" }), // answer - 1
        ])
      );
    });

    it("creates correct answer option that shows success alert", () => {
      mockRandom
        .mockReturnValueOnce(0.2) // a = 3
        .mockReturnValueOnce(0.4); // b = 5

      const { getByTestId } = render(<MathProblemButton />);

      fireEvent.press(getByTestId("math-problem-button"));

      const alertCall = mockAlert.mock.calls[0];
      const options = alertCall[2] as Array<{
        text: string;
        onPress: () => void;
      }>;
      const correctOption = options.find((opt) => opt.text === "8");

      expect(correctOption).toBeDefined();

      // Simulate pressing correct answer
      if (correctOption?.onPress) {
        correctOption.onPress();
        expect(mockAlert).toHaveBeenCalledWith("🎉 Correct!");
      }
    });

    it("creates wrong answer options that show failure alert", () => {
      mockRandom
        .mockReturnValueOnce(0.2) // a = 3
        .mockReturnValueOnce(0.4); // b = 5

      const { getByTestId } = render(<MathProblemButton />);

      fireEvent.press(getByTestId("math-problem-button"));

      const alertCall = mockAlert.mock.calls[0];
      const options = alertCall[2] as Array<{
        text: string;
        onPress: () => void;
      }>;
      const wrongOption = options.find((opt) => opt.text === "9"); // 8 + 1

      expect(wrongOption).toBeDefined();

      // Simulate pressing wrong answer
      if (wrongOption?.onPress) {
        wrongOption.onPress();
        expect(mockAlert).toHaveBeenCalledWith("❌ Try again!");
      }
    });
  });

  describe("Color Mood Button", () => {
    it("calls Alert.alert with random color mood", () => {
      mockRandom.mockReturnValue(0.2); // Should select index 1

      const { getByTestId } = render(<ColorMoodButton />);

      fireEvent.press(getByTestId("color-mood-button"));

      expect(mockAlert).toHaveBeenCalledWith(
        "Your Color Mood",
        "💙 Blue - Calm"
      );
    });

    it("selects different colors based on random value", () => {
      const { getByTestId } = render(<ColorMoodButton />);

      // Test first color
      mockRandom.mockReturnValue(0.0);
      fireEvent.press(getByTestId("color-mood-button"));
      expect(mockAlert).toHaveBeenCalledWith(
        "Your Color Mood",
        "❤️ Red - Passionate"

      mockAlert.mockClear();

      // Test last color
      mockRandom.mockReturnValue(0.99);
      fireEvent.press(getByTestId("color-mood-button"));
      expect(mockAlert).toHaveBeenCalledWith(
        "Your Color Mood",
        "💜 Purple - Creative"
      );
    });

    it("only selects from predefined color list", () => {
      const expectedColors = [
        "❤️ Red - Passionate",
        "💙 Blue - Calm",
        "💚 Green - Peaceful",
        "💛 Yellow - Happy",
        "💜 Purple - Creative",
      ];

      const { getByTestId } = render(<ColorMoodButton />);

      // Test multiple random values
      for (let i = 0; i < 10; i++) {
        mockRandom.mockReturnValue(Math.random());
        mockAlert.mockClear();

        fireEvent.press(getByTestId("color-mood-button"));

        const alertCall = mockAlert.mock.calls[0];
        const selectedColor = alertCall[1];

        expect(expectedColors).toContain(selectedColor);
      }
    });
  });

  describe("Multiple Button Interactions", () => {
    it("handles multiple button presses independently", () => {
      const TestComponent = () => (
        <View>
          <RandomNumberButton />
          <ColorMoodButton />
        </View>
      );

      const { getByTestId } = render(<TestComponent />);

      mockRandom.mockReturnValue(0.5);
      fireEvent.press(getByTestId("random-number-button"));
      expect(mockAlert).toHaveBeenCalledWith(
        "Random Number",
        "Your number: 51"

      mockAlert.mockClear();
      mockRandom.mockReturnValue(0.3);
      fireEvent.press(getByTestId("color-mood-button"));
      expect(mockAlert).toHaveBeenCalledWith(
        "Your Color Mood",
        "💙 Blue - Calm"
      );
    });
  });
});
