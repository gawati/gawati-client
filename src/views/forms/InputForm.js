import React from 'react';

import StdDiv from '../../components/StdDiv';
import IdentityMetadata from './IdentityMetadata' ;


class InputForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }



    render() {
        return (
            <StdDiv>
                <IdentityMetadata />
            </StdDiv>
        );
    }

}

export default InputForm;