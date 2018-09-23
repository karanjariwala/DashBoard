import PropTypes from "prop-types";
import React from "react";
import { Modal, Button, Label, Table } from "semantic-ui-react";
import moment from "moment";
import FieldDecorator from "./FieldDecorator/FieldDecorator";

const { objectOf, number, shape, string, func, bool } = PropTypes;

/**
 * Portal to show fixture info in Detail
 * Also indicates whether current primary fixture value is exactly same as secondary.
 */

ItemModal.propTyps = {
  /**
   * Fixture Item to be shown in the modal
   */
  item: objectOf(
    shape({
      team1: string,
      team2: string,
      sport: string,
      championship: string,
      start_time: number
    })
  ),
  /**
   *  open prop to open modal
   */
  open: bool,
  /**
   * callback function when modal is closed
   */
  handleClose: func,
  /**
   * callback function to save the edited value
   */
  saveValue: func
};

function ItemModal(props) {
  const { item, open, handleClose, saveValue } = props;

  return (
    <Modal size="small" open={open} onClose={handleClose}>
      <Modal.Header>Detail View</Modal.Header>
      <Modal.Content>
        {open && (
          <div>
            {item.editDistance === 0 ? (
              <Label ribbon color="green">
                Same as secondary Fixture
              </Label>
            ) : (
              <Label ribbon color="red">
                Not Same as secondary Fixture
              </Label>
            )}
            <Table basic="very" columns={2}>
              <Table.Body>
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
              </Table.Body>
            </Table>
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
