//DECLARE VARIABLES
var count;
var map;
var bgSet;


var gameHandler = {
  count: 0,
  map: 0,
  bgSet: 0
};

Object.defineProperty(gameHandler, "init", {
  set : function () {
    this.count = 0;
    this.map = 0;
    this.bgSet = 0;
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

Object.defineProperty(gameHandler, "setBG", {
  get : function () {this.bgSet = 1;}
});

Object.defineProperty(gameHandler, "remBG", {
  get : function () {this.bgSet = 0;}
});

Object.defineProperty(gameHandler, "setMap", {
  set : function (value) {this.map = value;}
});


//ON LOAD
//gameHandler initialization
function init() {
  console.log('initializing gameHandler');
  gameHandler.init;
  console.log('gameHandler: (' +  gameHandler.map + ',' + gameHandler.count + ')');
  console.log('bg:' + gameHandler.bgSet);
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
    default:
      for (cl = 0; cl < 2; cl++) {
        cleanImg(document.getElementById('imgHandle'), document.getElementById('chatHandle'));
        console.log('clean' + cl);
      }
      break;
    case 0:
      homepage();
      //console.log('gameHandler: (' +  gameHandler.map + ',' + gameHandler.count + ')');
      break;
    case 1:
      chillChat(bgImg, text0);
      break;
    case 2:   //driven

      break;
    case 3:   //experience
      break;
    case 4:   //funny
      //haHa(bgImg, text0);
      break;
    case 5:   //the end
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
  if (gameHandler.bgSet == 0){
    bgImg.setAttribute('src', 'images/chillBeatsBG.gif');
    gameHandler.setBG;
  }

  console.log('gameHandler: (' +  gameHandler.map + ',' + gameHandler.count + ')');

  switch(gameHandler.count) {

    default:
      gameHandler.countUp;
      break;

    case 1:
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
      text0.appendChild(document.createTextNode("Hello. My name is Amanda Galemmo and I first want to thank you for taking the time to engage with my extremely silly cover letter."));

      document.getElementById('chatHandle').appendChild(text0);
      //@todo: ADD A CLICK TO GO FURTHER STATIC ELEMENT FOR END OF TEXT.
      //@TODO STRETCH: ADD TYPING ANIMATION
      gameHandler.countUp;
      break;

    case 2:
      //CLEANUP
      cleanChat(document.getElementById('chatHandle'), text0, gameHandler.count);

      text0.appendChild(document.createTextNode("A bit about me before I talk more about me: I am a writer (and usually a human--I'm only the lofi hip hop beats to relax/study to headphones when I need to prove that I know #gamerculture) who has worked across various mediums, including video games!"));
      document.getElementById('chatHandle').appendChild(text0);

      gameHandler.countUp;
      break;

    case 3:
      //CLEANUP
      //console.log('cake');
      cleanChat(document.getElementById('chatHandle'), text0, gameHandler.count);

      text0.appendChild(document.createTextNode("I have always loved playing games and a couple years ago finally realized that I love making them as well! It is with this passion that I come to you today, eager to hopefully work with you all at... uh..."));
      document.getElementById('chatHandle').appendChild(text0);

      var node3 = document.createElement("IMG");
      node3.setAttribute('id', 'hand');
      node3.setAttribute('src', 'images/sqHand.gif');
      document.getElementById('imgHandle').appendChild(node3);

      var node4 = document.createElement("IMG");
      node4.setAttribute('id', 'bHand');
      node4.setAttribute('src', 'images/backHand.gif');
      document.getElementById('imgHandle').appendChild(node4);

      //wait 18s
      setTimeout(gameHandler.countUp, 180000);
      break;

    case 4:
      //CLEANUP EVERYTHING
      //console.log('here');
      //cleanImg(document.getElementById('imgHandle'), document.getElementById('chatHandle'));
      cleanChat(document.getElementById('chatHandle'), text0, gameHandler.count);

      text0.appendChild(document.createTextNode("Now comes the part where I talk about things I can do! Please choose from the options below to find out more."));
      document.getElementById('chatHandle').appendChild(text0);

      let nav = document.createElement('h2');
      let e1 = document.createElement('a');
      let e2 = document.createElement('a');
      let e3 = document.createElement('a');

      e1.setAttribute('onClick', 'drvn()');
      e2.setAttribute('onClick', 'exp()');
      e3.setAttribute('onClick', 'haHa()');

      e1.appendChild(document.createTextNode('DRIVEN')); // i mean i made this in a few days
      e2.appendChild(document.createTextNode('EXPERIENCED'));
      e3.appendChild(document.createTextNode('FUNNY?'));

      nav.appendChild(e1);
      nav.appendChild(document.createTextNode(' | '));
      nav.appendChild(e2);
      nav.appendChild(document.createTextNode(' | '));
      nav.appendChild(e3);
      console.log(nav);

      document.body.appendChild(nav);

      gameHandler.setMap = 7;
      gameHandler.countR;
      gameHandler.remBG;
      console.log('gameHandler: (' +  gameHandler.map + ',' + gameHandler.count + ')');
      break;
  }
};

function drvn() {
  if (gameHandler.map == 7) {gameHandler.setMap = 2;};
};

function exp() {};

function haHa(bgImg, text0) {
  //BG
  /*if (gameHandler.bgSet == 0){
    bgImg = document.createElement('IMG');
    bgImg.setAttribute('id', 'flatImage')
    bgImg.setAttribute('src', 'images/goldBG.gif');
    document.getElementById('imgHandle').appendChild(bgImg);
    gameHandler.setBG;
  }*/

  //So you want to know if I'm funny. That's fair! I guess it's a hard thing to prove ive gotten at least a couple belly laughs

  console.log('gameHandler: (' +  gameHandler.map + ',' + gameHandler.count + ')');

  switch(gameHandler.count) {

    default:
      var node1 = document.createElement("IMG");
      node1.setAttribute('id', 'chatBG');
      node1.setAttribute('src', 'images/textBG.png');
      node1.style.width = '860px';
      document.getElementById('chatHandle').appendChild(node1);

      cleanChat(document.getElementById('chatHandle'), text0, count);

      text0.appendChild(document.createTextNode(""));
      document.getElementById('chatHandle').appendChild(text0);

      gameHandler.countUp;
      break;

    case 1:
      bgImg = document.createElement('IMG');
      bgImg.setAttribute('id', 'flatImage')
      bgImg.setAttribute('src', 'images/goldBG.gif');
      document.getElementById('imgHandle').appendChild(bgImg);
      gameHandler.setBG;
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

function cleanImg(t,c) {
  for (i = 0; i < t.childNodes.length; i++) {
    t.removeChild(t.childNodes[i]);
  }
  for (i = 0; i < c.childNodes.length; i++) {
    c.removeChild(c.childNodes[i]);
  }
};
