import angular from 'angular';

class CalcreateStateController {
	
	constructor($log) {
		this.$log = $log;
		this.selectionModel = [
			{ label: 'boom', id: 1 },
			{ label: 'bang', id: 2 }
		];
		
		this.templates = [
            { label: 'item 1', id: 1 },
			{ label: 'item 2', id: 2 }
        ];
		
		this.selectedItem = null;
	}
	
	updateModel() {
		angular.forEach(this.selectionModel, (item,key) => {
			item.date = new Date();
		});
	}

	onDrop(index, item) {
		this.$log.debug('model dropped at ' + index);
		this.selectionModel.splice(index, 0, item);
		this.updateModel();
		//return item;
		return true;
	}

}

export default [
	'$log',
    CalcreateStateController
];
