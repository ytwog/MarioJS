
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

// Would load main DOM-data for you 
let loadBackDesign = function() {
  let elementUpper = document.getElementById("upper");
  elementUpper.innerText = "Mario JS";
}

// Load basic game mechanics
let loadGameData = function(width, height) {

  

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
  let bricks = [];
  // Refresh frame every second
  let updateLogic = function() {
      //CLEARING
        for(let i = 0; i < height; i++)
          for(let j = 0; j < width; j++)
            moduleArr[j+i*width] = "DDF";
      for(let i = 0; i < objectsArr.length; i++) {
        //PHYSICAL PROCESSING
        let bottomY = objectsArr[i].posY + objectsArr[i].actor.height;
        //CHECKING COLLISION AT BOTTOM
        //TODO FIX COLLISION
        let fall = true;
        if(bottomY > height) fall = false;
        else 
          for(let iX = 0; iX < objectsArr[i].actor.width; iX++) {
            if(moduleArr[iX+bottomY*width] != "DDF") {
              fall = false;
              break;
            }
          }

        if(fall) {
          objectsArr[i].posY++;
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
  }

  setInterval(funcRefresh, 1000);
}

loadBackDesign();
loadGameData(90, 90);