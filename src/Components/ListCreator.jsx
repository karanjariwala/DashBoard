import React from "react";
import PropTypes from "prop-types";
import { List, Label } from "semantic-ui-react";
import moment from "moment";
import ToolTip from "./ToolTip";

const { arrayOf, string, object, func } = PropTypes;

/**
 * Creates a List using normalized data (array of ids and entity object)
 * Show if primary is exactly same as secondary fixture.
 * handles click on list items
 */

ListCreator.propTypes = {
  /**
   * array of ids
   */
  arr: arrayOf(string),
  /**
   * entities object that contains data
   */
  entities: object,
  /**
   * callback when list item is clicked.
   */
  handleClick: func
};

function ListCreator(props) {
  const { arr, entities, handleClick } = props;
  return (
    <List selection verticalAlign="middle">
      {arr.map(id => (
        <ToolTip key={id} text="Click to open the Fixture">
          <List.Item onClick={handleClick(id)}>
            <List.Content>
              <List.Header>
                {entities[id].team1} vs {entities[id].team2}
              </List.Header>
              <List.Description>{entities[id].sport} </List.Description>
              <List.Description> {entities[id].championship}</List.Description>
              <List.Description>
                Date - {moment(entities[id].start_time).format("DD-MM-YYYY")}
              </List.Description>
              <List.Description>
                Time - {moment(entities[id].start_time).format("hh:mm a")}
              </List.Description>
              <List.Description>
                {entities[id].editDistance === 0 ? (
                  <Label color="green">Same as secondary</Label>
                ) : (
                  <Label color="red">Not Same as secondary</Label>
                )}
              </List.Description>
            </List.Content>
          </List.Item>
        </ToolTip>
      ))}
    </List>
  );
}

export default ListCreator;
