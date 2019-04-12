
//////////////////////////////////////////////////////////////////////////////////
	//		Init
	//////////////////////////////////////////////////////////////////////////////////

	// init renderer
	var renderer	= new THREE.WebGLRenderer({
		// antialias	: true,
		alpha: true
	});
	renderer.setClearColor(new THREE.Color('lightgrey'), 0)
	// renderer.setPixelRatio( 1/2 );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.top = '0px'
	renderer.domElement.style.left = '0px'
	document.body.appendChild( renderer.domElement );

	// array of functions for the rendering loop
	var onRenderFcts= [];

	// init scene and camera
	var scene	= new THREE.Scene();
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Initialize a basic camera
	//////////////////////////////////////////////////////////////////////////////////

	// Create a camera
	var camera = new THREE.Camera();
	scene.add(camera);

	////////////////////////////////////////////////////////////////////////////////
	//          handle arToolkitSource
	////////////////////////////////////////////////////////////////////////////////

	var arToolkitSource = new THREEx.ArToolkitSource({
		// to read from the webcam 
		sourceType : 'webcam',

		// to read from an image
		// sourceType : 'image',
		// sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',		

		// to read from a video
		// sourceType : 'video',
		// sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',		
	})

	arToolkitSource.init(function onReady(){
		onResize()
	})
	
	// handle resize
	window.addEventListener('resize', function(){
		onResize()
	})
	function onResize(){
		arToolkitSource.onResize()	
		arToolkitSource.copySizeTo(renderer.domElement)	
		if( arToolkitContext.arController !== null ){
			arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)	
		}	
	}
	////////////////////////////////////////////////////////////////////////////////
	//          initialize arToolkitContext
	////////////////////////////////////////////////////////////////////////////////
	

	// create atToolkitContext
	var arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: THREEx.ArToolkitContext.baseURL + '../data/data/camera_para.dat',
		detectionMode: 'mono',
		maxDetectionRate: 30,
		canvasWidth: 80*3,
		canvasHeight: 60*3,
	})
	// initialize it
	arToolkitContext.init(function onCompleted(){
		// copy projection matrix to camera
		camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
	})

	// update artoolkit on every frame
	onRenderFcts.push(function(){
		if( arToolkitSource.ready === false )	return

		arToolkitContext.update( arToolkitSource.domElement )
	})
	
	
	////////////////////////////////////////////////////////////////////////////////
	//          Create a ArMarkerControls
	////////////////////////////////////////////////////////////////////////////////
	
	var markerRoot = new THREE.Group
  markerRoot.name = 'marker'
	scene.add(markerRoot)
	var artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
		type : 'pattern',
		//patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.hiro'
		// patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji'
    //patternUrl : THREEx.ArToolkitContext.baseURL + '../pattern-marker_24-7.patt'
    //patternUrl :'http://pierrevedel.com/jommiquevoyance/img/hiro.patt'
    patternUrl :'https://raw.githubusercontent.com/pierrevedel/voyance/master/pattern-marker_oeil.patt'
	})

	// build a smoothedControls
	var smoothedRoot = new THREE.Group()
	scene.add(smoothedRoot)
	var smoothedControls = new THREEx.ArSmoothedControls(smoothedRoot, {
		lerpPosition: 0.4,
		lerpQuaternion: 0.3,
		lerpScale: 1,
	})
	onRenderFcts.push(function(delta){
		smoothedControls.update(markerRoot)
	})
  
  //display information if the marker is visible or not
  var markerBRoot = scene.getObjectByName('marker')
    onRenderFcts.push(function(){
		if( markerBRoot.visible === true){
        document.getElementById('interaction').style.visibility='visible';
        //document.getElementById("coucou" ).innerHTML = 'FAIS MOI DU COUSCOUS';
      document.getElementById("coucou").style.visibility='hidden';
		}else{
			document.getElementById('interaction').style.visibility='hidden';
      document.getElementById("coucou").style.visibility='visible';
      document.getElementById("coucou" ).innerHTML = 'VISE LE &#x25A3;';
		}
    })
    
  
	//////////////////////////////////////////////////////////////////////////////////
	//		add an object in the scene
	//////////////////////////////////////////////////////////////////////////////////

