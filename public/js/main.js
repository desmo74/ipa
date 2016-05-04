angular.module('app', ['ui.bootstrap', 'ngRoute'])

.config(function($routeProvider) {

	$routeProvider
	.when('/', {
		controller:'HomeController',
		templateUrl:'html/home.html',
	})
	.when('/services', {
		controller:'ServicesController',
		templateUrl:'html/services.html',
	})
	.when('/service-function-chaining', {
		controller:'ServiceFunctionChainingController',
		templateUrl:'html/service-function-chaining.html',
	})
	.when('/virtual-network-functions', {
		controller:'VirtualNetworkFunctionController',
		templateUrl:'html/virtual-network-functions.html',
	})
	.when('/created-sfcs', {
		controller:'CreatedSfcsController',
		templateUrl:'html/created-sfcs.html',
	})
	.when('/connection', {
		controller:'ConnectionController',
		templateUrl:'html/connection.html',
	})
	.when('/bridges', {
		controller:'BridgesController',
		templateUrl:'html/bridges.html',
	})
	.when('/topology', {
		controller:'TopologyController',
		templateUrl:'html/topology.html',
	})
	.when('/logs', {
		controller:'LogsController',
		templateUrl:'html/logs.html',
	})
	.when('/bridgepattern', {
		controller:'BridgePatternController',
		templateUrl:'html/bridgepatterns.html',
	})
	.when('/chainpattern', {
		controller:'ChainPatternController',
		templateUrl:'html/chainpatterns.hnetfloctml',
	})
	.when('/subbridges', {
		controller:'SubBridgesController',
		templateUrl:'html/subbridges.html',
	})
	.when('/networkpath', {
		controller:'NetworkPathController',
		templateUrl:'html/networkpath.html',
	})
	.when('/flowpatterns', {
		controller:'FlowPatternController',
		templateUrl:'html/flowpatterns.html',
	})
	.otherwise({
		redirectTo:'/'
	});
})
.service('netfloc', function($http) {
	//configuration settings and api endpoints
	var justOnce = false;
	var settings = {
			serviceChain: '/api/service-chain',
			virNetFun: '/api/vir-net-fun',
			neutronPorts: '/api/neutron-ports',
	};
	this.config = function(options) {
		//load config just once
		if (justOnce) { return this; }
		_.extend(settings, options); justOnce = true;
		return this;
	};

	//liste von VNF ids als commaseperated string
	this.createServiceChain = function(virNetFuns) {
		//Weiterleitung des requests zu Service Chain
		return $http({
			method: 'POST',
			url: settings.serviceChain,
			data: {
				"input": {
					"vir-net-funs": virNetFuns
				}
			}
		});
	};

	//Liste von  ids als comma separated string
	this.createVirNetFun = function(neutronPorts) {
			return $http({
				method: 'POST',
				url: settings.virNetFun,
				data: {
					"input": {
						"neutron-ports": neutronPorts
					}
				}
			});
		};

	this.getServiceChains = function() {
		return $http({
			method: 'GET',
			url: settings.serviceChain,
		});
	};

	this.getVirNetFuns = function() {
		return $http({
			method: 'GET',
			url: settings.virNetFun,
		});
	};

	this.deleteServiceChain = function(id) {
		return $http({
			method: 'DELETE',
			url: settings.serviceChain + '/' + id,
		});
	};

	this.deleteVirNetFun = function(id) {
		return $http({
			method: 'DELETE',
			url: settings.virNetFun + '/' + id,
		});
	};

	this.getNeutronPorts = function() {
		return $http({
			method: "GET",
			url: settings.neutronPorts
		});
	};
})
.controller('MainController', function($scope, $location) {
	console.log('currentroute', $location.$$path);
	$scope.main={};
	$scope.main.hasnavigation = true;
	$scope.menu=[
	{href:"#/topology" , label:"Topology" },
	{href:"#/logs" , label:"Logs" }
	];
	$scope.menuService = {label:"Service" , menu: [{href:"#/service-function-chaining" , label:"Service Function Chaining"} , {href:"#/virtual-network-functions" , label:"Virtual Network Functions" }, {href:"#/chainpattern" , label:"Chain Pattern" }]};
	$scope.menuConnection = {label:"Connection" , menu: [{href:"#/networkpath" , label:"Network Path" } , {href:"#/flowpatterns" , label:"Flow Pattern" }] };
	$scope.menuBridges = {label:"Bridges" , menu: [{href:"#/subbridges" , label:"Bridges" } , {href:"#/bridgepattern" , label:"Bridge Pattern" }]};
	$scope.menuTopology = {};
	$scope.menuLogs = {};
	console.log("MainController");
})
.controller('HomeController', function($scope) {
	$scope.main.hasnavigation = false;
	console.log("HomeController");
	$scope.introduction="NETwork FLOws for Clouds (Netfloc) is a framework for datacenter network programming. It is comprised of set of tools and libraries packed as Java bundles this interoperate with the OpenDaylight controller. Netfloc exposes REST API abstractions and Java interfaces for network programmers to enable optimal integration in cloud datacenters and fully SDN-enabled end-to-end management of OpenFlow enabled switches. For further information please follow this link : http://netfloc.readthedocs.org/en/latest/ ";
})
.controller('ServiceFunctionChainingController', function($scope, netfloc) {
	$scope.main.hasnavigation = true;
	console.log("ServiceFunctionChainingController");
	$scope.introductionservicefunctionchaining="The function Service Function Chaining allows to get the number of Neutron Ports needed.";

	$scope.fetchVirNetFuns = function() {
		netfloc.getVirNetFuns().then(function( virNetFuns){
			console.log("vir-net-funs",  virNetFuns,  virNetFuns.data. virNetFuns);
			$scope.virNetFuns = _.map( virNetFuns.data.virNetFuns, function( virNetFun) {
				virNetFun.selectedOrder = 0;
				virNetFun.dropDownToggled = function(open) {
					console.log("toggled", this, open);
				};
				return  virNetFun;
			});
		});
	};
	$scope.fetchVirNetFuns();
	$scope.fetchServiceChains = function() {
		netfloc.getServiceChains().then(function(serviceChains){
			$scope.serviceChains = _.map(serviceChains.data.serviceChains, function(serviceChain){
				serviceChain.selected = false;
				return serviceChain;
			});
		});
	};
	$scope.fetchServiceChains();

	$scope.deleteSelected = function() {
		_.each(_.filter($scope.serviceChains, function(serviceChain) {
			return serviceChain.selected === true;
		}), function(serviceChain) {
			netfloc.deleteServiceChain(serviceChain.id).then(function() {
				$scope.serviceChains = _.filter($scope.serviceChains, function(sc) {
					return sc.id !== serviceChain.id;
				});
			});
		});
	};

	$scope.toggleSelect = function(){
		$scope.serviceChains = _.map($scope.serviceChains, function(serviceChain){
			serviceChain.selected = $scope.selectAll;
			return serviceChain;
		});
	};
	var clearVirNetFuns = function() {
		$scope.virNetFuns = _.map($scope.virNetFuns, function(port) {
			console.log(port);
			port.selectedOrder = 0;
			return port;
		});
	};

	$scope.getServiceChain = function(ports) {
		return  _.map(_.sortBy(_.filter(ports, function(port){
			return port.selectedOrder != 0;
		}), 'selectedOrder'), function(port){
			return port.id;
		});
	};

	$scope.chainIsValid = function(ports, maxChainOrder) {
		return $scope.getServiceChain(ports).length >= 2
		&& maxChainOrder.length == 1
		&& maxChainOrder[0] == 0;
	};

	$scope.maxChainOrderIsValid = function(nr) {
		return nr >= 2 && nr % 1 == 0;
	};

	$scope.maxChainOrderNr = 0;
	$scope.applyMaxChainOrder = function() {
		clearVirNetFuns();
		$scope.maxChainOrder = Array.apply(null, {length: $scope.maxChainOrderNr+1}).map(Number.call, Number);
		console.log("apply maxChainOrder", $scope.maxChainOrder);
	};

	$scope.maxChainOrder = [null];
	$scope.createServiceChain = function(ports) {
		if (!$scope.chainIsValid(ports, $scope.maxChainOrder)) {
			console.log("chain is not valid.");
			return;
		}
		var serviceChainString = $scope.getServiceChain(ports).join(",");
		console.log("serviceChainString:", serviceChainString);
		netfloc.createServiceChain(serviceChainString)
			.then(function(data) {
				$scope.fetchNeutronPorts();
				console.log(data);
				$scope.showMessage = true;
			  $scope.alertClass = "alert-success";
			  $scope.alertTitle = "Success"; $scope.alertMessage = "Your Chain has been successfully created";
			})
			.catch(function(err) {
				$scope.showMessage = true;
			  $scope.alertClass = "alert-danger";
			  $scope.alertTitle = "Error"; $scope.alertMessage = "Something went wrong";
				console.error(err);
			});
	};
	$scope.selectOrder = function(port, order) {
		if(port.selectedOrder !== 0){
			$scope.maxChainOrder.push(port.selectedOrder);
		}
		port.selectedOrder = order;
		$scope.maxChainOrder = _.filter($scope.maxChainOrder, function(chainOrder) {
			return chainOrder !== order || chainOrder === 0;
		});
		// sortieren reihenfolge
		console.log("select order for port", order, port);
	};
})
.controller('VirtualNetworkFunctionController', function($scope, netfloc) {
	console.log("VirtualNetworkFunctionController");

	$scope.fetchNeutronPorts = function() {
		netfloc.getNeutronPorts().then(function(ports){
			console.log("neutron-ports", ports, ports.data.ports);
			$scope.neutronPorts = _.map(ports.data.ports, function(port) {
				port.selectedOrder = 0;
				port.dropDownToggled = function(open) {
					console.log("toggled", this, open);
				};
				port.ip = _.map(port.fixed_ips, function(fixed_ip){
					return fixed_ip.ip_address;
				}).join(",");
				return port;
			});
		});
	};
	$scope.fetchNeutronPorts();
	$scope.fetchVirNetFuns = function() {
		netfloc.getVirNetFuns().then(function(virNetFuns){
			$scope.virNetFuns = _.map(virNetFuns.data.virNetFuns, function(virNetFun){
				virNetFun.selected = false;
				return virNetFun;
			});
		});
	};
	$scope.fetchVirNetFuns();

	$scope.deleteSelected = function() {
		_.each(_.filter($scope.virNetFuns, function(virNetFun) {
			return virNetFun.selected === true;
		}), function(virNetFun) {
			netfloc.deleteVirNetFun(virNetFun.id).then(function() {
				$scope.virNetFuns = _.filter($scope.virNetFuns, function(vnf) {
					return vnf.id !== virNetFun.id;
				});
			});
		});
	};

	$scope.toggleSelect = function(){
		$scope.virNetFuns = _.map($scope.virNetFuns, function(virNetFun){
			virNetFun.selected = $scope.selectAll;
			return virNetFun;
		});
	};th#filteroder{
    width: 1200px;
}
og(port);
			port.selectedOrder = 0;
			return port;
		});
	};

	$scope.getVirNetFun = function(ports) {
		return  _.map(_.sortBy(_.filter(ports, function(port){
			return port.selectedOrder != 0;
		}), 'selectedOrder'), function(port){
			return port.id;
		});
	};

	$scope.vnfIsValid = function(ports, maxVnfOrder) {
		return $scope.getVirNetFun(ports).length >= 2
		&& maxVnfOrder.length == 1
		&& maxVnfOrder[0] == 0;
	};

	$scope.maxVnfOrderIsValid = function(nr) {
		return nr >= 2 && nr % 1 == 0;
	};

	$scope.maxVnfOrderNr = 0;
	$scope.applymaxVnfOrder = function() {
		clearNeutronPorts();
		$scope.maxVnfOrder = Array.apply(null, {length: $scope.maxVnfOrderNr+1}).map(Number.call, Number);
		console.log("apply maxVnfOrder", $scope.maxVnfOrder);
	};

	$scope.maxVnfOrder = [null];
	$scope.createVirNetFun = function(ports) {
		if (!$scope.vnfIsValid(ports, $scope.maxVnfOrder)) {
			console.log("chain is not valid.");
			return;
		}
		var virNetFunString = $scope.getVirNetFun(ports).join(",");
		console.log("virNetFunString:", virNetFunString);
		netfloc.createVirNetFun(virNetFunString)
			.then(function(data) {
				$scope.fetchNeutronPorts();
				console.log(data);
				$scope.showMessage = true;
			  $scope.alertClass = "alert-success";
			  $scope.alertTitle = "Success"; $scope.alertMessage = "Your Chain has been successfully created";
			})
			.catch(function(err) {
				$scope.showMessage = true;
			  $scope.alertClass = "alert-danger";
			  $scope.alertTitle = "Error"; $scope.alertMessage = "Something went wrong";
				console.error(err);
			});
	};
	$scope.selectOrder = function(port, order) {
		if(port.selectedOrder !== 0){
			$scope.maxVnfOrder.push(port.selectedOrder);
		}
		port.selectedOrder = order;
		$scope.maxVnfOrder = _.filter($scope.maxVnfOrder, function(vnfOrder) {
			return vnfOrder !== order || vnfOrder === 0;
		});
		// sortieren reihenfolge
		console.log("select order for port", order, port);
	};

})



