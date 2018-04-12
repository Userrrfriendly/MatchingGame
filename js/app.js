let cardArray = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt",
    "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb", "fa-diamond",
    "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"
];
const deckContainer = document.querySelector('.deck-container');
const restartIcon = document.querySelector('.fa-repeat');
const timerDisplay = document.querySelector('.timer');
const movesDisplay = document.querySelector('.moves');
const scorePanel = document.querySelector('.score-panel');
const gameOverScreen = document.querySelector('.victory-screen');
const stars = document.querySelectorAll('.fa-star');
let game = {
    state: '',
    openedCard: '',
    iconClass: "",
    moves: 0,
    matchedCards: 0,
    score: 3,
    totalTime: 0
};
let timeoutID;
let countSeconds = 1;
let clickBlock = false;

//this "checks" which Animation End handle the browser accept
// and assigns it in the constant animationEnd - See https://github.com/daneden/animate.css/issues/644
const animationEnd = (function (el) {
    const animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd'
    };

    for (let t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
})(document.createElement('div'));

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/* makeCard() returns the following:
<section class="card-container animated">
	<div class="card">
		<figure class="card-figure front"></figure>
		<figure class="card-figure back">
			<i class="fa fa-leaf card-icon"></i>
		</figure>
	</div>
</section>
*/
function makeCard(cardArr, cardArrayIndex) {
    let section = document.createElement('section');
    let divCard = document.createElement('div');
    let figureFront = document.createElement('figure');
    let icon = document.createElement('i');
    let figureBack = document.createElement('figure');

    section.classList.add('card-container', 'animated');
    divCard.classList.add('card');
    figureFront.classList.add('card-figure', 'front');
    icon.classList.add('fa', cardArr[cardArrayIndex], 'card-icon');
    figureBack.classList.add('card-figure', 'back');

    figureBack.appendChild(icon);
    divCard.appendChild(figureFront);
    divCard.appendChild(figureBack);
    section.appendChild(divCard);

    return section;
}

function makeDeck(array) {
    let deck = document.createElement('div');
    deck.classList.add('deck');
    let divFragment = document.createDocumentFragment();
    for (let i = 0; i < array.length; i++) {
        divFragment.appendChild(makeCard(cardArray, i));
    }
    deck.appendChild(divFragment);
    return deck;
}

function renderDeck(array) {
    const deck = document.querySelector('.deck');
    if (deck) {
        deck.remove();
        shuffle(array);
        deckContainer.appendChild(makeDeck(array));
    } else {
        shuffle(array);
        deckContainer.appendChild(makeDeck(array));
    }
    resetGame();
}

function resetGame() {
    game.state = 'ready';
    game.openedCard = '';
    game.iconClass = '';
    game.moves = 0;
    game.matchedCards = 0;
    game.score = 3;
    game.totalTime = 0;
    movesDisplay.textContent = game.moves;
    timerDisplay.textContent = game.totalTime
    for (let i = 1; i < 3; i++) {
        stars[i].classList.remove('faded-star');
    }
    countSeconds = 0;
    updateTime();
    clock(false);
    clickBlock = false;
}

renderDeck(cardArray);

function updateState(el, iconClass) {
    //ready= no moves yet but the game can start by flipping a card (moves === 0)
    //live= at least one card has been flipped (moves >= 1)
    //open-card=there is a flipped card on the board
    switch (game.state) {
        case 'ready':
            flipElement(el);
            el.classList.add('open');
            game.state = 'open-card';
            game.openedCard = el;
            game.iconClass = iconClass;
            game.moves += 1;
            updateScore();
            movesDisplay.textContent = game.moves; //cas it
            updateTime();
            clock(true);
            break;
        case 'live':
            flipElement(el);
            el.classList.add('open');
            game.state = 'open-card';
            game.openedCard = el;
            game.iconClass = iconClass;
            game.moves += 1;
            updateScore();
            movesDisplay.textContent = game.moves;
            break;
        case 'open-card':
            flipElement(el);
            if (game.iconClass === iconClass) {
                el.classList.add('matched', 'open');
                game.openedCard.classList.add('matched');
                el.parentElement.classList.add('tada');
                game.openedCard.parentElement.classList.add('tada');
                game.state = 'live';
                game.openedCard = '';
                game.iconClass = '';
                game.matchedCards === 7 ? gameOver() : game.matchedCards += 1;
            } else {
                game.openedCard.classList.remove('open');
                const tempGameValue = game.openedCard;
                setTimeout(function () {
                    tempGameValue.classList.remove('flipped');
                    el.classList.remove('flipped');
                }, 600);
                game.openedCard = '';
                game.state = 'live';
                game.iconClass = '';
            }
            break;
    }
}

