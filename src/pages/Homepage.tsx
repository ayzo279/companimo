import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import supabase from "../../utils/supabase";
import logo from "../assets/img/companimo_logo.png";

import Auth from "../components/Auth/Auth";
import ProfileCreator from "../components/ProfileCreator/ProfileCreator";
import Dashboard from "../components/Dashboard/Dashboard";

const Homepage: React.FC = () => {
  const { user } = useAuth(); 
  const [profileCreated, setProfileCreated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if the user is logged in and if the profile is created
  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      try {
        if (!user) {
          setLoading(false);
          return; // No user logged in
        }

        // Check if the user's profile exists in the `profiles` table
        const { data, error } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("user_id", user.id)
          .single(); // Fetch the profile row for the logged-in user

        if (error && error.code !== "PGRST116") {
          // Handle unexpected errors (not a "row not found" error)
          console.error("Error checking profile:", error.message);
        }

        setProfileCreated(!!data); // If data exists, profile is created
      } catch (err) {
        console.error("Error checking user or profile:", err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while checking user/profile
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
    <img src={logo} className="w-[20vw] pt-[4vw] pb-[2vw]" />
      {!user ? <Auth /> : !profileCreated ? <ProfileCreator /> : <Dashboard />}
    </div>
  );
};

export default Homepage;
