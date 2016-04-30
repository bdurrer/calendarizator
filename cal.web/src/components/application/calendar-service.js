class CalendarService {

    constructor(GApi, $log, $state, $q) {
        this.GApi = GApi;
        this.$log = $log;
        this.$state = $state;
        this.$q = $q;
        this.dataStore = {
            calendarSelection: null,
            eventList: []
        };
    }

    /**
     * This method handles login failures. It won't do anything if the error is NOT an auth error
     */
    handleGapiFailure(response) {
        this.$log.debug('failed to fetch data from google API');
        if (response && response.code === 401 && response.error) {
            if (response.error.message === 'Login Required') {
                this.$state.go('app.login');
                return;
            }
        }
        return this.$q.reject(response);
    }

    getCalendars() {
        return this.GApi.executeAuth('calendar', 'calendarList.list', {
            minAccessRole: 'writer',
            showDeleted: false,
            showHidden: false,
            maxResults: 30
        })
        .catch((response) => this.handleGapiFailure(response));
    }

    getCalendarAcl(calId) {
        return this.GApi.executeAuth('calendar', 'acl.list', {
            calendarId: calId,
            showHidden: false,
            maxResults: 30
        })
        .catch((response) => this.handleGapiFailure(response));
    }

    addCalendarAcl(calId, acl) {
        return this.GApi.executeAuth('calendar', 'acl.insert', {
            calendarId: calId,
            resource: acl
        })
        .catch((response) => this.handleGapiFailure(response));
    }

    createCalendar(paramObj) {
        return this.GApi.executeAuth('calendar', 'calendars.insert', paramObj).catch(this.handleGapiFailure);
    }

    saveAppointment(calId, event) {
        return this.GApi.executeAuth('calendar', 'events.insert', {
            calendarId: calId,
            resource: event
        })
        .catch((response) => this.handleGapiFailure(response));
    }

    getEventTemplate(id) {
        return this.GApi.executeAuth('calApi', 'template.get', id)
            .catch((response) => this.handleGapiFailure(response));
    }

    getEventTemplates() {
        return this.GApi.executeAuth('calApi', 'template.list')
            .catch((response) => this.handleGapiFailure(response));
    }

    saveEventTemplate(tmpl) {
        return this.GApi.executeAuth('calApi', 'template.save', tmpl)
            .catch((response) => this.handleGapiFailure(response));
    }

    getCalendarSelection() {
        return this.dataStore.calendarSelection;
    }

    setCalendarSelection(cal) {
        this.dataStore.calendarSelection = cal;
    }

    getEventList() {
        return this.dataStore.eventList;
    }

    setEventList(cal) {
        this.dataStore.eventList = cal;
    }
}

export default [
    'GApi',
    '$log',
    '$state',
    '$q',
    CalendarService
];
