
class CalselectStateController {

    constructor(calendarService, $state, $log) {
        this.calendarService = calendarService;
        this.$state = $state;
        this.$log = $log;

        this.list = [];
        this.selectedItem = null;
        this.isLoading = false;
        this.newCalParams = {
            name: null,
            timeZone: 'Europe/Zurich'
        };

        this.loadCalendars();
    }

    selectItem(item) {
        this.selectedItem = item;
    }

    loadCalendars() {
        this.isLoading = true;
        this.calendarService.getCalendars().then((response) => {
            this.$log.debug('fetched calendars!');
            this.list = response.items;
            this.isLoading = false;
        },
        (response) => this.handleGapiFailure(response));
    }

    handleGapiFailure(response) {
        this.isLoading = false;
        this.$log.debug('failed to fetch calendars');
        if (response && response.code === 401 && response.error) {
            if (response.error.message === 'Login Required') {
                this.$state.go('app.login');
            }
        }
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
        (response) => this.handleGapiFailure(response));
    }
}

export default [
    'calendarService',
    '$state',
    '$log',
    CalselectStateController
];
