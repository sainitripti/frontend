import * as THREE from '../../node_modules/three/build/three.module.js';

import Stats from '../../node_modules/three/examples/jsm/libs/stats.module.js';

import { TrackballControls } from '../../node_modules/three/examples/jsm/controls/TrackballControls.js';
import { PCDLoader } from '../../node_modules/three/examples/jsm/loaders/PCDLoader.js';

let container, stats;
let camera, controls, scene, renderer, threeD;

init();
addController();
//animate();

// sleep time expects milliseconds
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function init() {

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x000000 );

	camera = new THREE.PerspectiveCamera( 120, window.innerWidth *3/4 / window.innerHeight, 0.001, 500 );
	camera.position.x = 0;
	camera.position.y= 0;
	camera.position.z = 300;

	scene.add( camera );

	threeD = document.getElementById('r3d');
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth*3/4, window.innerHeight);
	threeD.appendChild( renderer.domElement );

	const loader = new PCDLoader();
	
	loader.load( 'https://ghcdn.rawgit.org/sainitripti/visualiser/master/data/LV.pcd', function ( points ) {

		scene.add( points );
		//points.rotation.x = 4.12;
		//points.rotation.y = 5.62;
		//points.rotation.z = 6.00;
		const center = points.geometry.boundingSphere.center;
		controls.target.set( center.x, center.y, center.z );
		controls.update();
		loader.load( 'https://ghcdn.rawgit.org/sainitripti/visualiser/master/data/LA.pcd', function ( points2 ) {

			scene.add( points2 );
			
			const center = points2.geometry.boundingSphere.center;
			controls.target.set( center.x, center.y, center.z );
			controls.update();
			//animatePoints(10);

			loader.load( 'https://ghcdn.rawgit.org/sainitripti/visualiser/master/data/RV.pcd', function ( points3 ) {

				scene.add( points3 );

				const center = points3.geometry.boundingSphere.center;
				controls.target.set( center.x, center.y, center.z );
				controls.update();
				//animatePoints(10);

				sleep(500).then(() => {

					loader.load( 'https://ghcdn.rawgit.org/sainitripti/visualiser/master/data/RA.pcd', function ( points4 ) {

						scene.add( points4 );
						points4.position.x += 5;
						points4.position.y -= 10;
						points4.position.z += 15;
						const center = points4.geometry.boundingSphere.center;
						controls.target.set( center.x, center.y, center.z );
						controls.update();
						animatePoints(10);
					} );
				});		
			} );
		} );
		//animatePoints(10);
	} );

	
	
	container = document.createElement( 'div' );
	threeD.appendChild( container );
	container.appendChild( renderer.domElement );

	controls = new TrackballControls( camera, renderer.domElement );

	controls.rotateSpeed = 2.0;
	controls.zoomSpeed = 0.3;
	controls.panSpeed = 0.2;

	controls.staticMoving = true;

	controls.minDistance = 0.3;	
	controls.maxDistance = 0.3 * 800;

	stats = new Stats();
	container.appendChild( stats.dom );

	window.addEventListener( 'resize', onWindowResize );

	window.addEventListener( 'keypress', keyboard );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	controls.handleResize();

}

function addController() {
	var heartControllerDiv = document.getElementById("heart-controller");

	var h4 = document.createElement('h4');
	h4.innerHTML = "Hide chamber(s):";
	heartControllerDiv.appendChild(h4);

	var checkboxDiv = document.createElement('div');
	
	// LV
	var input = document.createElement('input');
	input.id = "rightventricle";
	input.type = "checkbox";
	input.name = "rightventricle";
	input.value= "false";
	checkboxDiv.appendChild(input);

	var label = document.createElement('label');
	label.for = "rightventricle";
	label.innerHTML = "Right Ventricle";
	checkboxDiv.appendChild(label);

	heartControllerDiv.appendChild(checkboxDiv);

	// LA
	checkboxDiv = document.createElement('div');
	
	input = document.createElement('input');
	input.id = "rightatrium";
	input.type = "checkbox";
	input.name = "rightatrium";
	input.value= "false";
	checkboxDiv.appendChild(input);

	label = document.createElement('label');
	label.for = "rightatrium";
	label.innerHTML = "Right Atrium";
	checkboxDiv.appendChild(label);

	heartControllerDiv.appendChild(checkboxDiv);

	// RV
	checkboxDiv = document.createElement('div');
	
	input = document.createElement('input');
	input.id = "leftventricle";
	input.type = "checkbox";
	input.name = "leftventricle";
	input.value= "false";
	checkboxDiv.appendChild(input);

	label = document.createElement('label');
	label.for = "leftventricle";
	label.innerHTML = "Left Ventricle";
	checkboxDiv.appendChild(label);

	heartControllerDiv.appendChild(checkboxDiv);

	// RA
	checkboxDiv = document.createElement('div');
	
	input = document.createElement('input');
	input.id = "leftatrium";
	input.type = "checkbox";
	input.name = "leftatrium";
	input.value= "false";
	checkboxDiv.appendChild(input);

	label = document.createElement('label');
	label.for = "leftatrium";
	label.innerHTML = "Left Atrium";
	checkboxDiv.appendChild(label);

	heartControllerDiv.appendChild(checkboxDiv);

	document.getElementById('rightventricle').addEventListener('change', (event) => {
		if (event.currentTarget.checked) {
		  hideLV();
		} else {
		  showLV();
		}
	});

	document.getElementById('rightatrium').addEventListener('change', (event) => {
		if (event.currentTarget.checked) {
		  hideLA();
		} else {
		  showLA();
		}
	});

	document.getElementById('leftventricle').addEventListener('change', (event) => {
		if (event.currentTarget.checked) {
		  hideRV();
		} else {
		  showRV();
		}
	});

	document.getElementById('leftatrium').addEventListener('change', (event) => {
		if (event.currentTarget.checked) {
		  hideRA();
		} else {
		  showRA();
		}
	});

}

