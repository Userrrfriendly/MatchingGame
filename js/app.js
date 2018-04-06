const deckContainer = document.querySelector('.deck-container');
let cardArray = ["fa-diamond", "fa-paper-plane-o","fa-anchor","fa-bolt",
"fa-cube","fa-leaf","fa-bicycle","fa-bomb","fa-diamond",
"fa-paper-plane-o","fa-anchor","fa-bolt","fa-cube","fa-leaf","fa-bicycle","fa-bomb"];
const container = document.querySelector('.container');
const restartIcon = document.querySelector('.fa-repeat');
let game = {
    state: 'game-over',
    openedCard:'',
    iconClass: "",
    moves: 0,
    matchedCards: 0,
    score: 3
};

function resetGame() {
    game.state= 'live';
    game.openedCard= '';
    game.iconClass= "";
    game.moves= 0;
    game.matchedCards= 0;
    game.score= 3;
}

function checkState(node, iconClass) {
    switch (game.state) {
        case 'live' :
            flipCard(node);
            node.classList.add('open');
            game.state = 'inspection';
            game.openedCard = node;
            game.iconClass = iconClass;
            game.moves +=1;
            document.querySelector('.moves').textContent = game.moves;
            break;
        case 'inspection':
            flipCard(node);
            if (game.iconClass === iconClass) {
                node.classList.add('matched', 'open');
                game.openedCard.classList.add('matched');
                game.state = 'live';
                game.openedCard = '';
                game.iconClass = '';
                // game.moves +=1; i'd rather not change it here
                game.matchedCards += 1;
            } else {
                console.log(game.openedCard.classList);
                game.openedCard.classList.remove('open');
                const tempGameValue = game.openedCard //it is here because of the setTimeout
                setTimeout(function() {
                    tempGameValue.classList.remove('flipped');
                    node.classList.remove('flipped');
                }, 1000)
                game.openedCard = '';
                game.state = 'live';
                game.iconClass = '';
                // game.moves +=1; i'd rather not change it here
            }
            break;
        case 'game-over':
            //
            break;
    }
} 

function flipCard(node) {
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


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
<div class="deck">
    <section class="card-container">
        <div class="card">
            <figure class="card-figure front">
                <i class="fa fa-diamond card-icon"></i>
            </figure>
            <figure class="card-figure back">2</figure>
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
    //YOU CAN TRY AND REFACTORE IT WITH node.cloneNode();

    /*
        -backFigure.appendChild(icon)
        -divCard.append(frontfigure)
        -divCard.append(backfigure)
        -section.append(divCard)

        -divDeck.append(divCard)
            
     */
    let section = document.createElement('section');
    section.classList.add('card-container');

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
    if (e.target.nodeName === 'FIGURE' && e.target.classList.contains('front')) {
        //e.target.parentElement.classList.toggle('flipped');  //flip me
        //PUT AN IF HERE TO CHECK IF IT HAS CLASS '.OPENED' BEFORE PASSING THE NODE TO CHECKSTATE(NODE)
        if (!e.target.parentElement.classList.contains('open')) {
            checkState(e.target.parentElement, getIconClass(e.target.nextElementSibling.firstElementChild.classList));
        }
        //AT THIS POINT I HAVE A FEELING THAT THE ELSE IF IS NOT NEEDED!!!!!!!!!!!!! SINCE WE WILL ALWAYS TARGET A CLOSED CARD
    } 
    // else if (e.target.nodeName === 'I' && e.target.parentElement.classList.contains('card-figure')) {
    //     // e.target.parentElement.classList.contains('card-figure'); 
    //     // e.target.parentElement.parentElement.classList.toggle('flipped'); //flip me
    //     if (e.target.parentElement.parentElement.classList.contains('open')) {
    //         checkState(e.target.parentElement.parentElement, e.target.classList);
    //     }
    // }
}

restartIcon.addEventListener('click', renderDeck);



//


/* 
CARD STATE:
    *GAME-STATE:LIVE
    *GAME-STATE:INSPECTION {OPEN:'.fa-anchor',var openCard = document... get it from the click event}
    *GAME-STATE:GAME-OVER
    
    CARD:
    -CLOSED
        ~OPEN THIS: ADD CLASS .OPENED THO THIS
            *game.state = 'opened-card'
            *game.card = e.target...
            *game.iconClass = e....
            *game.moves +=1
    
        ~IF THIS CARD MATCHES THE CARD IN THE GAME-STATE:
            ~TRUE: ADD CLASS .MATCHED TO THIS AND THE CARD IN THE GAME-STATE
                *state='live'
                *
            ~FALSE: CLOSE IT ----STATE BECOMES LIVE
        ~DO NOTHING


*/

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/* TODO: 
-add normalize.css
-ask mentors how to calculate height acording to width
-add a google font that will look like its an arcade game
--ned to add icon click condition on the event listener
--THIS IS MUST do something about the setTimeout when the user makes a mistake he can keep flipping cards
*/

// function cardClick(e) {
//     if (e.target.nodeName === 'FIGURE' && e.target.parentElement.classList.contains('card')) {
//         //e.target.parentElement.classList.toggle('flipped');  //flip me
//         //PUT AN IF HERE TO CHECK IF IT HAS CLASS '.OPENED' BEFORE PASSING THE NODE TO CHECKSTATE(NODE)
//         if (!e.target.parentElement.classList.contains('opened')) {
//             checkState(e.target.parentElement);
//         }
//         //AT THIS POINT I HAVE A FEELING THAT THE ELSE IF IS NOT NEEDED!!!!!!!!!!!!! SINCE WE WILL ALWAYS TARGET A CLOSED CARD
//     } else if (e.target.nodeName === 'I' && e.target.parentElement.classList.contains('card-figure')) {
//         // e.target.parentElement.classList.contains('card-figure'); 
//         // e.target.parentElement.parentElement.classList.toggle('flipped'); //flip me
//         if (e.target.parentElement.parentElement.classList.contains('opened')) {
//             checkState(e.target.parentElement.parentElement, e.target.classList);
//         }
//     }
// }