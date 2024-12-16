import React from "react";
import supabase from "../../../utils/supabase";

const ProfileCreator: React.FC = () => {
  const signOut = async () => {
    await supabase.auth.signOut();
    console.log("User signed out");
  };

  return (
    <div>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

export default ProfileCreator;
