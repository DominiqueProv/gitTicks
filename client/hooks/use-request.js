import axios from 'axios';
import { useState } from 'react';

//create the hook function
export default ({ url, method, body, onSuccess }) => {
  //manage the piece of state error

  const [errors, setErrors] = useState(null);
  //method to return handle the call to the endpoint

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, { ...body, ...props });
      if (onSuccess) {
        onSuccess(response.data);
      }
      //return the data if request is 200

      return response.data;
    } catch (err) {
      //catch error and setErrors with JSX
      setErrors(
        <div className="alert alert-danger">
          <h4>Ouups....</h4>
          <ul className="my-0">
            {err.response.data.errors.map((error) => (
              <li key={error.message}>{error.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };
  //return the method and the errors []
  return { doRequest, errors };
};
