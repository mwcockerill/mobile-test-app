import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import { BackHandler } from "react-native";
import App from "../../App";
import { SCREENS } from "../../src/screens";

jest.mock("react-native/Libraries/Utilities/BackHandler", () =>
  require("react-native/Libraries/Utilities/__mocks__/BackHandler"),
);

type MockBackHandler = typeof BackHandler & { mockPressBack: () => void };

describe("App shell", () => {
  it("shows the home title and version", () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId("home-title")).toHaveTextContent("Learn Mobile Testing");
    expect(getByTestId("app-version")).toHaveTextContent("v1.0.0");
  });

  it("lists every registered screen", () => {
    const { getByTestId } = render(<App />);
    for (const { lesson, slug, title } of SCREENS) {
      expect(getByTestId(`home-item-${slug}`)).toHaveTextContent(
        `${lesson}. ${title}`,
      );
    }
  });

  it("opens a screen and goes back", () => {
    const { getByTestId, queryByTestId } = render(<App />);
    fireEvent.press(getByTestId("home-item-launch"));
    expect(getByTestId("screen-title")).toHaveTextContent("Launch");
    expect(getByTestId("lesson-hint")).toHaveTextContent(
      "Lesson 1 · lessons/01-launch.md",
    );
    expect(queryByTestId("home-title")).toBeNull();
    fireEvent.press(getByTestId("back-button"));
    expect(getByTestId("home-title")).toBeTruthy();
  });

  it("Android back on a screen returns home", () => {
    const { getByTestId } = render(<App />);
    fireEvent.press(getByTestId("home-item-launch"));
    act(() => (BackHandler as MockBackHandler).mockPressBack());
    expect(getByTestId("home-title")).toBeTruthy();
  });

  it("Launch screen shows the welcome text", () => {
    const { getByTestId } = render(<App />);
    fireEvent.press(getByTestId("home-item-launch"));
    expect(getByTestId("welcome-text")).toHaveTextContent(
      "Welcome to the practice app",
    );
  });
});
