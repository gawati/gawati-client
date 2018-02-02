import { notifySuccess, notifyError} from '../../utils/notifhelper';

export const handleSuccess =  (data) => {
    console.log(" DATA === ", data);
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

export const handleApiException = (err) => {
    console.log(" Error while adding ", err);
;

}