import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { SelectedFlightContext } from "./SelectedFlightContext";
import tombstone from "../assets/tombstone.png";
// import { useQuery } from "react-query";

const Confirmation = () => {
  const { reservation, setReservation, setBookingConfirmed, id } = useContext(
    SelectedFlightContext
  );

  //-----------------------------------------------------------------------------------------------------------
  // Was trying to learn React Query with BrandonBot, so I'll hear for later, try to ignore the commented lines, cheers!
  // const { isLoading, error, data, isFetching } = useQuery(
  //   "Test",
  //   () => fetch(`/api/reservations/${id}`).then((res) => res.json()),
  //   {
  //     onSucess: (data) => {
  //       setReservation(data.data);
  //       setBookingConfirmed(true);
  //       console.log(data);
  //     },
  //   }
  // );

  // useEffect(() => {
  //   setReservation(data.data);
  //   setBookingConfirmed(true);
  // }, [data]);

  // if (isLoading) return "Loading...";
  // if (error) return "An error has occurred: " + error.message;
  //-----------------------------------------------------------------------------------------------------------

  //the old id is displayed for a moment for some reason that I don't understand, so I added the [id] in the dependancy array to change to the corrent new ID after.
  useEffect(() => {
    fetch(`/api/reservations/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setReservation(data.data);
        setBookingConfirmed(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  return (
    <MasterWrapper>
      <Master>
        <Title>Your flight is confirmed!</Title>
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

const Master = styled.div`
  display: flex;
  flex-direction: column;
  width: 550px;
  height: 300px;
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
  width: 200px;
  height: auto;
`;

export default Confirmation;
