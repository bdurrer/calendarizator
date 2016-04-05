import './calselect-state.css!';
import angular from 'angular';
import 'angular-ui-router';
import 'angular-translate';
import translationsModule from './i18n/translations';
import CalselectStateController from './calselect-state-controller';
import calselectRouteConfig from './calselect-route';

const dependencies = [
    'ui.router',
    'pascalprecht.translate',
    translationsModule.name
];

export default angular
    .module('calselect-state-component', dependencies)
    .controller('CalselectStateController', CalselectStateController)
    .config(calselectRouteConfig);
