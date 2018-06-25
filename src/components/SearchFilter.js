import React, { Component } from 'react';
import { Row, Col, CardFooter,CardBody, Card, Button, Collapse } from 'reactstrap';
import DocTypes from '../views/forms/DocTypes.js';
import FromDate from '../views/forms/FromDate.js';
import ToDate from '../views/forms/ToDate.js';
import SearchTitle from '../views/forms/SearchTitle.js';
import {Aux} from '../utils/GeneralHelper';

export default class SearchFilter extends Component {

  constructor(props) {
    super(props);
    this.state = { titleFilter: '',
      docTypeSelected : '',
      fromDate:null,
      toDate:null,
    };
  }

  handleTitleChange(event) {
    let titleFilter = event.currentTarget.value
    this.setState({titleFilter: titleFilter}, () => {
      this.props.handleTitleChange(titleFilter);
    })
  }

  handleKeyPressTitle(event) {
    if(event.key === 'Enter'){
      this.props.submitForm();
    }
  }

  handleChangeDocType(event) {
    let docTypeSelected = event.currentTarget.value;
    this.setState({docTypeSelected: docTypeSelected}, () => {
      this.props.handleChangeDocType(docTypeSelected);
    })
  }

  handleChangeFromDate(event) {
    let fromDate = event;
    this.setState({fromDate: fromDate}, () => {
       this.props.handleChangeFromDate(fromDate);
    })
  }

  handleChangeToDate(event) {
    let toDate = event;
    this.setState({toDate: toDate}, () => {
      this.props.handleChangeToDate(toDate);   
    })
  }
  
  submitForm() {
    this.props.submitForm();
  }

  clearForm() {
    this.setState({ titleFilter: '',
      docTypeSelected: '',
      fromDate: null,
      toDate: null}, () => {
        this.props.clearForm();
      })
  }

  render() {
      return (
        <Aux>
          <Collapse isOpen={this.props.collapse}>
            <Card className="doc-form-card">
              <CardBody>
                <Row>
                  <Col xs="4">
                    <SearchTitle onChange={this.handleTitleChange.bind(this)} onKeyPress={this.handleKeyPressTitle.bind(this)} value={this.state.titleFilter}/>
                  </Col>
                  <Col xs="4">
                    <DocTypes name="docTypes" onChange={this.handleChangeDocType.bind(this)} value={this.state.docTypeSelected} />
                  </Col>
                </Row>
                <br />              
                <Row>
                  <Col xs="4">
                    <FromDate onChange={this.handleChangeFromDate.bind(this)} value={this.state.fromDate} />
                  </Col>
                  <Col xs="4">
                    <ToDate onChange={this.handleChangeToDate.bind(this)} value={this.state.toDate} />
                  </Col>
                </Row>
                <br />
                <CardFooter>
                <Row>
                  <Col xs="9"/>
                  { " " }
                  <Button className="btn-space-7" type="button" onClick={this.submitForm.bind(this)} name="btnSubmit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Search </Button>
                  { " " }
                  <Button type="reset" size="sm" color="danger" onClick={this.clearForm.bind(this)}><i className="fa fa-ban"></i> Reset</Button>
                </Row>  
                </CardFooter>
              </CardBody>
            </Card>
          </Collapse>
        </Aux>
      )
  }
}
