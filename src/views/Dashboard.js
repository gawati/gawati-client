import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {Breadcrumb, BreadcrumbItem,  Button, Table, Progress, Pagination, PaginationItem, PaginationLink, CardHeader, CardBody, Card} from 'reactstrap';
import axios from 'axios';

import { handleApiException } from './dashboard.handlers';

import { apiUrl } from '../api';
import {Aux, getWFProgress, capitalizeFirst} from '../utils/GeneralHelper';
import {humanDate, displayXmlDateTime} from '../utils/DateHelper';
import { setInRoute } from '../utils/RoutesHelper';
import StdCompContainer from '../components/general/StdCompContainer';

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



class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      docs: []
    };
  }

  getDocs = () => {
    axios.post(
      apiUrl('documents'), {
        data: {
          "docTypes": "all", 
          "itemsFrom":1, 
          "pageSize": 10
        }
      }
      )
    .then(
      (response) => {
          this.setState({docs: response.data.documents });
        }
    )
    .catch(
      (err) => {
        handleApiException(err);
      }
    );
  };

  linkDocumentAdd  = () => {
    const {lang} = this.props.match.params || "en" ;
    let navLinkTo = setInRoute(
      "document-add", 
      {"lang": lang}
    );
    return navLinkTo;
  };

  componentDidMount() {
    this.getDocs();
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
          </tr>
        );
      }
    )

  };

  render() {
    const {docs} = this.state;
    const addLink = this.linkDocumentAdd();
    const breadcrumb = this.getBreadcrumb();
    return (
      <StdCompContainer breadcrumb={breadcrumb}>
         {/** dummy action bar to be replaced by real one */}
        <Card className="bg-white text-right mt-1 mb-1">
          <CardBody className="pt-0 pb-0">
            <Button type="button" name="btn" className={ `btn btn-link` } >
              <NavLink to={ addLink }>
                    <i className="fa fa-plus"></i> Add Document
              </NavLink>
            </Button>                
            </CardBody>
        </Card>      
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
                </tr>
              </thead>
              <tbody>
                {
                  this.renderDashboardTableRow(docs)
                }
              </tbody>
            </Table>
            <div className="text-center">
                <Pagination>
                    <PaginationItem>
                      <PaginationLink previous href="#"></PaginationLink>
                    </PaginationItem>
                    <PaginationItem active>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">4</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink next href="#"></PaginationLink>
                    </PaginationItem>
                  </Pagination>
              </div>
            </CardBody>
        </Card>
    </StdCompContainer>
    );
  }
}

export default Dashboard;