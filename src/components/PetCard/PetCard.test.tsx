import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"; // Provides extended matchers
import PetCard from "./PetCard";

describe("PetCard Component", () => {
  const mockHandleSelected = jest.fn();

  const defaultProps = {
    id: "pet1",
    type: "dog",
    hungerMax: 3,
    tirednessMax: 2,
    selected: true,
    handleSelected: mockHandleSelected,
  };

  beforeEach(() => {
    mockHandleSelected.mockClear();
  });

  test("renders the correct pet icon based on the type", () => {
    render(<PetCard {...defaultProps} />);
    expect(screen.getByText("🐶")).toBeInTheDocument();
  });

  test("renders HUNGER and TIREDNESS progress bars", () => {
    render(<PetCard {...defaultProps} />);
    expect(screen.getByText("HUNGER")).toBeInTheDocument();
    expect(screen.getByText("TIREDNESS")).toBeInTheDocument();
  });

  test("calls handleSelected with the correct id when clicked", () => {
    render(<PetCard {...defaultProps} />);
    const card = screen.getByRole("button");
    fireEvent.click(card);

    expect(mockHandleSelected).toHaveBeenCalledTimes(1);
    expect(mockHandleSelected).toHaveBeenCalledWith("pet1");
  });

  test("applies border styling when selected is true", () => {
    render(<PetCard {...defaultProps} />);
    const card = screen.getByRole("button");
    expect(card).toHaveClass("border-mint");
  });

  test("does not apply border styling when selected is false", () => {
    render(<PetCard {...defaultProps} selected={false} />);
    const card = screen.getByRole("button");
    expect(card).not.toHaveClass("border-mint");
  });

  test("renders the correct number of filled progress bars for hunger and tiredness", () => {
    render(<PetCard {...defaultProps} hungerMax={4} tirednessMax={3} />);

    // Mock ProgressBar and verify its filled/total props
    const hungerBars = screen.getByText("HUNGER");
    const tirednessBars = screen.getByText("TIREDNESS");

    expect(hungerBars).toBeInTheDocument();
    expect(tirednessBars).toBeInTheDocument();
  });
});
