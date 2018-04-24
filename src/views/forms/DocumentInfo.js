import React from 'react';
import {Card, CardBody} from 'reactstrap';

import {SpanNormal} from '../../components/general/Spans';
import {T} from '../../utils/i18nHelper';
import { docNumber, docWorkflowState, docTitle } from '../../utils/PkgHelper';

export const DocumentInfo = ({mode, lang, pkg}) => 
    (
    <Card className="card-accent-warning">
      <CardBody>
        <h4>
            <SpanNormal>{ modeString(mode) }</SpanNormal>{ " " } { conditionalDocNumber(mode, pkg) }
            { " " }<i className="fa fa-caret-right"></i>{ " " }Current State: {T(docWorkflowState(pkg).label)} </h4>
            <h5><SpanNormal>Title:</SpanNormal> {conditionalDocTitle(mode, pkg)}</h5>
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
        case "add": docTitle(pkg) === "" ? T("Title not set yet") : docTitle(pkg) ;
        default: return docTitle(pkg);
    }
};


