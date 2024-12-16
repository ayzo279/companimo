import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Auth from "./Auth";
import { useAuth } from "../../hooks/useAuth";
import supabase from "../../../utils/supabase";

jest.mock("../../hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../../utils/supabase", () => ({
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
  },
}));

describe("Auth Component", () => {
  const mockSignUp = supabase.auth.signUp as jest.Mock;
  const mockSignInWithPassword = supabase.auth.signInWithPassword as jest.Mock;
  const mockSignOut = supabase.auth.signOut as jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();

    // Default mock implementation for useAuth
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
    });
  });

  it("renders the sign-in form when no user is signed in", () => {
    render(<Auth />);
    expect(screen.getByText("Sign into your account")).toBeInTheDocument();
  });

  it("allows toggling between sign-in and sign-up forms", () => {
    render(<Auth />);

    // Initially in sign-in mode
    fireEvent.click(screen.getByRole("button", { name: /create an account/i }));
    expect(screen.getByRole("button", { name: /create an account/i })).toBeInTheDocument();

    // Toggle back to sign-in mode
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(screen.getByText("Sign into your account")).toBeInTheDocument();
  });

  it("calls signUp function with correct arguments when signing up", async () => {
    mockSignUp.mockResolvedValueOnce({ error: null });
    render(<Auth />);

    fireEvent.click(screen.getByRole("button", { name: /create an account/i }));

    fireEvent.change(screen.getByPlaceholderText("email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create an account/i }));
    expect(mockSignUp).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("displays an error message if signUp fails", async () => {
    mockSignUp.mockResolvedValueOnce({
      error: { message: "Sign-up failed" },
    });

    render(<Auth />);
    fireEvent.click(screen.getByRole("button", { name: /create an account/i }));

    fireEvent.change(screen.getByPlaceholderText("email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create an account/i }));

    expect(await screen.findByText("Sign-up failed")).toBeInTheDocument();
  });

  it("calls signIn function with correct arguments when signing in", async () => {
    mockSignInWithPassword.mockResolvedValueOnce({ error: null });
    render(<Auth />);

    fireEvent.change(screen.getByPlaceholderText("email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Sign In"));
    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("displays an error message if signIn fails", async () => {
    mockSignInWithPassword.mockResolvedValueOnce({
      error: { message: "Sign-in failed" },
    });

    render(<Auth />);

    fireEvent.change(screen.getByPlaceholderText("email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Sign In"));

    expect(await screen.findByText("Sign-in failed")).toBeInTheDocument();
  });

  it("renders the welcome message and sign-out button when a user is authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: "test@example.com" },
    });

    render(<Auth />);
    expect(screen.getByText("Welcome, test@example.com")).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });

  it("calls signOut function when signing out", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: "test@example.com" },
    });

    render(<Auth />);
    fireEvent.click(screen.getByText("Sign Out"));
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
