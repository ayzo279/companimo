import React, { useEffect, useState } from "react";
import logo from "../../assets/img/companimo_logo.png";

import { useAuth } from "../../hooks/useAuth";
import supabase from "../../../utils/supabase";
import PetBanner from "../PetBanner/PetBanner";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [userPets, setUserPets] = useState<any[]>([]);

  useEffect(() => {
    const retrievePets = async () => {
      try {
        const { data: userPetData, error: userPetError } = await supabase
          .from("user_pets")
          .select("*")
          .eq("user_id", user.id);
        if (userPetError) throw new Error(userPetError.message);

        setUserPets(userPetData);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    retrievePets();
  }, [user]);

  return (
    <div className="h-[100vh] w-[100vw] bg-white">
      <div className="flex items-center justify-center bg-coral w-full h-[12vh]">
        <img src={logo} className="h-[8vh]" />
      </div>
      <div className="text-black">
        {userPets.length !== 0 && userPets.map((pet) => <div key={pet.id}>
          <PetBanner key={pet.id} name={pet.name} type={pet.type} age={pet.age} petId={pet.pet_id} hunger={pet.hunger_level} friendship={pet.friendship_meter}/>
        </div>)}
      </div>
    </div>
  );
};

export default Dashboard;
