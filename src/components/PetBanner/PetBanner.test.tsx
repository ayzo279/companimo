import { render, screen, waitFor } from "@testing-library/react";
import PetBanner from "./PetBanner";  // adjust the path as needed
import supabase from "../../../utils/supabase";  // adjust the path as needed
import '@testing-library/jest-dom';

// Mock supabase module
jest.mock("../../../utils/supabase", () => ({
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        single: jest.fn(),
      }),
    }),
  }),
}));

describe("PetBanner", () => {
  const mockPetData = {
    hunger_max: 100,
  };

  const defaultProps = {
    name: "Buddy",
    type: "dog",
    age: 3,
    petId: "1",
    hunger: 50,
    friendship: 40,
  };

  // Mock the supabase call before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays loading state initially", () => {
    render(<PetBanner {...defaultProps} />);

    // Check for loading text
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("fetches and displays pet data after loading", async () => {
    // Mock supabase call to return pet data
    (supabase.from("pets").select().eq("id", defaultProps.petId).single as jest.Mock).mockResolvedValue({
      data: mockPetData,
      error: null,
    });

    render(<PetBanner {...defaultProps} />);

    // Wait for loading to finish and the component to render the pet info
    await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());

    // Check if the pet name, type, and age are displayed
    expect(screen.getByText("Buddy")).toBeInTheDocument();
    expect(screen.getByText("🐶")).toBeInTheDocument();
    expect(screen.getByText("AGE")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();

    // Check if the hunger and friendship progress bars are rendered
    expect(screen.getByText("HUNGER")).toBeInTheDocument();
    expect(screen.getByText("FRIENDSHIP")).toBeInTheDocument();
  });

//   it("handles errors when pet data fetch fails", async () => {
//     // Mock supabase call to simulate an error
//     (supabase.from("pets").select().eq("id", defaultProps.petId).single as jest.Mock).mockResolvedValue({
//       data: null,
//       error: { message: "Error fetching data" },
//     });

//     render(<PetBanner {...defaultProps} />);

//     // Wait for loading to finish and the component to render the error
//     await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());

//     // Check if the component handles the error correctly
//     expect(screen.getByText("Error fetching data")).toBeInTheDocument();
//     expect(screen.queryByText("HUNGER")).toBeNull(); // As hunger data wasn't fetched
//   });
});
