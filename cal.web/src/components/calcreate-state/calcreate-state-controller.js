/* eslint no-param-reassign: 0 */

import angular from 'angular';
import moment from 'moment/moment';
import tmplEditModalTemplate from './modal/tmpledit-modal.html!text';
import confirmationModalTemplate from './modal/confirmation-modal.html!text';

import introJs from 'intro.js';
import 'intro.js/introjs.css!';

class CalcreateStateController {

    constructor(calendarService, authService,
                $q, $translate, $scope, $log, $timeout, $state, $cookies, $uibModal, selectedCalendar) {
        this.calendarService = calendarService;
        this.authService = authService;
        this.$q = $q;
        this.$translate = $translate;
        this.$scope = $scope;
        this.$log = $log;
        this.$timeout = $timeout;
        this.$state = $state;
        this.$cookies = $cookies;
        this.$uibModal = $uibModal;

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
        this.startDate = moment().subtract(1, 'day').toDate();
        this.startDateExternal = moment().toDate();

        this.horizontalMode = true;

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
        $scope.$watch(() => this.startDateExternal, () => {
            // this.$log.debug('startDateExternal has changed');
            this.updateModel();
        });

        // watch for changes and store them, so that the user can navigate safely
        $scope.$watch(() => this.selectionModel, () => {
            // this.$log.debug('selection has changed and is updated in memory store');
            this.calendarService.setEventList(this.selectionModel);
        }, true);

        this.pageSize = 3;
        this.pageClass = 'lg';

        // watch for the window-change event
        $scope.$on('bp-changed', (eventObj, sizing) => {
            this.$log.debug(`bootstrap responsive: window changed size from ${sizing.oldSize} to ${sizing.size}`);
            this.pageSize = sizing.size;
            this.pageClass = sizing.sizeName;
            this.horizontalMode = (this.pageSize >= 2);
            this.updateModel();
        });

        // if the user has not seen the intro yet, show it!
        const introMode = this.$cookies.get('introMode');
        if (!introMode) {
            this.$timeout(() => this.startIntro(), 500);
        }
    }

    /**
     * opens a modal window where the template can be edited
     */
    editTemplate(template) {
        const modalInstance = this.$uibModal.open({
            animation: true,
            template: tmplEditModalTemplate,
            controller: 'TemplateEditModalController',
            controllerAs: '$ctrl',
            bindToController: true,
            /* size: 'lg', */
            resolve: {
                template: angular.copy(template),
                calendarService: this.calendarService
            }
        });
        modalInstance.result.then((response) => {
            this.$log.debug(`editTemplate modal finished with response ${response}`);
            this.$timeout(() => this.loadTemplates(), 2000);
        }, () => {
            this.$log.info('editTemplate modal dismissed');
        });
    }

