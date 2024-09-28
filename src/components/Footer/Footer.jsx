import React from "react";
import "./Footer.css";
import footer from "../../constants/footer.json";

const Footer = () => {
  return (
    <footer className="footer">
      {footer.map((link, index) => (
        <a
          key={index}
          href={
            link.href.startsWith("/assets/")
              ? `${process.env.PUBLIC_URL}${link.href}`
              : link.href
          }
          download={link.download}
          target={link.target || undefined}
          rel={link.rel}
          className="footer-icon"
        >
          <img
            src={`${process.env.PUBLIC_URL}${link.imgSrc}`}
            alt={link.altText}
          />
        </a>
      ))}
    </footer>
  );
};

export default Footer;
