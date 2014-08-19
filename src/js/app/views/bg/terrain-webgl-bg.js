/*global define THREE $ TweenMax*/
define(function (require) {
	
	var UserEvent = require('pres/events/user-event'),
		AppEvent = require('pres/events/app-event'),
		blenderModel = require('text!app/data/island1.js'),
		cloudModel = require('text!app/data/cloud1.js'),
		Camera = require('pres/models/camera'),
		CameraPath = require('app/models/camera-path'),
		BgView,
        directionalLight,
        water,
        waterGeometry;
	
	require('tweenmax');
	require('three');
	require('vendor/Mirror');
	require('vendor/WaterShader');

	BgView = function () {
		var instance = this;
		
		instance.init = function (renderer, camera) {
			instance.renderer = renderer;
			instance.camera = camera;
			instance.addScene();
		};
		
		instance.addScene = function () {
			
			var light,
				directionalLight;
						
			instance.scene = new THREE.Scene();
			
			//LIGHTS				
			directionalLight = new THREE.DirectionalLight(0xff9966);
			directionalLight.position.set(1, 0, 1);
			instance.scene.add(directionalLight);
			
			light = new THREE.DirectionalLight(0xcc9966);
			light.position.set(1, 0, -1);
			instance.scene.add(light);
			
			light = new THREE.SpotLight(0xcc6633);
			light.position.set(1000, 0, 1000);
			instance.scene.add(light);
			
			light = new THREE.SpotLight(0x336699);
			light.position.set(-1000, 0, -1000);
			instance.scene.add(light);
			
			light = new THREE.SpotLight(0xcc9966);
			light.position.set(-1000, 0, 1000);
			instance.scene.add(light);
			
			light = new THREE.AmbientLight(0x333333);
			instance.scene.add(light);
			
			instance.addSky();
			instance.addModel();
            instance.addWater();
			instance.addClouds();
			
			instance.renderer.render(instance.scene, instance.camera);
			
			light = null;
			directionalLight = null;
		};
		
		instance.addModel = function () {
			var i,
                mesh,
				content,
				loader,
				model,
                mapTexture;
			
			content = JSON.parse(blenderModel);
			loader = new THREE.JSONLoader();
			model = loader.parse(content);
			
			for (i = 0; i < model.materials.length; i += 1) {
				model.materials[i].shading = THREE.FlatShading;
				model.materials[i].side = THREE.DoubleSide;
			}

			mesh = new THREE.Mesh(model.geometry, new THREE.MeshFaceMaterial(model.materials));
			mesh.scale.set(40, 40, 40);
			instance.scene.add(mesh);
			
			instance.terrain = mesh;
		};
		
		instance.addSky = function () {
			var mesh,
				geo,
				mat;
			
			geo = new THREE.SphereGeometry(8000, 100, 100);
			mat = new THREE.MeshBasicMaterial({
                color: 0x3377ff, 
				side: THREE.BackSide
			});
			
			mesh = new THREE.Mesh(geo, mat);
			instance.scene.add(mesh);
		};
		
		instance.addWater = function () {
            var i,
				mirrorMesh,
                parameters = {
                    width: 7000,
                    height: 7000,
                    widthSegments: 250,
                    heightSegments: 250,
                    depth: 1500,
                    param: 4,
                    filterparam: 1
                },
                waterNormals = new THREE.ImageUtils.loadTexture('assets/images/textures/waternormals.jpg');
            
            waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
            waterGeometry = new THREE.PlaneGeometry(parameters.width * 500, parameters.height * 500, 50, 50);
            water = new THREE.Mirror(instance.renderer, instance.camera, {
                textureWidth: 512, 
                textureHeight: 512,
                color: 0x0099cc
            });

            mirrorMesh = new THREE.Mesh(
                waterGeometry,
                water.material
            );

            mirrorMesh.add(water);
            mirrorMesh.position.y = 7;
            mirrorMesh.rotation.x = - Math.PI * 0.5;
            
            instance.scene.add(mirrorMesh);
        };

		instance.addClouds = function () {
			var content,
				loader,
				model,
				mesh,
				scale,
				rotation,
				i;
			
			content = JSON.parse(cloudModel);
			loader = new THREE.JSONLoader();
			model = loader.parse(content);
			
			for (i = 0; i < model.materials.length; i += 1) {
				model.materials[i].shading = THREE.FlatShading;
			}
			
			for (i = 0; i < 50; i += 1) {
				scale = 10 + Math.random() * 50;
				rotation = Math.random() * 180;
				mesh = new THREE.Mesh(model.geometry, new THREE.MeshFaceMaterial(model.materials));
				mesh.scale.set(scale, scale, scale);
				mesh.rotation.set(0, rotation, 0);
				mesh.position.set(-3500 + Math.random() * 7000, 200 + Math.random() * 200, -3500 + Math.random() * 7000);
				instance.scene.add(mesh);			
			}

		};
		
		instance.render = function () {
            water.render();
			instance.renderer.render(instance.scene, instance.camera);
		};

		instance.resize = function () {
			instance.render();
		};
		
		instance.destroy = function () {
			
		};
	};
		
	return BgView;
});
