import React from 'react';

import { DateTimePicker } from 'react-widgets'


class InputDate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value
        };
    }

    handleChange = (value) => {
        const {name} = this.props;
        this.props.onChange(name    , value);
    }

/*     handleBlur = () => {
        const {name} = this.props;
        this.props.onBlue(name, true);
    }; 
 */
    render() {
        const {name, readOnly, value} = this.props;
        return (
            <DateTimePicker
                name={name}
                id={name}
                disabled={readOnly}
                defaultValue={value}
                format="YYYY-MM-DD"
                time={false}
                value={value}
                placeholder={ 'Enter date in the format "2016-12-30"'}
                onChange={this.handleChange}
                //onBlur={this.handleBlur}
          />
        );
    }

}

export default InputDate ;