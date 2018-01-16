import React from 'react';

export const FieldError = ({error}) => {
    if (error) {
      return (
        <div className="input-feedback">{error}</div>
      );
    } else {
      return null;
    }
  }