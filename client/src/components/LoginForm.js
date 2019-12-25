import React from "react";
import Joi from "joi-browser";
import Form from "./common/Form";
import axios from 'axios';

class LoginForm extends Form {
  state = {
    data: {
      username: "",
      password: ""
    },
    errors: {}
  };

  schema = {
    username: Joi.string()
      .required()
      .label("Username"),
    password: Joi.string()
      .required()
      .label("Password")
  };

  doSubmit = async () => {
    const {data:user} = await axios.post('http://ec2-54-252-240-52.ap-southeast-2.compute.amazonaws.com:5000/auth', {email: this.state.data.username, password: this.state.data.password});

    if (user) {
      this.props.authUser(true);
      this.props.loadUser(user);
      this.props.history.push("/");
    } else {
      this.setState({
        errors: {
          username: "Username or Password is incorrect",
          password: "Username or Password is incorrect"
        }
      });
    }
  };

  render() {
    return (
      <div className="container">
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit} className="col s12">
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("Login")}
        </form>
      </div>
    );
  }
}

export default LoginForm;
