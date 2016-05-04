var _ = require("underscore"),
	util = require("util"),
	config = {},
	http = require("http"),
	express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	fs = require('fs'),
	prompt = require('prompt');

app.use(express.static('public'));
app.use(bodyParser.json());

var neutronPorts = [
	{ id: "1c7811dc-e0b1-4d1e-9089-c203df328157", mac_address: "fa:16:3e:47:47:00", fixed_ips: [{"subnet_id": "50d00739-172c-4ca5-9c0d-79478b27bc9f", "ip_address": "12.12.12.2"},]},
	{ id: "38aa2be8-dec7-49b3-94e6-805bb23c30fd", mac_address: "fa:16:3e:a0:25:f2", fixed_ips: [{"subnet_id": "fcd1456f-15dd-4e0b-9821-8036858a117c", "ip_address": "10.10.10.4"}]},
	{ id: "3b842df8-e92a-4d53-b394-fc575d8d37e5", mac_address: "fa:16:3e:5d:02:57", fixed_ips: [{"subnet_id": "61ae89f8-5297-4d5a-96fa-c6c3e2a1fa74", "ip_address": "10.12.0.3"}]},
	{ id: "3cac74fd-f24d-4b40-8344-1a86af85113e", mac_address: "fa:16:3e:bb:a4:ca", fixed_ips: [{"subnet_id": "fcd1456f-15dd-4e0b-9821-8036858a117c", "ip_address": "10.10.10.1"}]},
	{ id: "78058861-9079-4b9e-925f-81f4a0ac3e27", mac_address: "fa:16:3e:62:b4:f2", fixed_ips: [{"subnet_id": "fcd1456f-15dd-4e0b-9821-8036858a117c", "ip_address": "10.10.10.7"}]},
	{ id: "7fc1733c-f8d3-47cf-b755-0b08374a0e55", mac_address: "fa:16:3e:bb:1f:e0", fixed_ips: [{"subnet_id": "50d00739-172c-4ca5-9c0d-79478b27bc9f", "ip_address": "12.12.12.4"}]},
	{ id: "8075c307-4df9-4421-b65b-b2d871f83f56", mac_address: "fa:16:3e:3d:36:b6", fixed_ips: [{"subnet_id": "fcd1456f-15dd-4e0b-9821-8036858a117c", "ip_address": "10.10.10.3"}]},
	{ id: "87b30d9c-e895-42c0-8ea1-09c5087c2207", mac_address: "fa:16:3e:79:75:3f", fixed_ips: [{"subnet_id": "61ae89f8-5297-4d5a-96fa-c6c3e2a1fa74", "ip_address": "10.12.0.2"}]},
	{ id: "96ccf08f-6aa1-4b88-b853-4dfd46853a22", mac_address: "fa:16:3e:e1:2c:58", fixed_ips: [{"subnet_id": "50d00739-172c-4ca5-9c0d-79478b27bc9f", "ip_address": "12.12.12.5"}]}
];

var serviceChains = [
	{ id: "1c7811dc-e0b1-4d1e-9089-c203df328157a", vnf_list: "test",},
	{ id: "1c7811dc-e0b1-4d1e-9089-c203df328157b", vnf_list: "test",},
	{ id: "1c7811dc-e0b1-4d1e-9089-c203df328157c", vnf_list: "test",},
	{ id: "1c7811dc-e0b1-4d1e-9089-c203df328157d", vnf_list: "test",},
	{ id: "1c7811dc-e0b1-4d1e-9089-c203df328157e", vnf_list: "test",},
	{ id: "1c7811dc-e0b1-4d1e-9089-c203df328157f", vnf_list: "test",},
	{ id: "1c7811dc-e0b1-4d1e-9089-c203df328157g", vnf_list: "test",},
	{ id: "1c7811dc-e0b1-4d1e-9089-c203df328157h", vnf_list: "test",}
];

