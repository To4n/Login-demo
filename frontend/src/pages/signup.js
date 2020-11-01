import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, Link } from "react-router-dom";

class signup extends Component {
    constructor() {
        super();
        this.state = {
          firstname: '',
          lastname: '',
          phone: '',
          errors: {}
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const newUserData = {
          firstname: this.state.firstname,
          lastname: this.state.lastname,
          phone: this.state.phone
        };
        console.log(newUserData);
        axios
            .post('/signup',newUserData)
            .then((res) => {
                console.log(res.data);
                this.props.history.push('/');
            })
            .catch((err) =>{
                this.setState({
                    errors: err.response.data
                });
            });
    };

    handleChange = (event) => {
        this.setState({
          [event.target.name]: event.target.value
        });
    };

    render() {
        const { errors } = this.state;
        return(
            <div className="mx-auto py-5">
                <div className="py-5">
                    <div className="text-center font-weight-bold"><h1>SIGN UP</h1></div>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <div className="mt-4">
                             <div>
                                <span className="font-weight-bold">*First name:</span>
                             </div>
                             <input
                                   id="firstname"
                                   name="firstname"
                                   type="text"
                                   label="First"
                                   className="text-input w-100"
                                   placeholder="John"
                                   onChange={this.handleChange}
                             />
                        </div>
                        <div className="mt-4">
                             <div>
                                <span className="font-weight-bold">*Last name:</span>
                             </div>
                             <input
                                   id="lastname"
                                   name="lastname"
                                   type="text"
                                   label="Last"
                                   className="text-input w-100"
                                   placeholder="Doe"
                                   onChange={this.handleChange}
                             />
                        </div>
                        <div className="mt-4">
                             <div>
                                <span className="font-weight-bold">*Phone:</span>
                             </div>
                             <input
                                   id="phone"
                                   name="phone"
                                   type="tel"
                                   label="phone"
                                   className="text-input w-100"
                                   placeholder="123-456-8901"
                                   onChange={this.handleChange}
                             />
                        </div>
                        <button
                          type="submit"
                          variant="contained"
                          color="primary"
                          className="button-card mt-3 w-50 mx-auto"
                        >
                          Sign Up
                        </button>
                        <br />
                        <small>
                          Already have an account ? Login <Link to="/login">here</Link>
                        </small>
                    </form>
                </div>
            </div>
        );
    }
}

export default signup;