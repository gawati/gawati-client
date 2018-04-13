import React from 'react';
import {FormControl} from './FormControl';
import { Label, Input, Row, Col, Button} from 'reactstrap';
import axios from 'axios';
import {dataProxyServer} from '../../constants';

/**
 * Upload component for files. Event handlers for File input and Title input need to be 
 * passed in , along with a key to identify the group of fields
 * 
 * @class FileUpload
 * @extends {React.Component}
 */
class FileUpload extends React.Component {
    handleSaveFile() {
        const {fileValue, title, fileType, fileName, getDocIndex, commonkey} = this.props ;
        let index = getDocIndex(commonkey);
        console.log("Save attachment: ", index, title);

        let data = new FormData();
        if (fileValue) {
            if (title) {
                data.append(`file_${index}`, fileValue);
                data.append(`fileName_${index}`, fileName);
                data.append(`title_${index}`, title);
                data.append(`fileType_${index}`, fileType);
                data.append(`key_${index}`, commonkey);
            }
        }

        axios.post(dataProxyServer() + '/gwc/document/upload', data, {
            headers: { "X-Requested-With": "XMLHttpRequest" }
        }).then((response) => {
            console.log(" RESPONSE >  DATA ", response.data);
            //handleSuccess(response.data);
        }).catch((err) => {
            console.log(" ERROR RESPONSE ", err);
            //handleApiException(err);
        });
    }

    render() {
        const {fileValue, title, fileType, fileName} = this.props ;
        console.log(" PROPS = fileValue, title, fileType, fileName ", fileValue, title, fileType, fileName);
        const {onChangeFile, onChangeFileTitle, commonkey} = this.props ; 
        return (
            <div>
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
                <Button size="sm" color="primary" className="float-right" onClick={this.handleSaveFile.bind(this)}>
                    <i className="fa fa-dot-circle-o"></i> Save
                </Button>
            </div>
        );
    }
};

export default FileUpload;