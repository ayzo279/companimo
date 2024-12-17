import React from "react";
import ProgressBar from "../ProgressBar/ProgressBar";

interface PetCardProps {
  id: string;
  type: string;
  hungerMax: number;
  tirednessMax: number;
  selected: boolean;
  handleSelected: (id: string) => void;
}

const PetCard: React.FC<PetCardProps> = ({
  id,
  type,
  hungerMax,
  tirednessMax,
  selected = true,
  handleSelected,
}) => {
  const petIcons: { [type: string]: string } = {
    dog: "🐶",
    cat: "🐱",
    fish: "🐟",
    bird: "🐦",
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={`w-[16vw] h-[20vw] cursor-pointer rounded-2xl shadow-card bg-white flex flex-col justify-center items-center gap-[1vw] ${
        selected && `border-mint border-[0.75vw]`
      }`}
      onClick={() => handleSelected(id)}
    >
      <div className="text-[8vw] leading-none">{petIcons[type]}</div>
      <div className="flex flex-col gap-[1vw]">
        <div className="flex flex-col text-[1vw] font-semibold text-coral items-center gap-[0.2vw]">
          <p>HUNGER</p>
          <ProgressBar filled={hungerMax} total={hungerMax} />
        </div>
        <div className="flex flex-col text-[1vw] font-semibold text-coral items-center gap-[0.3vw]">
          <p>TIREDNESS</p>
          <ProgressBar filled={tirednessMax} total={tirednessMax} />
        </div>
      </div>
    </div>
  );
};

export default PetCard;