//arWorldRoot is the root scene group
	var arWorldRoot = smoothedRoot

	/*
  // add a torus knot	
	var geometry	= new THREE.CubeGeometry(1,1,1);
	var material	= new THREE.MeshNormalMaterial({
		transparent : true,
		opacity: 0.5,
		side: THREE.Frontside
	}); 
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.y	= geometry.parameters.height/2
	arWorldRoot.add( mesh );
	
	var geometry	= new THREE.TorusKnotGeometry(0.3,0.1,64,16);
	var material	= new THREE.MeshNormalMaterial(); 
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.y	= 0.5
	arWorldRoot.add( mesh );
	
	onRenderFcts.push(function(){
		mesh.rotation.x += 0.1
   
	})
  */
// list of sentences
  var tableWelcome = ['COUCOU LES DOUDOUS!', 'CA BICHE ICI', 'ALORS?'];    
  var tableSentence = ['SI Y A DU SEXE A LA FIN: FONCE!', 'ZIZOU CHAMPION DU MONDE', 'C\'EST BON POUR LE MORALES'];
    // select randomly a sentence from table
function getRandomSentence(table) {
      var randomFromTable = Math.floor(Math.random() * Math.floor(table.length));
      return table[randomFromTable];
    }
    var text = getRandomSentence(tableWelcome);
   
// add the text
var rotatingTextGroup = new THREE.Group();
    arWorldRoot.add(rotatingTextGroup);

   function rotatingText(parentGroup, displayText){
  var textGroup = new THREE.Group(); 
  parentGroup.add(textGroup);
  var meshMaterial = new THREE.MeshNormalMaterial({
        flatShading: THREE.FlatShading,
        transparent: true,
        opacity: 1,
      })
  // load font
      var fontLoader = new THREE.FontLoader();

      fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        var textOptions = {
          font: font,
          size: .35,
          height: .2,
          curveSegments: 5,
          bevelEnabled: false,
          bevelThickness: 2,
          bevelSize: 2,
          bevelSegments: 2
        }
    
    
    // table to store each single letter separatly
    var textTable = [];
    // variables to set gap between letters       
        var specialLetter = ['!', 'I', '\'', ','];
        var flagSpecialLetter = Boolean(false);
        var gapLetter =.33;
        var gapSpecialLetter = 0.71*gapLetter;
        var angle=0;    
        var decalageY=0;
        var decalageZ=1.3;
        
        var i;
        for (i = 0; i < displayText.length; i++) {
          // create a group per letter
          var singleLetterGroup = new THREE.Group(); 
          textGroup.add(singleLetterGroup);
          textTable[i] = displayText.charAt(i);
          
        // create text gerometry
        var textGeometry = new THREE.TextGeometry(textTable[i], textOptions)
        var textMesh = new THREE.Mesh(textGeometry, meshMaterial)
        textMesh.geometry.center();
        textMesh.position.set(0, .6, decalageZ);
        //textMesh.scale.set(.2,.2, .2);
        textMesh.rotation.x = -.3;
        singleLetterGroup.add(textMesh);
        // define special gap for special letter
  if (flagSpecialLetter == true){
    angle +=gapSpecialLetter;
    flagSpecialLetter = false;
  }else {
    for (var j = 0; j < specialLetter.length; j++) {
        if (textTable[i] == specialLetter[j]){
            flagSpecialLetter = true;
         }
    }
    if (flagSpecialLetter == true){
      angle +=gapSpecialLetter;
    }else {
      angle +=gapLetter;
    }
  }
  //apply gap between letters in spiral display
        singleLetterGroup.rotation.y = angle;
        singleLetterGroup.rotation.z = -.08;
        singleLetterGroup.position.y = decalageY;
        decalageY +=-.03;
        //singleLetterGroup.position.z = decalageZ;
        decalageZ +=.015;
        //quaternion = new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3(0, 1, -0).normalize(), i*.6 );
        }


//textGroup.rotation.x = -Math.PI/4;        
  onRenderFcts.push(function(){
		//textMesh.rotation.setEulerFromQuaternion( quaternion );
    textGroup.rotation.y += -0.03;
    //textMesh.position.applyQuaternion(quaternion);
    //textMesh.rotation.y += 0.05
	})      
        }) //end of fonction font

}//end of fonction rotatingText
rotatingText(rotatingTextGroup, text);
        
