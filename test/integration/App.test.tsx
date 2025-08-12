import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { useColorScheme, Alert } from "react-native";
import App from "../../App";

// Mock all dependencies
jest.mock("react-native", () => ({
  ...jest.requireActual("react-native"),
  useColorScheme: jest.fn(),
  Alert: {
    alert: jest.fn(),
  },
}));

// Mock Math.random for predictable tests
const mockMath = Object.create(global.Math);
mockMath.random = jest.fn();
mockMath.floor = jest.fn(global.Math.floor);
global.Math = mockMath;

describe("App Component Integration Tests", () => {
  const mockUseColorScheme = useColorScheme as jest.MockedFunction<
    typeof useColorScheme
  >;
  const mockAlert = Alert.alert as jest.MockedFunction<typeof Alert.alert>;
  const mockRandom = Math.random as jest.MockedFunction<typeof Math.random>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseColorScheme.mockReturnValue("light");
  });

  describe("App Structure and Rendering", () => {
    it("renders custom header with correct title", () => {
      const { getByText } = render(<App />);
      expect(getByText("🎮 Mini App Collection")).toBeTruthy();
      expect(getByText("Fun interactive tools")).toBeTruthy();
    });

    it("renders all 4 sections with correct titles", () => {
      const { getByText } = render(<App />);

      expect(getByText("🎲 Random Number Generator")).toBeTruthy();
      expect(getByText("📝 Counter App")).toBeTruthy();
      expect(getByText("🎯 Quick Math")).toBeTruthy();
      expect(getByText("🎨 Color Mood")).toBeTruthy();
    });

    it("renders all interactive buttons", () => {
      const { getByText } = render(<App />);

      expect(getByText("Generate Random Number")).toBeTruthy();
      expect(getByText("+")).toBeTruthy();
      expect(getByText("Reset")).toBeTruthy();
      expect(getByText("-")).toBeTruthy();
      expect(getByText("Give Me a Math Problem")).toBeTruthy();
      expect(getByText("What's My Color Mood?")).toBeTruthy();
    });
  });

  describe("Dark/Light Mode Consistency", () => {
    it("applies dark mode styling consistently across all elements", () => {
      mockUseColorScheme.mockReturnValue("dark");
      const { getByText } = render(<App />);

      // Check header text
      const headerTitle = getByText("🎮 Mini App Collection");
      expect(headerTitle.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ color: expect.any(String) }),
        ])
      );

      // Check counter display
      const counterText = getByText("Count: 0");
      expect(counterText.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ color: expect.any(String) }),
        ])
      );
    });

    it("applies light mode styling consistently", () => {
      mockUseColorScheme.mockReturnValue("light");
      const { getByText } = render(<App />);

      const headerTitle = getByText("🎮 Mini App Collection");
      expect(headerTitle.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ color: expect.any(String) }),
        ])
      );
    });
  });

  describe("Full User Workflows", () => {
    it("allows complete counter workflow", () => {
      const { getByText } = render(<App />);

      const counterDisplay = getByText("Count: 0");
      const incrementButton = getByText("+");
      const decrementButton = getByText("-");
      const resetButton = getByText("Reset");

      // Initial state
      expect(counterDisplay).toHaveTextContent("Count: 0");

      // Increment workflow
      fireEvent.press(incrementButton);
      expect(getByText("Count: 1")).toBeTruthy();

      fireEvent.press(incrementButton);
      fireEvent.press(incrementButton);
      expect(getByText("Count: 3")).toBeTruthy();

      // Decrement workflow
      fireEvent.press(decrementButton);
      expect(getByText("Count: 2")).toBeTruthy();

      // Reset workflow
      fireEvent.press(resetButton);
      expect(getByText("Count: 0")).toBeTruthy();
    });

    it("allows random number generation workflow", () => {
      mockRandom.mockReturnValue(0.75);
      const { getByText } = render(<App />);

      const randomButton = getByText("Generate Random Number");
      fireEvent.press(randomButton);

      expect(mockAlert).toHaveBeenCalledWith(
        "Random Number",
        "Your number: 76"
      );
    });

    it("allows math problem workflow with correct answer", () => {
      mockRandom
        .mockReturnValueOnce(0.4) // a = 5
        .mockReturnValueOnce(0.7); // b = 8

      const { getByText } = render(<App />);

      const mathButton = getByText("Give Me a Math Problem");
      fireEvent.press(mathButton);

      expect(mockAlert).toHaveBeenCalledWith(
        "Math Challenge",
        "What is 5 + 8?",
        expect.arrayContaining([
          expect.objectContaining({ text: "13" }), // correct
          expect.objectContaining({ text: "14" }), // wrong
          expect.objectContaining({ text: "12" }), // wrong
        ])
      );
    });

    it("allows color mood workflow", () => {
      mockRandom.mockReturnValue(0.8); // Should select Purple
      const { getByText } = render(<App />);

      const colorButton = getByText("What's My Color Mood?");
      fireEvent.press(colorButton);

      expect(mockAlert).toHaveBeenCalledWith(
        "Your Color Mood",
        "💜 Purple - Creative"
      );
    });
  });

  describe("State Management Isolation", () => {
    it("counter state does not affect other sections", () => {
      mockRandom.mockReturnValue(0.5);
      const { getByText } = render(<App />);

      // Modify counter state
      const incrementButton = getByText("+");
      fireEvent.press(incrementButton);
      fireEvent.press(incrementButton);
      expect(getByText("Count: 2")).toBeTruthy();

      // Other buttons should still work independently
      const randomButton = getByText("Generate Random Number");
      fireEvent.press(randomButton);

      expect(mockAlert).toHaveBeenCalledWith(
        "Random Number",
        "Your number: 51"
      );

      // Counter should be unchanged
      expect(getByText("Count: 2")).toBeTruthy();
    });

    it("multiple interactions do not interfere with each other", () => {
      mockRandom
        .mockReturnValue(0.3) // For color mood
        .mockReturnValueOnce(0.1) // For random number
        .mockReturnValueOnce(0.2) // For math problem a
        .mockReturnValueOnce(0.6); // For math problem b

      const { getByText } = render(<App />);

      // Increment counter
      fireEvent.press(getByText("+"));
      expect(getByText("Count: 1")).toBeTruthy();

      // Generate random number
      mockAlert.mockClear();
      fireEvent.press(getByText("Generate Random Number"));
      expect(mockAlert).toHaveBeenCalledWith(
        "Random Number",
        expect.any(String)

      // Counter should still be 1
      expect(getByText("Count: 1")).toBeTruthy();

      // Get color mood
      mockAlert.mockClear();
      fireEvent.press(getByText("What's My Color Mood?"));
      expect(mockAlert).toHaveBeenCalledWith(
        "Your Color Mood",
        expect.any(String)

      // Counter should still be 1
      expect(getByText("Count: 1")).toBeTruthy();
    });
  });

  describe("Error Handling and Edge Cases", () => {
    it("handles rapid button presses gracefully", () => {
      const { getByText } = render(<App />);

      const incrementButton = getByText("+");

      // Rapid fire clicks
      for (let i = 0; i < 10; i++) {
        fireEvent.press(incrementButton);
      }

      expect(getByText("Count: 10")).toBeTruthy();
    });

    it("handles negative counter values", () => {
      const { getByText } = render(<App />);

      const decrementButton = getByText("-");

      fireEvent.press(decrementButton);
      fireEvent.press(decrementButton);

      expect(getByText("Count: -2")).toBeTruthy();
    });

    it("resets from negative values correctly", () => {
      const { getByText } = render(<App />);

      // Go negative
      fireEvent.press(getByText("-"));
      fireEvent.press(getByText("-"));
      expect(getByText("Count: -2")).toBeTruthy();

      // Reset
      fireEvent.press(getByText("Reset"));
      expect(getByText("Count: 0")).toBeTruthy();
    });
  });
});
