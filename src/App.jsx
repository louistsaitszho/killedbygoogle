import React, { Component } from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';

// Global CSS (e.g. body)
import './global.scss';

// Major Components
import BannerMessage from './components/BannerMessage';
import Header from './components/Header';
import List from './components/List';
import Search from './components/Search';
import Footer from './components/Footer';

export default class App extends Component {
  constructor(props) {
    super(props);
    const { data } = props;
    this.state = {
      listOfItems: data,
      fullList: data,
    };

    // Bindings
    this.searchFilter = this.searchFilter.bind(this);
  }

  searchFilter(term) {
    const { fullList } = this.state;
    const regexp = new RegExp(term.toLowerCase(), 'i');
    // If search goes empty
    if (term === '') {
      // Reset the list.
      this.setState({
        listOfItems: fullList,
      });
    } else {
      // Otherwise filter the list by name and description
      this.setState({
        listOfItems: fullList.filter(el => (
          regexp.test(el.name.toLowerCase())
          || regexp.test(el.description.toLowerCase())
        )),
      });
    }
  }

  render() {
    const { listOfItems } = this.state;
    return (
      <div>
        <BannerMessage>
          <a href="https://github.com/codyogden/killedbygoogle/issues">
            {'Missing an Obituary? We\'re Open Source.'}
          </a>
        </BannerMessage>
        <Header />
        <Search search={this.searchFilter} />
        <List items={listOfItems} />
        <Footer />
      </div>
    );
  }
}

App.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
};

// Retrieve static json
fetch('graveyard.json')
  .then((response) => {
    // Process it
    response.json().then((data) => {
      // Sort by the dateClose (date discontinued)
      const graveyard = data.sort((a, b) => new Date(b.dateClose) - new Date(a.dateClose));
      // Render the app
      render(<App data={graveyard} />, document.querySelector('#killedbygoogle'));
    });
  });
