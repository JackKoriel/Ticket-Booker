import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { SelectedFlightProvider } from "./components/SelectedFlightContext";
// import { QueryClient, QueryClientProvider, } from "react-query";

// const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    {/* <QueryClientProvider client={queryClient}> */}
    <SelectedFlightProvider>
      <App />
    </SelectedFlightProvider>
    {/* </QueryClientProvider> */}
  </React.StrictMode>,
  document.getElementById("root")
);
