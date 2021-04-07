//!          -------------------------------- *** Memory Card Game  *** ---------------------------------------

let popUp = document.querySelector('#pop-up');
let startGame = document.querySelector('#pop-up button');
let getStarted = document.querySelector(".control-buttons span");
let overlay = document.querySelector(".control-buttons");

getStarted.onclick = function () {
  popUp.style.display = 'block';

  startGame.addEventListener('click', () => {
    let yourName = document.querySelector('#pop-up input').value;
    window.localStorage.setItem(yourName,'player');

    if (yourName === null || isFinite(yourName) || yourName.match(/[^A-z]/)) {
      document.getElementById('name').innerHTML = "Unknown";
    } else {
      document.getElementById('name').innerHTML = yourName;
    }
    popUp.style.display = 'none';
    overlay.remove();
  })
}

const DURATION = 1e3;
let blocksContainer = document.querySelector('.game-blocks');
let blocks = Array.from(blocksContainer.children);
let orderRange = [...Array(blocks.length).keys()];
let blocksNumber = blocks.length;

// SOUNDS FOR THE GAME

let failedSound = document.getElementById('failed');
let sucsessSound = document.getElementById('sucsess');
let loseSound = document.getElementById('lose');
let winSound = document.getElementById('win');

shuffle(orderRange);

let triesElement = document.querySelector('.tries span');

blocks.forEach((block, index) => {
  block.style.order = orderRange[index];
  block.addEventListener("click", () => flipBlock(block))
});

function flipBlock(choosenBlock) {
  choosenBlock.classList.add('flipped');
  let allFlippedBlocks = blocks.filter(flippedBlock => flippedBlock.classList.contains('flipped'))
  if (allFlippedBlocks.length == 2) {
    preventClick();
    checkBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);

    function endGame() {
      let allMatchedBlocks = blocks.filter(matchedBlock => matchedBlock.classList.contains('matched'))
      
      if (allMatchedBlocks.length == blocksNumber) {
        let wrongTries = parseInt(triesElement.innerHTML);
        if (wrongTries >= 11) {
          loseSound.play();
          let gameOver = document.querySelector('section.game-over');
          let gameOverBox = document.querySelector('section.game-over .box');
          let yourName = document.querySelector('#pop-up input').value;
          yourName = yourName === `${yourName}` ? `${yourName}` : null;
          gameOver.style.display = 'block';

          gameOverBox.innerHTML = 
          `
          <h2>game over</h2>
          <p>
            <span>unfortunately</span>, <b style="text-transform:capitalize">${yourName}</b> you made <b>${wrongTries}</b> wrong try but doesn't mean you are unlocky today, because you can try one more time and show your friends your real worth.
          </p>
        `;

          let btn = document.createElement('button');
          let contentNode = document.createTextNode('try again');
          btn.appendChild(contentNode);
          gameOverBox.appendChild(btn);
          btn.addEventListener('click', function () {
            window.location.reload();
          })
        }
        else {
          winSound.play();
          let youWin = document.querySelector('section.you-win');
          let youWinBox = document.querySelector('section.you-win .box');
          let yourName = document.querySelector('#pop-up input').value;
          yourName = yourName === `${yourName}` ? `${yourName}` : null;
          youWin.style.display = 'block';

          youWinBox.innerHTML = 
          `
          <h2>you win</h2>
          <p>
            <span>congratulations</span>, <b style="text-transform:capitalize">${yourName}</b> you made just <b>${wrongTries}</b> wrong try and you can do better if you want to, you will beat all your friends  record. then, you are the best player in this game.
          </p>
        `;

          let btn = document.createElement('button');
          let contentNode = document.createTextNode('try again');
          btn.appendChild(contentNode);
          youWinBox.appendChild(btn);
          btn.addEventListener('click', function () {
            window.location.reload();
          })
        }
      }

    } endGame();
};
}

function preventClick() {
  blocksContainer.classList.add("no-click")
  
  setTimeout(() => {    
    blocksContainer.classList.remove("no-click")
  }, DURATION);
}


function checkBlocks(firstBlock, secondBlock) {

  if (firstBlock.dataset.info === secondBlock.dataset.info) {
    firstBlock.classList.remove('flipped');
    secondBlock.classList.remove('flipped');
    
    firstBlock.classList.add('matched');
    secondBlock.classList.add('matched');

    sucsessSound.play()
  } else {
    triesElement.innerHTML = parseInt(triesElement.innerHTML) + 1;
    setTimeout(() => {
      firstBlock.classList.remove('flipped');
      secondBlock.classList.remove('flipped');
    }, DURATION)
    if (firstBlock.classList.contains('matched') && secondBlock.classList.contains('matched')) {
      return null;
    } else {
      failedSound.play();
    }
  }
}

let users = document.getElementById('users');

!function () {
  if (localStorage.length) {
    for (let [key, value] of Object.entries(localStorage)) {
      users.innerHTML += `<span style="display:none">${key} *** ${value}</span>`;
    }
  } else {
    return null
  }
}();

function shuffle(array) {
  let current = array.length;
  let stash,
      random;

  while (current > 0) {
    random = Math.floor(Math.random() * current);

    current--

    stash = array[current];

    array[current] = array[random];
  
    array[random] = stash;
  }
  return array;
}
