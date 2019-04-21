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

export class SearchResultModel {
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

  @computed get drawableData() {
    return this.flatten()
  }

  // TODO: REMOVE!!!
  constructor() {
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
  }

  flatten() {
    //данные, готовые для отображения
    return [
      { path: 'views/login-2feeddeadbeef.json', line: 2, matches: 1, ellapsed: true },
      { text: '  "type": "view",', line: 2, indices: [3, 6], path: 'views/login-2feeddeadbeef.json' },
      { path: 'views/login-2feeddeadbeef.json', line: 5, matches: 1, ellapsed: true },
      { text: '  "styles": [', line: 5, indices: [4, 5], path: 'views/login-2feeddeadbeef.json' }
    ]
  }

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
