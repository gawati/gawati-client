import React, { Component } from 'react';

import {Breadcrumb, BreadcrumbItem, Table, Progress, CardHeader, CardBody, Card} from 'reactstrap';
import axios from 'axios';

import { handleApiException } from './dashboard.handlers';

import { apiUrl } from '../api';

import RRNavLink from '../components/utils/RRNavLink';
import { T } from '../utils/i18nHelper';

import {Aux, getWFProgress, capitalizeFirst} from '../utils/GeneralHelper';
import {humanDate, displayXmlDateTime} from '../utils/DateHelper';
import { getLocalTypeName } from '../utils/DocTypesHelper';
import {typicalDashboardPermissions} from "../utils/DocPermissionsHelper";
import { setInRoute } from '../utils/RoutesHelper';

import StdCompContainer from '../components/general/StdCompContainer';
import Paginater from "../components/ui_elements/Paginater";
import DocActions from "../components/DocActions";
import Checkbox from "../components/widgets/Checkbox";

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


export const AllowedActions = ({docPkg}) => {
  const roles = getRolesForCurrentClient();
  const typical = typicalDashboardPermissions(docPkg, roles);
  const documentIri = docIri(docPkg);
  const linkIri = documentIri.startsWith("/") ? documentIri.slice(1): documentIri ; 
  return typical.map( (action, i, origArr) => {
      const navLinkTo = setInRoute(
        `document-ident-${action.name}`, 
        {"lang": "en", "iri": linkIri }
      );
      if (origArr.length - 1 ===  i) {
        // last item
        return <RRNavLink key={action.name} className="btn btn-info" role="button" to={navLinkTo}>{T(action.label)}</RRNavLink>;
      } else {
        // any other item
        return <Aux  key={action.name}><RRNavLink to={navLinkTo}  className="btn btn-info" role="button" >{T(action.label)}</RRNavLink>&#160;</Aux>;
      }
    })
 ;
}

export const TitleAndDateColumn = ({docPkg}) =>  {
  const {created, modified} = docPkg;
  const doc = docPkg.akomaNtoso;
  return (
    <Aux>
      <div>
        {getLocalTypeName(doc.docType.value)}: {doc.docTitle.value}
      </div>
      <div className="small text-muted">
       { showCreatedAndModified(created, modified) }
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
      docs: [],
      totalDocs: 0,
      allSelected: false,
      isChecked: []
    };
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
          "pageSize": PAGE_SIZE
        }
    }
    axios.post(apiUrl('documents'), body, config)
    .then(
      (response) => {
          this.setState({docs: response.data.documents, totalDocs: response.data.total});
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
    this.getDocs(itemsFrom);
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
                <AllowedActions docPkg={docPkg} />
            </td>
            <td className="text-center">
              <Checkbox key={index} label={index} showLabel={false} isChecked={this.state.isChecked[index]} handleCheckboxChange={this.toggleCheckbox}/>
            </td>
          </tr>
        );
      }
    )

  };

  renderPagination() {
    let pageCount = this.state.totalDocs/PAGE_SIZE > 1 ? this.state.totalDocs : 1;
    return (
      <Paginater pageCount={pageCount}
        onPageClick={this.onPageClick.bind(this)} />
    );
  }
  

  render() {
    const {docs} = this.state;
    console.log("DASHBOARD/COLUMN/STATE ", T("ET.Dashboard.Column.State"));
    const {lang} = this.props.match.params; 
    const breadcrumb = this.getBreadcrumb();
    return (
      <StdCompContainer breadcrumb={breadcrumb}>
        <DocActions selectedDocs={this.getSelectedDocs()} selectAll={this.selectAll.bind(this)} match={this.props.match} />
        <br />   
              {/*  className="table-outline mb-0 d-none d-sm-table"  */}
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