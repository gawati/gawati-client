import React from 'react';
import {Card, CardBody} from 'reactstrap';

import {SpanNormal} from '../../components/general/Spans';
import {T} from '../../utils/i18nHelper';
import { docNumber, docWorkflowState, docTitle, docOfficialDate, docCreatedDate, docModifiedDate } from '../../utils/PkgHelper';
import {displayDate, displayXmlDateTime} from '../../utils/DateHelper';
import { Aux } from '../../utils/GeneralHelper';

const ModeAndState = ({mode, pkg}) => 
    <Aux>
        <SpanNormal>{ modeString(mode) }</SpanNormal>{ " " } { conditionalDocNumber(mode, pkg) }
        <CaretSpacer />Current State: {T(docWorkflowState(pkg).label)}    
    </Aux>
;

const TitleAndDateInfo = ({ mode, pkg }) => {

    const officialDate = displayDate(docOfficialDate(pkg));
    const createdDate = displayXmlDateTime(docCreatedDate(pkg));
    const modifiedDate = displayXmlDateTime(docModifiedDate(pkg));
    console.log(" off, created, modified ", officialDate, createdDate, modifiedDate);
    return (
        <Aux>
            <SpanNormal>Title:</SpanNormal> {conditionalDocTitle(mode, pkg)}
            <br />
            <CaretSpacer />
            <SpanNormal>Official Date: </SpanNormal> {officialDate}
            <CaretSpacer />
            <small>Created: {createdDate}</small><CaretSpacer />
            <small>Modified: {modifiedDate}</small>
        </Aux>
    )
}
;

const CaretSpacer = () => 
    <Aux>
        { " " }<i className="fa fa-caret-right"></i>{ " " }
    </Aux>
;

export const DocumentInfo = ({mode, lang, pkg}) => 
    (
    <Card className="card-accent-warning">
      <CardBody>
        <h4>
            <ModeAndState mode={mode} pkg={pkg} />
        </h4>
        <h5>
            <TitleAndDateInfo mode={mode} pkg={pkg} />
        </h5>
        </CardBody>
    </Card>
);

const modeString = (mode) => {
    switch(mode) {
        case "edit": return T("Editing");
        case "add" : return T("Adding"); 
        case "view" : return T("Viewing"); 
        default: return T("Unknown"); 
    }
};

const conditionalDocNumber = (mode, pkg) => {
    switch (mode) {
        case "add": return "";
        default: return docNumber(pkg);
    }
};

const conditionalDocTitle = (mode, pkg) => {
    switch (mode) {
        case "add": return docTitle(pkg) === "" ? T("Title not set yet") : docTitle(pkg) ;
        default: return docTitle(pkg);
    }
};


