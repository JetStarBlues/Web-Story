define(function (require) {
	
	var WebglBg = require('app/views/bg/terrain-webgl-bg'),
		DomBg = require('app/views/bg/terrain-dom-bg');
	
	require('three');

	var BgTerrain = function () {
		var instance = this;
		
		instance.init = function (renderer) {
			console.log('---terrain-init!');
			
			instance.renderer = renderer;			
			instance.alive = true;
			
			instance.setup();
		};
		
		instance.setup = function () {
			instance.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 11000);
		
			instance.webglView = new WebglBg();
			instance.webglView.init(instance.renderer, instance.camera);
			
			instance.domView = new DomBg();
			instance.domView.init(instance.camera);
		};
		
		instance.render = function () {
			//console.log('---terrain-render!');

			if (instance.alive) {
				instance.domView.render();
				instance.webglView.render();
			}			
		};
		
		this.destroy = function () {
			
			instance.alive = null;
			
			instance.webglView.destroy();
			instance.domView.destroy();
			instance.webglView = null;
			instance.domView = null;
			
			instance.camera = null;			
						
			instance.init = null;
			instance.render = null;
			instance.setup = null;
			
			
			console.log('---terrain-destroy!');
		};
	}
	
	return BgTerrain;
	
});