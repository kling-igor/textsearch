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
}

export default new Store();
