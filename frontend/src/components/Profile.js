import React from "react";
import styled from "styled-components";
import Image from "../assets/OnePiece.jpg";

const Profile = () => {
  return (
    <CommingSoon>
      <img src={Image} />
    </CommingSoon>
  );
};

const CommingSoon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.9;
`;

export default Profile;
