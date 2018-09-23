import React, { Component } from "react";
import ReactDOM from "react-dom";
import { List, Modal, Button, Label, Header } from "semantic-ui-react";
import dayjs from "dayjs";
import getFixtures from "./apiService";
import mapAndNormalizeFixtures from "./utils";
import "./App.css";
import ListCreator from "./Components/ListCreator.jsx";
import ItemModal from "./Components/ItemModal.jsx";

class App extends Component {
  state = {
    entitiesObject: {},
    result: [],
    error: false,
    loading: false,
    itemClicked: ""
  };

  componentDidMount() {
    this.setState({ loading: true });
    Promise.all([getFixtures("primary"), getFixtures("secondary")])
      .then(data => {
        console.log(data);
        const { entitiesObject, result } = mapAndNormalizeFixtures(
          data[0],
          data[1]
        );
        this.setState({
          entitiesObject,
          result,
          error: false,
          loading: false
        });
        console.log(entitiesObject, result);
      })
      .catch(error => {
        this.setState({ fixtures: [], error: true, loading: false });
      });
  }

  handleClick = id => e => {
    this.setState({
      itemClicked: id
    });
  };

  handleClose = () => {
    this.setState({
      itemClicked: ""
    });
  };
  render() {
    let toRender = "...loading";
    if (!this.state.loading) {
      if (this.state.error) {
        toRender = "error occured";
      } else {
        const sortedResult = this.state.result.sort((id1, id2) => {
          const t1 = this.state.entitiesObject[id1].start_time;
          const t2 = this.state.entitiesObject[id2].start_time;
          if (dayjs(t1).isBefore(t2)) {
            return -1;
          }
          return 1;
        });
        toRender = ListCreator(
          sortedResult,
          this.state.entitiesObject,
          this.handleClick
        );
      }
    }

    return (
      <div className="App">
        {toRender}
        <ItemModal
          item={this.state.entitiesObject[this.state.itemClicked]}
          open={Boolean(this.state.itemClicked)}
          handleClose={this.handleClose}
        />
      </div>
    );
  }
}

export default App;
