import React from "react";
import { render } from "@testing-library/react-native";
import { useColorScheme } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

// Mock useColorScheme
jest.mock("react-native", () => ({
  ...jest.requireActual("react-native"),
  useColorScheme: jest.fn(),
}));

// Import Section component (we'll need to extract it)
type SectionProps = {
  title: string;
  children?: React.ReactNode;
};

function Section({ children, title }: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = {
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
};

describe("Section Component", () => {
  const mockUseColorScheme = useColorScheme as jest.MockedFunction<
    typeof useColorScheme
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders title prop correctly", () => {
    mockUseColorScheme.mockReturnValue("light");
    const { getByText } = render(
      <Section title="Test Title">Test content</Section>

    expect(getByText("Test Title")).toBeTruthy();
  });

  it("renders children content", () => {
    mockUseColorScheme.mockReturnValue("light");
    const { getByText } = render(
      <Section title="Test Title">Test children content</Section>

    expect(getByText("Test children content")).toBeTruthy();
  });

  it("applies dark mode colors when isDarkMode=true", () => {
    mockUseColorScheme.mockReturnValue("dark");
    const { getByText } = render(
      <Section title="Test Title">Test content</Section>

    const titleElement = getByText("Test Title");
    const contentElement = getByText("Test content");

    expect(titleElement.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: Colors.white })])
    );
    expect(contentElement.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: Colors.light })])
    );
  });

  it("applies light mode colors when isDarkMode=false", () => {
    mockUseColorScheme.mockReturnValue("light");
    const { getByText } = render(
      <Section title="Test Title">Test content</Section>

    const titleElement = getByText("Test Title");
    const contentElement = getByText("Test content");

    expect(titleElement.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: Colors.black })])
    );
    expect(contentElement.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: Colors.dark })])
    );
  });
});
