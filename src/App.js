import React from 'react';
import './App.css';

import ListPeople from './components/ListPeople.jsx'

class App extends React.Component {
  render() {
    return (
        <div className="App">
          <link
              rel="stylesheet"
              href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
              integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
              crossOrigin="anonymous"
          />
          <ListPeople personType="patient" />

        </div>
    );
  }
}

export default App;
