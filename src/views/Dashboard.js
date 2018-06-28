import React, { Component } from 'react';

import {Breadcrumb, BreadcrumbItem, Table, Progress, CardHeader, CardBody, Card} from 'reactstrap';
import axios from 'axios';

import { handleApiException } from './dashboard.handlers';

import { apiUrl } from '../api';

import RRNavLink from '../components/utils/RRNavLink';
import { T } from '../utils/i18nHelper';

import {Aux, getWFProgress, capitalizeFirst} from '../utils/GeneralHelper';
import {humanDate, displayXmlDateTime} from '../utils/DateHelper';
import { getLocalTypeName, getDocTypes } from '../utils/DocTypesHelper';
import {typicalDashboardPermissions} from "../utils/DocPermissionsHelper";
import { setInRoute } from '../utils/RoutesHelper';

import StdCompContainer from '../components/general/StdCompContainer';
import Paginater from "../components/ui_elements/Paginater";
import DocActions from "../components/DocActions";
import Checkbox from "../components/widgets/Checkbox";
import SearchFilter from '../components/SearchFilter.js';
import DeleteAction from './DeleteAction.js';

import {getToken, generateBearerToken, getRolesForCurrentClient} from "../utils/GawatiAuthClient";
import { docIri } from '../utils/ServerPkgHelper';

export const StateColumn = ({ stateInfo }) =>  {
  return (
    <div data-status={stateInfo.state.status}>{ stateInfo.state.label }</div>
  );
}

const showCreatedAndModified = (created, modified) => {
  return (created === modified) ?
        `created: ${ displayXmlDateTime(created) }` : 
        `created: ${ displayXmlDateTime(created) } / modified: ${ humanDate(modified) }`;
};

