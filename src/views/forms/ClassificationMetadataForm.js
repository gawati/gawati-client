import React from 'react';
import axios from 'axios';
import Select from 'react-select';
import {apiGetCall} from '../../api';
import { ToastContainer, toast } from 'react-toastify';
import {Row, Col, Button, Input} from 'reactstrap';

/**
 * This needs to be converted to use the baseformHOC
 */
class ClassificationMetadataForm extends React.Component {

    constructor(props) {
        super(props);
        this.changeMetaData = this.changeMetaData.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleAddMoreMetadata = this.handleAddMoreMetadata.bind(this);
        this.state = {
            metadata:[],
            existingMetadata: [],
            inputValue:''
        };
    }

    handleChange = (e, { name, value }) => { this.setState({ [name]: value }); }

    handleInput(e) {
    	this.setState({
          inputValue: e.target.value
        });
    }
    deleteClassification(member){
        console.log(member);
        let metadataArray = [];
        let isPresent = false;
        for(let i=0; i<this.state.existingMetadata.length; i++){
        	if(this.state.existingMetadata[i].value===member.value){
        		isPresent = true;
        	}else{
        		metadataArray.push({value:this.state.existingMetadata[i].value, showAs:this.state.existingMetadata[i].showAs})
        	}
        }

        if(!isPresent){
        	toast.error("Metadata does not exist");
        	return;
        }
        
        let data = {
        	metadata: metadataArray,
        	iri: this.props.pkg.pkgIdentity.docIri.value
        }

        let apiMetadata = apiGetCall(
            'documents-metadata-add', {}
        );
        
        axios.post(apiMetadata, {data
        }) 
        .then(response => {
            this.setState({existingMetadata: metadataArray});
            toast.success("Metadata deleted successfully");
            console.log(response);
        })
        .catch(function(error) {
            console.log('There is some error' + error);
        }); 
    }

    changeMetaData(e) {
        
        let isPresent = false;
        for(let i=0; i<this.state.existingMetadata.length; i++){
        	if(this.state.existingMetadata[i].value===e.value){
        		isPresent = true;
        		break;
        	}
        }

        let metadataArray = this.state.existingMetadata

        if(isPresent){
        	toast.error("Metadata is already present");
        	return;
        }

        metadataArray.push({value:e.value, showAs:e.label});
        
        let data = {
        	metadata: metadataArray,
        	iri: this.props.pkg.pkgIdentity.docIri.value
        }

        let apiMetadata = apiGetCall(
            'documents-metadata-add', {}
        );
        
        axios.post(apiMetadata, {data
        }) 
        .then(response => {
            this.setState({existingMetadata: metadataArray});
            toast.success("Metadata added successfully");
        })
        .catch(function(error) {
            console.log('There is some error' + error);
        }); 


    }

    handleAddMoreMetadata(event) {
    	event.preventDefault();
        const showAs = this.state.inputValue;
        if(showAs===''){
        	toast.error("Enter metadata");
        	return;
        }
        const value = this.state.inputValue.replace(/ /g,'');

        let isInExistingList = false;
        for(let i=0; i<this.state.existingMetadata.length; i++){
        	if(this.state.existingMetadata[i].value===value){
        		isInExistingList = true;
        		break;
        	}
        }
        if(isInExistingList){
        	toast.error("Metadata is already present");
        	return;
        }
        
        let isInList = false;
        for(let i=0; i<this.state.metadata.length; i++){
        	if(this.state.metadata[i].value===value){
        		isInList = true;
        		break;
        	}
        }
        if(isInList){
        	toast.error("Metadata is present in list. Kindly choose from list");
        	return;
        }


        let metadataArray = this.state.existingMetadata

        metadataArray.push({value:value, showAs:showAs});
        
        let data = {
        	metadata: metadataArray,
        	iri: this.props.pkg.pkgIdentity.docIri.value
        }

        let apiMetadata = apiGetCall(
            'documents-metadata-add', {}
        );
        
        axios.post(apiMetadata, {data
        }) 
        .then(response => {
            this.setState({existingMetadata: metadataArray});
            this.setState({ inputValue: ''});
            toast.success("Metadata added successfully");
        })
        .catch(function(error) {
            console.log('There is some error' + error);
        });

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

        const docClassifications = this.props.pkg.pkgIdentity.docClassifications;
        let existingMetaArray = [];
        if(docClassifications!==undefined && docClassifications.keyword!==undefined && docClassifications.keyword.length>0){
        	for(let i=0; i<docClassifications.keyword.length; i++){
        		existingMetaArray.push({value: docClassifications.keyword[i].value, showAs: docClassifications.keyword[i].showAs})
        	}
        	console.log(existingMetaArray);
        	this.setState({existingMetadata: existingMetaArray});
        }

    }

    renderClassifications = () => {
    	if(this.state.existingMetadata.length){
    		return (
              <div>
                  <table className="table table-hover">
                      <thead>
                          <tr>
                              <th>Value</th>
                              <th>Show As</th>
                              <th>Action</th>
                          </tr>
                      </thead>
                      <tbody>
                      {this.state.existingMetadata.map(member =>
                          <tr key={member.value}>
                          <td>{member.value}</td>
                          <td>{member.showAs}</td>
                          <td><a onClick={() => this.deleteClassification(member)}>Delete</a></td>
                          </tr>
                      )}
                      </tbody>
                  </table>
              </div>
          	);
    	}else{
    		return(
    			<div>
		            <div>No Classfication Metadata Found</div>
		        </div>
    		);
    	}
    }

    renderClassificationForm = () => {
        
        let result = this.renderClassifications();

        let metadataArray = [];
        for(let i=0; i<this.state.metadata.length;i++){
            metadataArray.push({value:this.state.metadata[i].value, label:this.state.metadata[i].showAs});
        }

        return ( 
            <div className="bg-white">
            	<ToastContainer />
                <div className="card">
                    <div className="card-header">
                        <h6> Choose from existing Metadata </h6> 
                    </div>
                    <div className="card-body">
                        <Select
                            name="metadata"
                            onChange={this.changeMetaData}
                            options={metadataArray}
                          />
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <h6> Add New Metadata </h6> 
                    </div>
                    <div className="card-body">
                    	<Row>
	                    	<Col sm={6}>
	                    		<Input type="text"  value={this.state.inputValue} name="value" onChange={this.handleInput} placeholder="Metadata Name" />
	                    	</Col>
	                    	<Col sm={4}>
	                    		<Button type="button" onClick={this.handleAddMoreMetadata}  name="btn" size="sm" color="primary" ><i className="fa fa-plus"></i> Add Metadata</Button>
	                    	</Col>
                    	</Row>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <h6> Already added Metadata </h6> 
                    </div>
                    <div className="card-body">
                        {result} 
                    </div>
                </div>
            </div>

        );
    }

    render = () => {
    	return this.renderClassificationForm();
    }
  
};

export default ClassificationMetadataForm;