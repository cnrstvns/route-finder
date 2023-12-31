import { ErrorMessage } from 'formik';
import React from 'react';

type ErrorLabelProps = {
  name: string;
};

const ErrorLabel = ({ name }: ErrorLabelProps) => {
  return (
    <ErrorMessage
      component="div"
      className="text-sm text-red-400 mt-1.5"
      name={name}
    />
  );
};

export { ErrorLabel };
