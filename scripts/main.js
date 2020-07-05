var count = 0;
var text0 = '';

//const anime = require('animejs');

function chat() {
  switch (count) {
    case 0:
      var node0 = document.createElement("IMG");
      node0.setAttribute('id', 'headPhone');
      node0.setAttribute('src', 'images/hpTemp.png');
      document.getElementById('imgHandle').appendChild(node0);

      var node1 = document.createElement("IMG");
      node1.setAttribute('id', 'chatBG');
      node1.setAttribute('src', 'images/textBG.png');
      document.getElementById('chatHandle').appendChild(node1);

      cleanChat(document.getElementById('chatHandle'), count);

      text0.appendChild(document.createTextNode("To whom it may concern,"));
      text0.appendChild(document.createElement("br"));
      text0.appendChild(document.createElement("br"));
      text0.appendChild(document.createTextNode("My name is Amanda Galemmo, and I want to thank you for taking the time to engage with my extremely silly cover letter."));

      document.getElementById('chatHandle').appendChild(text0);
      //@todo: ADD A CLICK TO GO FURTHER STATIC ELEMENT FOR END OF TEXT.
      //@TODO STRETCH: ADD TYPING ANIMATION
      count++;
      break;

    case 1:
      /*
      Since I'm applying to a studio that makes
      such delightfully silly games, I only hope
      to emulate Squanch's ~vibe~ in this application.

      As a comedy writer and an avid gamer *ahem* egirl bangs, gamer fuel, headphones, chair *ahem* I am very eager to apply to be a writer at... [hand comes up] Squanch.... Games. ~hm, weird name~
      */

      //CLEANUP
      cleanChat(document.getElementById('chatHandle'), count);
      text0.appendChild(document.createTextNode("As a comedy writer and an avid gamer *ahem* egirl bangs, gamer fuel, headphones, chair *ahem* I am very eager to apply to be a writer at... [hand comes up] Squanch.... Games. ~hm, weird name~"));
      document.getElementById('chatHandle').appendChild(text0);
      count++;

      break;

    case 2:
      break;
    case 3:
      break;
  }
};

function cleanChat(t,c) { //param: document.getElementById('chatHandle'), count
  if (c > 0) {
    var x = t.lastChild;
    t.removeChild(x);
  }
  text0 = document.createElement("P");
  text0.setAttribute('id', 'chatText');
  text0.setAttribute('z-index', 1);
}

function lineB(output, i) {
  output.appendChild(document.createElement("br"))
}
