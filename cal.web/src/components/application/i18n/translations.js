import angular from 'angular';
import 'angular-translate';
import de from './de';

const dependencies = [
    'pascalprecht.translate'
];

export default angular
    .module('application-translations', dependencies)
    .config(de);
