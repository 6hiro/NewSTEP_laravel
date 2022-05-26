import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './app/store';

ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
  </React.StrictMode>,
    document.getElementById('app')
)

// import { createRoot } from 'react-dom/client';
// const container = document.getElementById('app');
// const root = createRoot(container!); // createRoot(container!) if you use TypeScript
// root.render(
//   <React.StrictMode>
//   <Provider store={store}>
//     <App />
//   </Provider>
// </React.StrictMode>,
// );