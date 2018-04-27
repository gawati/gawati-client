import React from 'react';
import {Card, CardBody} from 'reactstrap';

import {SpanNormal} from '../../components/general/Spans';

import {docOfficialDate, docCreatedDate, docModifiedDate } from '../../utils/PkgHelper';
import {displayDate, displayXmlDateTime} from '../../utils/DateHelper';

import { conditionalDocTitle, CaretSpacer} from '../../utils/FormHelper';

import { Aux } from '../../utils/GeneralHelper';


const TitleInfo = ({ mode, pkg }) => {
    return (
        <Aux>
            <SpanNormal>Title:</SpanNormal> {conditionalDocTitle(mode, pkg)}
        </Aux>
    )
}
;

const DateInfo = ({ mode, pkg }) => {

    const officialDate = displayDate(docOfficialDate(pkg));
    const createdDate = displayXmlDateTime(docCreatedDate(pkg));
    const modifiedDate = displayXmlDateTime(docModifiedDate(pkg));

    return (
        <Aux>
            <CaretSpacer />
            <SpanNormal>Official Date: </SpanNormal> {officialDate}
            <CaretSpacer />
            <small>Created: {createdDate}</small><CaretSpacer />
            <small>Modified: {modifiedDate}</small>
        </Aux>
    )
}
;


export const DocumentInfo = ({mode, lang, pkg}) => 
    (
    <Card className="card-accent-warning">
      <CardBody>
        <h5>
            <TitleInfo mode={mode} pkg={pkg} />
        </h5>
        <h5>
            <DateInfo mode={mode} pkg={pkg} />
        </h5>
        </CardBody>
    </Card>
);


