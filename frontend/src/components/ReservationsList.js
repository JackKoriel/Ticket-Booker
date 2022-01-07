import React, { useContext, useEffect } from "react";
import { SelectedFlightContext } from "./SelectedFlightContext";
import styled from "styled-components";
import tombstone from "../assets/tombstone.png";
import { useHistory } from "react-router-dom";

const ReservationsList = () => {
  let history = useHistory();
  const { reservation, setReservation, setBookingConfirmed, id } = useContext(
    SelectedFlightContext
  );

  useEffect(() => {
    fetch(`/api/reservations/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setReservation(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const deleteHandle = () => {
    fetch(`/api/reservations/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          window.localStorage.removeItem("reservation");
          history.push(`/`);
          setBookingConfirmed(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <MasterWrapper>
      <DivMaster>
        <ButtonDiv>
          <Button>UPDATE</Button>
          <Button onClick={deleteHandle}>DELETE</Button>
        </ButtonDiv>
        <Master>
          <Title>Below is your reservation, Good Luck!</Title>
          <Container>
            <DivText>
              <Span>Reservation #: </Span> {reservation._id}
            </DivText>
            <DivText>
              <Span>Flight #: </Span> {reservation.flight}
            </DivText>
            <DivText>
              <Span>Seat #: </Span> {reservation.seat}
            </DivText>
            <DivText>
              <Span>Name: </Span> {reservation.givenName} {reservation.surname}
            </DivText>
            <DivText>
              <Span>Email: </Span> {reservation.email}
            </DivText>
          </Container>
        </Master>
        <ImageDiv src={tombstone} />
      </DivMaster>
    </MasterWrapper>
  );
};

const MasterWrapper = styled.div`
  font-family: var(--font-body);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 200px;
`;
const DivMaster = styled.div`
  width: 550px;
  height: 300px;
`;
const Master = styled.div`
  display: flex;
  flex-direction: column;

  border: 2px solid var(--color-cadmium-red);
  border-radius: 10px;
  padding: 20px;
  justify-content: flex-start;
`;

const Title = styled.h2`
  border-bottom: 2px solid var(--color-cadmium-red);
  color: var(--color-cadmium-red);
  font-size: 25px;
  font-family: var(--font-body);
  padding-bottom: 10px; ;
`;
const Container = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  /* align-items: center; */
  gap: 20px;
  font-size: 20px;
`;
const DivText = styled.div`
  display: flex;
  flex-direction: row;
`;
const Span = styled.div`
  font-weight: 900;
`;

const ImageDiv = styled.img`
  margin-top: 20px;
  margin-left: 170px;
  width: 200px;
  height: auto;
`;
const ButtonDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: inherit;
  /* border: red solid 1px; */
  gap: 70px;
  margin-bottom: 10px;
`;
const Button = styled.button`
  width: 300px;
  height: 50px;
  color: var(--color-desert-sand);
  background-color: #cc5404;
  border-radius: 10px;
  border: none;
  font-family: var(--font-heading);
  /* margin-left: 25px; */
  margin-top: 10px;
  &:hover {
    cursor: pointer;
  }
  &:active {
    opacity: 0.8;
  }
`;

export default ReservationsList;
