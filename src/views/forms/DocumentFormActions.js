import React from 'react';
import axios from 'axios';
import {Card, CardBody, ButtonGroup} from 'reactstrap';
import RRNavLink from '../../components/utils/RRNavLink';
import {linkDocumentAdd} from '../../components/utils/QuickRoutes';
import { docWorkflowState, docWorkflowTransitions, docWorkflowCurrentState, docWorkflowStateInfo, docIri, docType, docAknType } from '../../utils/PkgHelper';
import { getRolesForCurrentClient } from '../../utils/GawatiAuthClient';
import { T } from '../../utils/i18nHelper';
import { Aux } from '../../utils/GeneralHelper';
import confirm from '../utils/ConfirmInvoke';
import {modeString, conditionalDocNumber, CaretSpacer} from '../../utils/FormHelper';
import { SpanNormal } from '../../components/general/Spans';
import { apiUrl } from '../../api';

class DocumentFormActions extends React.Component {

    // 1 - check if any of the current roles has transit permission in the current state
    // 2 - if it has transit permission, enable the transits to the subsequent states
    /**
     * Checks if the current user has "transit" permission in the current state,
     * You can transit from one state to the other only if you have the "transit" permission
     */
    isTransitPermissionPresent =  (pkg) => {
        // get current roles 
        // check if the roles have transit permission in the curerent state 
        // check if current roles can transit to transition

        const roles = getRolesForCurrentClient();
        const currentState = docWorkflowCurrentState(pkg);
        const currentStateInfo = docWorkflowStateInfo(pkg, currentState.status);

        if (currentStateInfo.length > 0 ) {
            const theState = currentStateInfo[0];
            // [ {name: "view", roles: "client.Admin client.Submitter"}....  ]
            const theStatePermissions = theState.permission;
            // check if the the transit permission exists and is allowed for the current user
            const transitPermissions = theStatePermissions.filter( (perm) => perm.name === "transit");
            if (transitPermissions.length > 0 ) {
                const transitRoles = transitPermissions[0].roles.trim().split(/\s+/);
                return transitRoles.some( (transitRole) => roles.indexOf(transitRole) >= 0 );
            } else {
                return false;
            }   
        } else {
            return false;
        }
    };


    transitDataEnvelope = (pkg, from, to, name) => (
            {
                docIri: docIri(pkg),
                aknType : docAknType(pkg),
                aknSubType: docType(pkg),
                stateFrom: from, 
                stateTo: to, 
                transitionName: name
         }
    );



    transitDocument = (pkg, from, to, name) => {
        
        const transition = this.transitDataEnvelope(pkg, from, to, name);
        
        confirm("Are you sure ?").then(
            (result) => {
                console.log(" proceed ", result);
            },
            (result) => {
                console.log(" cancel called ", result);
            }
        )
        /*
        axios.post(apiUrl("workflows-transit"), {data: transition})
            .then( (response) => {
                // {"success":{"code":"save_file","message":"/db/docs/gawati-client-data/akn/ke/act/legge/1970-06-03/akn_ke_act_legge_1970-06-03_Cap_44_eng_main.xml"}}

                console.log("transitDocument ", response);
            })
            .catch( (err) => {
                console.log("transitDocument ", err);
            });
            */
    };

    renderTransitionActions = (pkg, lang) => {
        const transitions = docWorkflowTransitions(pkg) ;
        // [ {from:"draft", icon:"fa-thumbs-up", name:"make_editable", title:"Send for Editing",to:"editable" }]
        return transitions.map( (transition) => {
            const {from, to, icon, name, title } = transition;
            return (
            <Aux key={name}>
            <button className={`btn btn-warning`} onClick={
                () => {   
                    this.transitDocument(pkg, from, to, name);
                }  
            }>
                <i className={`fa ${icon}`}></i> {T(title)}
            </button>&#160;
            </Aux>
            );
        });
    };

    render() {
        const {lang, mode, pkg} = this.props;
        const transitAllowed = this.isTransitPermissionPresent(pkg);
        const transitionButtons = this.renderTransitionActions(pkg, lang);
        return(
            <Card className={`text-white bg-info text-right mt-1 mb-1 doc-toolbar-actions`}>
               <CardBody className={`pt-0 pb-0 pl-0 pr-0`}>
               <div className={`float-left document-form-action-current-info`}><ModeAndState mode={mode} pkg={pkg} /></div>
               <ButtonGroup>
                   {/** using Button here injects btn-secondary for some unknown reason so using <button> directly **/}
                   { transitAllowed ? transitionButtons : null}
                   <button className={`btn btn-primary`}><RRNavLink to={ linkDocumentAdd(lang) }><i className="fa fa-plus"></i> Add Document</RRNavLink></button>
                </ButtonGroup>
                </CardBody>
            </Card>        
        );
            
    }
};

export const ModeAndState = ({mode, pkg}) => 
<Aux>
    <SpanNormal>{ modeString(mode) }</SpanNormal>{ " " } { conditionalDocNumber(mode, pkg) }
    <CaretSpacer />Current State: {T(docWorkflowState(pkg).label)}    
</Aux>
;


export default DocumentFormActions;
