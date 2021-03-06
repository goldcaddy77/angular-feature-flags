(function () {
    'use strict';

    describe('Directive: FeatureFlag', function() {
        var $scope, parentElement, featureElement, flagCheck;

        beforeEach(module('feature-flags'));

        describe('when using the feature-flag directive in isolation', function() {

            beforeEach(inject(function($rootScope, $compile, featureFlags) {
                featureElement = angular.element('<div feature-flag="FLAG_NAME">Hello world</div>')[0];
                parentElement = angular.element('<div></div>').append(featureElement)[0];

                flagCheck = spyOn(featureFlags, 'isOn');

                $scope = $rootScope.$new();
                $compile(parentElement)($scope);
            }));

            describe('when the feature flag', function() {
                describe('is on', function() {
                    beforeEach(function() {
                        flagCheck.andReturn(true);
                        $scope.$digest();
                    });

                    it('should leave the element in the dom', function() {
                        expect(parentElement.innerText).toEqual("Hello world");
                    });
                });

                describe('is off', function() {
                    beforeEach(function() {
                        flagCheck.andReturn(false);
                        $scope.$digest();
                    });

                    it('should swap a placeholder comment into its place', function() {
                        expect(parentElement.childNodes.length).toBe(1);
                        expect(parentElement.childNodes[0].nodeName).toContain('comment');
                        expect(parentElement.childNodes[0].textContent).toContain('FLAG_NAME is off');
                    });
                });
            });

            describe('when i toggle it on and off again', function() {
                beforeEach(function() {
                    flagCheck.andReturn(true);
                    $scope.$digest();
                    flagCheck.andReturn(false);
                    $scope.$digest();
                });

                it('should replace the element with the placeholder comment', function() {
                    expect(parentElement.childNodes.length).toBe(1);
                    expect(parentElement.childNodes[0].outerHtml).toBe(featureElement.outerHtml);
                });
            });

        });

        describe('when using the feature-flag directive with the feature-flag-hide attribute', function() {

            beforeEach(inject(function($rootScope, $compile, featureFlags) {
                featureElement = angular.element('<div feature-flag="FLAG_NAME" feature-flag-hide>Hello world</div>')[0];
                parentElement = angular.element('<div></div>').append(featureElement)[0];

                flagCheck = spyOn(featureFlags, 'isOn');

                $scope = $rootScope.$new();
                $compile(parentElement)($scope);
            }));

            describe('when the feature flag', function() {
                describe('is on', function() {
                    beforeEach(function() {
                        flagCheck.andReturn(true);
                        $scope.$digest();
                    });

                    it('should swap a placeholder comment into its place', function() {
                        expect(parentElement.childNodes.length).toBe(1);
                        expect(parentElement.childNodes[0].nodeName).toContain('comment');
                        expect(parentElement.childNodes[0].textContent).toContain('FLAG_NAME is on');
                    });
                });

                describe('is off', function() {
                    beforeEach(function() {
                        flagCheck.andReturn(false);
                        $scope.$digest();
                    });

                    it('should leave the element in the dom', function() {
                        expect(parentElement.innerText).toEqual("Hello world");
                    });
                });
            });

            describe('when i toggle it on and off again', function() {
                beforeEach(function() {
                    flagCheck.andReturn(true);
                    $scope.$digest();
                    flagCheck.andReturn(false);
                    $scope.$digest();
                });

                it('should leave the element in the dom', function() {
                    expect(parentElement.innerText).toEqual("Hello world");
                });
            });

        });

    });
}());
