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

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("user_pets")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error && error.code !== "PGRST116") {
          console.error("Error checking profile:", error.message);
        }

        setProfileCreated(!!data);
      } catch (err) {
        console.error("Error checking user or profile:", err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {!user || !profileCreated ? <img src={logo} className="w-[20vw] pt-[4vw] pb-[2vw]" /> : ""}
      {!user ? <Auth /> : !profileCreated ? <ProfileCreator /> : <Dashboard />}
    </div>
  );
};

export default Homepage;
