import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

import LinearProgress from '@material-ui/core/LinearProgress'
import { withStyles } from '@material-ui/core/styles'

import styled, { withTheme } from 'styled-components'

import { Button, InputGroup, Intent, Position, Tooltip } from '@blueprintjs/core'

// для того чтобы скрыть обводку фокусного элемента!!!
// https://stackoverflow.com/questions/52814241/how-do-i-hide-the-border-around-blueprint-js-switch-component
// https://blueprintjs.com/docs/#core/accessibility.focus-management
// import { FocusStyleManager } from '@blueprintjs/core'
// FocusStyleManager.onlyShowFocusOnTabs()

const hashlessFileName = fileName => fileName.replace(/(.*)(-[0-9a-f]*)(\..*)/, (match, p1, p2, p3) => `${p1}${p3}`)

const Progress = withStyles({
  container: {
    flexGrow: 1
  },
  root: {
    position: 'relative',
    overflow: 'hidden',
    height: 2,
    marginTop: 8
  },
  linearColorPrimary: {
    backgroundColor: '#428dc3'
  },
  linearBarColorPrimary: {
    backgroundColor: '#1371b4'
  }
})(({ classes }) => (
  <div className={classes.container}>
    <LinearProgress
      classes={{
        root: classes.root,
        colorPrimary: classes.linearColorPrimary,
        barColorPrimary: classes.linearBarColorPrimary
      }}
    />
  </div>
))

const CaseSensitiveButton = ({ caseSensitive, onClick }) => (
  <Tooltip
    // isOpen={true}
    content={<span style={{ fontSize: '10px' }}>Case Sensitive</span>}
    position={Position.BOTTOM}
    usePortal={false}
    hoverOpenDelay={1000}
    inheritDarkTheme={false}
  >
    <Button
      style={{ padding: '0px' }}
      active={caseSensitive}
      icon={<img draggable={false} src="./assets/ui/case_sensitive.svg" width={16} height={16} />}
      minimal={true}
      small={true}
      intent={Intent.PRIMARY}
      onClick={onClick}
    />
  </Tooltip>
)

@observer
export class Search extends Component {
  handleQueryChange = event => {
    this.props.store.setQuery(event.target.value)
  }

  toggleCaseSensitive = () => {
    const {
      store: { setCaseSensitive, caseSensitive }
    } = this.props
    setCaseSensitive(!caseSensitive)
  }

  renderSearchResult = () => {
    const {
      store: { searchResult }
    } = this.props

    if (!searchResult) {
      return null
    }

    if (searchResult.length === 0) {
      return <p>No results found.</p>
    }

    return (
      <ul>
        {searchResult.map(({ text, line, file, path, matches }, i) => {
          return (
            <li key={`${path}/${file}_${i}`}>
              <span>{hashlessFileName(file)}</span>
              {'\u00a0'}
              <span>{path}</span>
              {'\u00a0'}
              <span
                style={{ backgroundColor: 'lightgreen', borderRadius: '50%', paddingLeft: '5px', paddingRight: '5px' }}
              >
                {matches.length}
              </span>
              <ul>
                {matches.map(([first, last]) => {
                  const beforeMatch = text.slice(0, first)
                  const matched = text.slice(first, last + 1)
                  const afterMatch = text.slice(last + 1)
                  const key = `${path}/${file}:${line}:${first}`
                  return (
                    <li
                      key={key}
                      onClick={() => {
                        console.log(key)
                      }}
                    >
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
    const { caseSensitive, query, search, searchInProgress } = this.props.store

    const onKeyDown = event => {
      if (event.key === 'Enter') {
        event.preventDefault()
        search()
      }
    }

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <InputGroup
          leftIcon="search"
          onChange={this.handleQueryChange}
          placeholder="Search"
          rightElement={<CaseSensitiveButton caseSensitive={caseSensitive} onClick={this.toggleCaseSensitive} />}
          small={true}
          value={query}
          onKeyDown={onKeyDown}
        />

        {!!searchInProgress && <Progress />}
        {this.renderSearchResult()}
      </div>
    )
  }
}