.controller('ServicesController', function() {
	console.log("ServicesController");
})
.controller('CreatedSfcsController', function($scope) {
	console.log("CreatedSfcsController");
	$scope.introductioncreatedsfcs="Below, all the already created Service Function Chains are listed. If you haven't created a Service Function Chain yet, please create one now.";

})
.controller('ChainPatternController', function($scope) {
	console.log("ChainPatternController");
	$scope.introductionchainpattern="In the Chain Patterns section of the SFC service, the user will be offered the possibility to Create / Enable / Disable different chain patterns. Patterns are automatically applied to new service chains and generate the Open Flow messages for each of the bridges in the chain.";

})
.controller('ConnectionController', function($scope) {
	console.log("ConnectionController");
})
.controller('NetworkPathController', function($scope) {
	console.log("NetworkPathController");
	$scope.introductionnetworkpath="The Network Graph creates Network Paths between Host Ports (provided by the Neutron API) to enable connection oriented flow programming. The Network Graph will currently only provide the shortest Network Path between two hosts by performing a BFS. A Network Path is a dynamic view onto a host-to-host connection and is not explicitly bound to OVS devices.";

})
.controller('FlowPatternController', function($scope) {
	console.log("FlowPatternController");
	$scope.introductionflowpattern="Flow Patterns are a parameterized structure which can be applied on Network Paths and are thus also segmented into source, destination and aggregation parts. Flow Patterns which are applied to Network Paths are dynamically maintained by Netfloc as long as the respective host-to-host connection is achievable.";
})
.controller('BridgesController', function() {
	console.log("BridgesController");

})
.controller('SubBridgesController', function() {
	console.log("SubBridgesController");

})
.controller('BridgePatternController', function() {
	console.log("BridgePatternController");

})
.controller('TopologyController', function() {
	console.log("TopologyController");

})
.controller('LogsController', function() {
	console.log("LogsController");
})
