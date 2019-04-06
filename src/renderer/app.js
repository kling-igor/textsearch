const { ipcRenderer, remote } = window.require('electron')
const { callMain, answerMain } = require('./ipc').default(ipcRenderer)
import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import uuidv4 from 'uuid/v4'
@inject(({ store }) => ({ store }))
@observer
export default class App extends Component {
  constructor(props) {
    super(props);
    this.hash = window.location.hash.replace("#", "");


    ipcRenderer.on('search-result', (event, result) => {
      console.log('search-result:', result)
    })


    ipcRenderer.on('search', (event, details) => {

      console.log('DETAILS:', details)

      const { folderPath, status, file, path, query, searchOptions, result } = details
      if (status === 'ready') {
        console.log('SEARCH READY')
        return
      }


      if (Array.isArray(result) && result.length > 0) {
        for (const { item: { line, text }, matches: [{ indices }] } of result) {
          this.props.store.addSearchResult({
            text,
            line,
            file,
            path,
            matches: indices
          })
        }
      }
    })

  }

  openFile = () => {
    remote.dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Open Folder',
      defaultPath: '/Users/kling/Altarix/MARM'
    }, result => {
      if (Array.isArray(result)) {
        this.props.store.setProjectPath(result[0])
      }
    });
  }

  handleQueryChange = event => {
    this.props.store.setQuery(event.target.value)
  }

  search = () => {
    const { projectPath, query, searchOptions = {}, clearSearchResults } = this.props.store

    clearSearchResults()

    console.log(`searching '${query}' in ${projectPath} ...`)
    const correlationMarker = uuidv4()
    ipcRenderer.send('search', correlationMarker, projectPath, query, searchOptions)
  }

  render() {
    const { store: { projectPath, query, searchResult } } = this.props;

    if (!projectPath) {
      return (
        <button onClick={() => this.openFile()}>Select Folder</button>
      )
    }

    return (
      <>
        <input type="text" value={query} onChange={this.handleQueryChange} />
        <button onClick={() => this.search()}>Search</button>
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
      </>
    )

  }
}
