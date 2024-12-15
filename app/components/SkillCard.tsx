import React from "react";
import { useRouter } from "next/navigation";

interface SkillCardProps {
  imageSrc: string;
  title: string;
  category: string;
  id: string;
}

const SkillCard: React.FC<SkillCardProps> = ({
  imageSrc,
  title,
  category,
  id,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/skill_card_detail/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-xl w-full"
    >
      <div className="relative w-full h-48 bg-gray">
        <img
          src={imageSrc}
          alt={`${title} skill`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5 bg-beige flex flex-col h-40">
        <h3 className="text-xl font-semibold text-brown mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-base text-gray mb-4 flex-grow line-clamp-3">
          {category}
        </p>
        <button className="px-4 py-2 text-sm font-medium text-white bg-orange rounded-lg hover:bg-orange transition-colors self-start mt-auto">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default SkillCard;