var virNetFuns = [
	{ id: "1c7811dc-e0b1-4d1e-9089-c203df328157a", ingress_port: "1c7811dc-e0b1-4d1e-9089-c203df328157a", egress_port: "1c7811dc-e0b1-4d1e-9089-c203df328157a", name: "1c7811dc-e0b1-4d1e-9089-c203df328157a", description: "1c7811dc-e0b1-4d1e-9089-c203df328157a"},
	{ id: "1c7811dc-e0b1-4d1e-9089-c203df328157b", ingress_port: "1c7811dc-e0b1-4d1e-9089-c203df328157a", egress_port: "1c7811dc-e0b1-4d1e-9089-c203df328157a", name: "1c7811dc-e0b1-4d1e-9089-c203df328157a", description: "1c7811dc-e0b1-4d1e-9089-c203df328157a"},
	{ id: "1c7811dc-e0b1-4d1e-9089-c203df328157c", ingress_port: "1c7811dc-e0b1-4d1e-9089-c203df328157a", egress_port: "1c7811dc-e0b1-4d1e-9089-c203df328157a", name: "1c7811dc-e0b1-4d1e-9089-c203df328157a", description: "1c7811dc-e0b1-4d1e-9089-c203df328157a"},
	{ id: "1c7811dc-e0b1-4d1e-9089-c203df328157d", ingress_port: "1c7811dc-e0b1-4d1e-9089-c203df328157a", egress_port: "1c7811dc-e0b1-4d1e-9089-c203df328157a", name: "1c7811dc-e0b1-4d1e-9089-c203df328157a", description: "1c7811dc-e0b1-4d1e-9089-c203df328157a"},
	{ id: "1c7811dc-e0b1-4d1e-9089-c203df328157e", ingress_port: "1c7811dc-e0b1-4d1e-9089-c203df328157a", egress_port: "1c7811dc-e0b1-4d1e-9089-c203df328157a", name: "1c7811dc-e0b1-4d1e-9089-c203df328157a", description: "1c7811dc-e0b1-4d1e-9089-c203df328157a"},
	{ id: "1c7811dc-e0b1-4d1e-9089-c203df328157f", ingress_port: "1c7811dc-e0b1-4d1e-9089-c203df328157a", egress_port: "1c7811dc-e0b1-4d1e-9089-c203df328157a", name: "1c7811dc-e0b1-4d1e-9089-c203df328157a", description: "1c7811dc-e0b1-4d1e-9089-c203df328157a"},
	{ id: "1c7811dc-e0b1-4d1e-9089-c203df328157g", ingress_port: "1c7811dc-e0b1-4d1e-9089-c203df328157a", egress_port: "1c7811dc-e0b1-4d1e-9089-c203df328157a", name: "1c7811dc-e0b1-4d1e-9089-c203df328157a", description: "1c7811dc-e0b1-4d1e-9089-c203df328157a"},
	{ id: "1c7811dc-e0b1-4d1e-9089-c203df328157h", ingress_port: "1c7811dc-e0b1-4d1e-9089-c203df328157a", egress_port: "1c7811dc-e0b1-4d1e-9089-c203df328157a", name: "1c7811dc-e0b1-4d1e-9089-c203df328157a", description: "1c7811dc-e0b1-4d1e-9089-c203df328157a"}
];
//routing funktionen
app.get("/api/service-chain", function(req, res){
	console.log("GET /api/service-chain/");
	res.status(200).send({ serviceChains: serviceChains });
});
//get methode für das verbiden der Applikation mit der API
app.get("/api/vir-net-fun", function(req, res){
	console.log("GET /api/vir-net-fun/");
	res.status(200).send({ virNetFuns: virNetFuns });
});

app.get("/api/service-chain/:id", function(req, res) {
	console.log("GET /api/service-chain/" + req.params.id);
	res.status(200).send(_.find(serviceChains, function(serviceChain) {
		return req.params.id === serviceChain.id;
	}));
});

app.get("/api/vir-net-fun/:id", function(req, res) {
	console.log("GET /api/vir-net-fun/" + req.params.id);

	res.status(200).send(_.find(virNetFuns, function(virNetFun) {
		return req.params.id === virNetFun.id;
	}));
});

app.delete("/api/service-chain/:id", function(req, res) {
	console.log("DELETE /api/service-chain/" + req.params.id);
	serviceChains = _.filter(serviceChains, function(serviceChain) {
		return serviceChain.id !== req.params.id;
	});
	res.status(200).send();
});

app.delete("/api/vir-net-fun/:id", function(req, res) {
	console.log("DELETE /api/vir-net-fun/" + req.params.id);
	virNetFuns = _.filter(virNetFuns, function(virNetFun) {
		return virNetFun.id !== req.params.id;
	});
	res.status(200).send();
});

app.get("/api/neutron-ports", function(req, res) {
	console.log("/api/neutron-ports");
	res.status(200).send({ ports: neutronPorts });
});

app.get("/api/vir-net-funs", function(req, res) {
	console.log("/api/vir-net-funs");
	res.status(200).send({ ports: virNetFuns });
});

fs.readFile('config.json', function(err, file) {
	config = JSON.parse(file);
	app.listen(config.guiPort, function() {
		console.log("listening on port " + config.guiPort);
	});
});
