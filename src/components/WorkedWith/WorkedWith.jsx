import React from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import "./WorkedWith.css";

function WorkedWith() {
  const workText = `I've worked with the likes of:`;

  const companies = [
    { name: "Soroco", website: "https://soroco.com/" },
    { name: "Cognizant", website: "https://www.cognizant.com/in/en" },
    { name: "TCS", website: "https://www.tcs.com/" },
  ];

  const handleCompanyClick = (website) => {
    window.open(website, "_blank", "noopener noreferrer");
  };

  return (
    <div className="work-wrapper">
      <div className="work-heading">{workText}</div>
      <div className="company-wrapper">
        {companies.map((company) => (
          <div
            key={company.name}
            className="company-link"
            onClick={() => handleCompanyClick(company.website)}
          >
            <OpenInNewIcon /> {company.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkedWith;
