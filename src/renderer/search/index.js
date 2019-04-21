import React from 'react'
import { Search as SearchComponent } from './component'
import { SearchResultModel } from './model'

export class Search {
  _widget = null

  get widget() {
    return this._widget
  }

  constructor({ workspace, project } = {}) {
    const store = new SearchResultModel()
    this._widget = <SearchComponent store={store} />
  }
}
