import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';

export default class Pagination extends Component {
  constructor(props) {
    super(props);
  }

  handlePageClick = (data) => {
    this.props.onPageClick(data.selected);    
  };

  render() {
    return(
      <ReactPaginate previousLabel={"<<"} nextLabel={">>"}
                     breakLabel={<a href="">...</a>} breakClassName={"break-me"}
                     pageCount={this.props.pageCount}
                     marginPagesDisplayed={2} pageRangeDisplayed={5}
                     onPageChange={this.handlePageClick}
                     containerClassName={"pagination"}                      subContainerClassName={"pages pagination"}
                     activeClassName={"active"} />
    );
  }
}