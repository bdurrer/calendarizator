/* eslint no-param-reassign: 0 */

import angular from 'angular';
import moment from 'moment/moment';

class CalcreateStateController {

    constructor(calendarService, authService, $q, $translate, $scope, $log, $timeout) {
        this.calendarService = calendarService;
        this.authService = authService;
        this.$q = $q;
        this.$translate = $translate;
        this.$log = $log;
        this.$timeout = $timeout;
        this.selectionModel = this.calendarService.getEventList();
        this.templates = [];
        this.selectionModelIdCounter = 1;
        this.selectedItem = null;

        this.authService.checkLogin()
        .then((txt) => {
            this.$log.debug(`CalCreate: Login check response was ${txt}`);
            this.loadTemplates();
        });

        // make sure the current locale is shown
        moment.locale($translate.use());

        this.startDate = moment().toDate();
        this.updateModel();

        // datepicker options
        this.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1,
            minDate: moment().subtract(1, 'year').toDate(),
            maxDate: moment().add(1, 'year').toDate()
        };
        this.dateAltInputFormats = $translate.instant('datepicker.altInputFormats').split(';');
        this.datePopupOpened = false;
        this.startDateOptions = {
            allowInvalid: false
        };

        $scope.$watch(() => this.startDate, () => {
            this.$log.debug('startDate has changed');
            this.updateModel();
        });

        // watch for changes and store them, so that the user can navigate safely
        $scope.$watch(() => this.selectionModel, () => {
            this.$log.debug('selection has changed and is updated in memory store');
            this.calendarService.setEventList(this.selectionModel);
        }, true);
    }

    openDatePicker() {
        this.datePopupOpened = true;
    }

    loadTemplates() {
        this.isLoading = true;
        this.calendarService.getEventTemplates().then((response) => {
            this.$log.debug('fetched templates!');
            if (response.items.length <= 0) {
                this.createDefaultTemplates();
            } else {
                this.templates = response.items;
            }
            this.onTemplatesLoaded();
            this.isLoading = false;
        },
        () => {
            this.isLoading = false;
        });
    }

    onTemplatesLoaded() {
        const zero = '0';
        const empty = '';

        angular.forEach(this.templates, (value) => {
            value.style = {};
            if (value.colorBackground) {
                value.style['background-color'] = value.colorBackground;
            }
            if (value.colorForeground) {
                value.style.color = value.colorForeground;
            }

            /* eslint-disable max-len */
            if (value.from_hour && !value.from) {
                value.from = `${value.from_hour < 10 ? zero : empty}${value.from_hour}:${value.from_min < 10 ? zero : empty}${value.from_min}`;
            } else {
                value.from = '';
            }

            if (value.to_hour && !value.to) {
                value.to = `${value.to_hour < 10 ? zero : empty}${value.to_hour}:${value.to_min < 10 ? zero : empty}${value.to_min}`;
            } else {
                value.to = '';
            }
            /* eslint-enable max-len */
        });
    }

    createDefaultTemplates() {
        const promises = [];
        promises.push(this.createDefaultTemplate('Fruehdienst', '#dff0d8', null, 9, 50, 15, 30));
        promises.push(this.createDefaultTemplate('Spaetdienst', '#d9edf7', null, 15, 15, 23, 45));
        promises.push(this.createDefaultTemplate('Nacht', '#fcf8e3', null, 23, 45, 7, 45));
        promises.push(this.createDefaultTemplate('Frei', '#ffffff', null, null, null, null, null));
        this.$q.all(promises).then(this.onTemplatesLoaded());
    }

    createDefaultTemplate(title, colorBackground, colorForeground, fromHour, fromMin, toHour, toMin) {
        return this.calendarService.saveEventTemplate({
            title,
            colorBackground,
            colorForeground,
            from_hour: fromHour,
            from_min: fromMin,
            to_hour: toHour,
            to_min: toMin
        }).then((response) => {
            this.$log.debug('saved default tmpl!');
            this.templates.push(response);
        }, () => {
            this.isLoading = false;
        });
    }

    updateModel() {
        let currentDate = moment(this.startDate).clone();

        angular.forEach(this.selectionModel, (item) => {
            item.date = currentDate;
            currentDate = currentDate.clone().add(1, 'day');
            if (!item.listid) {
                this.selectionModelIdCounter++;
                item.listid = this.selectionModelIdCounter;
            }
        });
    }

    onCopyTemplate(index, item, what) {
        this.selectionModelIdCounter++;
        item.listid = this.selectionModelIdCounter;
        this.$log.debug(`onCopyTemplate item.listid ${item.listid} running on ${what}`);
    }

    onDrop(index, item) {
        this.$log.debug(`model with item.listid ${item.listid} dropped at ${index}`);
        if (!item.date) {
            // reduce the visible hopping by setting a default value
            item.date = moment(this.startDate).clone();
        }
        this.$timeout(() => {
            this.updateModel();
        }, 100);
        return item;
    }

    onDelete() {
        this.$timeout(() => {
            this.updateModel();
        }, 100);
        return true;
    }
}

export default [
    'calendarService',
    'authService',
    '$q',
    '$translate',
    '$scope',
    '$log',
    '$timeout',
    CalcreateStateController
];
