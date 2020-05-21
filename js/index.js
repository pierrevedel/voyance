
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
    var tableWelcome = ['ENCORE TOI?', 'C\'EST POUR QUOI CETTE FOIS-CI?', 'POSE-MOI TA QUESTION', 'QUI ME REVEILLE A CETTE HEURE?', 'JE T\'ECOUTE MON PETIT', 'TON GENIE T\'ECOUTE', 'PARLE PAS TROP FORT S\'IL TE PLAIT', 'J\'ESPERE QUE C\'EST UNE QUESTION SEXUELLE'];    
  var tableSentence = ['J\'AI PAS L\'HABITUDE DE DIRE CA MAIS JE TE CONSEILLE DE FUIR','DES FOIS CHANGER DE PANTALON PEUT VOSU RENDRE SPLENDIDE','VAZY, ABANDONNE-TOI A TOUTES LES JOIES DU MONDE, IL N\'Y AURA PAS DE SACRIFICE', 'TON DESIR DE RETOURNER EN ARRIERE DANS TES PENSEES TE RAMENERAS AU MEME ENDROIT','COMMENCE PAR ALLER CHEZ LE COIFFEUR ET DEMANDE-LUI SON AVIS', 'QUE FERAIT ZIZOU DANS CETTE SITUATION?', 'PEU IMPORTE: SOUCIE-TOI DE CEUX QUE TU AIMES', 'C\'EST COMME PASSER A TRAVERS UN MIROIR ET LE CASSER APRES', 'REPOND-LUI: OH NOM DE DIEU DE BORDEL DE MERDE', 'C\'EST DANS TON SOMMEIL QUE TU TROUVERAS LA REPONSE', 'C\'EST PAS A TOI DE CHANGER: C\'EST AU MONDE DE S\'ADAPTER', 'C\'EST UN CHIEN QUI T\'AMENERA A LA REPONSE', 'CA ME FAIT PENSER A L\'HISTOIRE DES 2 ZEBRES QUI JOUAIENT A CACHE-CACHE', 'JE TE CONSEILLE DE NE JAMAIS TE REPOSER CETTE QUESTION', 'C\'EST COMME SI TU COUPAIS UN COCOTIER A CHAQUE FOIS QUE TU VOULAIS UNE NOIX DE COCO', 'PLUTOT QUE DE TIRER SUR L\'AMBULANCE: SUIS-LA', 'LA BANQUISE AURA FONDUE BIEN AVANT', 'Y A PEUT-ETRE UNE APP POUR CA?', 'ET SI TU CHANGEAIS DE RELIGION?', 'LE CHANGEMENT C\'EST JAMAIS MAINTENANT', 'PFF TU ME FATIGUES', 'C\'EST UN SUJET TROP SERIEUX POUR MOI', 'ATTENTION! TU REGARDES LE DOIGT DU SAGE', 'C\'EST UN PEU COMME FILMER UNE HORLOGE', 'JE NE VEUX PAS ETRE TENU RESPONSABLE DE CETTE DECISION', 'JE NE SUIS PAS TON JOURNAL INTIME', 'REGARDE BIEN LE SOLEIL EN FACE: TU TROUVERAS TA REPONSE', 'POURQUOI VOUS ME POSEZ TOUS LA MEME QUESTION?','REDEMANDE-MOI CA DANS UNE SEMAINE', 'TU ME DERANGES VRAIMENT POUR CA?', 'LA REPONSE COMMENCE PAR LA LETTRE: D', 'JE VOIS RIEN DU TOUT: J\'AI PERDU MON POUVOIR', 'CHOISI L\'OPPOSE DE CE QUE DIRAIENT TES PARENTS', 'FAIS COMME QUAND TU CHOISIS UN MENU AU RESTO', 'SI Y A DU SEXE A LA FIN: FONCE!', 'TU VEUX ETRE CHAMPION DU MONDE OU PAS?', 'C\'EST BON POUR LE MORAL', 'JE COMPRENDS PAS LA QUESTION: TU AS BU?'];
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
        var specialLetter = ['!', 'I', '\'', ',', '-', '?', ':'];
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
//bloquer la selection de texte pour les appuis long sur les boutons
document.onselectstart = (e) => { e.preventDefault() }

var isTouching = false;
var direction;

function rotateText() {
  if(isTouching){
    requestAnimationFrame(rotateText);
    rotatingTextGroup.rotation.x += direction*-Math.PI/200;
   }
}

  var divPlus = document.getElementById('+');
  divPlus.addEventListener("touchstart", function(){
  isTouching = true;
  direction = 1
  requestAnimationFrame(rotateText);
})
  divPlus.addEventListener("touchend", function(){
  isTouching = false;
})
  
  var divMenos = document.getElementById('-');
  divMenos.addEventListener("touchstart", function(){
  isTouching = true;
  direction = -1
  requestAnimationFrame(rotateText);
})
  divMenos.addEventListener("touchend", function(){
  isTouching = false;
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
