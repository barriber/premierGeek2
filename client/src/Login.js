import React, { PureComponent } from 'react';
import { Button } from 'material-ui';
import { Auth } from "aws-amplify";

export default class Login extends PureComponent {
    state = {
        email: "",
        password: ""
    };

    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();

        try {
            const x = await Auth.signIn(this.state.email, this.state.password);
            if(x.challengeName === "NEW_PASSWORD_REQUIRED") {
                const complete = Auth.completeNewPassword(x, '123456') 
            }
            console.log(x);
            let session = await Auth.currentAuthenticatedUser();
            console.log(session);
            this.props.userHasAuthenticated(true);
        } catch (e) {
            console.log(e);
            alert(e);
        }
    }

    render() {
        return (
            <div className="flex flex-column items-center flex-grow-1 justify-center flex-grow-1">
                <input type="email" id="email" value={this.state.email} onChange={this.handleChange} />
                <input type="password" id="password" value={this.state.password} className="mv3" onChange={this.handleChange} />
                <Button variant="raised" color="primary" onClick={this.handleSubmit}>
                    Login
                </Button>
            </div>
        );
    }
}





