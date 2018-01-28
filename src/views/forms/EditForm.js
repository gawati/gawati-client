import React from 'react';

import StdDiv from '../../components/StdDiv';
import IdentityMetadata from './IdentityMetadata' ;


class EditForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        const {match} = this.props;
        console.log(" MATCH ", match );
    }

    render() {
        const {match} = this.props; 
        const {iri, lang } = match.params ;
        return (
            <StdDiv>
                <IdentityMetadata mode="edit" lang={ lang } iri={ iri } />
            </StdDiv>
        );
    }

}

export default EditForm;