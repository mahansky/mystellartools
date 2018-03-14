import axios from 'axios'
import { first, last, orderBy } from 'lodash'

export class HorizonPaginator {
  constructor (path, perPage = 15) {
    this.path = path
    this.perPage = perPage

    this.records = []
    this.nextDisabled = false
    this.prevDisabled = true
    this.pressedNext = true
    this.nextId = null
    this.prevId = null

    this.parameters = {
      order: 'desc',
      limit: perPage,
      cursor: '',
    }

    this.lastWorkingParameters = {
      order: 'desc',
      limit: perPage,
      cursor: '',
    }
  }

  prev () {
    this.pressedNext = false

    return this.fetch(false)
  }

  next () {
    this.pressedNext = true

    return this.fetch(true)
  }

  fetch (goNext = true) {
    if (goNext) {
      if (this.nextId) {
        this.parameters.order = 'desc'
        this.parameters.cursor = this.nextId
      }
    } else {
      if (this.prevId) {
        this.parameters.order = 'asc'
        this.parameters.cursor = this.prevId
      }
    }

    return axios.get(this.path, {
      params: this.parameters
    })
      .then(response => {
        this.processResponse(response.data)

        return this.records
      })
  }

  processResponse (data) {
    this.records = orderBy(data._embedded.records, ['id'], ['desc'])

    this.parseNextAndPrevId(this.records)

    this.nextDisabled = false
    this.prevDisabled = false

    if (this.records.length < this.perPage) {
      if (this.pressedNext) {
        this.nextDisabled = true
      } else {
        this.prevDisabled = true
      }
    }
  }

  parseNextAndPrevId (data) {
    if (data.length === 0) {
      this.prevId = null
      this.nextId = null

      this.parameters = JSON.parse(JSON.stringify(this.lastWorkingParameters))

      return
    }

    this.lastWorkingParameters = JSON.parse(JSON.stringify(this.parameters))

    let prev = first(data)

    if (prev) {
      this.prevId = prev.id
    }

    let next = last(data)

    if (next) {
      this.nextId = next.id
    }
  }
}