import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

import { basename, dirname, extname } from 'path'

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

const CaseSensitiveButton = ({ caseSensitive, onClick }) => {
  const buttonStyle = { padding: '0px' }
  const Icon = () => <img draggable={false} src="./assets/ui/case_sensitive.svg" width={16} height={16} />
  const TooltipContent = () => <span>Case Sensitive</span>
  return (
    <Tooltip
      // isOpen={true}
      content={<TooltipContent />}
      position={Position.BOTTOM}
      usePortal={false}
      hoverOpenDelay={1000}
      inheritDarkTheme={false}
    >
      <Button
        style={buttonStyle}
        active={caseSensitive}
        icon={<Icon />}
        minimal={true}
        small={true}
        intent={Intent.PRIMARY}
        onClick={onClick}
      />
    </Tooltip>
  )
}

const ListStyle = styled.ul`
  position: relative;
  padding: 0;
  margin: 0px;
  margin-top: 0px;
  font-size: 13px;
  font-family: 'Open Sans', sans-serif;
  white-space: nowrap;
  overflow-y: auto;
  overflow-x: auto;
  /* text-overflow: ellipsis; */
  width: 100%;
  height: 100%;
`

const ListItemIconStyle = styled.img`
  margin-right: 4px;
`

const ListItemLabelStyle = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ListItemFilenameStyle = styled.span`
  white-space: nowrap;
  /* overflow: hidden;
  text-overflow: ellipsis; */
`

const ListItemFolderameStyle = styled.span`
  white-space: nowrap;
  /* overflow: hidden; */
  /* text-overflow: ellipsis; */
  font-size: 11px;
  line-height: 1em;
  opacity: 0.7;
`
const NodeArrowStyle = styled.span`
  color: ${({ theme: { type } }) => (type === 'dark' ? 'white' : 'black')};
  margin-right: 6px;
  display: inline-block;
  transform: ${({ ellapsed }) => (ellapsed ? 'rotate(-45deg)' : 'rotate(-90deg)')};
  transition: transform 200ms cubic-bezier(0.4, 1, 0.75, 0.9);

  ::after {
    content: '▾';
  }
`

const ListItemInnerContainerStyle = styled.span`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  margin-left: ${({ isNode }) => `${isNode ? 8 : 28}px`};
`

const ListItemContainerStyle = styled.li`
  padding: 0;
  margin: 0;
  list-style-type: none;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;

  line-height: 1.7em;

  color: ${({
    theme: {
      list: { focusForeground }
    }
  }) => focusForeground};

  cursor: pointer;
  user-select: none;

  :hover {
    background-color: ${({
      theme: {
        list: { hoverBackground }
      }
    }) => hoverBackground};

    color: ${({
      theme: {
        list: { hoverForeground }
      }
    }) => hoverForeground};
  }
`

const fileExtensions = {
  js: 'javascript.svg',
  json: 'json.svg'
}

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

  renderItem = item => {
    // { path: 'views/login-2feeddeadbeef.json', line: 2, matches: 1, ellapsed: true },
    // { text: '  "type": "view",', line: 2, indices: [3, 6], path: 'views/login-2feeddeadbeef.json' },
    // { path: 'views/login-2feeddeadbeef.json', line: 5, matches: 1, ellapsed: true },
    // { text: '  "styles": [', line: 5, indices: [4, 5], path: 'views/login-2feeddeadbeef.json' }
    const { path, line, matches, ellapsed, text, indices } = item

    if (ellapsed != null) {
      const directory = dirname(path)
      const fullFileName = basename(path)
      const extension = extname(fullFileName).slice(1)
      const decoratedFileName = hashlessFileName(fullFileName)

      const icon = `./assets/material-icons/${fileExtensions[extension.toLowerCase()] || 'file.svg'}`

      const uniqPath = `${path}:${line}`

      return (
        <ListItemContainerStyle
          key={uniqPath}
          onClick={() => {
            this.props.store.handleNodeClick(uniqPath)
          }}
        >
          <ListItemInnerContainerStyle isNode={true}>
            <NodeArrowStyle ellapsed={ellapsed} theme={this.props.theme} />
            <ListItemIconStyle height="16" width="16" src={icon} />
            <ListItemFilenameStyle>
              {decoratedFileName}
              {'\u00A0'}
            </ListItemFilenameStyle>
            <ListItemFolderameStyle>{directory}</ListItemFolderameStyle>
          </ListItemInnerContainerStyle>
          <span>{matches}</span>
        </ListItemContainerStyle>
      )
    }

    const [first, last] = indices
    const beforeMatch = text.slice(0, first)
    const matched = text.slice(first, last + 1)
    const afterMatch = text.slice(last + 1)

    const uniqPath = `${path}:${line}:${first}`
    return (
      <ListItemContainerStyle
        key={uniqPath}
        onClick={() => {
          this.props.store.handleLeafClick(uniqPath)
        }}
      >
        <ListItemInnerContainerStyle isNode={false}>
          <ListItemLabelStyle>
            <span>{beforeMatch}</span>
            <span style={{ backgroundColor: '#ecbca0' }}>{matched}</span>
            <span>{afterMatch}</span>
          </ListItemLabelStyle>
        </ListItemInnerContainerStyle>
        {/* <span>11</span> */}
      </ListItemContainerStyle>
    )
  }

  renderSearchResult = () => {
    const {
      store: { drawableData }
    } = this.props

    if (!drawableData) {
      return null
    }

    if (drawableData.length === 0) {
      return <p>No results found.</p>
    }

    return <ListStyle>{drawableData.map(this.renderItem)}</ListStyle>
    /*
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
 */
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
