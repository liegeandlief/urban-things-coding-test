import React, { Component } from 'react'
import './styles/Filters.css'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'
import { Accordion, AccordionItem, AccordionItemTitle, AccordionItemBody } from 'react-accessible-accordion'
import { AddStoreSubscriptions } from 'whitelodge'

class Filters extends Component {
  constructor (props) {
    super(props)

    this.booksStore = window.whitelodge.stores.books
  }

  handleSortChange (event, index, value) {
    this.booksStore.changeSortOrder(JSON.parse(value))
  }

  handleCategoryChange (event, index, value) {
    this.booksStore.changeCategory(value)
  }

  handleSearch (event, value) {
    this.booksStore.updateSearchTerm(value)
  }

  render () {
    return (
      <div className='Filters'>
        <Accordion>
          <AccordionItem>
            <AccordionItemTitle>Filters</AccordionItemTitle>
            <AccordionItemBody>
              <div className='Filters__controls'>
                <div className='Filters__control'>
                  <TextField
                    floatingLabelText='Search'
                    floatingLabelFixed
                    onChange={(event, value) => { this.handleSearch(event, value) }}
                  />
                </div>

                <div className='Filters__control'>
                  <SelectField
                    floatingLabelText='Category'
                    floatingLabelFixed
                    value={this.booksStore.storeState.category}
                    onChange={(event, index, value) => { this.handleCategoryChange(event, index, value) }}
                    autoWidth
                  >
                    <MenuItem value='' primaryText='All' />
                    {this.booksStore.getAllBookCategories().map((cat, index) => {
                      return <MenuItem value={cat} primaryText={cat} key={index} />
                    })}
                  </SelectField>
                </div>

                <div className='Filters__control'>
                  <SelectField
                    floatingLabelText='Sort order'
                    floatingLabelFixed
                    value={JSON.stringify(this.booksStore.storeState.sort)}
                    onChange={(event, index, value) => { this.handleSortChange(event, index, value) }}
                    autoWidth
                  >
                    {this.booksStore.storeState.allowedSortOrders.map((sort, index) => {
                      return <MenuItem value={JSON.stringify(sort)} primaryText={sort.label} key={index} />
                    })}
                  </SelectField>
                </div>
              </div>
            </AccordionItemBody>
          </AccordionItem>
        </Accordion>
      </div>
    )
  }
}

export default AddStoreSubscriptions(Filters, ['books'])
