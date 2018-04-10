let cardArray = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt",
    "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb", "fa-diamond",
    "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"
];
const deckContainer = document.querySelector('.deck-container');
const container = document.querySelector('.container'); //i think its redundant so far
const restartIcon = document.querySelector('.fa-repeat');
const timerDisplay = document.querySelector('.timer');
const scorePanel = document.querySelector('.score-panel');
const gameOverScreen = document.querySelector('.victory-screen');
const victoryScore = document.querySelector('.wrapper');
//any reason why you didnt use querSelectorAll to catch em all? REFACTOR?
const stars = [document.querySelector('.stars').firstElementChild.firstElementChild,
    document.querySelector('.stars').firstElementChild.nextElementSibling.firstElementChild,
    document.querySelector('.stars').lastElementChild.firstElementChild
];
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
let count = 1;
let clickBlock = false;

function resetGame() {
    game.state = 'ready';
    game.openedCard = '';
    game.iconClass = '';
    game.moves = 0;
    game.matchedCards = 0;
    game.score = 3;
    game.totalTime = 0;
    document.querySelector('.moves').textContent = game.moves;
    document.querySelector('.timer').textContent = game.totalTime
    for (let i = 1; i < 3; i++) {
        stars[i].classList.remove('faded-star');
    }
    count = 0;
    updateTime();
    clock(false);
    clickBlock = false;
}

function updateState(node, iconClass) {
    switch (game.state) {
        //ready= no moves yet but the game can start by flipping a card (moves === 0)
        //live= at least one card has been flipped (moves >= 1)
        //open-card=there is a flipped card on the board
        case 'ready':
            flipElement(node);
            node.classList.add('open');
            game.state = 'open-card';
            game.openedCard = node;
            game.iconClass = iconClass;
            game.moves += 1;
            score();
            document.querySelector('.moves').textContent = game.moves;
            updateTime();
            clock(true);
            break;
        case 'live':
            flipElement(node);
            node.classList.add('open');
            game.state = 'open-card';
            game.openedCard = node;
            game.iconClass = iconClass;
            game.moves += 1;
            score();
            document.querySelector('.moves').textContent = game.moves;
            break;
        case 'open-card':
            flipElement(node);
            if (game.iconClass === iconClass) {
                node.classList.add('matched', 'open');
                game.openedCard.classList.add('matched');

                node.parentElement.classList.add('tada');
                game.openedCard.parentElement.classList.add('tada');

                // let openedCard = game.openedCard;
                // setTimeout(function() {
                //     node.parentElement.classList.add('tada');
                //     openedCard.parentElement.classList.add('tada');
                // }, 00)

                game.state = 'live';
                game.openedCard = '';
                game.iconClass = '';
                game.matchedCards === 7 ? gameOver() : game.matchedCards += 1;
            } else {
                game.openedCard.classList.remove('open');
                const tempGameValue = game.openedCard //it is here because of the setTimeout
                setTimeout(function () {
                    tempGameValue.classList.remove('flipped');
                    node.classList.remove('flipped');
                }, 600)
                game.openedCard = '';
                game.state = 'live';
                game.iconClass = '';
            }
            break;
    }
}

function flipElement(node) {
    node.classList.toggle('flipped');
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
    console.log('GAME OVER');
    game.totalTime = count;
    clock(false);
    victoryScreen();
}

function score() {
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
        count = 1;
    }
}

function updateTime() {
    if (count >= 60) {
        const mins = Math.trunc(count / 60);
        const secs = count - mins * 60;
        secs < 10 ? timerDisplay.textContent = mins + ':0' + secs : timerDisplay.textContent = mins + ':' + secs;
        count += 1;
    } else {
        count < 10 ? timerDisplay.textContent = '00:0' + count : timerDisplay.textContent = '00:' + count;
        count += 1;
    }
}

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

/* Make deck creates the following block of elements:
<div class="deck">
    <section class="card-container animated">
        <div class="card">
            <figure class="card-figure front"></figure>
            <figure class="card-figure back">
                <i class="fa fa-leaf card-icon"></i>
            </figure>
        </div>
    </section>
    ...
    ...
</div>
*/

