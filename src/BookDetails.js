import React, { Component } from 'react'
import './styles/BookDetails.css'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import PropTypes from 'prop-types'

class BookDetails extends Component {
  constructor (props) {
    super(props)

    this.booksStore = window.whitelodge.stores.books
  }

  addToWishList (id) {
    const added = this.booksStore.addToWishList(id)
    if (!added) {
      window.alert('The book could not be added to your wish list as you have already added the maximum number of books allowed.')
    }
  }

  removeFromWishList (id) {
    this.booksStore.removeFromWishList(id)
  }

  render () {
    const book = this.booksStore.getBookDetailsByID(this.props.id)
    const inWishList = this.booksStore.isBookInWishList(this.props.id)

    const actions = [
      <FlatButton
        label='Close'
        onClick={() => { this.props.closeModal() }}
      />
    ]

    if (!inWishList) {
      actions.push(<FlatButton
        label='Add to my wish list'
        primary
        onClick={() => { this.addToWishList(book.id) }}
      />)
    } else {
      actions.push(<FlatButton
        label='Remove from my wish list'
        secondary
        onClick={() => { this.removeFromWishList(book.id) }}
      />)
    }

    return (
      <section className='BookDetails'>

        {/*
        repositionOnUpdate and style are used as a horrible hack to get the modal positioning correctly as it appears to be broken
        See: https://github.com/mui-org/material-ui/issues/1795
        */}
        <Dialog
          title={book.title}
          actions={actions}
          modal
          open
          autoScrollBodyContent
          repositionOnUpdate={false}
          style={{ padding: '0px 0px 0px 0px' }}
        >
          <img src={book.imageUrl} alt={book.title + ' cover'} className='BookDetails__image' onError={e => { e.target.style.display = 'none' }} />
          <p className='BookDetails__author'><strong>Author:</strong> {book.author}</p>
          {typeof book.volume !== 'undefined' && <p className='BookDetails__volume'><strong>Volume:</strong> {book.volume}</p>}
          <p className='BooksList__category'><strong>Category:</strong> {book.category}</p>
          <p className='BookDetails__available'><strong>Available:</strong> {book.available ? '✓' : '✗'}</p>
          <p className='BookDetails__description'>{book.description}</p>
        </Dialog>

      </section>
    )
  }
}

BookDetails.propTypes = {
  closeModal: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
}

export default BookDetails
