import io from '../node_modules/socket.io/client-dist/socket.io.js';
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

{
    class List extends React.Component {
        constructor(props) {
            super(props);

            this.listRef = React.createRef();
        }

        componentDidUpdate() {
            const list = this.listRef.current;
            const listHeight = $(list).height();
            $(list).scrollTop(listHeight);
        }

        render() {
            return (
                <ul className='list app__list' ref={this.listRef}>
                    {this.props.messages.map(message => (
                        <li className={'message list__item' + (message.isMe ? ' message--my list__item--right' : '')} key={message.id}>
                            {message.text}
                        </li>
                    ))}
                </ul>
            );
        }
    }

    class Form extends React.Component {
        constructor(props) {
            super(props);
        }

        render() {
            return (
                <form className='form app__form' onSubmit={this.props.onSubmit}>
                    <input className='form__input' type='text' value={this.props.message} onChange={this.props.onChange} />
                    <button className='form__submit' type='submit' disabled={this.props.message === ''}>Send</button>
                </form>
            );
        }
    }

    class App extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                messages: [],
                message: '',
            };

            {
                this.socket = io();

                this.socket.on('init', userID => {
                    this.userID = userID;
                    console.log(this.userID);
                });

                this.socket.on('messages', messages => this.setState({
                    messages: messages.map(message => ({
                        id: message.id,
                        text: message.text,
                        isMe: message.userID === this.userID ? true : false,
                    })),
                }));
            }

            this.handleSubmit = this.handleSubmit.bind(this);
            this.handleChange = this.handleChange.bind(this);
        }

        handleSubmit(event) {
            event.preventDefault();

            this.setState(state => {
                if (state.message !== '') {
                    this.socket.emit('message', {
                        userID: this.userID,
                        text: state.message,
                    });
                    
                    return {
                        message: '',
                    };
                }
            });
        }

        handleChange(event) {
            this.setState(state => ({
                message: event.target.value,
            }));
        }

        render() {
            return (
                <div className='app'>
                    <List messages={this.state.messages} />
                    <Form message={this.state.message} onSubmit={this.handleSubmit} onChange={this.handleChange} />
                </div>
            );
        }
    }

    ReactDOM.render(
        <App />,
        document.getElementById('root')
    );
}
