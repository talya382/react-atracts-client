import { Provider } from 'react-redux'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store } from './app/store.js'
import { LanguageProvider } from "./LanguageContext";


ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </Provider>
);

