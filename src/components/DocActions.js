import React, { Component } from 'react';
import { NavLink, Route } from 'react-router-dom';
import { CardBody, Card, ButtonGroup, Button } from 'reactstrap';
import { PropsRoute, setInRoute, getRoute } from '../utils/RoutesHelper';

// Display only on the Dashboard view
const AdditionalActions = ({linkDocumentAdd, handleSelectAll}) => (
  <ButtonGroup>
    <Button type="button" className={ `btn btn-link` } >
      <NavLink to={ linkDocumentAdd }>
            <i className="fa fa-plus"></i> Add Document
      </NavLink>
    </Button>
    <Button type="button" className={ `btn btn-link` } onClick={handleSelectAll}>Select All</Button>
  </ButtonGroup>
);

/**
 * To-Do:
 * b. Get route props
 */
export default class DocActions extends Component {

  handleTransition() {
    this.props.selectedDocs.map(doc => {
      console.log("Transition state for ", doc);
    });
  }

  handleSelectAll() {
    this.props.selectAll();
  }

  linkDocumentAdd = () => {
    // const {lang} = this.props.match.params || "en" ;
    const {lang} = "en" ;
    let navLinkTo = setInRoute(
      "document-add",
      {"lang": lang}
    );
    return navLinkTo;
  };

  renderAdditional() {
    return (
      <ButtonGroup>
        <Button type="button" className={ `btn btn-link` } >
          <NavLink to={ this.linkDocumentAdd() }>
                <i className="fa fa-plus"></i> Add Document
          </NavLink>
        </Button>
        <Button type="button" className={ `btn btn-link` } onClick={this.handleSelectAll.bind(this)}>Select All</Button>
      </ButtonGroup>
    )
  }

  render() {
    return(
      <Card className="bg-white text-right mt-1 mb-1">
        <CardBody className="pt-0 pb-0 pl-0 pr-0">
          <ButtonGroup className="float-left">
            <Button type="button" className={ `btn btn-link` } onClick={this.handleTransition.bind(this)}>Transition</Button>
            <Button type="button" className={ `btn btn-link` }>Action A</Button>
            <Button type="button" className={ `btn btn-link` }>Action B</Button>
          </ButtonGroup>

          <PropsRoute path={ getRoute("logged-in-root") } component={AdditionalActions} linkDocumentAdd={this.linkDocumentAdd()} handleSelectAll={this.handleSelectAll.bind(this)} />

        </CardBody>
      </Card>
    )
  }
}
