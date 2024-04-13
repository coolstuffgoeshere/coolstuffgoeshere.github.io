var pins = [];

// Show/Hide Namatama Text
// function toggleText() {
//     var text = document.getElementById("namatamaText");
//     if (text.style.display === "none") {
//       text.style.display = "block";
//     } else {
//       text.style.display = "none";
//     }
//   }

pinElement.addEventListener('mouseleave', function() {
    popup.classList.remove('active');
    clearNamatamaText();
});

  pinElement.addEventListener('click', function() {
      togglePopup(popup);
      updateSidebar(); // Update the sidebar when pin visibility changes
  });


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
  var namatamaText = document.getElementById('namatamaText');
  namatamaText.innerHTML = 'Nice work! Now go find an easter egg. ❤️';
}
