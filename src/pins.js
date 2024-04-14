// Additional functionality for PINS such as shows it's data in popups or Namatama currently

let pins = [];

// pinElement.addEventListener('mouseleave', function() {
//     popup.classList.remove('active');
//     clearNamatamaText();
// });

// pinElement.addEventListener('click', function() {
//       togglePopup(popup);
//       updateSidebar(); // Update the sidebar when pin visibility changes
//   });


function togglePopup(popup) {
    popup.classList.toggle('active');
}

function createPopup(pin) {
    var popup = document.createElement('div');
    // popup.classList.add('popup');

    // var pinData = document.createElement('div');
    // pinData.innerHTML = '<strong>Category:</strong> ' + pin.category + '<br>' +
    //                  '<strong>Title:</strong> ' + pin.title + '<br>' +
    //                  '<strong>Image:</strong> <img src="' + pin.dataImg + '" style="">';

    // popup.appendChild(pinData);

    return popup;
}

function updateNamatamaText(pin) {
  var namatamaText = document.getElementById('namatamaText');
  namatamaText.innerHTML = '<strong>Category:</strong> ' + pin.category + '<br>' +
                           '<strong>Title:</strong> ' + pin.title + '<br>' +
                           '<strong>Image:</strong> <img src="' + pin.dataImg + '" style="">';
}

function clearNamatamaText() {
  var textOptions = [
    'Nice work! Now go find an easter egg. ❤️',
    'What an eggcellent app!',
    'DID YOU KNOW??? Clicking on a pin will copy a SHARE LINK to your clipboard. Try it!',
    'Keep searching! The adventure continues! 🚀',
    'DID YOU KNOW??? Adding a pinch of salt to water when boiling eggs helps prevent them from cracking!',
    'What ye egg? That which we call a yolk by any other name would taste as sweet.',
    'How does an egg late to work get there as soon as possible? It scrambles...duh!',
    'Am I too funny? It this enough yolks yet?',
  ];
  var namatamaText = document.getElementById('namatamaText');
  // Get a random index to select a text option
  var randomIndex = Math.floor(Math.random() * textOptions.length);
  namatamaText.innerHTML = textOptions[randomIndex];
}
