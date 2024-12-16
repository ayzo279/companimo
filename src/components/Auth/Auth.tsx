// src/components/Auth.tsx
import React, { useState } from "react";
import supabase from "../../../utils/supabase";
import { useAuth } from "../../hooks/useAuth";

const Auth: React.FC = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState<boolean>(false); // Toggle state for sign-up or sign-in

  // Sign Up Function
  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      console.log("Check your email for the verification link");
    }
  };

  // Sign In Function
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      console.log("Successfully signed in");
    }
  };

  // Sign Out Function
  const signOut = async () => {
    await supabase.auth.signOut();
    console.log("User signed out");
  };

  // If user is authenticated, show the profile view
  if (user) {
    return (
      <div>
        <h1>Welcome, {user.email}</h1>
        <button onClick={signOut}>Sign Out</button>
      </div>
    );
  }

  // Show the form depending on whether user is signing up or signing in
  return (
    <div className="h-[32vw] w-[30vw] bg-white shadow-card rounded-xl flex flex-col justify-center items-center gap-[4vw]">
      <p className="text-[2vw]">
        {isSignUp ? "Create an account" : "Sign into your account"}
      </p>

      <div className="flex flex-col gap-[2vw]">
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
            className="h-[2vw] w-[20vw] border-2 border-fade rounded-lg px-[1vw] py-[1.2vw] placeholder-fade"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-[2vw] w-[20vw] border-2 border-fade rounded-lg px-[1vw] py-[1.2vw] placeholder-fade"
        />
      </div>
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="bg-mint w-[20vw] flex justify-center text-white font-bold rounded-3xl py-[0.5vw]">
          {isSignUp ? (
            <button onClick={() => signUp(email, password)} className="w-full h-full">
              Create an account
            </button>
          ) : (
            <button onClick={() => signIn(email, password)} className="w-full h-full">Sign In</button>
          )}
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Link to toggle between Sign In and Sign Up */}
        <div className="text-[0.9vw]">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-mint font-medium"
          >
            {isSignUp ? "Sign In" : "Create an account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
