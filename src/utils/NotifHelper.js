import {toast} from 'react-toastify';

export const notifySuccess = ( msg ) => {
    toast.success(msg, {
        hideProgressBar: true,
        position: toast.POSITION.TOP_CENTER
    });
};


export const notifyError = ( msg ) => {
    toast.error(msg, {
        hideProgressBar: true,
        position: toast.POSITION.TOP_CENTER
    });
};


export const notifyWarning = ( msg ) => {
    toast.warning(msg, {
        hideProgressBar: true,
        position: toast.POSITION.TOP_RIGHT
    });
};

export const info = ( msg ) => {
    toast.info(msg, {
        hideProgressBar: true,
        position: toast.POSITION.TOP_RIGHT
    });
};

export const handleApiException = (err) => {
    console.log(" Error while adding ", err);
};