
  // Game Data
  const LOGIC = {
  PLAYABLE: 0,
  WALKING: 1,
  STATIC: 2
}

const DIRECTIONS = {
  left: {x: -1, y: 0},
  right: {x: 1, y: 0},
  up: {x: 0, y: 1},
  down: {x: -1, y: -1},
}

const ACTORS = [
    {
      name: "mario",
      width: 3,
      height: 5,
      sprite: [["F00", "F00", "---"],
               ["F00", "FFF", "000"],
               ["FAA", "FAA", "FAA"],
               ["55F", "55F", "55F"],
               ["55F", "---", "55F"]],
      logic: LOGIC.PLAYABLE
    }, {
      name: "turtle",
      width: 2,
      height: 2,
      logic: LOGIC.WALKING
    }];

const MODULE = {

}

let intervalId;

// Would load main DOM-data for you 
let loadBackDesign = function() {
  let elementUpper = document.getElementById("upper");
  elementUpper.innerText = "Mario JS";
  let elementStop = document.getElementById('stopBtn');
  elementStop.addEventListener('click', event => {
    clearTimeout(intervalId);
  })
}

// Load basic game mechanics
let loadGameData = function(width, height) {

  let fall = 0;
  let actionXPlayer = 0;
  let actionYPlayer = 0;
  let moduleArr = [];
  let objectsArr = [{
    actor: ACTORS[0],
    posX: 6,
    posY: 6,
    facing: DIRECTIONS.right
  }];

  // DOM-data
  let elementGame = document.querySelectorAll("div")[1];
  console.log(elementGame.innerHTML);
  elementGame.innerHTML = "";
  for(let i = 0; i < height; i++) {
    let elementRow = document.createElement("div");
    elementRow.className += " row";
    for(let j = 0; j < width; j++) {
      let elementNode = document.createElement("div");
      elementNode.className += " block";
      moduleArr.push("DDF");
      elementRow.appendChild(elementNode);
    }
    elementGame.appendChild(elementRow);
  }
  let pressedW = false, pressedA = false, pressedD = false;
  let bricks = [];
  // Refresh frame every second
  let updateLogic = function() {
      let checkCollision = function(x, y) {
        return moduleArr[x+y*width] != "DDF";
      }
      if(pressedD == 1)
        actionXPlayer = 1;
      if(pressedA == 1)
        actionXPlayer = -1;
      if(pressedW == 1)
        actionYPlayer = -1;

      //CLEARING
      for(let i = 0; i < height; i++)
        for(let j = 0; j < width; j++)
          moduleArr[j+i*width] = "DDF";
      for(let i = 0; i < objectsArr.length; i++) {
        //PHYSICAL PROCESSING
        let bottomY = objectsArr[i].posY + objectsArr[i].actor.height;
        let rightX = objectsArr[i].posX + objectsArr[i].actor.width;
        //TODO FIX COLLISION
        let fallLeft = height - bottomY;
        if(objectsArr[i].actor.logic == LOGIC.PLAYABLE) {
          if(fallLeft == 0 && actionYPlayer == -1) {
            fall = -4;
          }
          if(actionXPlayer == 1) {
            let movingAllowed = true;
            for(let iY = 0; iY < objectsArr[i].actor.height; iY++) {
              if(checkCollision(iY, rightX)) {
                movingAllowed = false;
                break;
              }
            }
            if(movingAllowed) {
              objectsArr[i].posX++;
            }
          }
          if(actionXPlayer == -1) {
            let movingAllowed = true;
            for(let iY = 0; iY < objectsArr[i].actor.height; iY++) {
              if(checkCollision(rightX, iY)) {
                movingAllowed = false;
                break;
              }
            }
            if(movingAllowed) {
              objectsArr[i].posX--;
            }
          }
        }
        //CHECKING COLLISION AT BOTTOM
        if(fall == 0) fall = 1;
        if(fallLeft < 1) fall = Math.min(0, fall);
        else {
          fall = Math.min(fall, fallLeft);
          for(let iFall = 0; iFall < fallLeft; iFall++) {
            for(let iX = 0; iX < objectsArr[i].actor.width; iX++) {
              if(checkCollision(iX, bottomY+iFall)) {
                fall = iFall;
                break;
              }
            }
          }
        }
        objectsArr[i].posY += fall;
        if(fall < 10) fall++;

        //PIXELATION
        for(let iY = 0; iY < objectsArr[i].actor.height; iY++) {
          for(let iX = 0; iX < objectsArr[i].actor.width; iX++) {
            let pixel = objectsArr[i].actor.sprite[iY][iX];
            if(pixel != "---") {
              moduleArr[(objectsArr[i].posX+iX)+(objectsArr[i].posY+iY)*width] = pixel;
            }
          }
        }
      }
  }

  let funcRefresh = function() {
      updateLogic();
      let elementModules = document.querySelectorAll(".block");
      for(let i = 0; i < height; i++) {
        for(let j = 0; j < width; j++) {
          elementModules[j+i*width].style.backgroundColor = `#${moduleArr[j+i*width]}`;
        }
      }
    // Reset all actions  
    actionXPlayer = 0;
    actionYPlayer = 0;
  }

  let funcReleased = function(event) {
    //console.log(event.code);
    if(event.code == 'KeyD')
      pressedD = false;
    if(event.code == 'KeyA')
      pressedA = false;
    if(event.code == 'KeyW')
      pressedW = false;
    }


  let funcPressed = function(event) {
    if(event.code == 'KeyD')
      pressedD = true;
    if(event.code == 'KeyA')
      pressedA = true;
    if(event.code == 'KeyW')
      pressedW = true;
  }

  document.addEventListener('keydown', funcPressed);
  document.addEventListener('keyup', funcReleased);
  
  intervalId = setInterval(funcRefresh, 100);
}

loadBackDesign();
loadGameData(80, 50);