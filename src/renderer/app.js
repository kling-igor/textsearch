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
    const { projectPath, query, searchOptions = {} } = this.props.store

    console.log(`searching '${query}' in ${projectPath} ...`)
    const correlationMarker = uuidv4()
    ipcRenderer.send('search', correlationMarker, projectPath, query, searchOptions)
  }

  render() {
    const { store: { projectPath, query } } = this.props;

    if (!projectPath) {
      return (
        <button onClick={() => this.openFile()}>Select Folder</button>
      )
    }

    return (
      <>
        <input type="text" value={query} onChange={this.handleQueryChange} />
        <button onClick={() => this.search()}>Search</button>
      </>
    )

  }
}
