import React, { Component } from 'react';

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };

        this.handleChange = this.handleChange(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const logininfo = {
            email: this.state.email,
            password: this.state.password,
        };

        console.log(logininfo);

        // Meteor.call('authent.login', logininfo);

        this.setState = {
            email: '',
            password: '',
        };
    }

    render() {
        return (
            <form className="login" onSubmit={this.handleSubmit}>
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
                    value={this.state.password}
                    onChange={this.handleChange}
                />
                <input type="submit" value="Login" />
            </form>
        );
    }


}