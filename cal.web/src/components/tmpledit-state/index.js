import './tmpledit-state.css!';
import angular from 'angular';
import 'angular-ui-router';
import 'angular-translate';
import translationsModule from './i18n/translations';
import TmpleditStateController from './tmpledit-state-controller';
import tmpleditRouteConfig from './tmpledit-route';

const dependencies = [
    'ui.router',
    'pascalprecht.translate',
    translationsModule.name
];

export default angular
    .module('tmpledit-state-component', dependencies)
    .controller('TmpleditStateController', TmpleditStateController)
    .config(tmpleditRouteConfig);
