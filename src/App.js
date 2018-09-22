import React, { Component } from "react";
import ReactDOM from "react-dom";
import getFixtures from "./apiService";
import cleanAndMapFixtures from "./utils";
import "./App.css";

class App extends Component {
  state = {
    fixtures: [],
    error: "",
    loading: false
  };

  componentDidMount() {
    Promise.all([getFixtures("primary"), getFixtures("secondary")])
      .then(data => {
        console.log(data);
        this.setState({
          fixtures: cleanAndMapFixtures(data[0], data[1])
        });
      })
      .catch(error => {});
  }
  render() {
    return <div className="App">hi</div>;
  }
}

export default App;