/* card creates:
<section class="card-container animated">
	<div class="card">
		<figure class="card-figure front"></figure>
		<figure class="card-figure back">
			<i class="fa fa-leaf card-icon"></i>
		</figure>
	</div>
</section>
*/
function makeDeck() {
    let deck = document.createElement('div');
    deck.classList.add('deck');
    let divFragment = document.createDocumentFragment();
    for (let i = 0; i < cardArray.length; i++) {
        divFragment.appendChild(makeCard(i));
    }
    deck.appendChild(divFragment);
    return deck;
}

function makeCard(cardArrayIndex) {
    //YOU CAN TRY AND REFACTORE IT WITH Node.cloneNode();
    /*
        -backFigure.appendChild(icon)
        -divCard.append(frontfigure)
        -divCard.append(backfigure)
        -section.append(divCard)

        -divDeck.append(divCard)
            
     */
    let section = document.createElement('section');
    section.classList.add('card-container', 'animated');

    let divCard = document.createElement('div');
    divCard.classList.add('card');

    let figureFront = document.createElement('figure');
    figureFront.classList.add('card-figure', 'front');
    let icon = document.createElement('i');
    icon.classList.add('fa', cardArray[cardArrayIndex], 'card-icon');
    let figureBack = document.createElement('figure');
    figureBack.classList.add('card-figure', 'back');

    figureBack.appendChild(icon);
    divCard.appendChild(figureFront);
    divCard.appendChild(figureBack);
    section.appendChild(divCard);

    return section;
}

function renderDeck() {
    const deck = document.querySelector('.deck');
    if (deck) {
        deck.remove();
        shuffle(cardArray);
        deckContainer.appendChild(makeDeck());
    } else {
        shuffle(cardArray);
        deckContainer.appendChild(makeDeck());
    }
    resetGame();
}

renderDeck();

// EVENT LISTENERES
deckContainer.addEventListener('click', cardClick);

function cardClick(e) {
    if (e.target.nodeName === 'FIGURE' && e.target.classList.contains('front') && clickBlock === false) {
        if (!e.target.parentElement.classList.contains('open')) {
            //if a card is opened disable click untill the animations ends and all cards are facedown
            if (game.state === 'open-card') {
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

// const restartIcon2 = document.querySelector('.restart');
restartIcon.addEventListener('click', function (e) {
    rotateElement(e);
    renderDeck();
});

function rotateElement(e) {
    if (!e.target.classList.contains('rotate')) {
        e.target.classList.add('rotate');
        e.target.parentElement.classList.remove('rotate');
    } else {
        e.target.classList.remove('rotate');
        e.target.parentElement.classList.add('rotate');
    }
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move countSecondser and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/* TODO: 
    *Arrange order of code to ensure redability
    *Fix the Screen on Laptop
REFACTIRING:
*some of your functions are generic (flipCard) and some are specific (resetAnimation)
*check for e.target vs e.currentTarget(targets the event that has the event listener)
--Positioned icons inside card (vertical alignment) with vw- check the original udacity file (just for shits and giggles)
MINOR COSMETICS:
--think about adding negative padding on the .deck for medium screens
*/

//This function "checks" which Animation End handle the browser accept
// and assigns it in the constant animationEnd - See https://github.com/daneden/animate.css/issues/644 
const animationEnd = (function (el) {
    const animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd',
    };

    for (let t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
})(document.createElement('div'));

gameOverScreen.addEventListener(animationEnd, resetAnimation);

function resetAnimation(e) {
    //"resets" the element so it can be animated again with a different animation effect
    gameOverScreen.classList.toggle('displaced');
    gameOverScreen.classList.remove('fadeInDown', 'fadeOutUp');
};

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

document.querySelector('.new-game').addEventListener('click', function () {
    fadeOutUp();
    document.querySelector('.score-stars').remove();
    renderDeck();
});