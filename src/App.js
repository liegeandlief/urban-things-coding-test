import React, { Component } from 'react'
import './styles/App.css'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import BooksList from './BooksList'
import NavTabs from './NavTabs'

class App extends Component {
  render () {
    return (
      <Router>
        <MuiThemeProvider>
          <div className='App'>

            <div className='App__header'>
              <AppBar title='Library books' showMenuIconButton={false} />
            </div>

            <main className='App__main'>
              <Switch>
                <Route path='/' exact strict render={() => {
                  return <BooksList title='All books' />
                }} />
                <Route path='/my-wish-list' exact strict render={() => {
                  return <BooksList title='My wish list' wishListBooksOnly />
                }} />
                <Route render={() => {
                  return <p>Page not found.</p>
                }} />
              </Switch>
            </main>

            <nav className='App__nav'>
              <NavTabs />
            </nav>

          </div>
        </MuiThemeProvider>
      </Router>
    )
  }
}

export default App
