'use strict';
(function (angular) {
    var module = angular.module('ui-routed-tabs', []);

    module.controller('RoutedTabsetController', function RoutedTabsetController($scope) {
        var ctrl = this,
            tabs = ctrl.tabs = $scope.tabs = [];

        ctrl.select = function (selectedTab) {
            angular.forEach(tabs, function (tab) {
                if (tab.active && tab !== selectedTab) {
                    tab.active = false;
                }
            });
            selectedTab.active = true;
        };

        ctrl.addTab = function addTab(tab) {
            tabs.push(tab);
            // we can't run the select function on the first tab
            // since that would select it twice
            if (tabs.length === 1) {
                tab.active = true;
            } else if (tab.active) {
                ctrl.select(tab);
            }
        };

        ctrl.removeTab = function removeTab(tab) {
            var index = tabs.indexOf(tab);
            //Select a new tab if the tab to be removed is selected and not destroyed
            if (tab.active && tabs.length > 1 && !destroyed) {
                //If this is the last tab, select the previous tab. else, the next tab.
                var newActiveIndex = index == tabs.length - 1 ? index - 1 : index + 1;
                ctrl.select(tabs[newActiveIndex]);
            }
            tabs.splice(index, 1);
        };

        var destroyed;
        $scope.$on('$destroy', function () {
            destroyed = true;
        });
    });

    module.run(function ($templateCache) {
        $templateCache.put('template/tabs/routed-tabset.html',
            '<div>\n' +
            '  <ul class="nav nav-{{type || \'tabs\'}}" ng-class="{\'nav-stacked\': vertical, \'nav-justified\': justified}" ng-transclude></ul>\n' +
            '</div>\n');

        $templateCache.put('template/tabs/routed-tab.html',
            '<li ng-class="{active: active, disabled: disabled}">\n' +
            '  <a href ng-click="select()" routed-tab-heading-transclude></a>\n' +
            '</li>\n');
    });

    module.directive('routedTabset', function () {
        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            scope: {
                type: '@'
            },
            controller: 'RoutedTabsetController',
            templateUrl: 'template/tabs/routed-tabset.html',
            link: function (scope, element, attrs) {
                scope.vertical = angular.isDefined(attrs.vertical) ? scope.$parent.$eval(attrs.vertical) : false;
                scope.justified = angular.isDefined(attrs.justified) ? scope.$parent.$eval(attrs.justified) : false;
            }
        };
    });

    module.directive('routedTab', function ($parse, $state, $rootScope) {
        function any(array, predicate) {
            for (var key in array) {
                if (array.hasOwnProperty(key) && predicate(array[key])) {
                    return true;
                }
            }
            return false;
        }

        return {
            require: '^routedTabset',
            restrict: 'EA',
            replace: true,
            templateUrl: 'template/tabs/routed-tab.html',
            transclude: true,
            scope: {
                heading: '@',
                otherActiveRoutes: '@'
            },
            controller: function () {
                //Empty controller so other directives can require being 'under' a tab
            },
            compile: function ($template, $attrs, transclude) {
                return function postLink($scope, $element, $attrs, tabsetCtrl) {
                    var observedRoutes = $parse($attrs.otherActiveRoutes)($scope) || [];
                    observedRoutes.push($attrs.uiSref);

                    var updateActive = function () {
                        var active = any(observedRoutes, function (route) {
                            return $state.current.name.indexOf(route) === 0;
                        });
                        if (active) {
                            tabsetCtrl.select($scope);
                        }
                    };

                    var unbindStateChangeSuccess = $rootScope.$on('$stateChangeSuccess', updateActive);
                    var unbindStateChangeError = $rootScope.$on('$stateChangeError', updateActive);
                    var unbindStateChangeCancel = $rootScope.$on('$stateChangeCancel', updateActive);
                    var unbindStateNotFound = $rootScope.$on('$stateNotFound', updateActive);

                    $scope.$on('$destroy', unbindStateChangeSuccess);
                    $scope.$on('$destroy', unbindStateChangeError);
                    $scope.$on('$destroy', unbindStateChangeCancel);
                    $scope.$on('$destroy', unbindStateNotFound);

                    $scope.disabled = false;
                    if ($attrs.disabled) {
                        $scope.$parent.$watch($parse($attrs.disabled), function (value) {
                            $scope.disabled = !!value;
                        });
                    }

                    $scope.select = function () {
                        if (!$scope.disabled) {
                            $scope.active = true;
                        }
                    };

                    tabsetCtrl.addTab($scope);
                    $scope.$on('$destroy', function () {
                        tabsetCtrl.removeTab($scope);
                    });

                    $scope.headingElement = $scope.heading;
                    if (!$scope.heading) {
                        $scope.headingElement = transclude($scope.$parent);
                    }

                    updateActive();
                };
            }
        };
    });

    module.directive('routedTabHeadingTransclude', function () {
        return {
            restrict: 'A',
            require: '^routedTab',
            link: function ($scope, $element) {
                $scope.$watch('headingElement', function updateHeadingElement(heading) {
                    if (heading) {
                        $element.html('');
                        $element.append(heading);
                    }
                });
            }
        };
    });

}(angular));
