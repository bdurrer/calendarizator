/* eslint no-param-reassign: 0 */

import angular from 'angular';
import moment from 'moment/moment';

class CalcreateStateController {

    constructor(calendarService, $log, $timeout) {
        this.calendarService = calendarService;
        this.$log = $log;
        this.$timeout = $timeout;
        this.selectionModel = [];

        this.templates = [];

        this.loadTemplates();

        this.selectedItem = null;
        this.startDate = moment();
        this.updateModel();
    }
	
	loadTemplates(){
		this.isLoading = true;
        this.calendarService.getEventTemplates().then((response) => {
            this.$log.debug('fetched templates!');
            this.onTemplatesLoaded(response.items);
            this.isLoading = false;
        },
        (response) => this.handleGapiFailure(response));
	}

    onTemplatesLoaded(items){
        if (items.length <= 0) {
            this.$log.debug('user has no templates yet');
            this.createDefaultTemplates();
        } else {
            this.templates = items;
        }

        const zero = '0';
        const empty = '';
        
        angular.forEach(this.templates, (value) => {
            value.style = {};
            if (value.colorBackground) {
                value.style['background-color'] = value.colorBackground;
            }
            if (value.colorForeground) {
                value.style.color = value.colorForeground;
            }
			
			if ( value.from_hour ) {
				value.from = `${value.from_hour < 10 ? zero : empty}${value.from_hour}:${value.from_min < 10 ? zero : empty}${value.from_min}`;
			} else {
				value.from = '';
			}
			
			if (value.to_hour) {
				value.to = `${value.to_hour < 10 ? zero : empty}${value.to_hour}:${value.to_min < 10 ? zero : empty}${value.to_min}`;
			} else {
				value.to = '';
			}
        });
    }

    createDefaultTemplates() {
        this.createDefaultTemplate('Frühdienst', '#dff0d8', null, 9, 50, 15, 30);
        this.createDefaultTemplate('Spätdienst', '#d9edf7', null, 15, 15, 23, 45);
        this.createDefaultTemplate('Nacht', '#fcf8e3', null, 23, 45, 7, 45);
        this.createDefaultTemplate('Frei', '#ffffff', null, null, null, null, null);
    }

    createDefaultTemplate(title, colorBackground, colorForeground, from_hour, from_min, to_hour, to_min) {
        this.calendarService.saveEventTemplate({
            title,
            colorBackground,
            colorForeground,
            from_hour,
            from_min,
            to_hour,
            to_min
        }).then((response) => {
            this.$log.debug('saved default tmpl!');
			this.templates.push(response);
        }, (response) => this.handleGapiFailure(response));
    }

    handleGapiFailure(response) {
        this.isLoading = false;
        this.$log.debug('failed to fetch data from google API');
        if (response && response.code === 401 && response.error) {
            if (response.error.message === 'Login Required') {
                this.$state.go('app.login');
            }
        }
    }

    updateModel() {
        let currentDate = this.startDate.clone();
        angular.forEach(this.selectionModel, (item) => {
            item.date = currentDate;
            currentDate = currentDate.clone().add(1, 'day');
        });
    }

    onDrop(index, item) {
        this.$log.debug(`model dropped at ${index}`);
        this.selectionModel.splice(index, 0, item);
        this.updateModel();
        return true;
    }

    onDelete() {
        this.$timeout(() => {
            this.updateModel();
        }, 150);
        return true;
    }

}

export default [
    'calendarService',
    '$log',
    '$timeout',
    CalcreateStateController
];
