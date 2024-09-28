import React, { useEffect, useRef, useState } from "react";
import "./TextElement.css";

const TextElement = ({ children, textStyle = {} }) => {
  const [redHeight, setRedHeight] = useState(0);
  const elementRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setRedHeight(window.scrollY + 3 * 16); // 20rem in pixels (assuming 1rem = 16px)
    };

    const element = elementRef.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const elementHeight = element.clientHeight;

      handleScroll();

      const redPartHeight = Math.min(
        Math.max(redHeight - top, 0),
        elementHeight
      );
      const redPartStyle = {
        height: `${redPartHeight}px`,
      };

      const redPart = element.querySelector(".red-part");
      if (redPart) {
        Object.assign(redPart.style, redPartStyle);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [redHeight]);

  return (
    <div className="text-element" ref={elementRef} style={{ ...textStyle }}>
      <div className="red-part" style={{ ...textStyle }}>
        {children}
      </div>
      <div style={{ ...textStyle }}>{children}</div>
    </div>
  );
};

export default TextElement;
