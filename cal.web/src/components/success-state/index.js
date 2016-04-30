import './success-state.css!';
import angular from 'angular';
import 'angular-ui-router';
import 'angular-translate';
import translationsModule from './i18n/translations';
import SuccessStateController from './success-state-controller';
import successRouteConfig from './success-route';

const dependencies = [
    'ui.router',
    'pascalprecht.translate',
    translationsModule.name
];

export default angular
    .module('success-state-component', dependencies)
    .controller('SuccessStateController', SuccessStateController)
    .config(successRouteConfig);
