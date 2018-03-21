import React, { Component } from 'react';

import './App.css';
import 'react-widgets/dist/css/react-widgets.css';
import { CookiesProvider } from 'react-cookie';

import { I18n } from 'react-i18next';

import Root from './components/Root';

class App extends Component {
  render() {
    return (
     
      <I18n ns="translations">
      {
        (t, { i18n })=>(
          <CookiesProvider>
          <Root i18n={i18n} />
          </CookiesProvider>
        )
      }
      </I18n>
     
    );
  }
}

export default App;
