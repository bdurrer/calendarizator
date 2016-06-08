import angular from 'angular';

const dependencies = [];

export default angular
    .module('bootstrap-breakpoint', dependencies)
    .directive('bpListener', ['$window', '$timeout', '$rootScope', function ($window, $timeout, $rootScope) {
        return {
            restrict: 'A',
            scope: { },
            template: '<div class="visible-xs"></div><div class="visible-sm"></div>' +
            '<div class="visible-md"></div><div class="visible-lg"></div>',
            link(scope, iElement) {
                let t;
                scope.markers = iElement.find('div');
                scope.currentVal = null;
                
                const sizeMap = {
                    lg: 3,
                    md: 2,
                    sm: 1,
                    xs: 0
                };
                
                scope.broadcastChange = function(newValue){
                    const oldValue = scope.currentVal;
                    scope.currentVal = newValue;
                    
                    const paramOldVal = oldValue === null ? null : oldValue.substring(8);
                    const paramNewVal = scope.currentVal.substring(8)
                    $rootScope.$broadcast('bp-changed', {
                        sizeName: paramNewVal,
                        size: sizeMap[paramNewVal],
                        oldSizeName: paramOldVal,
                        oldSize: sizeMap[paramOldVal]
                    });
                }

                scope.updateDisplayMode = function () {
                    angular.forEach(scope.markers, (elem) => {
                        if (elem.offsetParent !== null) {
                            if (elem.className !== scope.currentVal) {
                                scope.broadcastChange(elem.className);
                            }
                        }
                    });
                };

                // debounced resize handler
                scope.onResize = function() {
                    $timeout.cancel(t);
                    t = $timeout(() => {
                        scope.updateDisplayMode();
                    }, 300); // check if resize event is still happening
                };
                angular.element($window).on('resize', scope.onResize);

                // send an event so that other components can enforce an bp-changed event.
                const unregisterFn = $rootScope.$on('bp-ping', () => {
                    scope.broadcastChange(scope.currentVal);
                });
                
                // unbind the event handlers when this component is destroyed
                scope.onDestroy = function() {
                    angular.element($window).off('resize', scope.onResize);
                    unregisterFn();
                }
                scope.$on('$destroy', onDestroy);

                scope.updateDisplayMode(); // fire it at least once
            }
        };
    }]);