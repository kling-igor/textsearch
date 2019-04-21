import { observable, action, computed, transaction, toJS, set } from 'mobx'

const FAKE_RESULT = [
  {
    item: { line: 2, text: '  "type": "view",' },
    matches: [{ arrayIndex: 0, indices: [[3, 6]] }]
  },
  {
    item: { line: 5, text: '  "styles": [' },
    matches: [{ arrayIndex: 0, indices: [[4, 5]] }]
  }
]

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

    // fake search

    setTimeout(() => {
      const file = 'login-2feeddeadbeef.json'
      const path = 'views'

      for (const {
        item: { line, text },
        matches: [{ indices }]
      } of FAKE_RESULT) {
        this.addSearchResult({
          text,
          line,
          file,
          path,
          matches: indices
        })
      }

      this.searchInProgress = false
    }, 2000)
  }

  @action.bound
  addSearchResult(result) {
    if (!this.searchResult) {
      this.searchResult = []
    }
    this.searchResult = [...this.searchResult, result]
  }

  @action.bound
  clearSearchResults() {
    this.searchResult = null
  }
}

export default new Store()
