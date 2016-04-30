/* eslint no-param-reassign: 0 */

import angular from 'angular';
import moment from 'moment/moment';

import introJs from 'intro.js';
import 'intro.js/introjs.css!';

class CalcreateStateController {

    constructor(calendarService, authService,
                $q, $translate, $scope, $log, $timeout, $state, $cookies, selectedCalendar) {
        this.calendarService = calendarService;
        this.authService = authService;
        this.$q = $q;
        this.$translate = $translate;
        this.$scope = $scope;
        this.$log = $log;
        this.$timeout = $timeout;
        this.$state = $state;
        this.$cookies = $cookies;

        /** the previously selected calendar which we'll gonna insert events */
        this.selectedCalendar = selectedCalendar;


        /** the user's list of events he's building. is backed up into memory on every change */
        this.selectionModel = this.calendarService.getEventList();

        /** the available event templates to drag into the selectionModel */
        this.templates = [];

        /** counter to ensure items in the selectionModel are unique. We don't care but ng-repeat needs an identifier */
        this.selectionModelIdCounter = 1;

        /* the currently dragged item */
        this.selectedItem = null;

        /** the list of permissions on the selected calendar */
        this.acl = [];
        this.calendarService.getCalendarAcl(this.selectedCalendar.id).then((response) => {
            this.acl = response.items;
        });

        // make sure that the user IS authed, though he's unlikely to be unauthed
        this.authService.checkLogin()
        .then((txt) => {
            this.$log.debug(`CalCreate: Login check response was ${txt}`);
            this.loadTemplates();
        });

        // make sure the current locale is shown
        moment.locale($translate.use());

        /** the date of the first event. can be changed by the user */
        this.startDate = moment().toDate();

        /** make sure date and idCounter are set on every event item */
        this.updateModel();

        /** datepicker options */
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

        // we need to update the dates on ally items when the user changes the start date
        $scope.$watch(() => this.startDate, () => {
            this.$log.debug('startDate has changed');
            this.updateModel();
        });

        // watch for changes and store them, so that the user can navigate safely
        $scope.$watch(() => this.selectionModel, () => {
            this.$log.debug('selection has changed and is updated in memory store');
            this.calendarService.setEventList(this.selectionModel);
        }, true);

        // if the user has not seen the intro yet, show it!
        const introMode = this.$cookies.get('introMode');
        if (!introMode) {
            this.$timeout(() => this.startIntro(), 500);
        }
    }

    clearSelectionModel() {
        this.selectionModel = [];
    }

