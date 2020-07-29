// Would load main DOM-data for you 
let loadBackDesign = function() {
  let elementUpper = document.getElementById("upper");
  elementUpper.innerText = "Mario JS";
}

// Load basic game mechanics
let loadGameData = function(width, height) {
  let elementGame = document.querySelector(".gameBlock");
  elementGame.innerHtml = "";

  for(let i = 0; i < height; i++) {
    let elementRow = document.createElement("div");
    for(let j = 0; j < width; j++) {
      let elementNode = document.createElement("div");
      elementNode.innerHtml = `${i*width+j}`;
      elementRow.appendChild(elementNode);
    }
    elementGame.appendChild(elementRow);
  }
  let bricks = [];
  // Refresh frame every second
  let funcRefresh = function() {

  }

  //setInterval(funcRefresh, 1000);
}

loadBackDesign();
loadGameData(16, 9);