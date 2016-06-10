class SuccessStateController {
    constructor(selectedCalendar, calendarService, $state, $log) {
        this.selectedCalendar = selectedCalendar;
        this.$state = $state;
        this.calendarService = calendarService;
        this.$log = $log;

        /** the list of permissions on the selected calendar */
        this.acl = [];
        this.loadAcls();
        this.isLoading = false;
    }

    restart() {
        // clear the selection
        this.calendarService.resetEventList();
        this.$state.go('app.calselect');
    }

    loadAcls() {
        this.calendarService.getCalendarAcl(this.selectedCalendar.id).then((response) => {
            this.acl = response.items;
        });
    }

    addAcl() {
        const acl = {
            role: 'reader',
            scope: {
                type: 'user',
                value: this.aclUsr
            }
        };
        this.isLoading = true;
        this.calendarService.addCalendarAcl(this.selectedCalendar.id, acl).then((response) => {
            this.acl.push(response);
            this.isLoading = false;
            this.showSuccess = true;
        },
        (response) => {
            this.$log.debug('failed to update acl');
            if (response.error && response.error.message) {
                if (response.error.message === 'Invalid scope value.') {
                    this.failureText = 'Invalid email address';
                } else {
                    this.failureText = response.error.message;
                }
            } else {
                this.failureText = 'Unknown failure';
            }
        });
    }
}

export default [
    'selectedCalendar',
    'calendarService',
    '$state',
    '$log',
    SuccessStateController
];