// crystal ball floating
	var crystalBallGroup = new THREE.Group();
  arWorldRoot.add(crystalBallGroup);
  var geometry = new THREE.SphereGeometry( .35, 16, 16 );
	var material = new THREE.MeshNormalMaterial();
	var crystalBall = new THREE.Mesh(geometry, material);
	// add the 3d object to the scene	
  crystalBallGroup.add(crystalBall);
  crystalBallGroup.position.y = 0.5;

  var sphereDisplacementMax=1;
  onRenderFcts.push(function(){
    crystalBallGroup.position.y	= Math.cos(Date.now()/500) *sphereDisplacementMax;
	})


var factor =1/1.05; 
var flagAnimationOver = Boolean(false);

    
    

//////////////////////////////////////////////////////////////////////////////////
//Interaction with buttons
//////////////////////////////////////////////////////////////////////////////////
 var divPlus = document.getElementById('+');
  divPlus.addEventListener("click", function(){
  rotatingTextGroup.rotation.x += -Math.PI/8;
})
  
  var divMenos = document.getElementById('-');
  divMenos.addEventListener("click", function(){
 rotatingTextGroup.rotation.x += +Math.PI/8;
})

  var divQuestion = document.getElementById('?');
  divQuestion.addEventListener("click", function(){
    divQuestion.disabled = true;
    divQuestion.style.visibility='hidden';
    //fonction pour faire varier le rayon d'une sphere
    function transition(timestamp) {
      var progress;
      if (start == 0) start = timestamp;
      progress = timestamp - start;  
      crystalBall.scale.multiplyScalar(factor);
      if (progress < 700) {
        requestAnimationFrame(transition);
      };
    }
    //je fais grossir la sphere
    start = 0;
    factor = 1/factor;
    requestAnimationFrame(transition);
    //je purge et mets a jour du texte (qui est à l'interieur de la sphere)
    setTimeout(function(){
      for (var i = rotatingTextGroup.children.length - 1; i >= 0; i--) {
        rotatingTextGroup.remove(rotatingTextGroup.children[i]);
      }
      text = getRandomSentence(tableSentence);
      rotatingText(rotatingTextGroup, text);
    //inverse facteur de variation de la sphere  
    }, 800)
    
    setTimeout(function(){
      //je fais diminuer la sphere
      factor = 1/factor;
      start = 0;
      requestAnimationFrame(transition); 
    }, 1500)
    setTimeout(function(){
    divQuestion.disabled = false;
    divQuestion.style.visibility='visible';
    },2500)
  })
  
//////////////////////////////////////////////////////////////////////////////////
	//		render the whole thing on the page
	//////////////////////////////////////////////////////////////////////////////////
	/*
  var stats = new Stats();
	document.body.appendChild( stats.dom );
	*/
  // render the scene
	onRenderFcts.push(function(){
		renderer.render( scene, camera );
		//stats.update();
	})
  
	// run the rendering loop
	var lastTimeMsec= null
	requestAnimationFrame(function animate(nowMsec){
		// keep looping
		requestAnimationFrame( animate );
		// measure time
		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
		var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
		lastTimeMsec	= nowMsec
		// call each update function
		onRenderFcts.forEach(function(onRenderFct){
			onRenderFct(deltaMsec/1000, nowMsec/1000)
    })
	})