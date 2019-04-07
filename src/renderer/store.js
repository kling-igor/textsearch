const { ipcRenderer, remote } = window.require('electron')
const { callMain, answerMain } = require('./ipc').default(ipcRenderer)
import uuidv4 from 'uuid/v4'
import { observable, action, computed, transaction, toJS, set } from "mobx";

class Store {

  @observable searchInProgress = false

  @observable projectPath = null;

  @observable query = ''

  @observable caseSensitive = false

  @action.bound
  setCaseSensitive(value) {
    this.caseSensitive = value
  }

  @observable searchOptions = {
    caseSensitive: true,
    shouldSort: true,
    findAllMatches: true,
    includeScore: true,
    includeMatches: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 2,
    keys: ["text"]
  };

  @action.bound
  setQuery(query) {
    this.query = query
  }

  @observable.ref searchResult = null
  // {
  //   text: '  hello hello',
  //   line: 3,
  //   file: 'hello.js',
  //   path: 'controllers',
  //   matches: [
  //     [3, 5],
  //     [9, 11]
  //   ]
  // },
  // {
  //   text: 'id:"hello"',
  //   line: 5,
  //   file: 'hello.json',
  //   path: 'views',
  //   matches: [
  //     [5, 7]
  //   ]
  // },

  @action.bound
  search = () => {
    if (!this.query && this.query.length < 3) return

    this.searchInProgress = true

    this.clearSearchResults()

    const correlationMarker = uuidv4()
    ipcRenderer.send('search', correlationMarker, this.projectPath, this.query, this.searchOptions)
  }

  @action.bound
  addSearchResult(result) {
    console.log('addSearchResult', result)
    if (!this.searchResult) {
      this.searchResult = []
    }
    this.searchResult = [...this.searchResult, result]
  }

  @action.bound
  clearSearchResults() {
    this.searchResult = null
  }

  constructor() {
    ipcRenderer.on('search', (event, details) => {
      const { folderPath, status, file, path, query, searchOptions, result } = details
      if (status === 'ready') {
        this.searchInProgress = false
        return
      }

      if (Array.isArray(result) && result.length > 0) {
        for (const { item: { line, text }, matches: [{ indices }] } of result) {
          this.addSearchResult({
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
        this.projectPath = result[0]
      }
    });
  }

}

export default new Store();
