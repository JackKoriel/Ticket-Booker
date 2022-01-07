import React, { createContext, useState, useEffect } from "react";

export const SelectedFlightContext = createContext();

export const SelectedFlightProvider = ({ children }) => {
  const [selectFlight, setSelectFlight] = useState("select");
  const [reservation, setReservation] = useState([]);
  const [id, setId] = useState(null);

  useEffect(() => {
    let _id = window.localStorage.getItem("reservation");
    _id !== null ? setId(JSON.parse(_id)) : setId(null);
  }, [reservation]);

  const [bookingConfirmed, setBookingConfirmed] = useState(id !== null);

  return (
    <SelectedFlightContext.Provider
      value={{
        selectFlight,
        setSelectFlight,
        reservation,
        setReservation,
        bookingConfirmed,
        setBookingConfirmed,
        id,
      }}
    >
      {children}
    </SelectedFlightContext.Provider>
  );
};
