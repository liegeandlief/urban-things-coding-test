import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import BooksStore from './stores/BooksStore'

new BooksStore() // eslint-disable-line no-new

ReactDOM.render(<App />, document.getElementById('root'))
