import React from 'react';
import {Switch} from 'react-router-dom';

import {PropsRoute, getRoute} from '../../utils/RoutesHelper';

import IdentityMetadata from './IdentityMetadata' ;
import EmbeddedDocuments from './EmbeddedDocuments';

class EditForm extends React.Component {
    render() {
        const {match, i18n} = this.props; 
        const {iri, lang } = match.params ;
        // from some reason, the react router loses context of url params, we have to 
        // pull it from the the url ... 
        return (
                <Switch>

                    <PropsRoute path={ getRoute("document-add") }  
                        name="InputForm" component={IdentityMetadata} mode="add" lang={ lang } i18n={i18n} />

                    <PropsRoute path={ getRoute("document-ident-open") } 
                                    name="EditIdentForm" component={IdentityMetadata} mode="edit" 
                                    lang={ lang }  iri={ iri } i18n={i18n} />

                    <PropsRoute path={ getRoute("document-comp-open") } 
                                    name="EditCompForm" component={EmbeddedDocuments} mode="edit" 
                                    lang={ lang }  iri={ iri } i18n={i18n} />
                                    
                </Switch>
        );
    }

}

export default EditForm;