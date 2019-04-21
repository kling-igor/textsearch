import React from 'react'
import { render } from 'react-dom'
import App from './app'
import { Provider } from 'mobx-react'

// import store from "./store";
// import store from './fake-store'

render(
  // <Provider store={store}>
  <App />,
  // </Provider>
  document.getElementById('app')
)
