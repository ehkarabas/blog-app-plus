import { ThemeProvider, createTheme } from "@mui/material";
import { Provider, useSelector } from "react-redux";
import store, { persistor } from "./app/store";
import { PersistGate } from "redux-persist/integration/react";
import AppRouter from "./rooter/AppRouter";
import ThemeProviderWrapper from "./components/ThemeProviderWrapper";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProviderWrapper>
          <div className="App flex flex-col min-h-screen">
            <AppRouter />
          </div>
          <ToastContainer />
        </ThemeProviderWrapper>
      </PersistGate>
    </Provider>
  );
}

export default App;
