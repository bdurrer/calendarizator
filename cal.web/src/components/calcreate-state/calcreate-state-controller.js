/* eslint no-param-reassign: 0 */

import angular from 'angular';
import moment from 'moment/moment';

class CalcreateStateController {

	constructor($log, $timeout) {
		this.$log = $log;
		this.$timeout = $timeout
		this.selectionModel = [
			{	label: 'Frühdienst', 
				id: 100, 
				style: { 'background-color': '#dff0d8' },
				from: '09:50', 
				to: '12:40'
			},
			{	label: 'Frühdienst', 
				id: 100, 
				style: { 'background-color': '#dff0d8' },
				from: '09:50', 
				to: '12:40'
			},
			{	label: 'Spätdienst', 
				id: 200, 
				style: { 'background-color': '#d9edf7' },
				from: '15:20', 
				to: '23:45'
			}
		];
		
		this.templates = [
            {	label: 'Frühdienst', 
				id: 100, 
				style: { 'background-color': '#dff0d8' },
				from: '09:50', 
				to: '12:40'
			},
			{	label: 'Spätdienst', 
				id: 200, 
				style: { 'background-color': '#d9edf7' },
				from: '15:20', 
				to: '23:45'
			},
			{	label: 'Nacht', 
				id: 300, 
				style: { 'background-color': '#fcf8e3' },
				from: '23:45', 
				to: '7:45'
			},
			{	label: 'Frei', 
				id: 400, 
				style: { 'background-color': '#fff' },
				from: '', 
				to: ''
			},
        ];
		
		this.selectedItem = null;
		this.startDate = moment();
		this.updateModel();
	}
	
	updateModel() {
		let currentDate = this.startDate.clone();
		angular.forEach(this.selectionModel, (item, key) => {
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
	
	onDelete(index, item) {
		this.$timeout( () => {
			this.updateModel();
		}, 150);
		
		return true;
	}

}

export default [
	'$log',
	'$timeout',
    CalcreateStateController
];
