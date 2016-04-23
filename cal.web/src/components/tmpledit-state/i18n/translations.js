import angular from 'angular';
import 'angular-translate';
import de from './de';

const dependencies = [
    'pascalprecht.translate'
];

export default angular
    .module('tmpledit-state-component-translations', dependencies)
    .config(de);
