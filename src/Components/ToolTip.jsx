import React from "react";
import { Popup } from "semantic-ui-react";
import PropTypes from "prop-types";

const { string, element, object } = PropTypes;

ToolTip.propTypes = {
  /**
   * text to be shown in tool tip
   */
  text: string,
  /**
   *  A React element.
   */
  children: element,
  /**
   * rest Props
   */
  rest: object
};

function ToolTip(props) {
  const { text, children, ...rest } = props;
  if (React.Children.count(children) === 1) {
    // make sure tool tip has only one trigger.
    return (
      <Popup
        on="hover"
        hideOnScroll
        size="mini"
        trigger={children}
        content={text}
        position="top center"
        {...rest}
      />
    );
  }
  return null;
}

export default ToolTip;
