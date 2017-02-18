console.log("Hello World from main.js!");

//Puzzle
//How it works:
//Dynamically generate images on the page (like our cards from Memory Game)
	//Grab each image from the assets folder dynamically
	//set information for each image dynamically
//Create eventListeners for dragging and dropping the images into place
//Lock images in place when they are in the right position
//Time how long it takes to win
//Display modal on winning
//Reste game upon button click
//Refactor the puzzle to rotate the piece when the L/R arrows are pressed
//Add a finalRotation to the images
//Check the image is rotated properly before allowing it to lock in place



//example:
	// var imgObj = [
	// 	{
	// 		src: "asset/img/cat_1.jpg",
	// 		finalPosX: 100,
	// 		finalPosY: 100,
	// 	},
	// 	{
	// 		src: "asset/img/cat_2.jpg",
	// 		finalPosX: 300,
	// 		finalPosY: 100,
	// 	}
	// ];

	//position of previous image

//Homework:
// create function to check if pieceBeingDragged is within 20px of it's finalPosX and 20px of finalPosY
// if so, add class locked and snap it into position (set x and y equal to finalx and y)
//Prevent dragging when piece has class locked
//create timer that will display in end game modal only
//When game ends, display modal with timer and reset button
//Reset game on reset button click
//Bonus: add in rotating


var createImgObj = function ( imgData ) {
	var imgObj = [];

	//set up variables to handle keeping track of x and y positions and which coumn we're in
	var positionX = 100;
	var positionY = 100;
	var columnCount = 1;

	//make a loop
		//calculate final positions
		//write out src
		//push new obj to array

	for ( var i = 1; i <= imgData.numberOfImgs; i++ ) {
		var currentImg = {
			src: imgData.path + i + imgData.extension,
			finalPosX: positionX,
			finalPosY: positionY,
		};
		imgObj.push ( currentImg );

		if ( columnCount != imgData.numberOfCols ) {
			positionX += imgData.width;
			columnCount++;
		} else {
			columnCount = 1;
			positionX = 100;
			positionY += imgData.width;
		}
	}

console.log ( imgObj );
	return imgObj;
}

var startGame = function () {

	//path to images
	//Extension of images
	//width & height of each images
	//number of pieces
	//number of columns
	var imgDefaultData = {
		path: "assets/img/cat_",
		extension: ".jpg",
		width: 200,
		numberOfImgs: 6,
		numberOfCols: 3,
	};

	var imgArray = createImgObj(imgDefaultData);

	placePieces ( imgArray );

	window.addEventListener ( "mousemove", movePiece );
	window.addEventListener ( "mouseup", stopDrag );
	window.addEventListener ( "keyup", rotatePiece );

}

var placePieces = function ( imgArray ) {
	for ( var i = imgArray.length - 1; i >= 0; i-- ) {
		var piece = document.createElement( "img" );
		var rotation = (Math.round(Math.random() * 3) * 90);
		piece.setAttribute ( "class", "piece" );
		piece.setAttribute ( "src", imgArray[i].src );
		piece.setAttribute ( "data-final-x", imgArray[i].finalPosX );
		piece.setAttribute ( "data-final-y", imgArray[i].finalPosY );
		piece.setAttribute ( "data-rotation", rotation);
		piece.style.top = Math.random () * 500 + "px";
		piece.style.left = Math.random () * 300 + 700 + "px";
		piece.style.transform = "rotate(" + rotation + "deg)";
		document.body.appendChild ( piece );

		piece.addEventListener ( "mousedown", startDrag );
	}
}

var startDrag = function ( e ) {
	e.preventDefault();

	if ( !e.currentTarget.classList.contains ( "locked" )) {
		pieceBeingDragged = e.currentTarget; 			//you could use this here

		pieceBeginLeft = parseInt ( pieceBeingDragged.style.left );
		pieceBeginTop = parseInt ( pieceBeingDragged.style.top );

		mouseBeginLeft = e.clientX;
		mouseBeginTop = e.clientY;
	}
}

var movePiece = function ( e ) {
	// console.log ( e.clientX + ", " + e.clientY);

	if ( pieceBeingDragged ) {
		var distanceLeft = e.clientX - mouseBeginLeft;
		var distanceTop = e.clientY - mouseBeginTop;
		pieceBeingDragged.style.left = pieceBeginLeft + distanceLeft + "px";
		pieceBeingDragged.style.top = pieceBeginTop + distanceTop + "px";
	
	}

}

