import { observable, action, computed, transaction, toJS, set } from "mobx";

class Store {

  @observable projectPath = null;

  @action.bound
  setProjectPath(path) {
    this.projectPath = path;
  }

  @observable query = ''

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

  @observable.ref searchResult = []
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
  addSearchResult(result) {
    console.log('addSearchResult', result)
    this.searchResult = [...this.searchResult, result]
  }

  @action.bound
  clearSearchResults() {
    this.searchResult = []
  }

}

export default new Store();
