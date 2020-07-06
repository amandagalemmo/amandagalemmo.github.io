//DECLARE VARIABLES
var count;
var map;


var gameHandler = {
  count: 0,
  map: 0,
};

Object.defineProperty(gameHandler, "init", {
  set : function () {
    this.count = 0;
    this.map = 0;
  }
});

Object.defineProperty(gameHandler, "countR", {
  get : function () {this.count = 0;}
});

Object.defineProperty(gameHandler, "countUp", {
  get : function () {this.count++;}
});

Object.defineProperty(gameHandler, "mapUp", {
  get : function () {this.map++;}
});


//ON LOAD
//gameHandler initialization
function init() {
  console.log('initializing gameHandler');
  gameHandler.init;
  console.log('gameHandler: (' +  gameHandler.map + ',' + gameHandler.count + ')');
  return 0;
};

//ON CLICK
function run() {
  console.log('click #' + gameHandler.count);

  var text0 = document.createElement("P");
  text0.setAttribute('id', 'chatText');
  text0.setAttribute('z-index', 1);
  var bgImg = document.getElementById('flatImage');

  //MAP HANDLER
  switch (gameHandler.map) {
    //@BUG: needs double click. not v important
    case 0:
      console.log('gameHandler: (' +  gameHandler.map + ',' + gameHandler.count + ')');
      homepage();
      console.log('gameHandler: (' +  gameHandler.map + ',' + gameHandler.count + ')');
      break;
    case 1:
      chillChat(bgImg, text0);
      break;
  }
};

function homepage() {
  gameHandler.mapUp;
  gameHandler.countR;
  return 0;
};

function chillChat(bgImg, text0) {
  //BG
  bgImg.setAttribute('src', 'images/chillBeatsBG.gif');

  console.log('gameHandler: (' +  gameHandler.map + ',' + gameHandler.count + ')');

  switch(gameHandler.count) {
    default:
      console.log('gameHandler: (' +  gameHandler.map + ',' + gameHandler.count + ')');
      gameHandler.countUp;
      break;

    case 1:
      console.log('gameHandler: (' +  gameHandler.map + ',' + gameHandler.count + ')');

      var node1 = document.createElement("IMG");
      node1.setAttribute('id', 'headPhone');
      node1.setAttribute('src', 'images/hpTemp.png');
      document.getElementById('imgHandle').appendChild(node1);

      var node2 = document.createElement("IMG");
      node2.setAttribute('id', 'chatBG');
      node2.setAttribute('src', 'images/textBG.png');
      document.getElementById('chatHandle').appendChild(node2);

      cleanChat(document.getElementById('chatHandle'), text0, count);

      text0.appendChild(document.createTextNode("To whom it may concern,"));
      text0.appendChild(document.createElement("br"));
      text0.appendChild(document.createElement("br"));
      text0.appendChild(document.createTextNode("My name is Amanda Galemmo, and I want to thank you for taking the time to engage with my extremely silly cover letter."));

      animText(text0);

      document.getElementById('chatHandle').appendChild(text0);
      //@todo: ADD A CLICK TO GO FURTHER STATIC ELEMENT FOR END OF TEXT.
      //@TODO STRETCH: ADD TYPING ANIMATION
      gameHandler.countUp;
      break;

    case 2:
      /*
      Since I'm applying to a studio that makes
      such delightfully silly games, I only hope
      to emulate Squanch's ~vibe~ in this application.

      As a comedy writer and an avid gamer *ahem* egirl bangs, gamer fuel, headphones, chair *ahem* I am very eager to apply to be a writer at... [hand comes up] Squanch.... Games. ~hm, weird name~
      */

      //CLEANUP
      cleanChat(document.getElementById('chatHandle'), text0, gameHandler.count);
      text0.appendChild(document.createTextNode("I am a writer who has worked across a variety of mediums and I've always especially loved writing for videogames."));
      document.getElementById('chatHandle').appendChild(text0);

      var node3 = document.createElement("IMG");
      node3.setAttribute('id', 'hand');
      node3.setAttribute('src', 'images/sqHand.gif');
      document.getElementById('imgHandle').appendChild(node3);

      gameHandler.countUp;

      break;


  }
};

function cleanChat(t,text0,c) { //param: document.getElementById('chatHandle'), count
  if (c > 0) {
    var x = t.lastChild;
    t.removeChild(x);
  }
  for(i = 0; i < text0.childNodes.length; i++) {
    text0.removeChild(text0.childNodes[i]);
  }
};

function animText(t) {
  let x = t.length;
}

function lineB(output, i) {
  output.appendChild(document.createElement("br"));
};
