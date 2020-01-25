import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { login, logout } from './LoginActions';

import { api } from '../../models/api';
import './Login.scss';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
        }
    }

    componentDidMount() {
        let storedInfo = localStorage.getItem('@todoapp/login');
        storedInfo = JSON.parse(storedInfo);

        if(storedInfo && storedInfo.token){
            api.post('/api/user/auth', storedInfo).then(res => {
                this.props.login(storedInfo.token, storedInfo.username, storedInfo.name);
            }).catch(err => {
                console.log(err);
            });
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let info = {
            username: this.state.username,
            password: this.state.password,
        }
        api.post('/api/user/login', info).then(res => {
            this.props.login(res.data.token, res.data.username, res.data.name);
        }).catch(err => {
            // manda notificação
        });
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        if(this.props.loggedIn){
            return (
                <Redirect to='/todos'/>
            )
        }

        return (
            <div id='login'>
                <div className='header'>
                    <h1>login</h1>
                    <a href='/register'>register</a>
                </div>
                
                <form
                    autoComplete='false'
                    onSubmit={this.handleSubmit}
                >
                    <div id='login-content'>
                        <span>
                            <label>username</label>
                            <input
                                name='username'
                                type='text'
                                value={this.state.username}
                                onChange={this.handleChange}
                            />
                        </span>

                        <span>
                            <label>password</label>
                            <input
                                name='password'
                                type='password'
                                value={this.state.password}
                                onChange={this.handleChange}
                            />
                        </span>

                        <span>
                            <input type='submit' value='login'></input>
                        </span>
                    </div>

                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    loggedIn: state.login.loggedIn,
    token: state.login.token,
});

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({ login, logout }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Login);