import React, { Component } from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import LibraryBooks from 'material-ui/svg-icons/av/library-books'
import List from 'material-ui/svg-icons/action/view-list'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

class NavTabs extends Component {
  handleTabChange (route) {
    this.props.history.push(route)
  }

  render () {
    return (
      <Tabs onChange={value => { this.handleTabChange(value) }} value={this.props.location.pathname}>
        <Tab icon={<LibraryBooks />} label='All books' value='/' />
        <Tab icon={<List />} label='My wish list' value='/my-wish-list' />
      </Tabs>
    )
  }
}

NavTabs.propTypes = {
  history: PropTypes.object.isRequired
}

export default withRouter(NavTabs)
