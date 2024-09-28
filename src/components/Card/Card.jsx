import React from "react";
import "./Card.css";

function Card({ name, description, techStack, lastCardRef = null }) {
  return (
    <div className="card-container" ref={lastCardRef}>
      <div className="card">
        <div className="card-heading">
          <span className="card-heading-text">{name}</span>
        </div>
        <div className="card-body">
          <div className="card-description">{description}</div>
        </div>
        <div className="card-footer">
          {techStack.map((tech) => (
            <div className="card-tech-stack" key={tech}>
              {tech}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Card;
