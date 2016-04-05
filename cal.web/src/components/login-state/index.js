import './login-state.css!';
import angular from 'angular';
import 'angular-ui-router';
import 'angular-translate';
import translationsModule from './i18n/translations';
import LoginStateController from './login-state-controller';
import loginRouteConfig from './login-route';

const dependencies = [
    'ui.router',
    'pascalprecht.translate',
    translationsModule.name
];

export default angular
    .module('login-state-component', dependencies)
    .controller('LoginStateController', LoginStateController)
    .config(loginRouteConfig);
