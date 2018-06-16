import React from 'react';
import axios from 'axios';
import Select from 'react-select';
import {apiGetCall} from '../../api';

/**
 * This needs to be converted to use the baseformHOC
 */
class ClassificationMetadataForm extends React.Component {

    constructor(props) {
        super(props);
        this.changeMetaData = this.changeMetaData.bind(this);
        this.state = {
            metadata:[]
        };
    }

    handleChange = (e, { name, value }) => { this.setState({ [name]: value }); }

    renderNoClassifications = () =>
        <div>
            <div>No Classfication Metadata Found</div>
        </div>;

    deleteClassification(member){
        console.log(member);
        // let data = {
        //     _id: member._id
        // }

        // let apiClassification = apiGetCall(
        //     'delete-classification', {}
        // );
        
        // axios.delete(apiClassification, {data
        // }) 
        // .then(response => {
        //     let classifications = this.state.docClassifications;
        //     let index = classifications.indexOf(member);
        //     this.setState({
        //         docClassifications: this.state.docClassifications.filter((_, i) => i !== index)
        //     });
        //     toast.success("Classification deleted successfully");
        // })
        // .catch(function(error) {
        //     console.log('There is some error' + error);
        // });
    }

    changeMetaData(e) {
        console.log(e);
    }

    componentDidMount() {
        
      let apiMetadata = apiGetCall(
            'documents-metadata', {}
        );
        
        axios.get(apiMetadata, {
        }) 
        .then(response => {
            this.setState({ metadata: response.data.metadata});
            console.log(response);
        })
        .catch(function(error) {
            console.log('There is some error' + error);
        }); 

    }

    renderClassifications = (members) => {
        return (
              <div>
                  <table className="table table-hover">
                      <thead>
                          <tr>
                              <th>Dictionary</th>
                              <th>EId</th>
                              <th>Value</th>
                              <th>Show As</th>
                              <th>Action</th>
                          </tr>
                      </thead>
                      <tbody>
                      {members.map(member =>
                          <tr key={member.eId}>
                          <td>{member.dictionary} </td>
                          <td>{member.eId}</td>
                          <td>{member.showAs}</td>
                          <td>{member.value}</td>
                          <td><a onClick={() => this.deleteClassification(member)}>Delete</a></td>
                          </tr>
                      )}
                      </tbody>
                  </table>
              </div>
          );
    }

    renderClassificationForm = () => {
        const docClassifications = this.props.pkg.pkgIdentity.docClassifications;
        let result;
        if(docClassifications.keyword!==undefined && docClassifications.keyword.length>0){
            result = this.renderClassifications(docClassifications.keyword);
        }else{
            result = this.renderNoClassifications();
        }

        let metadataArray = [];
        for(let i=0; i<this.state.metadata.length;i++){
            metadataArray.push({value:this.state.metadata[i].value, label:this.state.metadata[i].showAs});
        }

        return ( 
            <div>
            <h6> Add More Metadata </h6> 
            <Select
                name="metadata"
                onChange={this.changeMetaData}
                options={metadataArray}
              />
            <h6> Already added Metadata </h6> 
            {result} 
            </div>

        );
    }

    render = () => {
        return this.renderClassificationForm();
    }
  
};

export default ClassificationMetadataForm;