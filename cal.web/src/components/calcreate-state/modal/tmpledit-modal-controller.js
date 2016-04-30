import moment from 'moment/moment';
import angular from 'angular';

class TemplateEditModalController {
    constructor($uibModalInstance, calendarService, $log, template) {
        this.$uibModalInstance = $uibModalInstance;
        this.calendarService = calendarService;
        this.$log = $log;

        this.template = template || {
            from: '07:00',
            to: '16:00'
        };
        this.isnew = !template;

        this.template.fromTime = moment(`2016-04-07 ${this.template.from}`, 'YYYY-MM-DD HH:mm').toDate();
        this.template.toTime = moment(`2016-04-07 ${this.template.to}`, 'YYYY-MM-DD HH:mm').toDate();

        this.colors = [];
        this.calendarService.getEventColor().then((response) => {
            this.colors = [];
            angular.forEach(response.event, (value, key) => {
                const color = {
                    id: key,
                    value,
                    style: `background-color:${value.background};`
                };
                this.colors.push(color);
                if (key === this.template.colorId) {
                    this.template.color = color;
                }
            });
        });
    }

    save() {
        this.form.$setSubmitted();

        if (this.form.$valid) {
            // this form is valid
            this.calendarService.saveEventTemplate(this.template).then((response) => {
                this.$uibModalInstance.close(response);
            },
            () => {
                this.showError = true;
            });
        }
    }

    cancel() {
        this.$uibModalInstance.dismiss('dismiss modal without saving');
    }

    selectColor(color) {
        this.template.colorId = color.id;
        this.template.color = color;
        this.template.colorBackground = color.value.background;
        this.template.colorForeground = color.value.foreground;
    }

    onTimeChange() {
        this.$log.debug('time changed');
        this.showTimeInfo = (this.template.fromTime > this.template.toTime);

        const mFrom = moment(this.template.fromTime);
        const mTo = moment(this.template.toTime);

        this.template.from = mFrom.format('HH:mm');
        this.template.from_hour = mFrom.format('H');
        this.template.from_min = mFrom.format('m');

        this.template.to = mTo.format('HH:mm');
        this.template.to_hour = mTo.format('H');
        this.template.to_min = mTo.format('m');
    }
}

export default [
    '$uibModalInstance',
    'calendarService',
    '$log',
    'template',
    TemplateEditModalController
];
