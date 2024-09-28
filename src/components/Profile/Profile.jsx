import React from "react";
import "./Profile.css";
import MouseWheel from "components/MouseWheel/MouseWheel";

function Profile() {
  return (
    <div className="Profile">
      <div className="profile-wrapper">
        <div className="profile-wrapper-background" />
        <img
          className="profile-image"
          src={`${process.env.PUBLIC_URL}/assets/images/profile_no_bg.png`}
          alt="Bhavesh Ahalani"
        />
        <h1 className="text-color">Bhavesh Ahalani</h1>
      </div>
      <MouseWheel />
    </div>
  );
}

export default Profile;
