import { useState } from 'react';
import Router from 'next/router';
//the name of the hook is defined here since the use-request file doesnt contain any hook name only a default export
import useRequest from '../../hooks/use-request';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //call to useRequest hook == pass the url, method, body needed in the hook
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password,
    },
    //call in the hook if it's success to redirect
    onSuccess: () => {
      Router.push('/');
    },
  });
  const onSubmit = async (ev) => {
    ev.preventDefault();
    await doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign up</h1>
      <div className="form-group">
        <label>Email adress</label>
        <input
          className="form-control"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
      </div>
      {errors}
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};
