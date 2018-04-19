import { notifySuccess, notifyError} from '../../utils/NotifHelper';
import {dataProxyServer, MAX_ATTACHMENTS} from '../../constants';

export const handleSuccess =  (data) => {
    const {success, error} = data ; 
    if (success) {
        let {code, message} = success ; 
        notifySuccess( `${code} - Document was saved ${message}`);
    }  
    if (error) {
        let {code, message} = error ;
        notifyError( `${code} - ${message} `);
    } 
};

export const handleAddMore = (event) => {
    if (this.props.form.docComponents.value.length === MAX_ATTACHMENTS) {
      alert("Maximum number of attachments reached");
    } else {
      event.preventDefault();
      let {docs} = this.state ;
      let key = uuid.v1();
      let doc = {
          "key": key, 
          "file": null, 
          "fileName": '',
          "title": '',
          "fileType": ''
      };
      let newDocs = [...docs, doc];
      this.setState({docs: newDocs });
    }
}


export const handleApiException = (err) => {
    console.log(" Error while adding ", err);
};