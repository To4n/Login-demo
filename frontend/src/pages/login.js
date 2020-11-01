import React, { Component } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

class login extends Component {
    constructor() {
        super();
        this.state = {
          phone: '',
          code: '',
          sentCode: false,
          validateAccess: false,
          errors: {}
        };
    }

    handleSubmit1 = (event) => {
        event.preventDefault();
        const newUserData = {
          phone: this.state.phone
        };
        console.log(newUserData);
        axios
            .post('/createNewAccessCode',newUserData)
            .then((res) => {
                console.log(res.data);
                this.setState({sentCode: true});
            })
            .catch((err) =>{
                this.setState({
                    errors: err.response.data
                });
            });
    };

    handleSubmit2 = (event) => {
        event.preventDefault();
        const newUserData = {
          phone: this.state.phone,
          code: this.state.code
        };
        console.log(newUserData);
        axios
            .post('/ValidateAccessCode',newUserData)
            .then((res) => {
                console.log(res.data);
                this.setState({validateAccess: true});
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
                    <div className="text-center font-weight-bold"><h1>LOG IN</h1></div>
                    <form noValidate onSubmit={!this.state.sentCode ? this.handleSubmit1 : this.handleSubmit2}>

                        <div className="mt-4">
                             <div>
                                <span className="font-weight-bold">Phone:</span>
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
                        <div className="mt-4">
                             <div>
                                <span className="font-weight-bold">Code:</span>
                             </div>
                             <input
                                   id="code"
                                   name="code"
                                   type="text"
                                   label="code"
                                   className="text-input w-100"
                                   placeholder="123456"
                                   disabled = {!this.state.sentCode}
                                   onChange={this.handleChange}
                             />
                        </div>

                        <button
                          type="submit"
                          variant="contained"
                          color="primary"
                          className="button-card mt-3 w-50 mx-auto"
                        >
                          {!this.state.sentCode ? 'Send Code' : 'Submit'}
                        </button>
                        <div className=' my-1'>
                            {this.state.validateAccess && <div>success: true</div>}
                        </div>
                        <br />
                        <small>
                          dont have an account ? sign up <Link to="/signup">here</Link>
                        </small>
                    </form>
                </div>
            </div>
        );
    }
}

export default login;