function flipElement(el) {
    el.classList.toggle('flipped');
}

function getIconClass(classList) {
    let icon = "";
    for (let i = 0; i < classList.length; i++) {
        if (classList.item(i).startsWith('fa-')) {
            icon = classList.item(i);
        }
    }
    return icon;
}

function gameOver() {
    game.totalTime = countSeconds;
    clock(false);
    victoryScreen();
}

function updateScore() {
    if (game.moves > 15 && game.moves < 26) {
        game.score = 2
        stars[2].classList.add('faded-star');
    } else if (game.moves > 25) {
        game.score = 1;
        stars[1].classList.add('faded-star');
    }
}

function clock(bool) {
    //if true start timer ... if false stop timer
    bool ? startTimer() : stopTimer();

    function startTimer() {
        timeoutID = window.setInterval(updateTime, 1000);
    }

    function stopTimer() {
        clearInterval(timeoutID);
        countSeconds = 1;
    }
}

function updateTime() {
    if (countSeconds >= 60) {
        const mins = Math.trunc(countSeconds / 60);
        const secs = countSeconds - mins * 60;
        secs < 10 ? timerDisplay.textContent = mins + ':0' + secs : timerDisplay.textContent = mins + ':' + secs;
        countSeconds += 1;
    } else {
        countSeconds < 10 ? timerDisplay.textContent = '00:0' + countSeconds : timerDisplay.textContent = '00:' + countSeconds;
        countSeconds += 1;
    }
}

function victoryScreen() {
    const scoreClone = scorePanel.firstElementChild.cloneNode(true);
    scoreClone.classList.add('score-stars');
    const gameStats = `It took you ${game.moves} moves and ${game.totalTime} seconds
     to finish the game with a score of ${game.score} stars`;
    document.querySelector('.game-stats').textContent = gameStats;
    document.querySelector('.game-stats').insertAdjacentElement('afterend', scoreClone);
    gameOverScreen.classList.add('fadeInDown');
}

function fadeOutUp() {
    gameOverScreen.classList.add('fadeOutUp');
};

function rotateElementZ(e) {
    //rotates target element around its z axis by adding the class .rotate
    //target element requires to be wrapped in a 'container' element
    if (!e.target.classList.contains('rotate')) {
        e.target.classList.add('rotate');
        e.target.parentElement.classList.remove('rotate');
    } else {
        e.target.classList.remove('rotate');
        e.target.parentElement.classList.add('rotate');
    }
}

/*EVENT LISTENERES */
deckContainer.addEventListener('click', cardClick);

function cardClick(e) {
    if (e.target.nodeName === 'FIGURE' && e.target.classList.contains('front') && clickBlock === false) {
        if (!e.target.parentElement.classList.contains('open')) {
            if (game.state === 'open-card') {
                //if a card is opened disable click untill the animations ends and all cards are facedown
                clickBlock = true;
                let stopClickID = window.setTimeout(stopClick, 600);

                function stopClick() {
                    window.clearTimeout(stopClickID);
                    clickBlock = false;
                }
            }
            updateState(e.target.parentElement, getIconClass(e.target.nextElementSibling.firstElementChild.classList));
        }
    }
}

restartIcon.addEventListener('click', function (e) {
    rotateElementZ(e);
    renderDeck(cardArray);
});

gameOverScreen.addEventListener(animationEnd, resetAnimation);

function resetAnimation(e) {
    //"resets" the element so it can be animated again with a different animation effect
    gameOverScreen.classList.toggle('displaced');
    gameOverScreen.classList.remove('fadeInDown', 'fadeOutUp');
};

document.querySelector('.new-game').addEventListener('click', function () {
    fadeOutUp();
    document.querySelector('.score-stars').remove();
    renderDeck(cardArray);
});

/* TODO:
-(Implement a leaderboard, store game state using local storage, etc.)
Implement (keyboard shortcuts for gameplay, etc).
*/