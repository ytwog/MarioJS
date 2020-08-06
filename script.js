
  // Game Data
  const LOGIC = {
  PLAYABLE: 0,
  WALKING: 1,
  STATIC: 2,
  MOVING: 3
}

const DIRECTIONS = {
  left: {x: -1, y: 0},
  right: {x: 1, y: 0},
  up: {x: 0, y: 1},
  down: {x: -1, y: -1},
}
const ACTORS = [
    {
      name: 'mario',
      width: 3,
      height: 5,
      climbable: false,
      sprite: [["F00", "F00", "---"],
               ["F00", "FFF", "000"],
               ["FAA", "FAA", "FAA"],
               ["55F", "55F", "55F"],
               ["55F", "---", "55F"]],
      logic: LOGIC.PLAYABLE
    }, {
      name: 'ladder',
      width: 3,
      height: 4,
      climbable: true,
      sprite: [["F99", "F99", "F99"],
               ["F99", "---", "F99"],
               ["F99", "F99", "F99"],
               ["F99", "---", "F99"]],
      logic: LOGIC.STATIC
    }, 
    {
      name: 'brickBlock',
      width: 3,
      height: 3,
      sprite: [["F55", "F55", "F55"],
               ["F55", "F55", "F55"],
               ["F55", "F55", "F55"]],
      climbable: false,
      logic: LOGIC.STATIC
    }];

const LEVEL1 = [{
  actor: ACTORS[2],
  posX: 6,
  posY: 46,
  facing: DIRECTIONS.right,
  fall: 0
}, {
  actor: ACTORS[2],
  posX: 10,
  posY: 38,
  facing: DIRECTIONS.right,
  fall: 0
}, {
  actor: ACTORS[2],
  posX: 16,
  posY: 35,
  facing: DIRECTIONS.right,
  fall: 0
}, {
  actor: ACTORS[2],
  posX: 24,
  posY: 20,
  facing: DIRECTIONS.right,
  fall: 0
}, {
  actor: ACTORS[1],
  posX: 21,
  posY: 20,
  facing: DIRECTIONS.right,
  fall: 0
}, {
  actor: ACTORS[1],
  posX: 21,
  posY: 24,
  facing: DIRECTIONS.right,
  fall: 0
}]

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

  let actionXPlayer = 0;
  let actionYPlayer = 0;
  let moduleArr = [];
  let objectsArr = LEVEL1.concat([{
    actor: ACTORS[0],
    posX: 6,
    posY: 6,
    facing: DIRECTIONS.right,
    fall: 0
  }]);

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
      let checkStuck = function(x, y, object) {
        return x < object.posX + object.actor.width &&
             y < object.posY + object.actor.height &&
             x > object.posX && y >= object.posY;
      }

      let checkCollisionHorizontal = function(x1, x2, y1, y2, direction, objectIndex) {
        for(let j = 0; j < objectsArr.length; j++) {
          if(j == objectIndex) continue;
          if(checkStuck(x1+direction, y1, objectsArr[j]) ||
            checkStuck(x1+direction, y2, objectsArr[j]) ||
            checkStuck(x2+direction, y1, objectsArr[j]) ||
            checkStuck(x2+direction, y2, objectsArr[j]))
            return true && !objectsArr[j].actor.climbable;
        }
        return false;
      }

      let checkCollision = function(x1, x2, y1, y2, desiredFall, objectIndex) {
        for(let z = 0-(desiredFall<0); (z < desiredFall && desiredFall >= 0) ||
        (z > desiredFall && desiredFall < 0); z += desiredFall > 0 ? 1 : -1) {
          for(let i = 0; i < objectsArr.length; i++) {
            if(i == objectIndex) continue;
            if(checkStuck(x1, y1+z, objectsArr[i]) ||
               checkStuck(x1, y2+z, objectsArr[i]) || 
               checkStuck(x2, y1+z, objectsArr[i]) ||
               checkStuck(x2, y2+z, objectsArr[i])) {
              if(desiredFall < 0) return 0;
              return z;
            }
            if(objectsArr[i].posX == x1 && 
              objectsArr[i].posX+objectsArr[i].actor.width == x2 &&
              y1+z+1 < objectsArr[i].posY + objectsArr[i].actor.height
              && y2+z>= objectsArr[i].posY) return z+4*(desiredFall<0 && !objectsArr[i].actor.climbable);
          }
        }
        return desiredFall;
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
        if(objectsArr[i].actor.logic != LOGIC.STATIC) {
          let bottomY = objectsArr[i].posY + objectsArr[i].actor.height;
          let rightX = objectsArr[i].posX + objectsArr[i].actor.width;
          //TODO FIX COLLISION
          let fallLeft = height - bottomY;
          if(objectsArr[i].actor.logic == LOGIC.PLAYABLE) {
            if((fallLeft == 0 || checkCollision(objectsArr[i].posX,
                              objectsArr[i].posX+objectsArr[i].actor.width,
                              objectsArr[i].posY,
                              objectsArr[i].posY+objectsArr[i].actor.height,
                              1, i) == 0) && actionYPlayer == -1 &&
                              objectsArr[i].fall >= 0) {
              objectsArr[i].fall = -4;
            }
            if(actionXPlayer == 1) {
              let movingAllowed = !checkCollisionHorizontal(objectsArr[i].posX,
                            objectsArr[i].posX+objectsArr[i].actor.width,
                            objectsArr[i].posY + 1,
                            objectsArr[i].posY+objectsArr[i].actor.height-1,
                            actionXPlayer, i) && objectsArr[i].posX > 0 
                            && objectsArr[i].posX+objectsArr[i].actor.width < width;
              if(movingAllowed) {
                objectsArr[i].posX++;
              }
            }
            if(actionXPlayer == -1) {
              let movingAllowed = !checkCollisionHorizontal(objectsArr[i].posX,
                            objectsArr[i].posX+objectsArr[i].actor.width,
                            objectsArr[i].posY + 1,
                            objectsArr[i].posY+objectsArr[i].actor.height-1,
                            actionXPlayer, i) && objectsArr[i].posX > 0 
                            && objectsArr[i].posX+objectsArr[i].actor.width < width;
              if(movingAllowed) {
                objectsArr[i].posX--;
              }
            }
          }
          if(fallLeft < 1) objectsArr[i].fall = Math.min(0, objectsArr[i].fall);
          else {
            
            //CHECKING COLLISION AT BOTTOM
            objectsArr[i].fall = Math.min(objectsArr[i].fall, fallLeft);
            allowedFall = checkCollision(objectsArr[i].posX,
                              objectsArr[i].posX+objectsArr[i].actor.width,
                              objectsArr[i].posY,
                              objectsArr[i].posY+objectsArr[i].actor.height,
                              objectsArr[i].fall, i);
            if(objectsArr[i].fall < 0 || allowedFall < objectsArr[i].fall) {
              objectsArr[i].fall = allowedFall;
            }
          }
          objectsArr[i].posY += objectsArr[i].fall;
          if(objectsArr[i].fall < 10) objectsArr[i].fall++;
        }
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