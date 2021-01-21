import Amplify, { Auth } from 'aws-amplify';
import AWS_CONFIG from './config/awsConfig';
import React from 'react';
import Routes from "./Routes";
import './App.css';

Amplify.configure({
  Auth: AWS_CONFIG.cognito,
});

Auth.configure();

const App = () => (
  <Routes />
);


export default App;
