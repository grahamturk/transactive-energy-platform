import React, { Component } from 'react';

export default class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log('registered');

        const userinfo = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password,
        };

        console.log(userinfo);

        // Meteor.call('authent.register', userinfo);

        this.setState({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        });
    }

    render() {
        return (
            <form className="register" onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={this.state.firstName}
                    onChange={this.handleChange}
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={this.state.lastName}
                    onChange={this.handleChange}
                />
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={this.handleChange}
                />
                <input
                    type="text"
                    name="password"
                    placeholder="Password"
                    value = {this.state.password}
                    onChange={this.handleChange}
                />

                <input type="submit" value="Register" />
            </form>
        );
    }
}