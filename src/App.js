import React, { Component } from "react";
import { Loader, Dimmer } from "semantic-ui-react";
import getApi from "./apiService";
import {
  mapAndNormalizeFixtures,
  serializeObjectValues,
  getEditDistance,
  emptyFixture,
  sortByDate
} from "./utils";
import "./App.css";
import ListCreator from "./Components/ListCreator.jsx";
import ItemModal from "./Components/ItemModal.jsx";

/**
 * App list Primary fixtures in ascending order of timestamp.
 * A tooltip is displayed on each list item.
 * Clicking List Item opens the Modal to show fixture information in detail.
 * You can edit field values in modal and save the new values.
 * An indicator is present in the list item and in the modal to
 * - show whether Primary fixture info (currently) is exactly same as the Secondary fixture info.
 */

class App extends Component {
  state = {
    /**
     * Fixtures array normalized so that updating a fixture can be done O(1)
     */
    entitiesObject: {},
    result: [],
    /**
     * error and loading states for api
     */
    error: false,
    loading: false,
    /**
     * keeping track of the current fixture selected.
     */
    itemClicked: ""
  };

  componentDidMount() {
    this.setState({ loading: true });
    Promise.all([getApi("/fixtures/primary"), getApi("/fixtures/secondary")])
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
    const newObj = { ...this.state.entitiesObject[id], [key]: value };
    newObj.editDistance = getEditDistance(
      serializeObjectValues(newObj, emptyFixture),
      serializeObjectValues(newObj.secondary, emptyFixture)
    );

    this.setState({
      entitiesObject: {
        ...this.state.entitiesObject,
        [id]: newObj
      }
    });
  };

  render() {
    let toRender = (
      <Dimmer active inverted>
        <Loader active size="big" inline="centered">
          ...Loading
        </Loader>
      </Dimmer>
    );

    if (!this.state.loading) {
      if (this.state.error) {
        toRender = "error occured";
      } else {
        const sortedResult = sortByDate(
          this.state.result,
          this.state.entitiesObject,
          "start_time",
          true
        );
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
