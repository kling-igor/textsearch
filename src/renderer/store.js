const { ipcRenderer, remote } = window.require('electron')
const { callMain, answerMain } = require('./ipc').default(ipcRenderer)
import uuidv4 from 'uuid/v4'
import { observable, action, computed, transaction, toJS, set } from 'mobx'

class Store {
  @observable searchInProgress = false

  @observable projectPath = null

  @observable query = ''

  @observable caseSensitive = false

  @action.bound
  setCaseSensitive(caseSensitive) {
    this.caseSensitive = caseSensitive
  }

  @action.bound
  setQuery(query) {
    this.query = query
  }

  @observable.ref searchResult = null

  @action.bound
  search = () => {
    if (!this.query && this.query.length < 3) return

    this.searchInProgress = true

    this.clearSearchResults()

    // переместить на сторону vision.project (там известен projectPath и applicationDelegate который в main передаст задачу)
    const correlationMarker = uuidv4()
    ipcRenderer.send('search', correlationMarker, this.projectPath, this.query, this.caseSensitive)
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
    //перенести в ApplicationDelegate как это сделано для onApplicationMenuCommand
    ipcRenderer.on('search', (event, details) => {
      const { folderPath, status, file, path, query, result } = details
      if (status === 'ready') {
        this.searchInProgress = false

        if (!this.searchResult) {
          this.searchResult = [] // to show message 'No results found.'
        }

        return
      }

      if (Array.isArray(result) && result.length > 0) {
        for (const {
          item: { line, text },
          matches: [{ indices }]
        } of result) {
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
    remote.dialog.showOpenDialog(
      {
        properties: ['openDirectory'],
        title: 'Open Folder',
        defaultPath: '/Users/kling/Altarix/MARM'
      },
      result => {
        if (Array.isArray(result)) {
          this.projectPath = result[0]
        }
      }
    )
  }
}

export default new Store()
