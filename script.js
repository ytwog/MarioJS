// Would load main DOM-data for you 
let loadBackDesign = function() {
  let elementUpper = document.getElementById("upper");
  elementUpper.innerText = "Mario JS";
}

// Load basic game mechanics
let loadGameData = function(width, height) {
  let actors = [
    {
      name: "mario",
      width: "3",
      height: "5",
      
    },];
  let elementGame = document.querySelectorAll("div")[1];
  console.log(elementGame.innerHTML);
  elementGame.innerHTML = "";

  for(let i = 0; i < height; i++) {
    let elementRow = document.createElement("div");
    elementRow.className += " row";
    for(let j = 0; j < width; j++) {
      let elementNode = document.createElement("div");
      //elementNode.innerHTML = `${i*width+j}`;
      elementNode.className += " air";
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
loadGameData(25, 18);