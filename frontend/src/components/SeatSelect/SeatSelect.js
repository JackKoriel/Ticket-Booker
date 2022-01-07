import React, { useState, useContext } from "react";
import styled from "styled-components";
import Plane from "./Plane";
import Form from "./Form";
import Flight from "./Flight";
import { SelectedFlightContext } from "../SelectedFlightContext";

const SeatSelect = ({}) => {
  const [seating, setSeating] = useState([]);
  const [seatNum, setSeatNum] = useState(null);
  const { selectFlight } = useContext(SelectedFlightContext);

  return (
    <Master>
      <Flight />
      <ContainerBody>
        <H2>Select your seat and Provide your information!</H2>
        <ContainerBooking>
          <Plane
            seating={seating}
            setSeating={setSeating}
            setSeatNum={setSeatNum}
          />
          {selectFlight !== "select" && <Form seatNum={seatNum} />}
        </ContainerBooking>
      </ContainerBody>
    </Master>
  );
};

const Master = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const H2 = styled.h2`
  margin-top: 15px; ;
`;

const ContainerBody = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContainerBooking = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export default SeatSelect;
