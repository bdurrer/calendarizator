import angular from 'angular';
import 'angular-translate';
import de from './de';

const dependencies = [
    'pascalprecht.translate'
];

export default angular
    .module('success-state-component-translations', dependencies)
    .config(de);
