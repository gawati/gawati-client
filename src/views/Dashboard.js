import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {Row, Col, Table, Progress, Pagination, PaginationItem, PaginationLink, CardHeader, CardBody, Card} from 'reactstrap';
import axios from 'axios';

import { handleApiException } from './dashboard.handlers';

import { apiGetCall, apiUrl } from '../api';
import {Aux} from '../utils/GeneralHelper';
import {humanDate, displayXmlDateTime} from '../utils/DateHelper';
import { setInRoute } from '../utils/RoutesHelper';

export const StateColumn = ({ doc }) => 
  <div>{ "draft" }</div>
;

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
    console.log(" GET DOCS === " , apiUrl('documents'));
    axios.post(
      apiUrl('documents'), {
        data: {"docTypes": "all"}
      }
      )
    .then(
      (response) => {
          console.log(" response.data ", response.data);
          this.setState({docs: response.data.package });
        }
    )
    .catch(
      (err) => {
        handleApiException(err);
      }
    );
  };

  getDocs2 = () => {
     let apiDocs = apiGetCall('documents', {});
     axios.get(apiDocs)
     .then(
        (response) => {
          console.log(" getDocs2 ", docs);
          const {docs} = response.data;

          this.setState({
            docs: docs
          });
        }
     ).catch(
        (err) => {
          console.log(" ERROR ", err) ;
        }
     );
  }

  componentDidMount() {
    this.getDocs();
  }


  render() {
    const {docs} = this.state;
    console.log(" DOCS + ", docs);
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12" lg="12">   
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
            <th className="text-center">Country</th>
          </tr>
        </thead>
        <tbody>
          {
            docs.map(
              (docPkg, index) => {
                let doc = docPkg.akomaNtoso;
                return (
                  <tr key={ `docs-${doc.docIri.value}`}>
                    <td className="text-center">
                      <StateColumn doc={doc} />
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
                          <strong>50%</strong>
                        </div>
                        <div className="float-right">
                          <small className="text-muted">Jun 11, 2015 - Jul 10, 2015</small>
                        </div>
                      </div>
                      <Progress className="progress-xs" color="success" value="50"/>
                    </td>
                    <td className="text-center">
                      <DocCountryColumn doc={doc} />
                    </td>
                  </tr>
                );
              }
            )

          }
           {/*  <tr>
              <td className="text-center">
                <div className="avatar">
                  <img src={'img/avatars/1.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com"/>
                  <span className="avatar-status badge-success"></span>
                </div>
              </td>
              <td>
                <div>Yiorgos Avraamu</div>
                <div className="small text-muted">
                  <span>New</span> | Registered: Jan 1, 2015
                </div>
              </td>
              <td className="text-center">
                <img src={'img/flags/USA.png'} alt="USA" style={{height: 24 + 'px'}}/>
              </td>
              <td>
                <div className="clearfix">
                  <div className="float-left">
                    <strong>50%</strong>
                  </div>
                  <div className="float-right">
                    <small className="text-muted">Jun 11, 2015 - Jul 10, 2015</small>
                  </div>
                </div>
                <Progress className="progress-xs" color="success" value="50"/>
              </td>
              <td className="text-center">
                <i className="fa fa-cc-mastercard" style={{fontSize: 24 + 'px'}}></i>
              </td>
              <td>
                <div className="small text-muted">Last login</div>
                <strong>10 sec ago</strong>
              </td>
              </tr>
              <tr>
                <td className="text-center">
                  <div className="avatar">
                    <img src={'img/avatars/2.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com"/>
                    <span className="avatar-status badge-danger"></span>
                  </div>
                </td>
                <td>
                  <div>Avram Tarasios</div>
                  <div className="small text-muted">

                    <span>Recurring</span> | Registered: Jan 1, 2015
                  </div>
                </td>
                <td className="text-center">
                  <img src={'img/flags/Brazil.png'} alt="Brazil" style={{height: 24 + 'px'}}/>
                </td>
                <td>
                  <div className="clearfix">
                    <div className="float-left">
                      <strong>10%</strong>
                    </div>
                    <div className="float-right">
                      <small className="text-muted">Jun 11, 2015 - Jul 10, 2015</small>
                    </div>
                  </div>
                  <Progress className="progress-xs" color="info" value="10"/>
                </td>
                <td className="text-center">
                  <i className="fa fa-cc-visa" style={{fontSize: 24 + 'px'}}></i>
                </td>
                <td>
                  <div className="small text-muted">Last login</div>
                  <strong>5 minutes ago</strong>
                </td>
              </tr>
              <tr>
                <td className="text-center">
                  <div className="avatar">
                    <img src={'img/avatars/3.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com"/>
                    <span className="avatar-status badge-warning"></span>
                  </div>
                </td>
                <td>
                  <div>Quintin Ed</div>
                  <div className="small text-muted">
                    <span>New</span> | Registered: Jan 1, 2015
                  </div>
                </td>
                <td className="text-center">
                  <img src={'img/flags/India.png'} alt="India" style={{height: 24 + 'px'}}/>
                </td>
                <td>
                  <div className="clearfix">
                    <div className="float-left">
                      <strong>74%</strong>
                    </div>
                    <div className="float-right">
                      <small className="text-muted">Jun 11, 2015 - Jul 10, 2015</small>
                    </div>
                  </div>
                  <Progress className="progress-xs" color="warning" value="74"/>
                </td>
                <td className="text-center">
                  <i className="fa fa-cc-stripe" style={{fontSize: 24 + 'px'}}></i>
                </td>
                <td>
                  <div className="small text-muted">Last login</div>
                  <strong>1 hour ago</strong>
                </td>
              </tr>
              <tr>
                <td className="text-center">
                  <div className="avatar">
                    <img src={'img/avatars/4.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com"/>
                    <span className="avatar-status badge-secondary"></span>
                  </div>
                </td>
                <td>
                  <div>Enéas Kwadwo</div>
                  <div className="small text-muted">
                    <span>New</span> | Registered: Jan 1, 2015
                  </div>
                </td>
                <td className="text-center">
                  <img src={'img/flags/France.png'} alt="France" style={{height: 24 + 'px'}}/>
                </td>
                <td>
                  <div className="clearfix">
                    <div className="float-left">
                      <strong>98%</strong>
                    </div>
                    <div className="float-right">
                      <small className="text-muted">Jun 11, 2015 - Jul 10, 2015</small>
                    </div>
                  </div>
                  <Progress className="progress-xs" color="danger" value="98"/>
                </td>
                <td className="text-center">
                  <i className="fa fa-paypal" style={{fontSize: 24 + 'px'}}></i>
                </td>
                <td>
                  <div className="small text-muted">Last login</div>
                  <strong>Last month</strong>
                </td>
              </tr>
              <tr>
                <td className="text-center">
                  <div className="avatar">
                    <img src={'img/avatars/5.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com"/>
                    <span className="avatar-status badge-success"></span>
                  </div>
                </td>
                <td>
                  <div>Agapetus Tadeáš</div>
                  <div className="small text-muted">
                    <span>New</span> | Registered: Jan 1, 2015
                  </div>
                </td>
                <td className="text-center">
                  <img src={'img/flags/Spain.png'} alt="Spain" style={{height: 24 + 'px'}}/>
                </td>
                <td>
                  <div className="clearfix">
                    <div className="float-left">
                      <strong>22%</strong>
                    </div>
                    <div className="float-right">
                      <small className="text-muted">Jun 11, 2015 - Jul 10, 2015</small>
                    </div>
                  </div>
                  <Progress className="progress-xs" color="info" value="22"/>
                </td>
                <td className="text-center">
                  <i className="fa fa-google-wallet" style={{fontSize: 24 + 'px'}}></i>
                </td>
                <td>
                  <div className="small text-muted">Last login</div>
                  <strong>Last week</strong>
                </td>
              </tr>
              <tr>
                <td className="text-center">
                  <div className="avatar">
                    <img src={'img/avatars/6.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com"/>
                    <span className="avatar-status badge-danger"></span>
                  </div>
                </td>
                <td>
                  <div>Friderik Dávid</div>
                  <div className="small text-muted">
                    <span>New</span> | Registered: Jan 1, 2015
                  </div>
                </td>
                <td className="text-center">
                  <img src={'img/flags/Poland.png'} alt="Poland" style={{height: 24 + 'px'}}/>
                </td>
                <td>
                  <div className="clearfix">
                    <div className="float-left">
                      <strong>43%</strong>
                    </div>
                    <div className="float-right">
                      <small className="text-muted">Jun 11, 2015 - Jul 10, 2015</small>
                    </div>
                  </div>
                  <Progress className="progress-xs" color="success" value="43"/>
                </td>
                <td className="text-center">
                  <i className="fa fa-cc-amex" style={{fontSize: 24 + 'px'}}></i>
                </td>
                <td>
                  <div className="small text-muted">Last login</div>
                  <strong>Yesterday</strong>
                </td>
              </tr> */}
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
         </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;