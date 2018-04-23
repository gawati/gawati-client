import React from 'react';
import {FormControl} from './FormControl';
import { Label, Input, Row, Col, Button} from 'reactstrap';
import axios from 'axios';
import {dataProxyServer} from '../../constants';
import { iriDate } from '../../utils/DateHelper';

/**
 * To-Do:
 * Rename `index` to `id`?
 * Check for empty file and title
 * 
 * Upload component for files. Handles both update and new.
 * Leave `index` empty for new files. The server will generate one.
 *  
 * @class FileUpload
 * @extends {React.Component}
 */
class FileUpload1 extends React.Component {
    constructor(props) {
        super(props);
        const {index, showAs, fileType, fileName} = this.props.emDoc;
        this.state = {
            index: index,
            file: null,
            title: showAs,
            fileName: fileName,
            fileType: fileType
        }
    }

    handleSuccess(response) {
        if (response.hasOwnProperty("success")) {
            alert("File Saved");
        }
    }

    handleChangeFile(e) {
        this.setState({
            file: e.target.files[0],
            fileName: e.target.files[0].name,
            fileType: e.target.files[0].type
        })
    }

    handleSaveFile() {
        const {index, file, title, fileType, fileName} = this.state;
        let iri = this.props.form['docIri'].value;

        let data = new FormData();
        if (file) {
            if (title) {
                data.append(`index`, index);
                data.append(`file`, file);
                data.append(`fileName`, fileName);
                data.append(`title`, title);
                data.append(`fileType`, fileType);
                data.append(`iri`, iri);
            }
        }
        // add document metadata to submit formData
        for (let field in this.props.form) {
           let formField = this.props.form[field];
           if (field === 'docOfficialDate') {
              let offDate = iriDate(formField.value);
              data.append(field, JSON.stringify({value: offDate}));
           } else {
              data.append(field, JSON.stringify({value: formField.value}));
           }
        }

        axios.post(dataProxyServer() + '/gwc/document/upload', data, {
            headers: { "X-Requested-With": "XMLHttpRequest" }
        }).then((response) => {
            console.log(" RESPONSE >  DATA ", response.data);
            this.handleSuccess(response.data);
        }).catch((err) => {
            console.log(" ERROR RESPONSE ", err);
            //handleApiException(err);
        });

        //Call Post Save handler in the parent.
        this.props.handlePostSave();
    }

    render() {
        const {index, title, fileType, fileName} = this.state;
        console.log("index, title, fileType, fileName ", index, title, fileType, fileName);
        return (
            <div>
                <Row className="mb-4">
                    <Col xs="12">
                        <Row>
                        <Col xs="12">
                            <input type="file" className="form-control-file" forkey={index} id="file" name="file" onChange={this.handleChangeFile.bind(this)} />
                        </Col>
                        </Row>
                        <Row>
                        <Col xs="6">
                            <FormControl>
                                <Label htmlFor="docAttType">Upload File Type</Label>
                                <input type="text" name="docAttType"
                                    forkey={index}
                                    className="form-control"
                                    value={fileType}
                                    id="doctype"
                                    readOnly="true"
                                    placeholder="Upload File Type" required/>
                            </FormControl>
                        </Col>
                        <Col xs="6">
                            <FormControl>
                                <Label htmlFor="docAttTitle">File Title</Label>
                                <Input type="text" name="docAttTitle"
                                    forkey={index}
                                    className="form-control"
                                    onChange={e => this.setState({title: e.target.value})}
                                    value={title}
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

export default FileUpload1;