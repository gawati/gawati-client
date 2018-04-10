import React, { Component } from 'react';
import { ButtonGroup, Button } from 'reactstrap';

const styles = {
  Container: {
    backgroundColor: '#20a8d8',
    width: '100%'
  },
  ButtonGroup: {
    float: 'left'
  }
}

/**
 * To-Do: 
 * a. Display Select All only on the Dashboard route
 * b. Move styles to css 
 */
export default class DocActions extends Component {

  handleTransition() {
    this.props.selectedDocs.map(doc => {
      console.log("Transition state for ", doc);
    });
  }

  handleSelectAll() {
    this.props.selectAll();
  }

  render() {
    return(
      <div style={styles.Container}>
        <ButtonGroup style={styles.ButtonGroup}>
          <Button color="primary" onClick={this.handleTransition.bind(this)}>Transition</Button>
          <Button color="primary">Action A</Button>
          <Button color="primary">Action B</Button>
        </ButtonGroup>

        
        <Button type="submit" color="primary" className="float-right" onClick={this.handleSelectAll.bind(this)}>Select All</Button>
      </div>
    )
  }
}
