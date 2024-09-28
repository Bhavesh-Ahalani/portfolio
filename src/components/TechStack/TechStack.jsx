import React from "react";
import "./TechStack.css";
import skills from "../../constants/skills.json";

function TechStack() {
  const techStackTitle = `Tech Stack: `;

  const handleSkillClick = (url) => {
    window.open(url, "_blank"); // Open the URL in a new tab
  };

  return (
    <div className="tech-stack-wrapper">
      <div className="tech-stack-title">{techStackTitle}</div>
      <div className="skillset-wrapper">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="skillset-content"
            onClick={() => handleSkillClick(skill.url)} // Click event for redirect
          >
            <img
              className="skillset"
              src={`${process.env.PUBLIC_URL}/assets/icons/${skill.iconName}.svg`}
              alt={skill.name} // Added alt text for accessibility
            />
            <div className="skillset-name">{skill.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TechStack;
