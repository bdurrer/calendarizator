
class CalendarService {

    constructor($http) {
        this._http = $http;
    }

    getCalendars(personInput, treatmentInput) {
        return this._http
        .post('/api/v1/Calendar', {
            person: personInput,
            treatment: treatmentInput
        })
        .then((response) => response.data);
    }

    createCalendar(name) {
        return this._http
        .get(`/api/v1/Calendar/${name}`)
        .then((response) => response.data);
    }

    saveAppointments(calList) {
        return this._http
        .post(`/api/v1/Calendar/`, {
			cal: calList
		})
        .then((response) => response.data);
    }

}

export default [
    '$http',
    CalendarService
];
