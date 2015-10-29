// Kuhtipp v0.1 2015
//Author: Michael Schwarz
//email: mail@mmschwarz.de
//
(function () {
    var nodeTipp = angular.module('nodeTipp', ['rzModule']);

    nodeTipp.controller('mainController', function ($scope, $http) {
        $scope.formData = {};

        // get all the tipps from Database
        $http.get('/api/tipps')
            .success(function (data) {
                $scope.tipps = data;
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

        // sends the data to the server
        $scope.createTipp = function () {
            $http.post('/api/tipps', $scope.formData)
                .success(function (data) {
                    $scope.formData = {}; //clear the form entries
                    $scope.tipps = data;
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        };

        // deletes a tipp with the id
        $scope.deleteTipp = function (id) {
            $http.delete('/api/tipps/' + id)
                .success(function (data) {
                    $scope.tipps = data;
                    console.log(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        };
    });

    //loads the selected tabs
    nodeTipp.controller('TabController', function ($scope, $http) {
        this.tab = 1;
        this.setTab = function (newValue) {
            this.tab = newValue;
        };

        this.isSet = function (tabName) {
            return this.tab === tabName;
        };
    });

    //controller for evaluating the winner
    nodeTipp.controller('EvaluationController', function ($scope, $http) {
        //holds the entries of the evaluation form
        $scope.formData2 = {};
        $scope.results = [];
        //slider with deviation value
        $scope.sliderValue = 0;

        $scope.evaluateTipps = function () {
            this.gewicht = parseInt($scope.formData2.tippgewicht);
            this.abweichung = parseInt($scope.sliderValue);
            $scope.results = []; //reset results

            if ($scope.tipps.length < 1) {
                console.log('Error: Keine Tipps vorhanden');
                return;
            }

            for (i = 0; i < $scope.tipps.length; i++) {
                this.tippgewicht = parseInt($scope.tipps[i].tippgewicht); //convert to Int
                if ((this.gewicht - this.abweichung) <= this.tippgewicht && this.tippgewicht <= (this.gewicht + this.abweichung)) {
                    console.log(i);
                    $scope.tipps[i].abweichung = Math.abs(this.gewicht - this.tippgewicht);
                    $scope.results.push($scope.tipps[i]);
                    console.log("tippnr " + $scope.tipps[i].tippnr + "mit " + $scope.tipps[i].tippgewicht + " kg hinzugefügt");
                }
            }

            //sorting the results by deviation
            $scope.results.sort(function (a, b) {
                var keyA = new Number(a.abweichung),
                    keyB = new Number(b.abweichung);
                // Compare the 2 dates
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });
        };
    });
})();