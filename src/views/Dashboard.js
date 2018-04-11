import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {Breadcrumb, BreadcrumbItem, Table, Progress, CardHeader, CardBody, Card} from 'reactstrap';
import axios from 'axios';

import { handleApiException } from './dashboard.handlers';

import { apiUrl } from '../api';
import {Aux, getWFProgress, capitalizeFirst} from '../utils/GeneralHelper';
import {humanDate, displayXmlDateTime} from '../utils/DateHelper';
import { setInRoute } from '../utils/RoutesHelper';
import StdCompContainer from '../components/general/StdCompContainer';
import Paginater from "../components/ui_elements/Paginater";
import DocActions from "../components/DocActions";
import Checkbox from "../components/widgets/Checkbox";

export const StateColumn = ({ stateInfo }) =>  {
  console.log(" StateColumn ", stateInfo);
  return (
    <div data-status={stateInfo.state.status}>{ stateInfo.state.label }</div>
  );
}

const showCreatedAndModified = (created, modified) => {
  return (created === modified) ?
        `created: ${ displayXmlDateTime(created) }` : 
        `created: ${ displayXmlDateTime(created) } / modified: ${ humanDate(modified) }`;
};

export const TitleAndDateColumn = ({docPkg}) =>  {
  const {created, modified} = docPkg;
  const doc = docPkg.akomaNtoso;
  let linkIri = doc.docIri.value.startsWith("/") ? doc.docIri.value.slice(1): doc.docIri.value ; 
  let navLinkTo = setInRoute(
      "document-ident-open", 
      {"lang": "en", "iri": linkIri }
  );

  
  return (
    <Aux>
      <div>
        <NavLink to={ navLinkTo }>{doc.docTitle.value}</NavLink>
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

const PAGE_SIZE = 2;

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
    axios.post(
      apiUrl('documents'), {
        data: {
          "docTypes": "all", 
          "itemsFrom": itemsFrom,
          "pageSize": PAGE_SIZE
        }
      }
      )
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
    <Breadcrumb><BreadcrumbItem active>Home</BreadcrumbItem></Breadcrumb>;
  
  renderDashboardTableRow = (docs) => {
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
              <DocCountryColumn doc={doc} />
            </td>
            <td className="float-right">
              <Checkbox key={index} label={index} showLabel={false} isChecked={this.state.isChecked[index]} handleCheckboxChange={this.toggleCheckbox}/>
            </td>
          </tr>
        );
      }
    )

  };

  renderPagination() {
    let pageCount = this.state.totalDocs/PAGE_SIZE > 1 ? this.state.totalDocs : 1;
    console.log(" PAGE COUNT = ", this.state.totalDocs, pageCount);
    return (
      <Paginater pageCount={pageCount}
        onPageClick={this.onPageClick.bind(this)} />
    );
  }
  

  render() {
    const {docs} = this.state;
    const breadcrumb = this.getBreadcrumb();
    return (
      <StdCompContainer breadcrumb={breadcrumb}>
        <DocActions selectedDocs={this.getSelectedDocs()} selectAll={this.selectAll.bind(this)} match={this.props.match} />
        <br />   
              {/*  className="table-outline mb-0 d-none d-sm-table"  */}
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Documents
          </CardHeader>
          <CardBody>
            <Table hover responsive>
              <thead className="thead-light">
                <tr>
                  <th className="text-center">State</th>
                  <th>Title</th>
                  <th className="text-center">Language</th>
                  <th>Workflow</th>
                  <th className="text-center">Next States</th>
                  <th className="text-center">Country</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {
                  this.renderDashboardTableRow(docs)
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