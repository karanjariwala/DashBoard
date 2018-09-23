import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import { Button, Header, Input, Table, Icon } from "semantic-ui-react";
import moment from "moment";
import "./fieldDecorator.css";

const { string, func, oneOf } = PropTypes;

class FieldDecorator extends PureComponent {
  static propTypes = {
    /**
     * value of the field
     */
    value: string.isRequired,
    /**
     * callback when save is clicked after editing field value
     */
    saveValue: func.isRequired,
    /**
     * id of the fixture object
     */
    id: string.isRequired,
    /**
     * which key in fixture does this field represent
     */
    keyName: oneOf(["team1", "team2", "sport", "championship", "start_time"]),
    /**
     * type of field
     */
    type: oneOf(["text", "date"])
  };

  state = {
    inputValue: this.props.value,
    editMode: false
  };

  handleChange = e => this.setState({ inputValue: e.target.value });
  handleClick = () => {
    if (this.state.editMode) {
      if (this.props.type === "date") {
        const momentDate = moment(
          this.state.inputValue,
          "DD-MM-YYYY, hh:mm a",
          true
        );
        if (momentDate.isValid()) {
          this.props.saveValue(
            this.props.keyName,
            momentDate.valueOf(),
            this.props.id
          );
        } else {
          /**
           * alert if date not in required format.
           * reset the date to original date.
           */
          alert("Date should be valid and in 'DD-MM-YYYY, hh:mm a' format");
          this.setState({ inputValue: this.props.value });
        }
      } else {
        this.props.saveValue(
          this.props.keyName,
          this.state.inputValue.trim(),
          this.props.id
        );
      }
    }

    this.setState({ editMode: !this.state.editMode });
  };
  render() {
    let toRender = (
      <Table.Row>
        <Table.Cell>
          <Header as="h4">
            <Header.Content>{this.props.keyName}</Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>
          {this.state.editMode ? (
            <Input
              size="mini"
              value={this.state.inputValue}
              onChange={this.handleChange}
            />
          ) : (
            <div className="field-value">{this.props.value}</div>
          )}

          <Button
            icon
            labelPosition="left"
            className="field-action"
            size="mini"
            compact
            circular
            onClick={this.handleClick}
          >
            <Icon name={this.state.editMode ? "save" : "edit"} />
            {this.state.editMode ? "save" : "edit"}
          </Button>
        </Table.Cell>
      </Table.Row>
    );

    return toRender;
  }
}

export default FieldDecorator;
