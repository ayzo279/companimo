import React, { useEffect, useState } from "react";
import supabase from "../../../utils/supabase";
import ProgressBar from "../ProgressBar/ProgressBar";

interface PetBannerProps {
  name: string;
  type: string;
  age: number;
  petId: string;
  hunger: number;
  friendship: number;
}

const PetBanner: React.FC<PetBannerProps> = ({
  name,
  type,
  age,
  petId,
  hunger,
  friendship,
}) => {
  const petIcons: { [type: string]: string } = {
    dog: "🐶",
    cat: "🐱",
    fish: "🐟",
    bird: "🐦",
  };

  const [hungerMax, setHungerMax] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getPet = async () => {
      try {
        const { data: petData, error: petError } = await supabase
          .from("pets")
          .select()
          .eq("id", petId)
          .single();
        if (petError) {
          throw new Error(petError.message);
        }
        setHungerMax(petData.hunger_max);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    getPet();
  }, []);
  return (
    <div className="w-full flex justify-center py-[2vw]">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex items-center gap-[2vw]">
          <div className="text-[8vw] leading-none">{petIcons[type]}</div>
          <div className="flex gap-[2vw] ">
            <div className="flex flex-col">
              <p className="font-bold text-[2vw]">{name}</p>
              <div className="flex gap-[2vw]">
                <p className="text-coral">AGE</p>
                <p>{age}</p>
              </div>
            </div>
            <div className="flex gap-[1vw] items-center">
              <div className="flex flex-col items-center text-coral gap-[0.5vw]">
                HUNGER <ProgressBar filled={hunger} total={hungerMax} />
              </div>
              <div className="flex flex-col items-center text-coral gap-[0.5vw]">
                FRIENDSHIP{" "}
                <ProgressBar filled={friendship / 5} total={100 / 5} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetBanner;
