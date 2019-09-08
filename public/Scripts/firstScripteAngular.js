//Déclaration du Modul
var app = angular.module('firstAppNodeJs', [])
	
	// Déclaration de la factory dont le nom est monController, $scope est le scope de controleur, car chaque controleur doit avoir un scope. et lors de l'appelle a cette factory on va créer le controlleur qui a comme nom "monController"
	app.controller('monController', ['$scope', function(scope){
		scope.maData = "Veillez vous Connecter"
	}])

//3eme cours
   // controlleur et manipulation
var appFunc = angular.module('monApp2', [])

// ??
angular.element(function() {
      angular.bootstrap(document, ['monApp2']);
    });
// fin ??

	appFunc.controller('monController2', ['$scope', maFonction])

	function maFonction($scope){
		$scope.msg = "Bravo !";
		$scope.data = 3;
		$scope.inc = function(){
			$scope.data++;
		}
		$scope.dec = function(){
			$scope.data--;
		}
	}
   
   // controlleur et maniplation Hide et Show
      // je vais créer un nouvau controlleur pour le mm objet (module)

      appFunc.controller('HideShowCtrl', ['$scope', hideShowFunc])

      function hideShowFunc($scope){
      	$scope.datas = ['un','deux','trois'];
      	$scope.visible = true;

      	$scope.affiche = function(){
      		$scope.visible = true;
      	}
      	$scope.masque = function(){
      		$scope.visible = false;
      	}
      }

      // controlleur et maniplation Form

      appFunc.controller('Form_ctrl', ['$scope', formFunct])

	function formFunct($scope){
			$scope.email = "";
			$scope.number = "";

			$scope.submit = function(){
				console.log("$scope.email: "+$scope.email);
				console.log("$scope.number: "+$scope.number);
				console.log("$scope.maForm.emailInput: "+$scope.maForm.emailInput.$viewValue);
			}
		}

		app.controller('formLoginPost', ['$scope', '$http', validateFunction])
			function validateFunction($scope, $http){
				$scope.login ="";
				$scope.password = "";
                $scope.PostDataResponse = '';
                $scope.aficheAlert = false;

				$scope.submit = function() {
                    var datas = {
                            login: $scope.login,
                            password: $scope.password
						};
                    $http.post('/traiterLogin', datas).success(function (response) {
                        $scope.PostDataResponse = response;
                        $scope.aficheAlert = true;
                    })
                        .error(function (data, status, header, config) {
                            $scope.ResponseDetails = "Data: " + data +
                                "<hr />status: " + status +
                                "<hr />headers: " + header +
                                "<hr />config: " + config;
                        });
                }
			}