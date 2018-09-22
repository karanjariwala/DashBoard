import React, { Component } from "react";
import ReactDOM from "react-dom";
import { List } from "semantic-ui-react";
import dayjs from "dayjs";
import getFixtures from "./apiService";
import mapAndNormalizeFixtures from "./utils";
import "./App.css";

const ListCreator = (arr, entities) => {
  return (
    <List selection verticalAlign="middle">
      {arr.map(id => (
        <List.Item key={id}>
          <List.Content>
            <List.Header>
              {entities[id].team1} vs {entities[id].team2}
            </List.Header>
            <div>{entities[id].sport} </div>
            <div> {entities[id].championship}</div>
            <div>
              Date - {dayjs(entities[id].start_time).format("DD-MM-YYYY")}
            </div>
            <div>Time - {dayjs(entities[id].start_time).format("hh:mm a")}</div>
          </List.Content>
        </List.Item>
      ))}
    </List>
  );
};

class App extends Component {
  state = {
    entitiesObject: {},
    result: [],
    error: false,
    loading: false
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
        toRender = ListCreator(sortedResult, this.state.entitiesObject);
      }
    }

    return <div className="App">{toRender}</div>;
  }
}

export default App;
