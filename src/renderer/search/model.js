import { observable, action, computed, transaction, toJS, set } from 'mobx'

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

  @observable.ref searchResult = []

  @computed get drawableData() {
    return this.flatten()
  }

  flatten() {
    // //данные, готовые для отображения
    // return [
    //   { path: 'views/login-2feeddeadbeef.json', line: 2, matches: 1, ellapsed: true },
    //   { text: '  "type": "view",', line: 2, indices: [3, 6], path: 'views/login-2feeddeadbeef.json' },
    //   { path: 'views/login-2feeddeadbeef.json', line: 5, matches: 1, ellapsed: true },
    //   { text: '  "styles": [', line: 5, indices: [4, 5], path: 'views/login-2feeddeadbeef.json' }
    // ]

    const flatten = []

    let currentPath = null
    let skipPath = null
    for (const { path, line, matches, ellapsed, text, indices } of this.searchResult) {
      const uniqPath = `${path}:${line}`

      if (skipPath !== uniqPath) {
        // если переход к новому node
        if (currentPath !== uniqPath) {
          if (ellapsed === false) {
            skipPath = uniqPath
          } else {
            currentPath = uniqPath
          }
          flatten.push({ path, line, matches, ellapsed })
        } else {
          flatten.push({ path, line, text, indices })
        }
      }
    }
    return flatten
  }

  @action.bound
  search = () => {
    if (!this.query && this.query.length < 3) return

    this.searchInProgress = true

    this.clearSearchResults()

    // fake search
    setTimeout(() => {
      this.addSearchResult({
        file: 'login-2feeddeadbeef.json',
        path: 'views',
        line: 2,
        text: '  "type": "view",',
        matches: [[3, 6]]
      })

      this.addSearchResult({
        file: 'login-2feeddeadbeef.json',
        path: 'views',
        line: 5,
        text: '  "styles": [',
        matches: [[4, 5]]
      })

      this.searchInProgress = false
    }, 0)
  }

  @action.bound
  addSearchResult(result) {
    const { path, file, line, text, matches } = result
    const fullPath = `${path}/${file}`
    this.searchResult = [
      ...this.searchResult,
      { path: fullPath, line, matches: matches.length, ellapsed: true },
      ...matches.map(indices => ({ path: fullPath, text, line, indices }))
    ]
  }

  @action.bound
  clearSearchResults() {
    this.searchResult = []
  }

  @action
  handleNodeClick(fullPath) {
    // ищем путь меняем ему ellapsed
    const found = this.searchResult.find(
      ({ path, line, ellapsed }) => `${path}:${line}` === fullPath && ellapsed != null
    )

    if (found) {
      found.ellapsed = !found.ellapsed
      this.searchResult = [...this.searchResult]
    }
  }

  @action
  handleLeafClick(path) {
    // вызываем событие щелчок по элементу - подписчик получает путь со строкой и столбцом
  }
}
