import React from 'react';
import {Card, CardBody} from 'reactstrap';

import {SpanNormal} from '../../components/general/Spans';
import {T} from '../../utils/i18nHelper';
import { docNumber, docWorkflowState } from '../../utils/PkgHelper';

export const DocumentInfo = ({mode, lang, pkg}) => 
    (
    <Card className="card-accent-warning">
      <CardBody>
        <h4>
            <SpanNormal>{ modeString(mode) }</SpanNormal>{ " " } { conditionalDocNumber(mode, pkg) }
            { " " }<i className="fa fa-caret-right"></i>{ " " }Current State: {docWorkflowState(pkg).label} </h4>
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
        laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
        ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
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


