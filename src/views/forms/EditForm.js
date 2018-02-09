import React from 'react';
import {Switch} from 'react-router-dom';

import {PropsRoute} from '../../utils/routeshelper';

import StdDiv from '../../components/StdDiv';
import IdentityMetadata from './IdentityMetadata' ;
import EmbeddedDocuments from './EmbeddedDocuments';


class EditForm extends React.Component {
    render() {
        const {match, mode, i18n} = this.props; 
        const {iri, lang } = match.params ;
        return (
            <StdDiv>
                <Switch>

                    <PropsRoute path="/document/add/_lang/:lang" 
                        name="InputForm" component={IdentityMetadata} mode={ mode} lang={ lang } i18n={i18n} />

                    <PropsRoute path="/document/open/ident/_lang/:lang/_iri/:iri*" 
                                    name="EditIdentForm" component={IdentityMetadata} mode={ mode } lang={ lang }  iri={ iri } i18n={i18n} />

                    <PropsRoute path="/document/open/comp/_lang/:lang/_iri/:iri*" 
                                    name="EditCompForm" component={EmbeddedDocuments} mode={ mode } lang={ lang }  iri={ iri } i18n={i18n} />
                                    
                </Switch>
            </StdDiv>
        );
    }

}

export default EditForm;