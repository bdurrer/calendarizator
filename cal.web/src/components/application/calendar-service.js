class CalendarService {

    constructor(GApi) {
        this.GApi = GApi;
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
            }
        }
    }

    getCalendars() {
        return this.GApi.executeAuth('calendar', 'calendarList.list', {
            minAccessRole: 'writer',
            showDeleted: false,
            showHidden: false,
            maxResults: 30
        })
        .catch(this.handleGapiFailure);
    }

    createCalendar(paramObj) {
        return this.GApi.executeAuth('calendar', 'calendars.insert', paramObj).catch(this.handleGapiFailure);
    }

    saveAppointments(calList) {
        return this._http
        .post('/api/v1/Calendar/', {
            cal: calList
        })
        .then((response) => response.data, this.handleGapiFailure);
    }

    getEventTemplate(id) {
        return this.GApi.executeAuth('calApi', 'template.get', id).catch(this.handleGapiFailure);
    }

    getEventTemplates() {
        return this.GApi.executeAuth('calApi', 'template.list').catch(this.handleGapiFailure);
    }

    saveEventTemplate(tmpl) {
        return this.GApi.executeAuth('calApi', 'template.save', tmpl).catch(this.handleGapiFailure);
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
    CalendarService
];
