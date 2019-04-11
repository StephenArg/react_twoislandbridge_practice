import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'purecss/build/pure.css'
import App from './App';
import * as serviceWorker from './serviceWorker';
import {ActionCableProvider} from 'react-actioncable-provider'

//ActionCableProvider component wraps main component. If wrapped not here it will cause issues.
//process.env.REACT_APP_API_LOCATION refers to the environmental variable which can be set in the .env file for local projects, or in heroku (or other server hoster)

ReactDOM.render(
<ActionCableProvider url={`${process.env.REACT_APP_API_LOCATION}/cable`} >
    <App />
</ActionCableProvider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
