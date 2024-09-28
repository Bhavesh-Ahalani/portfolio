import React, { useEffect, useState } from "react";
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import About from "components/About/About";
import Profile from "components/Profile/Profile";
import WorkedWith from "components/WorkedWith/WorkedWith";
import TechStack from "components/TechStack/TechStack";
import LatestWork from "components/LatestWork/LatestWork";
import Footer from "components/Footer/Footer";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleEmailClick = () => {
    window.location.href =
      "mailto:bhavesh.ahalani@gmail.com?subject=Hello%20There!&body=Hi,%20I%20was%20checking%20out%20your%20profile%20and%20would%20like%20to%20get%20in%20touch.";
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <Profile />
        <About />
        <WorkedWith />
        <TechStack />
        <LatestWork />
        <Footer />
        <div
          className={`icon-container ${
            !isScrolled || isHovered ? "contact-icon" : ""
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleEmailClick}
        >
          {!isScrolled || isHovered ? (
            <ChatBubbleIcon />
          ) : (
            <HorizontalRuleIcon />
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
