
class CalendarService {

    constructor($http, GApi) {
        this._http = $http;
        this.GApi = GApi;

        this.dataStore = {
            calendarSelection: null
        };
    }

    getCalendars() {
        return this.GApi.executeAuth('calendar', 'calendarList.list', {
            minAccessRole: 'writer',
            showDeleted: false,
            showHidden: false,
            maxResults: 30
        });
    }

    createCalendar(paramObj) {
        return this.GApi.executeAuth('calendar', 'calendars.insert', paramObj);
    }

    saveAppointments(calList) {
        return this._http
        .post('/api/v1/Calendar/', {
            cal: calList
        })
        .then((response) => response.data);
    }

    getEventTemplates() {
        return this.GApi.executeAuth('calApi', 'templates');
    }

    saveEventTemplate(tmpl) {
        return this.GApi.executeAuth('calApi', 'save', tmpl);
    }

    getCalendarSelection() {
        return this.dataStore.calendarSelection;
    }

    setCalendarSelection(cal) {
        this.dataStore.calendarSelection = cal;
    }
}

export default [
    '$http',
    'GApi',
    CalendarService
];
