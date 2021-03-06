/* globals Stats, dat, AMI*/

// standard global letiables
var controls;
var threeD;
var renderer;
var camera;
var scene;
var vrHelper;
var lut;
var ready = false;

var myStack = {
    lut: 'random',
    opacity: 'random',
    steps: 256,
    alphaCorrection: 0.5,
    interpolation: 1
};

var file = 'https://ghcdn.rawgit.org/sainitripti/visualiser/master/data/training_axial_full_pat0_transformed.nii.gz';
var annotation = 'https://ghcdn.rawgit.org/sainitripti/visualiser/master/data/training_axial_full_pat0-label.nii.gz';

/**
 * Handle window resize event
 */
function onWindowResize() {
    // update the camera
    camera.aspect = threeD.offsetWidth / threeD.offsetHeight;
    camera.updateProjectionMatrix();

    // notify the renderer of the size change
    renderer.setSize(threeD.offsetWidth, threeD.offsetHeight);
}

/**
 * Build GUI
 */
function buildGUI() {
    var gui = new dat.GUI({
        autoPlace: false
    });

    var customContainer = document.getElementById('my-gui-container');
    customContainer.appendChild(gui.domElement);

    var stackFolder = gui.addFolder('Settings');
    var lutUpdate = stackFolder.add(myStack, 'lut', lut.lutsAvailable());
    lutUpdate.onChange(function(value) {
        lut.lut = value;
        vrHelper.uniforms.uTextureLUT.value.dispose();
        vrHelper.uniforms.uTextureLUT.value = lut.texture;
    });
    // init LUT
    lut.lut = myStack.lut;
    vrHelper.uniforms.uTextureLUT.value.dispose();
    vrHelper.uniforms.uTextureLUT.value = lut.texture;

    var opacityUpdate = stackFolder.add(myStack, 'opacity', lut.lutsAvailable('opacity'));
    opacityUpdate.onChange(function(value) {
        lut.lutO = value;
        vrHelper.uniforms.uTextureLUT.value.dispose();
        vrHelper.uniforms.uTextureLUT.value = lut.texture;
    });

    var stepsUpdate = stackFolder.add(myStack, 'steps', 0, 512).step(1);
    stepsUpdate.onChange(function(value) {
        if (vrHelper.uniforms) {
            vrHelper.uniforms.uSteps.value = value;
        }
    });

    var alphaCorrrectionUpdate = stackFolder.add(myStack, 'alphaCorrection', 0, 1).step(0.01);
    alphaCorrrectionUpdate.onChange(function(value) {
        if (vrHelper.uniforms) {
            vrHelper.uniforms.uAlphaCorrection.value = value;
        }
    });

    stackFolder.add(vrHelper, 'interpolation', 0, 1).step(1);

    stackFolder.open();
}

/**
 * Init the scene
 */
function init() {
    /**
   * Rendering loop
   */
    function animate() {
        // render
        controls.update();

        if (ready) {
            renderer.render(scene, camera);
        }

        // request new frame
        requestAnimationFrame(function() {
            animate();
        });
    }

    // renderer
    threeD = document.getElementById('r3d');
    renderer = new THREE.WebGLRenderer({
        alpha: true
    });
    renderer.setSize(threeD.offsetWidth, threeD.offsetHeight);
    threeD.appendChild(renderer.domElement);

    // scene
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera(45, threeD.offsetWidth / threeD.offsetHeight, 0.1, 100000);
    
    camera.position.x = -435;
    camera.position.y = 58;
    camera.position.z = -75;
    camera.up.set(-0.34, 0.00, 0.67);

    // controls
    controls = new AMI.TrackballControl(camera, threeD);
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    window.addEventListener('resize', onWindowResize, false);

    // start rendering loop
    animate();
}

// init threeJS...
init();
render();

function render() {
    var loader = new AMI.VolumeLoader(threeD);
loader.load([file, annotation]).then(function() {
    var series = loader.data[0].mergeSeries(loader.data)[0];
    var series2 = loader.data[1].mergeSeries(loader.data)[0];
    loader.free();
    loader = null;
    var stack2 = series2.stack[0];

    vrHelper = new AMI.VolumeRenderingHelper(stack2);
    // scene
    scene.add(vrHelper);

    // get first stack from series
    var stack = series.stack[0];

    vrHelper = new AMI.VolumeRenderingHelper(stack);
    scene.add(vrHelper);
    
    // CREATE LUT
    lut = new AMI.LutHelper('my-tf');
    lut.luts = AMI.LutHelper.presetLuts();
    lut.lutsO = AMI.LutHelper.presetLutsO();
    // update related uniforms
    vrHelper.uniforms.uTextureLUT.value = lut.texture;
    vrHelper.uniforms.uLut.value = 1;

    // update camrea's and interactor's target
    var centerLPS = stack.worldCenter();
    camera.lookAt(centerLPS.x, centerLPS.y, centerLPS.z);
    camera.updateProjectionMatrix();
    controls.target.set(centerLPS.x, centerLPS.y, centerLPS.z);

    // create GUI
    buildGUI();

    ready = true;
});
}


