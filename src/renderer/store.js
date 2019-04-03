import { observable, action, computed, transaction, toJS, set } from "mobx";

class Store {

  @observable projectPath = null;

  @action.bound
  setProjectPath(path) {
    this.projectPath = path;
  }

  @observable query = ''

  @action.bound
  setQuery(query) {
    this.query = query
  }
}

export default new Store();
