import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Movie_cards_list from './Test';
import { NavLink, Route } from 'react-router-dom';
import classnames from 'classnames';

class App extends Component {
  render() {
    return (
      <div className="App ui">
        <div className="ui container">
          <div className="ui top attached tabular menu">
            <NavLink exact to='/Current' className="item" activeClassName="active" data-tab="first">Today</NavLink>
            <NavLink exact to='/Soon' className="item" activeClassName="active" data-tab="second">Soon</NavLink>
          </div>
          <div className={classnames("ui bottom attached tab segment", {active: this.props.location.pathname == '/Current' })} data-tab="first">
            <Route exact path='/Current' component={Movie_cards_list} />
          </div>
          <div className={classnames("ui bottom attached tab segment", {active: this.props.location.pathname == '/Soon' })} data-tab="second">
            <Route exact path='/Soon' component={Movie_cards_list} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
