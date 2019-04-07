import './app.css'

// для того чтобы скрыть обводку фокусного элемента!!!
// https://stackoverflow.com/questions/52814241/how-do-i-hide-the-border-around-blueprint-js-switch-component
// https://blueprintjs.com/docs/#core/accessibility.focus-management
import { FocusStyleManager } from "@blueprintjs/core";
FocusStyleManager.onlyShowFocusOnTabs();

import React, { Component } from "react";
import { observer, inject } from "mobx-react";


import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';

import { Button, Checkbox, InputGroup, Intent } from "@blueprintjs/core";


const Progress = withStyles({
  container: {
    flexGrow: 1
  },
  root: {
    position: 'relative',
    overflow: 'hidden',
    height: 2,
  },
  linearColorPrimary: {
    backgroundColor: '#428dc3',
  },
  linearBarColorPrimary: {
    backgroundColor: '#1371b4',
  },
})(({ classes }) => (
  <div className={classes.container}>
    <LinearProgress classes={{
      root: classes.root,
      colorPrimary: classes.linearColorPrimary,
      barColorPrimary: classes.linearBarColorPrimary,
    }} />
  </div>
))


@inject(({ store }) => ({ store }))
@observer
export default class App extends Component {
  constructor(props) {
    super(props);
    this.hash = window.location.hash.replace("#", "");
  }

  handleQueryChange = event => {
    this.props.store.setQuery(event.target.value)
  }

  handleCaseSesitiveChange = event => {
    this.props.store.setCaseSensitive(event.target.checked)
  }

  renderSearchResult = () => {
    const { store: { searchResult } } = this.props;

    if (!searchResult) {
      return null
    }

    if (searchResult.length === 0) {
      return <p>No results found.</p>
    }

    return (
      <ul>
        {searchResult.map(({ text, line, file, path, matches }) => {

          return (
            <li key={`${path}/${file}`}>
              <span>{file}</span>{"\u00a0"}<span>{path}</span>{"\u00a0"}<span style={{ backgroundColor: 'lightgreen', borderRadius: '50%', paddingLeft: '5px', paddingRight: '5px' }}>{matches.length}</span>
              <ul>
                {matches.map(([first, last]) => {
                  const beforeMatch = text.slice(0, first)
                  const matched = text.slice(first, last + 1)
                  const afterMatch = text.slice(last + 1)
                  return (
                    <li key={`${path}/${file}:${line}:${first}`} onClick={() => { console.log(`${path}/${file}:${line}:${first}`) }}>
                      <span>{beforeMatch}</span>
                      <span style={{ backgroundColor: 'yellow' }}>{matched}</span>
                      <span>{afterMatch}</span>
                    </li>
                  )
                })}
              </ul>
            </li>
          )
        })}
      </ul>
    )
  }

  render() {
    const { store: { search, openFile, projectPath, query, searchInProgress, caseSensitive } } = this.props;

    if (!projectPath) {
      return (
        <button onClick={openFile}>Select Folder</button>
      )
    }

    const SearchButton = <Button icon="search" minimal={true} small={true} intent={Intent.PRIMARY} onClick={search} /> // arrow-right

    return (
      <div style={{ width: '200px' }}>
        <InputGroup
          // leftIcon="search"
          onChange={this.handleQueryChange}
          placeholder="Search"
          rightElement={SearchButton}
          small={true}
          value={query}
        />

        <Checkbox
          className="bp3-align-right"
          label="Case Sensitive"
          checked={caseSensitive}
          onChange={this.handleCaseSesitiveChange}
        />
        {!!searchInProgress && <Progress />}
        {this.renderSearchResult()}
      </div >
    )

  }
}
