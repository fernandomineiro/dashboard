import React, { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, Typography, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
// components
import Form from "react-validation/build/form";
import isEmail from 'validator/lib/isEmail';

import Iconify from '../../../components/iconify';
import AuthService from "../../../services/auth.service";
// ----------------------------------------------------------------------
const required = (value) => {
  if (!value) {
    return (
      <div className="invalid-feedback d-block">
        Campo obrigatório!
      </div>
    );
  }
  return false
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="invalid-feedback d-block">
        This is not a valid email.
      </div>
    );
  }
  return false
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="invalid-feedback d-block">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
  return false
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="invalid-feedback d-block">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
  return false
};
export default function LoginForm() {
  const navigate = useNavigate();

  const form = useRef();
  const checkBtn = useRef();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(true);
  const [successful, setSuccessful] = useState(false);
  const [email, setEmail] = useState("");
 

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    form.current.validateAll();

      AuthService.login(username, password).then(
        () => {
          navigate("/app");
          window.location.reload();
        },
        (error) => {
          console.log(error)
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setLoading(false);
          setMessage(resMessage);
        }
      );
   
  };

  const changeMode = () =>{
    setPage(!page);
  }

  const handleRegister = (e) => {
    e.preventDefault();

    console.log(checkBtn.current.context._errors.length);

    setMessage("");
    setSuccessful(false);
    form.current.validateAll();

    

      AuthService.register(username, email, password).then(
        (response) => {
          setMessage(response.data.message);
          setSuccessful(true);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setMessage(resMessage);
          setSuccessful(false);
        }
      );
    
  };

  


  return (
    <>
    <Typography variant="body2" sx={{ mb: 5 }}>
              Você não tem conta? {''}
              <Link variant="subtitle2" onClick={()=>changeMode()}>Vamos começar</Link>
            </Typography>
    {page ? 
     <Form onSubmit={handleLogin} ref={form}>
          <div className="form-group">
            <div htmlFor="username">Username</div>
            <Input
              type="text"
              className="form-control"
              name="username"
              value={username}
              onChange={onChangeUsername}
              validations={[required]}
            />
           
          </div>

          <div className="form-group">
            <div htmlFor="password">Password</div>
            <Input
              type="password"
              className="form-control"
              name="password"
              value={password}
              onChange={onChangePassword}
              validations={[required]}
            />
          </div>

          <div className="form-group">
            <button className="btn btn-primary btn-block" disabled={loading}>
              
              <span>Login</span>
            </button>
          </div>

          {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
        : 
        
        <Form onSubmit={handleRegister} ref={form}>
          {!successful && (
            <div>
              <div className="form-group">
                <div>Username</div>
                <Input
                  type="text"
                  className="form-control"
                  name="username"
                  value={username}
                  onChange={onChangeUsername}
                  validations={[required, vusername]}
                />
              </div>

              <div className="form-group">
                <div>Email</div>
                <Input
                  type="text"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={onChangeEmail}
                  validations={[required, validEmail]}
                />
              </div>

              <div className="form-group">
                <div>Password</div>
                <Input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={onChangePassword}
                  validations={[required, vpassword]}
                />
              </div>

              <div className="form-group">
                <button className="btn btn-primary btn-block">Sign Up</button>
              </div>
            </div>
          )}

          {message && (
            <div className="form-group">
              <div
                className={
                  successful ? "alert alert-success" : "alert alert-danger"
                }
                role="alert"
              >
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
        }
    {/* <Form onSubmit={handleLogin} ref={form}>
      <Stack spacing={3}>
        <TextField  type="text"
              className="form-control"
              name="username"
              value={username}
              onChange={onChangeUsername}
              validations={[required]} />

        <TextField
         className="form-control"
         name="password"
         value={password}
         onChange={onChangePassword}
         validations={[required]}
         type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />- Me Manter conectado
        <Link variant="subtitle2" underline="hover">
          Perdeu senha?
        </Link>
      </Stack>
      
      {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}

      <LoadingButton fullWidth size="large" type="submit" variant="contained" ref={checkBtn}>
        Logar
      </LoadingButton>
      </Form> */}
    </>
  );
}
