import {toast} from 'react-toastify';

export const success = ( msg ) => {
    toast.success(msg, {
        hideProgressBar: true,
        position: toast.POSITION.TOP_CENTER
    });
};


export const error = ( msg ) => {
    toast.error(msg, {
        hideProgressBar: true,
        position: toast.POSITION.TOP_CENTER
    });
};


export const warning = ( msg ) => {
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

