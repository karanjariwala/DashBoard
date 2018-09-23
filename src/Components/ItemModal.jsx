import React, { Component } from "react";
import { Modal, Button, Label, Header } from "semantic-ui-react";
import dayjs from "dayjs";

function ItemModal(props) {
  const { item, open, handleClose } = props;
  return (
    <Modal size="small" open={open} onClose={handleClose}>
      <Modal.Header>Detail View</Modal.Header>
      <Modal.Content>
        {open && (
          <div className="modal-content">
            <Header>
              {item.team1} vs {item.team2}
            </Header>
            <Header.Subheader>{item.sport} </Header.Subheader>
            <Header.Subheader> {item.championship}</Header.Subheader>
            <Header.Subheader>
              Date - {dayjs(item.start_time).format("DD-MM-YYYY")}
            </Header.Subheader>
            <Header.Subheader>
              Time - {dayjs(item.start_time).format("hh:mm a")}
            </Header.Subheader>
            {item.editDistance === 0 ? (
              <Label color="green">Same as secondary</Label>
            ) : (
              <Label color="red">Not Same as secondary</Label>
            )}
          </div>
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
