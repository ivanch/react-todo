import React, { Component } from "react";

import './Register.scss';
import api from '../../models/api';
import { getTomorrow } from '../../models/date';

const tomorrow = getTomorrow();

const formatDate = (date) => {
    return `${date.getFullYear()}-${("0"+(date.getMonth() + 1)).slice(-2)}-${("0"+date.getDate()).slice(-2)}`;
}

const originalState = {
    title: '',
    description: '',
    deadline: formatDate(tomorrow),
};

export default class Register extends Component {
    constructor(props) {
        super(props);

        this.state = originalState;
    }

    componentDidMount() {
        console.log(this.state.deadline);
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let timedState = this.state;
        timedState.deadline = new Date(timedState.deadline);

        api.post('/api/task', timedState).then(response => {
            if(response.status === 201){
                this.setState(originalState);
                this.props.fetchTasks();
            }
        });
    }

    render() {
        return (
            <div className='register'>

                <form
                    className='register-form'
                    onSubmit={this.handleSubmit}
                    autoComplete="off"
                >
                    <span className='register-header'>
                        add task
                    </span>

                    <input
                        type='text'
                        name='title'
                        value={this.state.title}
                        onChange={this.handleChange}
                        placeholder='title'
                    />

                    <textarea
                        name='description'
                        value={this.state.description}
                        onChange={this.handleChange}
                        placeholder='description'
                    />

                    <div>
                        <label>deadline:</label>
                        <input
                            type='date'
                            name='deadline'
                            value={this.state.deadline}
                            onChange={this.handleChange}
                        />
                    </div>

                    <input type='submit' onClick={this.handleSubmit}></input>
                </form>
            </div>
        )
    }
}