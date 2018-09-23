import React, { Component } from "react";
import { Modal, Button, Label, Header, Input, List } from "semantic-ui-react";
import moment from "moment";

class FieldDecorator extends React.Component {
  state = {
    inputValue: this.props.value,
    editMode: false
  };

  handleChange = e => this.setState({ inputValue: e.target.value });
  handleClick = () => {
    if (this.state.editMode) {
      if (this.props.type === "date") {
        console.log(this.props.keyName, this.state.inputValue, this.props.id);
        if (
          moment(this.state.inputValue, "DD-MM-YYYY, hh:mm a", true).isValid()
        ) {
          this.props.saveValue(
            this.props.keyName,
            moment(this.state.inputValue, "DD-MM-YYYY, hh:mm a").valueOf(),
            this.props.id
          );
        } else {
          console.log("invalid date");
        }
      } else {
        console.log(
          this.props.keyName,
          this.state.inputValue,
          this.props.id,
          "here"
        );
        this.props.saveValue(
          this.props.keyName,
          this.state.inputValue,
          this.props.id
        );
      }
    }

    this.setState({ editMode: !this.state.editMode });
  };
  render() {
    let toRender = (
      <List.Item>
        {this.props.keyName}:{" "}
        {this.state.editMode ? (
          <Input
            size="mini"
            value={this.state.inputValue}
            onChange={this.handleChange}
          />
        ) : (
          <div
            className={`${this.props.className} field`}
            style={{ display: "inline-block" }}
          >
            {this.props.value}
          </div>
        )}
        <Button
          circular
          style={{ display: "inline-block", marginLeft: "10px" }}
          size="mini"
          onClick={this.handleClick}
          icon={this.state.editMode ? "save" : "edit"}
        />
      </List.Item>
    );

    return toRender;
  }
}

function ItemModal(props) {
  const { item, open, handleClose, saveValue } = props;
  return (
    <Modal size="small" open={open} onClose={handleClose}>
      <Modal.Header>Detail View</Modal.Header>
      <Modal.Content>
        {open && (
          <List>
            <FieldDecorator
              value={item.team1}
              saveValue={saveValue}
              id={item.id}
              keyName="team1"
              type="text"
            />
            <FieldDecorator
              value={item.team2}
              saveValue={saveValue}
              id={item.id}
              keyName="team2"
              type="text"
            />
            <FieldDecorator
              value={item.sport}
              saveValue={saveValue}
              id={item.id}
              keyName="sport"
              type="text"
            />
            <FieldDecorator
              value={item.championship}
              saveValue={saveValue}
              id={item.id}
              keyName="championship"
              type="text"
            />
            <FieldDecorator
              value={moment(item.start_time).format("DD-MM-YYYY, hh:mm a")}
              saveValue={saveValue}
              id={item.id}
              keyName="start_time"
              type="date"
            />
            {item.editDistance === 0 ? (
              <Label color="green">Same as secondary</Label>
            ) : (
              <Label color="red">Not Same as secondary</Label>
            )}
          </List>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button negative size="mini" onClick={handleClose}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default ItemModal;