export const AllowedActions = ({docPkg,deleteDoc}) => {
  const roles = getRolesForCurrentClient();
  const typical = typicalDashboardPermissions(docPkg, roles);
  const documentIri = docIri(docPkg);
  let linkIri = documentIri.startsWith("/") ? documentIri.slice(1): documentIri ;
  return typical.map( (action, i, origArr) => {
      const navLinkTo = setInRoute(
        `document-ident-${action.name}`, 
        {"lang": "en", "iri": linkIri }
      );
      // ASHOK: Need to fix this strange if here -- 
      if (origArr.length - 1 ===  i) {
        // last item
        if(action.name === 'delete'){
          return (<DeleteAction key={action.name} action={action} deleteDoc={deleteDoc} linkIri={linkIri}/>);
        }
        else{
          return (<RRNavLink key={action.name} className="btn btn-info" role="button" to={navLinkTo}>{T(action.label)}</RRNavLink>);
        }
      }else{
          // any other item
        if(action.name === 'delete'){
          return (<DeleteAction key={action.name} action={action} deleteDoc={deleteDoc} linkIri={linkIri}/>);
        }else{
          return (<Aux  key={action.name}><RRNavLink to={navLinkTo}  className="btn btn-info" role="button" >{T(action.label)}</RRNavLink>&#160;</Aux>);
        }
      }  
  })
}

export const TitleAndDateColumn = ({docPkg}) =>  {
  const doc = docPkg.akomaNtoso;
  const {docCreatedDate, docModifiedDate} = doc;
  return (
    <Aux>
      <div>
        {getLocalTypeName(doc.docType.value)}: {doc.docTitle.value}
      </div>
      <div className="small text-muted">
       { showCreatedAndModified(docCreatedDate.value, docModifiedDate.value) }
      </div>
    </Aux>
  )
  ;
};

export const DocLangColumn = ({ doc }) => 
  <div>{doc.docLang.value.label}</div>
;

export const DocCountryColumn = ({ doc }) => 
  <div>{doc.docCountry.value}</div>
;

const PAGE_SIZE = 5;

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      titleFilter: '',
      docType: [''],
      subType: [''],
      fromDate:null,
      toDate:null,
      docs: [],
      totalDocs: 0,
      allSelected: false,
      isChecked: [],
      collapse: false
    };
  }
  
  deleteDoc (linkIri) {
    let iri = "/" + linkIri;
    const headers = generateBearerToken(getToken());
    const config = { headers: headers };
    const body = {
      data: {
          "iri": iri
      }
    }
    axios.post(apiUrl('document-delete'), body, config)
    .then(
      (response) => {
          this.getFilteredDocs(1);
        }
    )
    .catch(
      (err) => {
        handleApiException(err);
      }
    );
  }

  resetCheckboxes() {
    let isChecked = [];
    for (let i=0; i<this.state.docs.length; i++) {
      isChecked[i] = false;
    }
    this.setState({isChecked, allSelected: false});
  }

  toggleCheckbox = label => {
    let isChecked = this.state.isChecked;
    isChecked[label] = !this.state.isChecked[label];
    this.setState({isChecked});
  }

  selectAll() {
    let newAllSelected = !this.state.allSelected;

    if (newAllSelected) {
      let isChecked = this.state.isChecked;
      for (let i=0; i<this.state.docs.length; i++) {
        isChecked[i] = true;
      }
      this.setState({isChecked, allSelected: true});
    } else {
      this.resetCheckboxes();
    }
  }

  getSelectedDocs() {
    let selectedDocs = [];
    for (let i=0; i<this.state.isChecked.length; i++) {
      if (this.state.isChecked[i]) {
        selectedDocs.push(this.state.docs[i].akomaNtoso);
      }
    }
    return selectedDocs;
  }
  
  getDocs = (itemsFrom) => {
    const headers = generateBearerToken(getToken());
    const config = { headers: headers };
    const body = {
      data: {
          "docTypes": "all", 
          "itemsFrom": itemsFrom,
          "pageSize": PAGE_SIZE,
          "roles": getRolesForCurrentClient()
        }
    }
    axios.post(apiUrl('documents'), body, config)
    .then(
      (response) => {
          const {code, documents, total} = response.data;
          // check if 0 records returned
          // absence of code means data was returned
          if (code == null && Array.isArray(documents)) {
            this.setState({docs: documents, totalDocs: total});
          } else {
            this.setState({docs: [], totalDocs: 0});
          }
        }
    )
    .catch(
      (err) => {
        handleApiException(err);
      }
    );
  };

  componentDidMount() {
    this.getDocs(1);  //Get from first item
    this.resetCheckboxes();
  }

  onPageClick(selected) {
    //ReactPaginate page indices start from 0.
    let itemsFrom = (selected * PAGE_SIZE) + 1;
    this.getFilteredDocs(itemsFrom);
    this.resetCheckboxes();
  }

  /**
   * Return the real breadcrumb here 
   * 
   * @memberof Dashboard
   */
  getBreadcrumb = () => 
    <Breadcrumb><BreadcrumbItem active>{T("Home")}</BreadcrumbItem></Breadcrumb>;

  
  renderDashboardTableRow = (lang, docs) => {
    return docs.map(
      (docPkg, index) => {
        let doc = docPkg.akomaNtoso;
        return (
          <tr key={ `docs-${doc.docIri.value}`}>
            <td className="text-center">
              <StateColumn stateInfo={docPkg.workflow} />
            </td>
            <td>
              <TitleAndDateColumn docPkg={docPkg} />
            </td>
            <td className="text-center">
              <DocLangColumn doc={doc} />
            </td>
            <td>
              <div className="clearfix">
                <div className="float-left">
                  <strong>{getWFProgress(docPkg.workflow)}%</strong>
                </div>
                <div className="float-right">
                  <small className="text-muted">Jun 11, 2015 - Jul 10, 2015</small>
                </div>
              </div>
              <Progress className="progress-xs" color="success" value={getWFProgress(docPkg.workflow)}/>
            </td>
            <td className="text-center">
              {
                docPkg.workflow.nextStates.map(state => capitalizeFirst(state)).join(",")
              }
            </td>
            <td className="text-center">
                <AllowedActions docPkg={docPkg} deleteDoc={this.deleteDoc.bind(this)}/>
            </td>
            <td className="text-center">
              <Checkbox key={index} label={index} showLabel={false} isChecked={this.state.isChecked[index] || false} handleCheckboxChange={this.toggleCheckbox}/>
            </td>
          </tr>
        );
      }
    )

  };

  renderPagination() {
    let pageCount = Math.ceil(this.state.totalDocs/PAGE_SIZE);
    return (
      <Paginater pageCount={pageCount}
        onPageClick={this.onPageClick.bind(this)} />
    );
  }
  
  handleTitleChange(titleFilter) {
    this.setState({titleFilter: titleFilter})
  }

  handleChangeDocType (docTypeSelected) {
    let docTypeChange = [];
    let subTypeChange = [];
    for(let dType of getDocTypes()){
      if(dType['localTypeName'] === docTypeSelected){
        docTypeChange.push(dType['aknType']);
        subTypeChange.push(dType['localTypeNameNormalized']); 
        break; 
      }
    }
    this.setState({docType:docTypeChange , subType:subTypeChange }, () => {
      this.submitForm();
    });

  }

  handleChangeFromDate(fromDate) {
    this.setState({fromDate: fromDate}, () => {
      this.submitForm();
    })
  }

  handleChangeToDate(toDate) {
    this.setState({toDate: toDate} , () => {
      this.submitForm();
    })
  }

  dateFormatter = (date,id) => {
    if(date === null && id === 0){
      return "1700-01-01";
    }else if (date === null && id === 1){
      return "2100-12-12";
    }else{
      return JSON.stringify(date).substring(1,11) ;
    }  
  }

  getFilteredDocs(itemsFrom) {
    const headers = generateBearerToken(getToken());
    const config = { headers: headers };
    const body = {
      data: {
          "docTypes": "all", 
          "itemsFrom": itemsFrom,
          "pageSize": PAGE_SIZE,
          "roles": getRolesForCurrentClient(),
          "title": this.state.titleFilter,
          "docType": this.state.docType,
          "subType": this.state.subType,
          "fromDate": this.dateFormatter(this.state.fromDate,0),
          "toDate": this.dateFormatter(this.state.toDate,1)
        }
    }
    console.log("data is" + JSON.stringify(body.data));
    axios.post(apiUrl('documents-filter'), body, config)
    .then(
      (response) => {
          const {code, documents, total} = response.data;
          // check if 0 records returned
          // absence of code means data was returned
          if (code == null && Array.isArray(documents)) {
            this.setState({docs: documents, totalDocs: total});
          } else {
            this.setState({docs: [], totalDocs: 0});
          }
        }
    )
    .catch(
      (err) => {
        handleApiException(err);
      }
    );
  }

  submitForm() {
    this.getFilteredDocs(1);
  };

  clearForm() {
    this.setState({
      titleFilter: '',
      docType: [''],
      subType: [''],
      fromDate:null,
      toDate:null
    }, () => {
      this.getDocs(1);
    })
  }

  toggleForm() {
    this.setState({ collapse: !this.state.collapse });
  }


  render() {
    const {docs} = this.state;
    const {lang} = this.props.match.params; 
    const breadcrumb = this.getBreadcrumb();
    return (
      <StdCompContainer breadcrumb={breadcrumb}>
        <DocActions selectedDocs={this.getSelectedDocs()} selectAll={this.selectAll.bind(this)} 
         match={this.props.match} toggleForm={this.toggleForm.bind(this)}/>
        <br />   
              {/*  className="table-outline mb-0 d-none d-sm-table"  */}
        <SearchFilter handleTitleChange={this.handleTitleChange.bind(this)}  
         titleFilter={this.state.titleFilter}
         handleChangeDocType = {this.handleChangeDocType.bind(this)}
         handleChangeFromDate={this.handleChangeFromDate.bind(this)}
         handleChangeToDate={this.handleChangeToDate.bind(this)}
         submitForm={this.submitForm.bind(this)}
         clearForm={this.clearForm.bind(this)}
         collapse={this.state.collapse}
         />       
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> {T("ET.Dashboard.Listing.Documents")}
          </CardHeader>
          <CardBody>
            <Table hover responsive>
            <thead className="thead-light">
            <tr>
              <th className="text-center">{T("ET.Dashboard.Column.State")}</th>
              <th>Title</th>
              <th className="text-center">{T("ET.Dashboard.Column.Language")}</th>
              <th>Workflow</th>
              <th className="text-center">{T("ET.Dashboard.Column.NextStates")}</th>
              <th></th>
              <th></th>
                </tr>
              </thead>
              <tbody>
                {
                  this.renderDashboardTableRow(lang, docs)
                }
              </tbody>
            </Table>
            <div className="text-center">
              {this.renderPagination()}
            </div>
            </CardBody>
        </Card>
    </StdCompContainer>
    );
  }
}

export default Dashboard;