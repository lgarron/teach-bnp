var mocuteKeyCodes = {
  A:            {"down":  72, "hold":   8, "up":  32},
  B:            {"down":  85, "hold":  27, "up":  70},
  X:            {"down":  89, "hold":  32, "up":  84},
  Y:            {"down":  74, "hold": 189, "up":  78},
  START:        {"down":  76, "hold": 219, "up":  86},
  SELECT:       {"down":  79, "hold": 187, "up":  71},
  CIRCLE_UP:    {"down":  65, "hold":  37, "up":  81}, // Also generates 222 between down and hold
  CIRCLE_RIGHT: {"down":  78, "hold":  38, "up":  69}, // Also generates 220 between down and hold
  CIRCLE_DOWN:  {"down":  68, "hold":  39, "up":  67}, // Also generates 220 between down and hold
  CIRCLE_LEFT:  {"down":  88, "hold":  40, "up":  90}  // Also generates 186 between down and hold
};

var FULL = false;

var timeline = FULL ? fullTimeline : condensedTimeline;

var fullLeadInDuration = 4.6;
var minimalLeadInDuration = 0.2;
var fadeOutTime = 0.2;


function go() {
  var numMarkers = timeline.length;

  if (FULL) {
    document.body.classList.add("full");
  }

  var leadInElem = document.getElementById("lead-in");
  var select = document.getElementById("section-select");
  select.size = numMarkers;

  var audio = document.getElementById("audio");


  var options = [];
  var currentSectionName = "";
  var currentOptGroup;
  for (var marker of timeline) {
    if (FULL && currentSectionName !== marker.section) {
      currentOptGroup = document.createElement("optgroup");
      currentOptGroup.label = marker.section;
      currentSectionName = marker.section;
      select.appendChild(currentOptGroup);
    }

    var option = document.createElement("option");
    option.value = marker.time;
    option.textContent = marker.name;

    options.push(option);
    (FULL ? currentOptGroup : select).appendChild(option);
  }

  function getFirst() {
    var first, last;
    for (var i = 0; i < numMarkers; i++) {
      if (options[i].selected) {
        return i;
      }
    }
  }

  function getLast() {
    for (var i = numMarkers - 1; i >= 0; i--) {
      if (options[i].selected) {
        return i;
      }
    }
  }

  var startMarkerTime = 0;
  var endMarkerTime = 0;
  function moveTimeToMarker(index) {
    startMarkerTime = timeline[index].time;
    rewindSection();
  }

  function rewindSection() {
    audio.currentTime = startMarkerTime;
    audio.currentTime -= leadInElem.checked ? fullLeadInDuration : minimalLeadInDuration;
    adjustAudio();
  }

  function setPlayRange(startIndex, endIndex) {
    audio.pause();
    moveTimeToMarker(startIndex);
    endMarkerTime = (endIndex + 1 < numMarkers) ? timeline[endIndex + 1].time : audio.duration;
    console.log(startMarkerTime);
    console.log(endMarkerTime);
  }

  function pause() {
      audio.pause();
      cancelAnimationFrame(animFrame);
  }

  function adjustAudio() {
    if (!leadInElem.checked) {
      audio.volume = 1;
      return;
    }

    if (audio.currentTime < startMarkerTime) {
      audio.volume = 1 - (startMarkerTime - audio.currentTime) / (2 * fullLeadInDuration);
    } else if (audio.currentTime > endMarkerTime + fadeOutTime) {
      pause();
    } else if (audio.currentTime > endMarkerTime) {
      audio.volume = 1 - (audio.currentTime - endMarkerTime) / (fadeOutTime);
    } else {
      audio.volume = 1;
    }
  }

  function animFrame() {
    requestAnimationFrame(animFrame); // Request before adjustAudio so that adjustAudio can pause.
    adjustAudio();
  }

  function playpause() {
    if (audio.paused) {
      audio.play();
      requestAnimationFrame(animFrame);
    } else {
      pause();
    }
  }

  // Selects all options in the range.
  function setRange(first, last) {
    select.selectedIndex = -1; // Clear selection
    for (var i = first; i <= last; i++) {
      options[i].selected = true;
    };
    setPlayRange(first, last);
  }

  select.addEventListener("change", function() {
    setRange(getFirst(), getLast());
  });

  function clip(index) {
    if (index < 0) {
      return 0;
    } else if (index >= numMarkers) {
      return numMarkers - 1
    } else {
      return index;
    }
  }

  function shiftRange(firstDelta, lastDelta) {
    first = clip(getFirst() + firstDelta);
    last  = clip(getLast() + lastDelta);
    if (last < first) {
      last = first;
    }
    setRange(first, last);
  }

  window.addEventListener("keydown", function(event) {
    var preventDefault = true;
    switch (event.keyCode) {
      case mocuteKeyCodes.START.down:
        playpause();
        break;

      case mocuteKeyCodes.A.down: shiftRange(-1, -1); break;

      case mocuteKeyCodes.Y.down: shiftRange(1, 1);   break;

      case mocuteKeyCodes.X.down: shiftRange(0, -1);  break;

      case mocuteKeyCodes.B.down: shiftRange(0, 1);   break;

      case mocuteKeyCodes.CIRCLE_LEFT.down: leadInElem.checked = !leadInElem.checked; break;

      case mocuteKeyCodes.SELECT.down: rewindSection(); break;
      default:
        preventDefault = false;
        break;
    }

    if (preventDefault) {
      event.preventDefault();
    }
  });

  leadInElem.checked = true;

  setRange(0, 0);
}

window.addEventListener("load", go);

// var optionsToSelect = ['One', 'three'];
// var select = document.getElementById( 'choice' );

// for ( var i = 0, l = select.options.length, o; i < l; i++ )
// {
//   o = select.options[i];
//   if ( optionsToSelect.indexOf( o.text ) != -1 )
//   {
//     o.selected = true;
//   }
// }
