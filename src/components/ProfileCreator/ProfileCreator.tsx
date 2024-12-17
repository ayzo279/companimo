import React, { useState, useEffect } from "react";
import supabase from "../../../utils/supabase";

import { useAuth } from "../../hooks/useAuth";

import PetCard from "../PetCard/PetCard";

const ProfileCreator: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState<string>("");
  const [nameConfirmed, setNameConfirmed] = useState<boolean>(false);
  const [hasProfile, setHasProfile] = useState<boolean>(false);

  const [pets, setPets] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [petName, setPetName] = useState<string>("");

  useEffect(() => {
    const checkUser = async () => {
      const { data: nameData } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("user_id", user.id)
        .single();
      setHasProfile(!!nameData);
    };
    checkUser();
  }, [nameConfirmed, user]);

  useEffect(() => {
    const getPets = async () => {
      const { data: pets, error } = await supabase.from("pets").select();

      if (error) {
        console.error("Error fetching pets", error);
        return;
      }

      if (pets && pets.length > 0) {
        setPets(pets);
      } else {
        console.log("No pets available");
      }
    };

    getPets();
  }, []);

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert("Please provide a name.");
    } else {
      const { data: _, error: profileError } = await supabase
        .from("profiles")
        .upsert([{ user_id: user.id, name: name }], { onConflict: "user_id" });

      if (profileError) {
        throw profileError;
      }
      setNameConfirmed(true);
    }
  };

  const handleSelected = (id: string) => {
    setSelected(id);
  };

  const handlePetSelect = () => {
    if (!selected) {
      alert("Please choose a pet.");
      return;
    } else {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitSelection = async () => {
    if (!petName) {
      alert("Please give your pet a name!");
      return;
    }

    try {
      const userId = user.id;

      const petToAdd = pets.find((pet) => pet.id === selected);

      const petData = {
        user_id: userId,
        pet_id: selected,
        name: petName,
        hunger_level: petToAdd.hunger_max,
        friendship_meter: petToAdd.default_friendship,
        last_fed_at: new Date().toISOString(),
        type: petToAdd.type,
      };

      const { data: _, error: petError } = await supabase
        .from("user_pets")
        .insert([petData]);

      if (petError) {
        throw petError;
      }
    } catch (error: any) {
      alert(`Error saving data ${error.message}`);
    }
  };

  return (
    <div>
      {!hasProfile ? (
        <form
          onSubmit={handleNameSubmit}
          className="flex flex-col items-center gap-[4vw]"
        >
          <div className="pt-[4vw] flex flex-col gap-[1vw] items-center">
            <label className="text-white text-[2vw] font-medium">
              Hello there! What is your name?
            </label>
            <input
              type="text"
              name="name"
              value={name}
              className="w-[30vw] px-[1vw] py-[0.5vw] text-[1.5vw] rounded-xl border-[0.4vw] border-mint"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            />
          </div>
          <button type="submit" className="text-mint font-extrabold text-[2vw]">
            Continue &gt;
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center jsutify-center gap-[4vw]">
          <p className="text-white text-[2vw] font-medium">
            Hi {name}! Choose your first digital learning companion.
          </p>
          <div className="flex gap-[4vw]">
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                id={pet.id}
                type={pet.type}
                hungerMax={pet.hunger_max}
                tirednessMax={3}
                selected={selected === pet.id}
                handleSelected={handleSelected}
              />
            ))}
          </div>
          <button
            onClick={handlePetSelect}
            className="text-mint font-extrabold text-[2vw]"
          >
            Confirm Selection &gt;
          </button>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-[2vw] rounded-xl shadow-lg text-center px-[4vw] pb-[4vw] flex flex-col gap-[2vw]">
            <div className="w-full flex justify-end">
              <button className="text-[1.5vw] font-bold" onClick={closeModal}>
                X
              </button>
            </div>
            <h2 className="text-[2vw] font-bold mb-[1vw]">
              Name your {pets.find((pet) => pet.id === selected).type}!
            </h2>
            <form
              className="flex flex-col items-center gap-[2vw]"
              onSubmit={handleSubmitSelection}
            >
              <input
                type="text"
                className="border-fade border-[0.2vw] px-[0.5vw] py-[0.25vw] text-[1vw] rounded-lg w-[14vw]"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
              />
              <button className="text-white bg-mint w-[10vw] px-[1.5vw] py-[0.25vw] rounded-full text-[1.2vw]">
                Confirm
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCreator;
