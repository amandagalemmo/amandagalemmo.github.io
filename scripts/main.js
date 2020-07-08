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
  //console.log('click #' + gameHandler.count);

  var text0 = document.createElement("P");
  text0.setAttribute('id', 'chatText');
  text0.setAttribute('onclick', 'run()');
  //var bgImg = document.getElementById('flatImage');

  //MAP HANDLER
  switch (gameHandler.map) {
    //@BUG: needs double click. not v important
    default:
      for (cl = 0; cl < 2; cl++) {
        cleanImg(document.getElementById('imgHandle'), document.getElementById('chatHandle'));
        //console.log('clean' + cl);
      }
      break;
    case 0:
      homepage();
      //console.log('gameHandler: (' +  gameHandler.map + ',' + gameHandler.count + ')');
      break;
    case 1:
      chillChat(document.getElementById('flatImage'), text0);
      break;
    case 2:   //carousel
      cleanChat(document.getElementById('chatHandle'), text0, count);
      carousel(document.getElementById('flatImage'), text0);
      break;
    case 3:   //the end
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

  //console.log('gameHandler: (' +  gameHandler.map + ',' + gameHandler.count + ')');

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
      node2.setAttribute('onclick', 'run()');
      document.getElementById('chatHandle').appendChild(node2);

      bgImg.setAttribute('onclick', '');

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

      text0.appendChild(document.createTextNode("I have always loved playing games and a couple years ago finally realized that I love making them as well. It is with this passion that I come to you today, eager to hopefully work with you all at... uh..."));
      document.getElementById('chatHandle').appendChild(text0);

      var node3 = document.createElement("IMG");
      node3.setAttribute('id', 'hand');
      node3.setAttribute('src', 'images/sqHand.gif');
      document.getElementById('imgHandle').appendChild(node3);

      var node4 = document.createElement("IMG");
      node4.setAttribute('id', 'bHand');
      node4.setAttribute('src', 'images/backHand.gif');
      document.getElementById('imgHandle').appendChild(node4);

      setTimeout(document.getElementById('headPhone').setAttribute('src', 'images/headphoneEyes.gif'), 4500);

      gameHandler.countUp;

    case 4:
      gameHandler.mapUp;
      gameHandler.countR;
      gameHandler.remBG;
      console.log(gameHandler.map + ',' + gameHandler.count + ',' + gameHandler.bgSet);
      break;
  }
};

