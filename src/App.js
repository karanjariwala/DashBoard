import React, { Component } from "react";
import ReactDOM from "react-dom";
import { List, Modal, Button, Label, Header } from "semantic-ui-react";
import moment from "moment";
import getFixtures from "./apiService";
import {
  mapAndNormalizeFixtures,
  serializeObjectValues,
  getEditDistance,
  emptyFixture
} from "./utils";
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

  saveValue = (key, value, id) => {
    console.log(this.state.entitiesObject[id], key, value, id);
    const newObj = { ...this.state.entitiesObject[id], [key]: value };
    newObj.editDistance = getEditDistance(
      serializeObjectValues(newObj, emptyFixture),
      serializeObjectValues(newObj.secondary, emptyFixture)
    );

    this.setState(
      {
        entitiesObject: {
          ...this.state.entitiesObject,
          [id]: newObj
        }
      },
      () => console.log(this.state.entitiesObject[id], key, value, id)
    );
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
          if (moment(t1).isBefore(t2)) {
            return -1;
          }
          return 1;
        });
        toRender = ListCreator({
          arr: sortedResult,
          entities: this.state.entitiesObject,
          handleClick: this.handleClick
        });
      }
    }

    return (
      <div className="App">
        {toRender}
        <ItemModal
          item={this.state.entitiesObject[this.state.itemClicked]}
          open={Boolean(this.state.itemClicked)}
          handleClose={this.handleClose}
          saveValue={this.saveValue}
        />
      </div>
    );
  }
}

export default App;
