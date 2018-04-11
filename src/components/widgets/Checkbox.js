import React, { Component } from 'react';

/**
 * Controlled Checkbox Component.
 */
class Checkbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({isChecked: nextProps.isChecked})
  }

  toggleCheckboxChange() {
    const { handleCheckboxChange, label } = this.props;
    handleCheckboxChange(label);
  }

  render() {
    const { label } = this.props;

    return (
      <div className="checkbox">
        <label>
          <input
            type="checkbox"
            value={label}
            checked={this.state.isChecked}
            onChange={this.toggleCheckboxChange.bind(this)}
          />
          {this.props.showLabel ? {label} : ''}
        </label>
      </div>
    );
  }
}

export default Checkbox;