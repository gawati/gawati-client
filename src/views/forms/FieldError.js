import React from 'react';

export const FieldError = ({error}) => {
    if (error) {
      console.log(" FIELD ERROR ", error);

      return (
        <div className="input-feedback">{error.error}</div>
      );
    } else {
      return null;
    }
  }