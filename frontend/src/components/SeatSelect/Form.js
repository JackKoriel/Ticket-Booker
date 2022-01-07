import React, { useState, useContext } from "react";
import styled from "styled-components";
import { SelectedFlightContext } from "../SelectedFlightContext";
import { useHistory } from "react-router-dom";

const Form = ({ seatNum }) => {
  let history = useHistory();
  const { selectFlight, setBookingConfirmed } = useContext(
    SelectedFlightContext
  );
  const [givenName, setFirstName] = useState("");
  const [surname, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const handleChangeFirstName = (event) => {
    // console.log(event.target.value);
    setFirstName(event.target.value);
  };

  const handleChangeLastName = (event) => {
    // console.log(event.target.value);
    setLastName(event.target.value);
  };

  const handleChangeEmail = (event) => {
    // console.log(event.target.value);
    setEmail(event.target.value);
  };

  const handleReserve = (ev) => {
    ev.preventDefault();

    fetch("/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        flight: selectFlight,
        seat: seatNum,
        givenName: givenName,
        surname: surname,
        email: email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log("Post", data);
        if (data.status === 201) {
          window.localStorage.setItem(
            "reservation",
            JSON.stringify(data.data._id)
          );
          setBookingConfirmed(true);
          history.push(`/confirmed`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Master>
      <SubmitForm action="/action_page.php">
        <FirstName>
          <input
            type="text"
            id="fname"
            name="fname"
            placeholder="First name"
            onChange={handleChangeFirstName}
          />
        </FirstName>
        <LastName>
          <input
            type="text"
            id="lname"
            name="lname"
            placeholder="Last name"
            onChange={handleChangeLastName}
          />
        </LastName>
        <Email>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            onChange={handleChangeEmail}
            required
          />
        </Email>
        <SubmitButton
          type="submit"
          value="Confirm"
          onClick={(ev) => {
            handleReserve(ev);
          }}
        />
      </SubmitForm>
    </Master>
  );
};

const Master = styled.div`
  display: flex;
  flex-direction: column;
  border: 4px solid var(--color-alabama-crimson);
  border-radius: 10px;
`;

const SubmitForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 80%;
  height: 80%;
  justify-content: center;
  align-items: center;
  margin: 20px;
`;

const FirstName = styled.div`
  font-size: 15px;
  padding: 10px;
  width: 100%;
  height: 50px;
  border-radius: 10px;
`;

const LastName = styled.div`
  font-size: 15px;
  padding: 10px;
  width: 100%;
  height: 50px;
  border-radius: 10px;
`;

const Email = styled.div`
  font-size: 15px;
  padding: 10px;
  width: 100%;
  height: 50px;
  border-radius: 10px;
`;

const SubmitButton = styled.input`
  width: 300px;
  height: 50px;
  color: var(--color-desert-sand);
  background-color: #cc5404;
  border-radius: 10px;
  font-family: var(--font-heading);
  margin-left: 25px;
  margin-top: 10px;
  &:hover {
    cursor: pointer;
  }
  &:active {
    opacity: 0.8;
  }
`;

export default Form;
