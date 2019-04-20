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

import { Button, InputGroup, Intent, Position, Tooltip } from "@blueprintjs/core";


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


  toggleCaseSensitive = () => {
    const { store: { setCaseSensitive, caseSensitive } } = this.props
    setCaseSensitive(!caseSensitive)
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

    const ButtonIcon = <img draggable={false} src="./assets/ui/case_sensitive.svg" width={16} height={16} />

    const CaseSensitiveButton = (
      <Tooltip
        isOpen={true}
        content={<span style={{ fontSize: '10px' }}>Case Sensitive</span>}
        position={Position.BOTTOM}
        usePortal={false}
        hoverOpenDelay={1000}
        inheritDarkTheme={false}
      >
        <Button style={{ padding: '0px' }} active={caseSensitive} icon={ButtonIcon} minimal={true} small={true} intent={Intent.PRIMARY} onClick={this.toggleCaseSensitive} />
      </Tooltip>
    )

    return (
      <div style={{ width: '200px' }}>
        <InputGroup
          // leftIcon="search"
          onChange={this.handleQueryChange}
          placeholder="Search"
          rightElement={CaseSensitiveButton}
          small={true}
          value={query}
          onKeyDown={(ev) => {
            if (ev.key === 'Enter') {
              ev.preventDefault();
              search()
            }
          }}
        />

        {/* <Checkbox
          className="bp3-align-right"
          label="Case Sensitive"
          checked={caseSensitive}
          onChange={this.handleCaseSesitiveChange}
        /> */}

        {/* <p>Search in:</p>
        <Checkbox
          className="bp3-align-right"
          label="controllers"
          checked={caseSensitive}
          onChange={this.handleCaseSesitiveChange}
        />
        <Checkbox
          className="bp3-align-right"
          label="services"
          checked={caseSensitive}
          onChange={this.handleCaseSesitiveChange}
        />
        <Checkbox
          className="bp3-align-right"
          label="views"
          checked={caseSensitive}
          onChange={this.handleCaseSesitiveChange}
        />
        <Checkbox
          className="bp3-align-right"
          label="styles"
          checked={caseSensitive}
          onChange={this.handleCaseSesitiveChange}
        />
        <Checkbox
          className="bp3-align-right"
          label="models"
          checked={caseSensitive}
          onChange={this.handleCaseSesitiveChange}
        /> */}

        {!!searchInProgress && <Progress />}
        {this.renderSearchResult()}
      </div >
    )

  }
}