function hideLV()
{
	const points = scene.getObjectByName( 'LV.pcd' );
	points.material.transparent = true;
	points.material.opacity = 0;
	points.material.needsUpdate = true;
}

function hideLA()
{
	const points2 = scene.getObjectByName( 'LA.pcd' );
	points2.material.transparent = true;
	points2.material.opacity = 0;
	points2.material.needsUpdate = true;
}

function hideRV()
{
	const points3 = scene.getObjectByName( 'RV.pcd' );
	points3.material.transparent = true;
	points3.material.opacity = 0;
	points3.material.needsUpdate = true;
}

function hideRA()
{
	const points4 = scene.getObjectByName( 'RA.pcd' );
	points4.material.transparent = true;
	points4.material.opacity = 0;
	points4.material.needsUpdate = true;
}

function showLV()
{
	const points = scene.getObjectByName( 'LV.pcd' );
	points.material.opacity = 1;
	points.material.needsUpdate = true;
}

function showLA()
{
	const points2 = scene.getObjectByName( 'LA.pcd' );
	points2.material.opacity = 1;
	points2.material.needsUpdate = true;
}

function showRV()
{
	const points3 = scene.getObjectByName( 'RV.pcd' );
	points3.material.opacity = 1;
	points3.material.needsUpdate = true;
}

function showRA()
{
	const points4 = scene.getObjectByName( 'RA.pcd' );
	points4.material.opacity = 1;
	points4.material.needsUpdate = true;
}

function keyboard( ev ) {

	const points = scene.getObjectByName( 'LV.pcd' );
	const points2 = scene.getObjectByName( 'LA.pcd' );
	const points3 = scene.getObjectByName( 'RV.pcd' );
	const points4 = scene.getObjectByName( 'RA.pcd' );

	switch ( ev.key || String.fromCharCode( ev.keyCode || ev.charCode ) ) {

		case '+':
			points.material.size *= 1.2;
			points.material.needsUpdate = true;
			break;

		case '-':
			points.material.size /= 1.2;
			points.material.needsUpdate = true;
			break;

		case 'e':
			points.material.color.setHex( 0xff0000 );
			points.material.needsUpdate = true;
			points2.material.color.setHex( 0x00ff00 );
			points2.material.needsUpdate = true;
			points3.material.color.setHex( 0x0000ff );
			points3.material.needsUpdate = true;
			points4.material.color.setHex( 0xffffff );
			points4.material.needsUpdate = true;

			break;

		case 'x':
			points4.position.x = points4.position.x + 1;
			break;
		case 'y':
			points4.position.y = points4.position.y + 1;
			break;
		case 'z':
			points4.position.z = points4.position.z + 1;
			break;

	}

}

function animate() {

	requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );
	stats.update();

}

function animatePoints(ts) {

	var points = scene.getObjectByName( 'LV.pcd' );	
	var points2 = scene.getObjectByName( 'LA.pcd' );	
	var points3 = scene.getObjectByName( 'RV.pcd' );	
	var points4 = scene.getObjectByName( 'RA.pcd' );	

	var center = new THREE.Vector3(0,0,0);
	var dist = new THREE.Vector3(points.position.x, points.position.y, points.position.z).sub(center);
	var size = 50.0;
	var magnitude = 0.05;
	points.scale.x = 1 + Math.sin(dist.length()/size + (ts/200)) * magnitude;
	points.scale.y = 1 + Math.sin(dist.length()/size + (ts/200)) * magnitude;
	points.scale.z = 1 + Math.sin(dist.length()/size + (ts/200)) * magnitude;
	
	var dist2 = new THREE.Vector3(points2.position.x, points2.position.y, points2.position.z).sub(center);
	points2.scale.x = 1 + Math.sin(dist2.length()/size + (ts/200)) * magnitude;
	points2.scale.y = 1 + Math.sin(dist2.length()/size + (ts/200)) * magnitude;
	points2.scale.z = 1 + Math.sin(dist2.length()/size + (ts/200)) * magnitude;
	
	var dist3 = new THREE.Vector3(points3.position.x, points3.position.y, points3.position.z).sub(center);
	points3.scale.x = 1 + Math.sin(dist3.length()/size + (ts/200)) * magnitude;
	points3.scale.y = 1 + Math.sin(dist3.length()/size + (ts/200)) * magnitude;
	points3.scale.z = 1 + Math.sin(dist3.length()/size + (ts/200)) * magnitude;
	
	var dist4 = new THREE.Vector3(points4.position.x, points4.position.y, points4.position.z).sub(center);
	points4.scale.x = 1 + Math.sin(dist4.length()/size + (ts/200)) * magnitude;
	points4.scale.y = 1 + Math.sin(dist4.length()/size + (ts/200)) * magnitude;
	points4.scale.z = 1 + Math.sin(dist4.length()/size + (ts/200)) * magnitude;
	
	requestAnimationFrame( animatePoints );
	controls.update();
	//console.log(points3.position);
	renderer.render( scene, camera );
	stats.update();
}

