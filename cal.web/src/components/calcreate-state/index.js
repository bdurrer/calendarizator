import './calcreate-state.css!';
import angular from 'angular';
import 'angular-ui-router';
import 'angular-translate';
import translationsModule from './i18n/translations';
import CalcreateStateController from './calcreate-state-controller';
import calcreateRouteConfig from './calcreate-route';

import TemplateEditModalController from './modal/tmpledit-modal-controller';
import ConfirmationModalController from './modal/confirmation-modal-controller';

const dependencies = [
    'ui.router',
    'pascalprecht.translate',
    translationsModule.name
];

export default angular
    .module('calcreate-state-component', dependencies)
    .controller('CalcreateStateController', CalcreateStateController)
    .controller('TemplateEditModalController', TemplateEditModalController)
    .controller('ConfirmationModalController', ConfirmationModalController)
    .config(calcreateRouteConfig);
