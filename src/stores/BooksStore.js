import { Store } from 'whitelodge'

const defaultSortOrder = {field: 'title', dir: 'asc', label: 'Title ↑'}

const initialState = {
  allBooks: [],
  wishList: [],
  search: '',
  category: '',
  sort: defaultSortOrder,
  allowedSortOrders: [
    defaultSortOrder,
    {field: 'title', dir: 'desc', label: 'Title ↓'},
    {field: 'author', dir: 'asc', label: 'Author ↑'},
    {field: 'author', dir: 'desc', label: 'Author ↓'}
  ]
}

export default class BooksStore extends Store {
  constructor () {
    super('books', initialState)
  }

  fetchAllBooks () {
    const books = window.sessionStorage.getItem('allBooks')

    if (books !== null) {
      this.setStoreState({allBooks: JSON.parse(books)})
    } else {
      window.fetch('http://static.urbanthings.co/hr/tests/library/books.json').then(res => {
        if (res.status !== 200) {
          console.error(res)
          console.error('Books datasource responded with an non-200 status code.')
          return
        }

        res.json().then(data => {
          const books = data.items
          window.sessionStorage.setItem('allBooks', JSON.stringify(books))
          this.setStoreState({allBooks: books})
        })
      }).catch(err => {
        console.error(err)
      })
    }
  }

  fetchWishListBookIDs () {
    const wishList = window.localStorage.getItem('wishList')

    if (wishList !== null) {
      this.setStoreState({wishList: JSON.parse(wishList)})
    }
  }

  setWishListBooksIDs (books) {
    window.localStorage.setItem('wishList', JSON.stringify(books))
    this.fetchWishListBookIDs()
  }

  addToWishList (id) {
    if (this.storeState.wishList.length === 10) return false
    this.setWishListBooksIDs(this.storeState.wishList.concat(id))
    return true
  }

  removeFromWishList (id) {
    const newWishList = this.storeState.wishList.reduce((newWishList, bookID) => {
      if (bookID !== id) newWishList.push(bookID)
      return newWishList
    }, [])
    this.setWishListBooksIDs(newWishList)
  }

  getBookDetailsByID (id) {
    for (let i = 0; i < this.storeState.allBooks.length; i++) {
      if (this.storeState.allBooks[i].id === id) {
        return this.storeState.allBooks[i]
      }
    }
  }

  isBookInWishList (id) {
    return this.storeState.wishList.indexOf(id) > -1
  }

  getBookDetailsForAllBooks () {
    return this.sortBooks(
      this.filterBySearchTerm(
        this.filterByCategory(
          this.storeState.allBooks
        )
      )
    )
  }

  getBookDetailsForWishListBooks () {
    return this.sortBooks(
      this.filterBySearchTerm(
        this.filterByCategory(
          this.storeState.allBooks.filter(book => this.storeState.wishList.indexOf(book.id) > -1)
        )
      )
    )
  }

  sortBooks (books) {
    const newBooks = [].concat(books) // Create a new mutable array containing all of the elements of the passed-in array
    newBooks.sort((a, b) => {
      return a[this.storeState.sort.field].localeCompare(b[this.storeState.sort.field])
    })
    if (this.storeState.sort.dir === 'desc') newBooks.reverse()
    return newBooks
  }

  filterByCategory (books) {
    if (!this.storeState.category.length) return books
    return books.reduce((filteredBooks, book) => {
      if (book.category === this.storeState.category) {
        filteredBooks.push(book)
      }
      return filteredBooks
    }, [])
  }

  filterBySearchTerm (books) {
    if (!this.storeState.search.length) return books
    const search = this.storeState.search.toLowerCase()
    return books.reduce((filteredBooks, book) => {
      if (
        book.title.toLowerCase().includes(search) ||
        book.author.toLowerCase().includes(search) ||
        book.description.toLowerCase().includes(search)
      ) {
        filteredBooks.push(book)
      }
      return filteredBooks
    }, [])
  }

  changeSortOrder (order) {
    this.setStoreState({sort: order})
  }

  changeCategory (cat) {
    this.setStoreState({category: cat})
  }

  updateSearchTerm (value) {
    this.setStoreState({search: value})
  }

  getAllBookCategories () {
    const allBooks = [].concat(this.storeState.allBooks) // Create a new mutable array containing all of the elements of the passed-in array
    const categories = allBooks.reduce((categories, book) => {
      if (categories.indexOf(book.category) === -1) {
        categories.push(book.category)
      }
      return categories
    }, [])
    categories.sort()
    return categories
  }
}
