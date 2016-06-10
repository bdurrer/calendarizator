class ConfirmationModalController {
    constructor($uibModalInstance, $log, data) {
        this.$uibModalInstance = $uibModalInstance;
        this.data = data;
        this.$log = $log;
    }

    ok() {
        this.$uibModalInstance.close('ok');
    }

    cancel() {
        this.$uibModalInstance.dismiss('dismiss modal without saving');
    }
}

export default [
    '$uibModalInstance',
    '$log',
    'data',
    ConfirmationModalController
];
