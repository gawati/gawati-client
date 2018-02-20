import React from 'react';
import {FormControl} from './FormControl';
import { Label, Input, Row, Col} from 'reactstrap';



class FileUpload extends React.Component {


    onFormSubmit(evt){
        evt.preventDefault();
        this.fileUpload(this.state.file)
            .then((response)=>{
                console.log(response.data);
            });
    }


    render() {
        const {fileValue, title, fileType, fileName} = this.props ;
        console.log(" PROPS = fileValue, title, fileType, fileName ", fileValue, title, fileType, fileName);
        const {onChangeFile, onChangeFileTitle, commonkey} = this.props ; 
        return (
             <Row className="mb-4">
                <Col xs="12">
                    <Row>
                      <Col xs="12">
                        <input type="file" className="form-control-file" forkey={commonkey} id="file" name="file" onChange={onChangeFile} />
                      </Col>  
                    </Row>
                    <Row>
                      <Col xs="6">
                        <FormControl>
                            <Label htmlFor="docAttType">Upload File Type</Label>
                            <input type="text" name="docAttType" 
                                forkey={commonkey}
                                className="form-control"
                                value={ fileType } 
                                id="doctype"
                                readOnly="true"
                                placeholder="Upload File Type" required/>
                        </FormControl>
                      </Col>
                      <Col xs="6">
                        <FormControl>
                            <Label htmlFor="docAttTitle">File Title</Label>
                            <Input type="text" name="docAttTitle" 
                                forkey={commonkey}
                                className="form-control"
                                onChange={ onChangeFileTitle }
                                value={ title }  
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