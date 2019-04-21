import './app.css'

import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

// для того чтобы скрыть обводку фокусного элемента!!!
// https://stackoverflow.com/questions/52814241/how-do-i-hide-the-border-around-blueprint-js-switch-component
// https://blueprintjs.com/docs/#core/accessibility.focus-management
import { FocusStyleManager } from '@blueprintjs/core'
FocusStyleManager.onlyShowFocusOnTabs()

import { createGlobalStyle, ThemeProvider } from 'styled-components'

import { Search } from './search'

import dark from './dark'
import light from './light'

const GlobalStyle = createGlobalStyle`

html {
    height: 100%;
    margin: 0;
  }

  body {
    padding: 0;
    margin: 0;
    font-family: Roboto, sans-serif;
    overflow: hidden;
    background-color: white;
    height: 100%;
    margin: 0;
    overflow: hidden !important;
  }

  #app {
    /* background: #272822; */
    min-height: 100%;
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;

    padding: 8px;
  }
`

const search = new Search()

@inject(({ store }) => ({ store }))
@observer
export default class App extends Component {
  render() {
    return (
      <ThemeProvider theme={light}>
        <>
          <GlobalStyle />
          <div style={{ height: '100%', width: '300px' }}>{search.widget}</div>
        </>
      </ThemeProvider>
    )
  }
}