    /**
     * Hi server, I would like to have some data. Pleeease.
     */
    loadTemplates() {
        this.isLoading = true;
        this.calendarService.getEventTemplates().then((response) => {
            this.$log.debug('fetched templates!');
            if (!response.items || response.items.length <= 0) {
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

    /**
     * called when the server response with the templates is here.
     * We need to improve the styling of the data a bit.
     */
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

    /**
     * let's get serious: Inserts the current event model into the user's calendar
     */
    createEvents() {
        this.$log.info(`woah, that human actually wants to save his ${this.selectionModel.length} events`);
        if (!this.selectedCalendar || !this.selectedCalendar.id) {
            this.$log.info('yo human, why u no selecting a calendar first? Abort, I do.');
            return;
        }
        this.insertProgressCount = 0;
        this.insertInProgress = true;
        // const tz = this.selectedCalendar.timeZone;
        // moment("2013-11-18").tz("America/Toronto")

        const eventList = [];
        angular.forEach(this.selectionModel, (item) => {
            if (!item.from_hour || !item.to_hour) {
                this.$log.debug(`selection item ${item.title} has no time, skipping it`);
                return;
            }
            const fromDate = item.date.clone();
            fromDate.hours(item.from_hour);
            fromDate.minutes(item.from_min);
            fromDate.seconds(0);
            fromDate.milliseconds(0);

            const toDate = item.date.clone();
            toDate.hours(item.to_hour);
            toDate.minutes(item.to_min);
            toDate.seconds(0);
            toDate.milliseconds(0);

            if (toDate.diff(fromDate, 'minutes') < 0) {
                toDate.add(1, 'days');
            }

            const event = {
                start: {
                    dateTime: fromDate.toISOString(),
                    timeZone: this.selectionModel.timeZone
                },
                end: {
                    dateTime: toDate.toISOString(),
                    timeZone: this.selectionModel.timeZone
                },
                summary: item.title,
                description: item.text,
                source: {
                    title: 'Calendarizator App',
                    url: 'https://calendarizator.appspot.com/'
                }
            };
            eventList.push(event);
        });

        // this.$log.debug(JSON.stringify(eventList));
        this.insertAllEventsInSequence(eventList).then((response) => {
            this.insertInProgress = false;
            this.$log.info('finished inserting events!');
            this.$log.debug(response);
            this.$state.go('app.success');
        });
    }

    insertAllEventsInSequence(arr) {
        // chain the inserting
        return arr.reduce((promise, eventItem) =>
            promise.then((result) =>
                this.insertEvent(result, eventItem).then(() => {
                    this.$log.debug(`finished item ${this.insertProgressCount}`);
                    this.insertProgressCount++;
                })
            ),
            this.$q.when([]));
    }

    insertEvent(result, eventItem) {
        return this.calendarService.saveAppointment(this.selectedCalendar.id, eventItem).then((response) => {
            const resultArr = result || [];
            resultArr.push(response);
            return resultArr;
        });
    }

    /**
     * initializes the templates of this user with the default templates
     */
    createDefaultTemplates() {
        const promises = [];
        promises.push(this.createDefaultTemplate(1, 'Frei', null, '#FBFBFB', '#1d1d1d', null, null, null, null));
        promises.push(this.createDefaultTemplate(2, 'Frühdienst', 1, '#a4bdfc', '#1d1d1d', 7, 0, 15, 38));
        promises.push(this.createDefaultTemplate(3, 'Spätdienst', 2, '#7ae7bf', '#1d1d1d', 15, 0, 23, 38));
        promises.push(this.createDefaultTemplate(4, 'Nacht', 3, '#dbadff', '#1d1d1d', 23, 0, 7, 38));
        this.$q.all(promises).then(() => {
            this.$timeout(this.loadTemplates(), 2000);
        });
    }

    /**
     * initializes the templates of this user with the default templates
     */
    createDefaultTemplate(orderId, title, colorId, colorBackground, colorForeground, fromHour, fromMin, toHour, toMin) {
        return this.calendarService.saveEventTemplate({
            orderId,
            title,
            colorId,
            colorBackground,
            colorForeground,
            from_hour: fromHour,
            from_min: fromMin,
            to_hour: toHour,
            to_min: toMin
        }).then((response) => {
            this.$log.debug(`saved default tmpl ${title}!`);
            return response;
        });
    }

    /**
     * updates all items in the selectionModel, so that the dates are in sequence
     * and every item has an ID (to make ng-repeat happy).
     */
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

    /**
     * called by the drag&drop directive when a item is dragged from the templates to the selectionModel
     */
    onCopyTemplate(index, item, what) {
        this.selectionModelIdCounter++;
        item.listid = this.selectionModelIdCounter;
        this.$log.debug(`onCopyTemplate item.listid ${item.listid} running on ${what}`);
    }

    /**
     * called by the drag&drop directive when a item is dropped
     */
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

    /**
     * called by the drag&drop directive when a item is dropped onto the trash can
     */
    onDelete() {
        this.$timeout(() => {
            this.updateModel();
        }, 100);
        return true;
    }

    /**
     * Triggered by the datepicker button
     */
    openDatePicker() {
        this.datePopupOpened = true;
    }

    /**
     * called in intro mode, when the user finishes the tutorial or aborts it
     */
    onFinishIntro() {
        this.$log.debug('onFinishIntro...');
        this.$cookies.put('introMode', 'finished', {
            path: '/',
            expires: moment().add(1, 'year').toDate()
        });
    }

    /**
     * Starts the tutorial mode
     */
    startIntro() {
        const introSteps = [
            {
                element: '#helpbutton',
                intro: this.$translate.instant('intro.start').replace(/\n/g, '<br/>'),
                position: 'bottom'
            }, {
                element: '#panel-templates',
                intro: this.$translate.instant('intro.templates'),
                position: 'top'
            }, {
                element: '#panel-yourevents',
                intro: this.$translate.instant('intro.yourevents'),
                position: 'top'
            }, {
                element: '#startdaterow',
                intro: this.$translate.instant('intro.youreventdate').replace(/\n/g, '<br/>'),
                position: 'bottom'
            }, {
                element: '#yourevents-list',
                intro: this.$translate.instant('intro.youreventslist').replace(/\n/g, '<br/>'),
                position: 'top'
            }, {
                element: '#panel-trash',
                intro: this.$translate.instant('intro.trash'),
                position: 'left'
            }, {
                element: '#saveButton',
                intro: this.$translate.instant('intro.saveButton'),
                position: 'top'
            }, {
                element: '#generalinfopanel',
                intro: this.$translate.instant('intro.generalinfopanel').replace(/\n/g, '<br/>'),
                position: 'bottom'
            }
        ];

        this.$log.debug('starting intro');
        const intro = introJs.introJs();
        intro.setOptions({
            steps: introSteps,
            nextLabel: this.$translate.instant('intro.buttons.nextLabel'),
            prevLabel: this.$translate.instant('intro.buttons.prevLabel'),
            skipLabel: this.$translate.instant('intro.buttons.skipLabel'),
            doneLabel: this.$translate.instant('intro.buttons.doneLabel'),
            exitOnEsc: false,
            exitOnOverlayClick: false,
            keyboardNavigation: true,
            disableInteraction: true
        });
        intro.onexit(() => this.onFinishIntro());
        intro.oncomplete(() => this.onFinishIntro());
        intro.start();
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
    '$state',
    '$cookies',
    'selectedCalendar',
    CalcreateStateController
];
