import React from 'react';
import classnames from 'classnames';

export const FormControl = (props) => {
    return (
      <div {...props}>{props.children} </div>
    );
  }

export const formControlErrorClass = (error) =>
  classnames(
    "form-group",
    {
      'error': !!error,
    }
  );