function carousel(bgImg, text0) {
  if (gameHandler.bgSet == 0){
    /*for (x = 0; x < 2; x++){cleanImg(document.getElementById('imgHandle'));};*/
    removeElement("flatImage");
    cleanChat(document.getElementById('chatHandle'), text0, count);
    bgImg = document.createElement('IMG');
    bgImg.setAttribute('id', 'flatImage')
    bgImg.setAttribute('src', 'images/emily.gif');
    document.getElementById('imgHandle').appendChild(bgImg);
    gameHandler.setBG;
  }

  console.log('gameHandler: (' +  gameHandler.map + ',' + gameHandler.count + ')');

  switch(gameHandler.count) {
    default:
      break;
    case 0:
      console.log('hi');
      console.log('gameHandler: (' +  gameHandler.map + ',' + gameHandler.count + ')');
      cleanChat(document.getElementById('chatHandle'), text0, gameHandler.count, gameHandler.map);
      console.log('woo');

      var node2 = document.createElement("IMG");
      node2.setAttribute('id', 'chatBG');
      node2.setAttribute('src', 'images/textBG.png');
      node2.setAttribute('onclick', 'run()');
      node2.style.width = '860px';
      document.getElementById('chatHandle').appendChild(node2);

      text0.style.width = '820px';

      text0.appendChild(document.createTextNode("Here's a few projects that I've worked on: "));
      text0.appendChild(document.createElement("br"));
      text0.appendChild(document.createElement("br"));
      text0.appendChild(document.createTextNode("\"Emily\" is a short and sweet narrative-driven game that I'm currently working on with two other people. I'm serving as a narrative designer and programmer on the project."));
      document.getElementById('chatHandle').appendChild(text0);
      console.log('cake')

      gameHandler.countUp;
      break;

    case 1:
      console.log('pie')
      text0.style.width = '820px';
      cleanChat(document.getElementById('chatHandle'), text0, gameHandler.count, gameHandler.map);
      text0.appendChild(document.createTextNode("As \"Emily\" the first project I've worked on where minigames fed into the narrative, I've learned a lot about using interactive elements to explore a character's psyche and motivations."));
      document.getElementById('chatHandle').appendChild(text0);
      gameHandler.countUp;
      break;

    case 2:
      cleanChat(document.getElementById('chatHandle'), text0, gameHandler.count, gameHandler.map);
      text0.style.width = '820px';

      bgImg.setAttribute('src', 'images/ellis.gif');

      text0.appendChild(document.createTextNode("\"Ellis Island, 1904\" was a historical-fiction, audio-focused VR experience that I wrote and designed during my time at the VR audio studio Noctvrnal."));
      text0.appendChild(document.createElement("br"));
      text0.appendChild(document.createElement("br"));
      text0.appendChild(document.createTextNode("It was challenging not being able to rely on visual cues for exposition and I came out of the project writing more effectively."));

      document.getElementById('chatHandle').appendChild(text0);
      gameHandler.countUp;
      break;

    case 3:
      cleanChat(document.getElementById('chatHandle'), text0, gameHandler.count, gameHandler.map);
      text0.style.width = '820px';

      bgImg.setAttribute('src', 'images/degree.gif');

      text0.appendChild(document.createTextNode("A film degree! At college, I majored in Screenwriting and minored in Computer Science and cobbled together my ideal videogame development education. I also got a piece of paper that lets people know that I can turn things in on time. Worth it!"));
      document.getElementById('chatHandle').appendChild(text0);
      gameHandler.countUp;
      break;

    case 4:
      cleanChat(document.getElementById('chatHandle'), text0, gameHandler.count, gameHandler.map);
      text0.style.width = '820px';
      text0.style.height = '640px';
      document.getElementById('chatBG').setAttribute('src', 'images/dunn.gif');
      document.getElementById('imgHandle').removeChild(document.getElementById('imgHandle').lastChild);
      document.getElementById('clickTo').removeChild(document.getElementById('clickTo').lastChild);
      document.getElementById('clickTo').appendChild(document.createTextNode('(the end!)'));

      bgImg.setAttribute('src', 'images/degree.gif');

      text0.appendChild(document.createTextNode("But in all seriousness, thank you again for your time and consideration, and I hope you had at least a little bit of fun clicking through this. I had a lot of fun making this, and I hope that you feel that the vibes I've put out through this little project are a good fit for Squanch Games."));
      text0.appendChild(document.createElement("br"));
      text0.appendChild(document.createElement("br"));
      text0.appendChild(document.createTextNode("I can be reached by cell at (661) 678-3781 or by email at amandagalemmo@gmail.com. Have a great rest of your day!"));
      text0.appendChild(document.createElement("br"));
      text0.appendChild(document.createElement("br"));
      text0.appendChild(document.createTextNode("Best,"));
      text0.appendChild(document.createElement("br"));
      text0.appendChild(document.createTextNode("Amanda Galemmo"));
      document.getElementById('chatHandle').appendChild(text0);
      break;

  }
};

function cleanChat(t,text0,c,m) { //param: document.getElementById('chatHandle'), count
  console.log(c);
  if (c > 0) {
    var x = t.lastChild;
    t.removeChild(x);
  } else if (c == 0 && m == 2) {
    for(i = 0; i < t.childNodes.length; i++) {
      console.log(t.childNodes[i]);
      t.removeChild(t.childNodes[i]);
    }
    removeElement('chatBG')
  }

  for(i = 0; i < text0.childNodes.length; i++) {
    console.log(text0.childNodes[i]);
    text0.removeChild(text0.childNodes[i]);

  }
};

function cleanImg(t) {
  for (i = 0; i < 2; i++){
    for (i = 0; i < t.childNodes.length; i++) {
      t.removeChild(t.childNodes[i]);
      console.log(t.childNodes[i] + 'removed');
    }
  }
};

function removeElement(id) {
    var elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
};
