import React from 'react';
import {Row, Col} from 'reactstrap';

/**
 * Generates a dynamic set of reactstrap Rows.
 * @param {*} items to be placed in cols.
 * @param {Number} ncols is the number of cols per Row. 
 */
export const DynamicGrid = (items, ncols) => {
  const colSize = 12 / ncols;
  const nrows = items.length / ncols;
  let rows = [];
  for (let i=0; i<nrows; i++) {
    let cols = [];
    for (let j=0; j<ncols; j++) {
      let item = items.pop();
      cols.push(
        <Col xs={colSize}>
          {item}
        </Col>
      )
    }
    rows.push(<Row>{cols}</Row>);
  }
  return rows;
};