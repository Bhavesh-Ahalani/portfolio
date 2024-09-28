import React from "react";
import "./About.css";

function About() {
  const aboutText = `Hi, I’m Bhavesh, a full-stack developer`;
  const aboutContent = `With over a 5 years of experience in multiple disciplines, I work with companies to create intuitive and engaging digital experiences.`;

  return (
    <div className="About" id="about">
      <div className="about-wrapper">
        <div className="about-heading">{aboutText}</div>
        <div className="about-content">{aboutContent}</div>
      </div>
    </div>
  );
}

export default About;
