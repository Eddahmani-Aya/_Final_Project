import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";

interface RoleCardProps {
  type: "client" | "prestataire";
  title: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

const RoleCard: React.FC<RoleCardProps> = ({
  type,
  title,
  description,
  features,
  isPopular,
}) => {
  
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isClient = type === "client";
  const bgColor = isClient ? "bg-[#0059B2]" : "bg-[#28282B]";
  const hoverBgColor = isClient ? "hover:bg-[#004a96]" : "hover:bg-[#1f1f22]";
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);

    timeoutRef.current = setTimeout(() => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();

        const offset = 40; 
        const isAbove = rect.top < 0;
        const isBelow = rect.bottom > window.innerHeight;

        if (isAbove) {
          window.scrollBy({
            top: rect.top - offset,
            behavior: "smooth",
          });
        } else if (isBelow) {
          window.scrollBy({
            top: rect.bottom - window.innerHeight + offset,
            behavior: "smooth",
          });
        }
      }
    }, 180);

  };





  const handleMouseLeave = () => {
  setIsHovered(false);

  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }
};


  return (
    <div
      ref={cardRef}  
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2  2xl:-top-6 transform -translate-x-1/2 bg-[#0059B2] text-white text-sm 2xl:text-3xl px-4 2xl:px-6 py-1 2xl:py-2 rounded-full shadow-lg z-10">
          Les plus populaires
        </div>
      )}

      <div
        className={`${bgColor} ${hoverBgColor}
        space-y-3 text-white rounded-3xl
        p-5 lg:p-4 sm:p-6 md:p-8 2xl:p-16
        shadow-2xl transition-all duration-180 ease-out
        transform md:hover:scale-105
        min-h-[120px] lg:min-h-[80px] xl:min-h-[90px]  
        flex flex-col justify-between
        relative overflow-hidden
        w-full sm:max-w-[320px] md:max-w-[300px] lg:max-w-[230px] xl:max-w-[380px] 2xl:max-w-[750px]
        mx-auto`}
      >

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -ml-20 -mb-20"></div>

        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl md:text-[18px] lg:text-[20px] xl:text-2xl 2xl:text-[55px]  font-bold mb-4 lg:mb-3 2xl:mb-12 2xl:mt-4  uppercase tracking-wide text-center">
            {title}
          </h2>

          {/* Container for everything that appears on hover */}
          <div
            className={`transition-all duration-180 overflow-hidden  ${
              isHovered ? "max-h-[400px] 2xl:max-h-[650px] opacity-100 mb-3 xl:mb-2 2xl:mb-10" : "max-h-0 opacity-0"
            }`}
          >
            {/* Description */}
            <hr className="space-y-5 mb-4 lg:mb-2 xl:mb-10" />
            <p className="text-white/90 text-mb: text-xs sm:text-sm md:text-[13px] lg:text-[10px] xl:text-[14px] 2xl:text-[34px] md:text-base lg:text-[10px] xl:text-[18px] 2xl:leading-[48px] leading-relaxed mb-4 xl:mb-10 2xl:mb-14">{description}</p>

             {/* Features list */}
            <ul className="space-y-5 lg:space-y-4 xl:space-y-8 2xl:space-y-18 mb-6 lg:mb-4 2xl:mb-16">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 flex-shrink-0 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-base text-sm sm:text-sm md:text-[13px] lg:text-[12px] xl:text-[16px] 2xl:text-[30px]">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Button */}
            <button onClick={() => navigate(type === "client" ? "/ClientRegister" : "/PrestataireRegister")}
              className={`w-full ${
                isClient
                  ? "bg-[#28282B] hover:bg-[#1f1f22]"
                  : "bg-[#0059B2] hover:bg-[#004a96]"
              } text-white text-sm sm:text-base md:text-[14px] lg:text-[12px] xl:text-[18px] 2xl:text-[30px] px-6 py-2.5 xl:py-3 2xl:py-8 rounded-xl font-semibold tracking-wide shadow-md transition-all duration-300 ease-out hover:shadow-xl active:scale-95`}
            >
              S'inscrire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleCard;