import Yup from 'yup';

export const formInitialState = () => (
    {
      "key": {value: '', error: null }, 
      "file": {value: '', error: null },
      "fileName": {value: '', error: null},
      "title": {value: '', error: null},
      "fileType": {value: '', error: null }
    }
);

export const validationSchema = () => (
    {
        key: {
          validate:  Yup.string().required(" Key is required")
        }, 
        fileName: {
          validate:  Yup.string().required(" You must enter a file Name")
        },
        title: {
          validate: Yup.string().required("You must enter a title")
        },
        fileType: {
          validate:  Yup.string().required(" File type is required")
        }
    }
);
