// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { persistStore } from "redux-persist";
import store from "./Store/store.js"
import { Provider } from 'react-redux'; // Import Provider
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate
import Loadingpage from "./Pages/Common/LoadingPage.jsx"
import './index.css';
import App from './App.jsx';

let persistor = persistStore(store)

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}> 
      <PersistGate loading={<Loadingpage/>} persistor={persistor}> 
        <App />
      </PersistGate>
    </Provider>
  // </StrictMode>
);
