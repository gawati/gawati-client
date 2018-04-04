import React from 'react';
import {Link, Route} from 'react-router-dom';
import axios from 'axios';
import {Breadcrumb, BreadcrumbItem} from 'reactstrap'; 
import { apiUrl } from '../../api';

const routes = {
  "home": "/dashboard"
}

class Breadcrumbs extends React.Component {
  constructor(props) {
    super(props);
    this.state = { docType: "", docTitle: "" }
  }

  getDocument = (pathname) => {
    let iri = pathname.split("_iri").pop();
    axios.post(
      apiUrl('document-open'), {
        data: {"iri": iri}
      }
    )
    .then(
      (response) => {
          const {error, akomaNtoso} = response.data;
          if (error) {
            return error;
          } else {
            this.setState({ docType: akomaNtoso.docType.value, docTitle: akomaNtoso.docTitle.value });
          } 
      }
    )
    .catch(
      (err) => {
        console.log(err);
      }
    );
  };

  //Need both component lifecycle methods
  //To handle refreshes 
  componentDidMount() {
    let { match, location : {pathname} } = this.props;
    if (match.url === "/document" ) {
      this.getDocument(pathname);
    }
  }

  //To handle client side navigation where component is not remounted.
  componentWillReceiveProps(nextProps) {
    let { match, location : {pathname} } = nextProps;
    if (match.url === "/document" ) {
      this.getDocument(pathname);
    }
  } 

  render() {
    let { match, location : {pathname} } = this.props;
    if (this.props.match.url === "/dashboard") {
      return (
        <Breadcrumb>
          <BreadcrumbItem active>Home</BreadcrumbItem>  
        </Breadcrumb>
      );
    } else {
      // this.getDocument(pathname);
      return (
        <Breadcrumb>
          <BreadcrumbItem><a href={routes["home"]}>Home</a></BreadcrumbItem>
          <BreadcrumbItem><a href={routes["home"]}>{this.state.docType}</a></BreadcrumbItem>
          <BreadcrumbItem active>{this.state.docTitle}</BreadcrumbItem>  
        </Breadcrumb>
      );
    }
  }
}

export default Breadcrumbs;