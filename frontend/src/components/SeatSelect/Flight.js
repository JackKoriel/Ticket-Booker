import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { SelectedFlightContext } from "../SelectedFlightContext";

const Flight = () => {
  const { selectFlight, setSelectFlight } = useContext(SelectedFlightContext);
  const [flights, setFlights] = useState([]);
  // console.log("flight is: ", flights);

  const handleChange = (event) => {
    setSelectFlight(event.target.value);
  };

  useEffect(() => {
    fetch(`/api/flights`)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setFlights(data.data);
      })
      .catch((err) => {
        // setErrorStatus(true);
        console.log(err);
      });
  }, []);

  return (
    <Master>
      <Text>FLIGHT NUMBER : </Text>
      <div>
        <Select
          style={{ backgroundColor: "white", color: "black", width: "150px" }}
          variant="outlined"
          id="simple-select"
          value={selectFlight}
          label="Flight"
          onChange={handleChange}
        >
          <option value="select">Select flight</option>
          {flights.map((flight, index) => {
            return (
              <option key={index} value={flight}>
                {flight}
              </option>
            );
          })}
        </Select>
      </div>
    </Master>
  );
};

const Master = styled.div`
  display: flex;
  flex-direction: row;
  background: var(--color-cadmium-red);
  width: 100%;
  height: 80px;
  align-items: center;
  padding-left: 20px;
`;

const Text = styled.h2`
  margin-right: 20px;
`;

const Select = styled.select`
  border-radius: 4px;
  border: none;
  padding: 10px 0;
  font-family: var(--font-body);
  font-size: 15px;
`;

export default Flight;
