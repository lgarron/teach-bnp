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

var timeline = fullTimeline;


function go() {
  var numMarkers = timeline.length;

  var select = document.getElementById("section-select");
  select.size = numMarkers;

  var audio = document.getElementById("audio");

  var options = [];
  for (var marker of timeline) {

    var option = document.createElement("option");
    option.value = marker.time;
    option.textContent = marker.name;

    options.push(option);
    select.appendChild(option);
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

  function moveTimeToMarker(index) {
    audio.pause();
    audio.currentTime = timeline[index].time;
  }

  // Selects all options in the range.
  function setRange(first, last) {
    select.selectedIndex = -1; // Clear selection
    for (var i = first; i <= last; i++) {
      options[i].selected = true;
    };
    moveTimeToMarker(first);
  }

  select.addEventListener("change", function() {
    setRange(first(), last());
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

  window.addEventListener("keydown", function() {
    switch (event.keyCode) {
      case mocuteKeyCodes.START.down:
        audio.paused ? audio.play() : audio.pause();
        break;

      case mocuteKeyCodes.A.down: shiftRange(-1, -1); break;

      case mocuteKeyCodes.Y.down: shiftRange(1, 1);   break;

      case mocuteKeyCodes.X.down: shiftRange(0, -1);  break;

      case mocuteKeyCodes.B.down: shiftRange(0, 1);   break;

      case mocuteKeyCodes.SELECT.down:
        moveTimeToMarker(getFirst());
        break;
      default:
        console.log("Unassigned key code:", event.keyCode)
    }
  });

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
