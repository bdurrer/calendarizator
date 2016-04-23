import moment from 'moment/moment';

class CalselectStateController {

    constructor(calendarService, authService, $state, $translate, $log, listItems) {
        this.calendarService = calendarService;
        this.authService = authService;
        this.$state = $state;
        this.$log = $log;
        this.list = listItems || [];
        this.selectedItem = null;
        this.isLoading = false;

        // make sure the current locale is shown
        moment.locale($translate.use());

        this.$log.debug(`timezone is guessed to be ${moment.tz.guess()}`);

        this.newCalParams = {
            name: null,
            timeZone: null
        };

        try {
            this.newCalParams.timeZone = moment.tz.guess();
        } catch (err) {
            this.newCalParams.timeZone = 'Europe/Zurich';
        }

        this.authService.checkLogin().then((txt) => {
            this.$log.debug(`Calselect: Login check response was ${txt}`);
        });
    }

    selectItem(item) {
        this.selectedItem = item;
        this.$log.debug(`timezone is guessed to be ${moment.tz.guess()}`);
    }

    loadCalendars() {
        this.isLoading = true;
        this.calendarService.getCalendars().then((response) => {
            this.$log.debug('fetched calendars!');
            this.list = response.items;
            this.isLoading = false;
        },
        () => {
            this.isLoading = false;
        });
    }

    acceptSelection() {
        this.calendarService.setCalendarSelection(this.selectedItem);
        this.$state.go('app.calcreate');
    }

    createCalendar() {
        this.isLoading = true;
        this.$log.debug('creating calendar...');
        this.calendarService.createCalendar(this.newCalParams).then((response) => {
            this.$log.debug('created calendar!');
            this.loadCalendars();
            this.isLoading = false;
            this.selectedItem = response;
        },
        () => {
            this.isLoading = false;
        });
    }
}

export default [
    'calendarService',
    'authService',
    '$state',
    '$translate',
    '$log',
    'listItems',
    CalselectStateController
];
