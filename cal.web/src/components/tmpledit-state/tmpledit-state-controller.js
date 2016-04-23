class TmpleditStateController {

    constructor(calendarService, tmpl, $state) {
        this.calendarService = calendarService;
        this.tmpl = tmpl;
        this.$state = $state;
    }

    onSave() {
        this.calendarService.saveEventTemplate(this.tmpl).then(() => {
            this.$state.go('app.calcreate');
        });
    }
}

export default [
    'calendarService',
    'tmpl',
    '$state',
    TmpleditStateController
];
