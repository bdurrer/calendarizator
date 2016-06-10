import angular from 'angular';

const dependencies = [];

export default angular
    .module('bootstrap-breakpoint', dependencies)
    .directive('bpListener', ['$window', '$timeout', '$rootScope', '$log', function ($window, $timeout, $rootScope, $log) {
        return {
            restrict: 'A',
            scope: {
                bpListener: '=?'
            },
            template: '<div class="visible-xs"></div><div class="visible-sm"></div>' +
                      '<div class="visible-md"></div><div class="visible-lg"></div>',
            link(directiveScope, iElement) {
                const scope = directiveScope;
                let t;
                const markers = iElement.find('div');
                let currentVal = null;

                // map the bootstrap size names to numbers, to make comparison easier
                const sizeMap = {
                    lg: 3,
                    md: 2,
                    sm: 1,
                    xs: 0
                };

                /**
                 * function to send an event when the size value changes
                 */
                function broadcastChange(newValue) {
                    const oldValue = currentVal;
                    currentVal = newValue;

                    const paramOldVal = oldValue === null ? null : oldValue.substring(8);
                    const paramNewVal = currentVal.substring(8);
                    const valueObj = {
                        sizeName: paramNewVal,
                        size: sizeMap[paramNewVal],
                        oldSizeName: paramOldVal,
                        oldSize: sizeMap[paramOldVal]
                    };
                    scope.bpListener = valueObj;
                    $rootScope.$broadcast('bp-changed', valueObj);
                }

                /**
                 * function to update the internal state value and trigger an event, when the value actually changes
                 */
                function updateDisplayMode(force) {
                    angular.forEach(markers, (elem) => {
                        if (elem.offsetParent !== null) {
                            if (force || elem.className !== currentVal) {
                                broadcastChange(elem.className);
                            }
                        }
                    });
                }

                /**
                 * event listener for window.resize.
                 * This is debounced by 300ms to prevent event-spam
                 */
                function onResize() {
                    $timeout.cancel(t);
                    t = $timeout(() => {
                        updateDisplayMode(false);
                    }, 300); // check if resize event is still happening
                }
                angular.element($window).on('resize', onResize);

                // send an event so that other components can enforce an bp-changed event.
                /*
                const unregisterFn = $rootScope.$on('bp-ping', () => {
                    broadcastChange(currentVal);
                });
                */

                // unbind the event handlers when this component is destroyed
                function onDestroy() {
                    $log.debug('unregistering listeners of directive bpListener upon destruction');
                    angular.element($window).off('resize', onResize);
                    // unregisterFn();
                }
                scope.$on('$destroy', onDestroy);

                updateDisplayMode(true); // fire it at least once
            }
        };
    }]);
