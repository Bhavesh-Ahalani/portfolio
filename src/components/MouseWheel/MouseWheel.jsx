import React from "react";
import "./MouseWheel.css";

function MouseWheel() {
  const handleClick = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="mouse-icon"
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <div className="mouse-icon_wheel"></div>
    </div>
  );
}

export default MouseWheel;