var stopDrag = function ( e ) {

	if ( pieceBeingDragged ) {
	checkForFit ( pieceBeingDragged );
	pieceBeingDragged = null;
	}
}

var rotatePiece = function ( e ) {

	if (pieceBeingDragged) {
		e.preventDefault(); 		//doesn't stop window from horizontal scrolling with arrow buttons, so we fall back on a & d as backup
		//a = keyCode 65
		//d = keyCode 68

		if (e.keyCode == 65) {
			//rotate left
			pieceBeingDragged.style.transform = "rotate(90deg)";
		} else if (e.keyCode == 68) {
			//rotate right
			pieceBeingDragged.style.transform = "rotate(180deg)";
		}
	}
}


var checkForFit = function ( lastDraggedPiece ) {
	console.dir ( lastDraggedPiece );
	var currentLeft = parseInt ( lastDraggedPiece.style.left );
	var currentTop = parseInt ( lastDraggedPiece.style.top );
	var finalLeft = parseInt ( lastDraggedPiece.dataset.finalX );
	var finalTop = parseInt ( lastDraggedPiece.dataset.finalY );

	if ( currentLeft <= finalLeft + 20 &&
		currentLeft >= finalLeft - 20 &&
		currentTop <= finalTop + 20 &&
		currentTop >= finalTop - 20 ) {
		// console.log("in place");
		lastDraggedPiece.style.left = finalLeft + "px";
		lastDraggedPiece.style.top = finalTop + "px";

		lastDraggedPiece.classList.add ( "locked" );

		var piecesLocked = document.querySelectorAll( ".locked" ).length;

		if ( piecesLocked === 6 ) {
			setTimeout ( function () {
				createModule ();
				
			}, 250 );
			clearInterval ( intervalStopWatch );
		}
	}
}

var pieceBeingDragged,
	pieceBeginLeft,
	pieceBeginTop,
	mouseBeginLeft,
	mouseBeginTop;
startGame();



////////////////TIMER//////////////


var seconds = 0;
var minutes = 0;
var hours = 0;

var stopWatch = document.createElement ( "h1" );
stopWatch.classList.add ( "timer" );
document.body.appendChild ( stopWatch );


var addTime = function () {
    seconds++;
    stopWatch.innerHTML = ( hoursValue () + hours + ":" + minutesValue () + minutes + ":" + secondsValue () + seconds );

    if ( seconds >= 60 ) {
        minutes++;
        seconds = 0;
    }
    if ( minutes >= 60 ) {
        hours++;
        minutes = 0;
        seconds = 0;
    }
}


var intervalStopWatch = setInterval ( addTime, 1000 );

function secondsValue () {
    if ( seconds < 10 ) {
        return "0";
    } else {
        return "";
    }
}

function minutesValue () {
    if ( minutes < 10 ) {
        return "0";
    } else {
        return "";
    }
}

function hoursValue () {
    if ( hours < 10 ) {
        return "0";
    } else {
        return "";
    }
}

////////////////MODULE//////////////


var createModule = function () {

	var overlay = document.createElement ( "div" );
	overlay.classList.add( "overlay" );
	document.body.appendChild ( overlay );

	var module = document.createElement ( "div" );
	module.classList.add( "module" );
	document.body.appendChild ( module );

	var winningMessage = document.createElement ( "h3" );
	winningMessage.classList.add( "winningMessage" );
	module.appendChild ( winningMessage );
	winningMessage.innerHTML = "Congratulations! It took you " + ( hoursValue () + hours + ":" + minutesValue () + minutes + ":" + secondsValue () + seconds ) + " to finish the game.";

	var resetButton = document.createElement ( "button" );
	resetButton.classList.add( "resetButton" );
	module.appendChild ( resetButton );
	resetButton.innerHTML = "Reset";

	resetButton.addEventListener ( "click", resetGame );
}

////////////////RESET GAME//////////////


var resetGame = function () {

	var overlay = document.querySelector( ".overlay" );
	var module = document.querySelector( ".module" );
	
	overlay.parentNode.removeChild( overlay );
	module.parentNode.removeChild( module );

	var imgArray = document.querySelectorAll( "imgDefaultData" );

	// for ( var i = cards.length - 1; i >= 0; i-- ) {
	// 	cards[i].parentNode.removeChild ( cards [i] );
	// }
	intervalstopWatch = setInterval(addTime, 1000);
	startGame ();

}













