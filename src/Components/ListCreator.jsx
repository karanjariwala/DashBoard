import React, { Component } from "react";
import { List, Label, Header } from "semantic-ui-react";
import dayjs from "dayjs";

function ListCreator(props) {
  const { arr, entities, handleClick } = props;
  return (
    <List selection verticalAlign="middle">
      {arr.map(id => (
        <List.Item key={id} onClick={handleClick(id)}>
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
            <div>
              {entities[id].editDistance === 0 ? (
                <Label color="green">Same as secondary</Label>
              ) : (
                <Label color="red">Not Same as secondary</Label>
              )}
            </div>
          </List.Content>
        </List.Item>
      ))}
    </List>
  );
}

export default ListCreator;
