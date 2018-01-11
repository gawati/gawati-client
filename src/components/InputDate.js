import React from 'react';

import { DateTimePicker } from 'react-widgets'


class InputDate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.initialValue
        };
    }

    render() {
        const {value} = this.state ; 
        const {name} = this.props;
        return (
            <DateTimePicker
                name={name}
                value={value}
                format="YYYY-MM-DD"
                time={false}
                placeholder={ 'Enter date in the format "2016/12/30"'}
                onChange={value => this.setState({value})}
          />
        );
    }

}

export default InputDate ;