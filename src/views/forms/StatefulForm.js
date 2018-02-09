import React from 'react';
import {Form} from 'reactstrap';

/**
 * This is a stateful conversion of the ReactStrap form
 * We make it stateful by converting it to a class component. 
 * We require state to be able to use refs
 */
class StatefulForm extends React.Component {

    render() {
        return (
            <Form {...this.props}>
                {this.props.children}
            </Form>
        );
    }

}

export default StatefulForm ; 