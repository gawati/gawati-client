import React from 'react';
import {FormControl} from './FormControl';
import { Label, Input, Row, Col, Button} from 'reactstrap';
import axios, {post} from 'axios';


class FileUpload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            fileMIMEType: null
        };

        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.fileUpload = this.fileUpload.bind(this)

    };

    onChange(evt) {
        console.log(" FILE == ", evt.target.files[0]);
        this.setState({file: evt.target.files[0]});
    }
    
    onFormSubmit(evt){
        evt.preventDefault();
        this.fileUpload(this.state.file)
            .then((response)=>{
                console.log(response.data);
            });
    }

    fileUpload(file){
        const url = 'http://example.com/file-upload';
        const formData = new FormData();
        formData.append('file', file)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return  post(url, formData,config)
    }

    render() {
        return (
             <Row className="mb-4">
                <Col xs="12">
                    <Row>
                      <Col xs="12">
                        <Input type="file" onChange={this.onChange} />
                      </Col>  
                    </Row>
                    <Row>
                      <Col xs="6">
                        <FormControl>
                            <Label htmlFor="docAttType">Upload File Type</Label>
                            <Input type="text" name="docAttType" 
                                defaultValue="value" 
                                id="doctitle"
                                readOnly="true"
                                placeholder="Upload File Type" required/>
                        </FormControl>
                      </Col>
                      <Col xs="6">
                        <FormControl>
                            <Label htmlFor="docAttTitle">File Title</Label>
                            <Input type="text" name="docAttTitle" 
                                defaultValue="value"  
                                id="doctitle"
                                placeholder="File Title" required/>
                        </FormControl>
                      </Col>
                    </Row>
                </Col> 
            </Row>
        );
    }
};

export default FileUpload;