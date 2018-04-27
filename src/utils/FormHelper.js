import React from 'react';
import {Aux} from './GeneralHelper';
import {T} from './i18nHelper';
import {docNumber, docTitle} from './PkgHelper';

export const conditionalDocNumber = (mode, pkg) => {
    switch (mode) {
        case "add": return "";
        default: return docNumber(pkg);
    }
};

export const conditionalDocTitle = (mode, pkg) => {
    switch (mode) {
        case "add": return docTitle(pkg) === "" ? T("Title not set yet") : docTitle(pkg) ;
        default: return docTitle(pkg);
    }
};

export const modeString = (mode) => {
    switch(mode) {
        case "edit": return T("Editing");
        case "add" : return T("Adding"); 
        case "view" : return T("Viewing"); 
        default: return T("Unknown"); 
    }
};

export const CaretSpacer = () => 
    <Aux>
        { " " }<i className="fa fa-caret-right"></i>{ " " }
    </Aux>
;