    /**
     * Hi server, I would like to have some data. Pleeease.
     */
    loadTemplates() {
        this.$scope.$emit('transitionRunningStart');
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
        this.$log.debug('templates are loaded');
        this.$scope.$emit('transitionRunningEnd');

        angular.forEach(this.templates, (value) => {
            value.style = {};
            value.style['background-color'] = value.colorBackground;
            value.style.color = value.colorForeground;

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

    createEventsAskForConfirmation() {
        this.$log.info(`woah, that human actually wants to save his ${this.selectionModel.length} events`);
        if (!this.selectedCalendar || !this.selectedCalendar.id) {
            this.$log.info('yo human, why u no selecting a calendar first? Abort, I do.');
            return;
        }

        const modalInstance = this.$uibModal.open({
            animation: true,
            template: confirmationModalTemplate,
            controller: 'ConfirmationModalController',
            controllerAs: '$ctrl',
            bindToController: true,
            /* size: 'lg', */
            resolve: {
                data: {
                    selectionModel: angular.copy(this.selectionModel),
                    date: moment(this.startDate).format('ddd DD. MMMM YY')
                }
            }
        });
        modalInstance.result.then((response) => {
            this.$log.debug(`confirmation modal finished with response ${response}`);
            this.createEvents();
        }, () => {
            this.$log.debug('confirmation modal cancled');
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
                // the end time is before the beginning, so it's an overnight event
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
            if (item.colorId) {
                event.colorId = item.colorId;
            }
            if (item.location) {
                event.location = item.location;
            }

            eventList.push(event);
        });

        // this.$log.debug(JSON.stringify(eventList));
        this.insertAllEventsInSequence(eventList).then((response) => {
            this.insertInProgress = false;
            this.onTemplatesLoaded();
            this.$log.info('finished inserting events!');
            this.$log.debug(response);
            this.$state.go('app.success');
        });
    }

    /**
     * processes a list of events and inserts them in sequence
     */
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
        promises.push(this.createDefaultTemplate(1, 'Freier Tag', null, '#FBFBFB', '#1d1d1d', null, null, null, null, 'free'));
        promises.push(this.createDefaultTemplate(2, 'Frühdienst', 1, '#a4bdfc', '#1d1d1d', 7, 0, 15, 38, 'event'));
        promises.push(this.createDefaultTemplate(3, 'Spätdienst', 2, '#7ae7bf', '#1d1d1d', 15, 0, 23, 38, 'event'));
        promises.push(this.createDefaultTemplate(4, 'Nacht', 3, '#dbadff', '#1d1d1d', 23, 0, 7, 38, 'event'));
        this.$q.all(promises).then(() => {
            this.$timeout(this.loadTemplates(), 2000);
        });
    }

    /**
     * initializes the templates of this user with the default templates
     */
    createDefaultTemplate(orderId, title, colorId, colorBackground, colorForeground, fromHour, fromMin, toHour, toMin, type) {
        return this.calendarService.saveEventTemplate({
            orderId,
            title,
            colorId,
            colorBackground,
            colorForeground,
            from_hour: fromHour,
            from_min: fromMin,
            to_hour: toHour,
            to_min: toMin,
            type
        }).then((response) => {
            this.$log.debug(`saved default tmpl ${title}!`);
            return response;
        });
    }

    /**
     * Replaces the current selection model with the default data.
     * updateModel is called implicitly by the listener, because the model changed.
     */
    clearSelectionModel() {
        this.selectionModel = this.calendarService.resetEventList();
    }


    /**
     * updates all items in the selectionModel, so that the dates are in sequence
     * and every item has an ID (to make ng-repeat happy).
     */
    updateModel() {
        this.startDate = moment(this.startDateExternal).subtract(1, 'day').toDate();
        let currentDate = moment(this.startDate).clone();

        angular.forEach(this.selectionModel, (item, $index) => {
            item.date = currentDate;
            currentDate = currentDate.clone().add(1, 'day');
            if (!item.listid) {
                this.selectionModelIdCounter++;
                item.listid = this.selectionModelIdCounter;
            }

            delete item.style.display;

            if ($index === 0) {
                // the first element is the placeholder and is read-only for the user.
                // It's a 'free time' event to align the real data with the days of week.
                const placeholderCount = moment(this.startDateExternal).isoWeekday() - 1;
                const colWidth = this.pageClass === 'md' ? 115 : 145;
                const boxWidth = (placeholderCount * colWidth) + ((placeholderCount - 1) * 10);
                item.style.width = `${boxWidth}px`;
                if (placeholderCount === 0) {
                    item.style.display = 'none';
                }
            } else {
                // delete item.style['margin-left'];
                delete item.style.width;
            }
        });
    }

    /**
     * Event handler, called whenever an item is dragged over the selectionModel list
     */
    onDragOver(eventObj, index /* , type, external */) {
        // disable dropping at index zero because here the mighty placeholder for date shifting lives
        return index !== 0;
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
     * duplicates a certain event item when the user does shift+click it
     */
    duplicateItem($index, item, $event) {
        if ($event.shiftKey || $event.ctrlKey || $event.altKey) {
            this.$log.debug(`shift + clicked item ${$index}`);
            this.selectionModelIdCounter++;
            item = angular.copy(item);
            item.listid = this.selectionModelIdCounter;
            this.selectionModel.splice($index, 0, item);
        }
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
                intro: this.$translate.instant('intro.templates').replace(/\n/g, '<br/>'),
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
                position: 'top'
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
    '$uibModal',
    'selectedCalendar',
    CalcreateStateController
];
