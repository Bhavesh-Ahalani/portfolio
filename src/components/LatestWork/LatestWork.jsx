import React, { useEffect, useRef } from "react";
import "./LatestWork.css";
import projects from "../../constants/projects.json";
import Card from "components/Card/Card";

function LatestWork() {
  const titleRef = useRef(null);
  const lastCardRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const title = titleRef.current;
      const lastCard = lastCardRef.current;

      if (title && lastCard) {
        const lastCardRect = lastCard.getBoundingClientRect();
        const titleRect = title.getBoundingClientRect();

        if (lastCardRect.bottom - titleRect.height < titleRect.height) {
          title.style.opacity = "0";
        } else {
          title.style.opacity = "1";
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const title = `LATEST WORK`;

  return (
    <div className="latest-work">
      <div ref={titleRef} className="latest-work-title">
        {title}
      </div>
      {projects.map((project, index) => {
        if (index === projects.length - 1) {
          return (
            <Card
              key={index}
              {...project}
              lastCardRef={lastCardRef} // Pass the ref to the last card
            />
          );
        }
        return <Card key={index} {...project} />;
      })}
    </div>
  );
}

export default LatestWork;
