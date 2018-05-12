import React, { Component } from 'react'
import './styles/BooksList.css'
import RaisedButton from 'material-ui/RaisedButton'
import { AddStoreSubscriptions } from 'whitelodge'
import BookDetails from './BookDetails'
import Filters from './Filters'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

class BooksList extends Component {
  constructor (props) {
    super(props)

    this.booksStore = window.whitelodge.stores.books

    this.state = {
      idOfBookForDetails: null
    }
  }

  componentDidMount () {
    this.booksStore.fetchAllBooks()
    this.booksStore.fetchWishListBookIDs()
  }

  handleModalClose () {
    this.setState({
      idOfBookForDetails: null
    })
  }

  handleSortChange (event, index, value) {
    this.booksStore.changeSortOrder(JSON.parse(value))
  }

  showBookDetails (id) {
    this.setState({idOfBookForDetails: id})
  }

  render () {
    let booksToShow
    let wishListBooks
    if (!this.props.wishListBooksOnly) {
      booksToShow = this.booksStore.getBookDetailsForAllBooks()
      wishListBooks = this.booksStore.getBookDetailsForWishListBooks()
    } else {
      booksToShow = this.booksStore.getBookDetailsForWishListBooks()
      wishListBooks = booksToShow
    }
    const wishListBookIDs = wishListBooks.reduce((wishListBookIDs, book) => {
      return wishListBookIDs.concat(book.id)
    }, [])

    return (
      <section className='BooksList'>

        {!this.props.wishListBooksOnly && <Helmet><title>Library books - All books</title></Helmet>}
        {this.props.wishListBooksOnly && <Helmet><title>Library books - My wish list</title></Helmet>}

        <h2 className='BooksList__heading'>{this.props.title}</h2>

        <Filters />

        {booksToShow.length > 0 && <ol className='BooksList__list'>
          {booksToShow.map((book, index) => {
            const inWishList = wishListBookIDs.indexOf(book.id) > -1

            return <li key={index} className='BooksList__item'>
              <h3 className='BooksList__itemTitle'>{book.title}</h3>
              <p className='BooksList__itemAuthor'><strong>Author:</strong> {book.author}</p>
              {typeof book.volume !== 'undefined' && <p className='BooksList__itemVolume'><strong>Volume:</strong> {book.volume}</p>}
              <p className='BooksList__itemAvailable'><strong>Available:</strong> {book.available ? '✓' : '✗'}</p>
              {!this.props.wishListBooksOnly && (
                <p className='BooksList__itemInWishList'><strong>In my wish list:</strong> {inWishList ? '✓' : '✗'}</p>
              )}
              <RaisedButton className='BooksList__itemDetailsButton' label='More details' onClick={() => { this.showBookDetails(book.id) }} />
            </li>
          })}
        </ol>}

        {booksToShow.length === 0 && !this.props.wishListBooksOnly && <p>There are no books available matching the selected criteria.</p>}
        {booksToShow.length === 0 && this.props.wishListBooksOnly && <p>There are no books in your wish list matching the selected criteria.</p>}

        {this.state.idOfBookForDetails !== null && (
          <BookDetails id={this.state.idOfBookForDetails} closeModal={() => { this.handleModalClose() }} />
        )}

      </section>
    )
  }
}

BooksList.defaultProps = {
  wishListBooksOnly: false
}

BooksList.propTypes = {
  wishListBooksOnly: PropTypes.bool,
  title: PropTypes.string.isRequired
}

export default AddStoreSubscriptions(BooksList, ['books'])
