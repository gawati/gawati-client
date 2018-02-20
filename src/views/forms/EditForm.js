import React from 'react';
import {Switch} from 'react-router-dom';

import {PropsRoute} from '../../utils/routeshelper';

import StdDiv from '../../components/StdDiv';
import IdentityMetadata from './IdentityMetadata' ;
import EmbeddedDocuments from './EmbeddedDocuments';



class EditForm extends React.Component {
    render() {
        const {match, i18n} = this.props; 
        const {iri, lang } = match.params ;
        console.log(" MATCH>IRI ", match, iri, lang);
        // from some reason, the react router loses context of url params, we have to 
        // pull it from the the url ... 
        return (
            <StdDiv>
                <Switch>

                    <PropsRoute path="/document/add/_lang/:lang" 
                        name="InputForm" component={IdentityMetadata} mode="add" lang={ lang } i18n={i18n} />

                    <PropsRoute path="/document/open/ident/_lang/:lang/_iri/:iri*" 
                                    name="EditIdentForm" component={IdentityMetadata} mode="edit" 
                                    lang={ lang }  iri={ iri } i18n={i18n} />

                    <PropsRoute path="/document/open/comp/_lang/:lang/_iri/:iri*" 
                                    name="EditCompForm" component={EmbeddedDocuments} mode="edit" 
                                    lang={ lang }  iri={ iri } i18n={i18n} />
                                    
                </Switch>
            </StdDiv>
        );
    }

}

export default EditForm;