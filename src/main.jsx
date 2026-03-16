import ReactDOM from 'react-dom/client'
import React from 'react'
import { Provider } from 'react-redux'
import { store } from './app/store.js'
import { LanguageProvider } from "./LanguageContext"
import App from './App.jsx'
import './index.css'
import { createTheme, ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#04140e',
      paper: '#04140e',
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  </Provider>
);