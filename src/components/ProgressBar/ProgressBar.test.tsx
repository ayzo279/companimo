import { render, screen } from "@testing-library/react";
import ProgressBar from "./ProgressBar";
import "@testing-library/jest-dom";

describe("ProgressBar Component", () => {
  it("renders the correct number of filled and unfilled segments", () => {
    const total = 6;
    const filled = 4;

    render(<ProgressBar total={total} filled={filled} />);

    // Get all elements with class 'bg-mint' (filled segments)
    const filledSegments = screen.getAllByTestId("filled-segment");
    expect(filledSegments).toHaveLength(filled);

    // Get all elements with class 'bg-white' (unfilled segments)
    const unfilledSegments = screen.getAllByTestId("unfilled-segment");
    expect(unfilledSegments).toHaveLength(total - filled);
  });

  it("renders correct segment widths based on total", () => {
    const total = 4;
    const filled = 2;
    const segmentWidth = 12 / total;

    const { container } = render(<ProgressBar total={total} filled={filled} />);

    // Verify width styles for filled segments
    const filledSegments = container.querySelectorAll(".bg-mint");
    filledSegments.forEach((segment) => {
      expect(segment).toHaveStyle(`width: ${segmentWidth}vw`);
    });

    // Verify width styles for unfilled segments
    const unfilledSegments = container.querySelectorAll(".bg-white");
    unfilledSegments.forEach((segment) => {
      expect(segment).toHaveStyle(`width: ${segmentWidth}vw`);
    });
  });
});
