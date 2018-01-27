import React from 'react';

import { DateTimePicker } from 'react-widgets'


class InputDate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.initialValue
        };
    }

    handleChange = (value) => {
        this.props.onChange('docOfficialDate', value);
    }

    //handleBlur = () => 
    //   this.props.onBlur('docOfficialDate', true);
    //;

    render() {
        const {name, value} = this.props;
        return (
            <DateTimePicker
                name={name}
                id={name}
                defaultValue={value}
                format="YYYY-MM-DD"
                time={false}
                value={value}
                placeholder={ 'Enter date in the format "2016/12/30"'}
                onChange={this.handleChange}
                //onBlur={this.handleBlur}
          />
        );
    }

}

export default InputDate ;