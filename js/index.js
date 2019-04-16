const EL = {
  DISTANCE: {
    EVENT: document.getElementById("distance-dropdown"),
    INPUT: document.getElementById("distance-specify"),
    UNIT: document.getElementById("distance-units")
  },
  PACE: {
    MIN: document.getElementById("pace-minutes"),
    SEC: document.getElementById("pace-seconds"),
    UNIT: document.getElementById("pace-units")
  },
  TIME: {
    HOUR: document.getElementById("time-hours"),
    MIN: document.getElementById("time-minutes"),
    SEC: document.getElementById("time-seconds")
  },
  CALC_BTN: document.getElementsByClassName("calc"),
  SELECTION: document.getElementById("selection")
};
const DISTANCES = {
  "400m": { dist: 400, unit: "METER" },
  mile: { dist: 1, unit: "MILE" },
  "5k": { dist: 5, unit: "KM" },
  "10k": { dist: 10, unit: "KM" },
  half: { dist: 13.1, unit: "MILE" },
  marathon: { dist: 26.2, unit: "MILE" }
};
const CONVERSIONS = {
  MILE: {
    METER: 1609.34,
    KM: 1.60934,
    MILE: 1,
    YARD: 1760
  },
  METER: {
    METER: 1,
    KM: 0.001,
    MILE: 0.000621371,
    YARD: 1.09361
  },
  KM: {
    METER: 1000,
    KM: 1,
    MILE: 0.621371,
    YARD: 1093.61
  },
  YARD: {
    METER: 0.9144,
    KM: 0.0009144,
    MILE: 0.000568182,
    YARD: 1
  }
};

let model = {
  selection: "distance",
  isDistanceEditable: false,
  distance: { dist: null, unit: null },
  pace: { seconds: null, unit: null },
  time: null // seconds
};

EL.DISTANCE.EVENT.onchange = e => {
  // if pre-set event, overwrite the distance and unit inputs
  // and disable them
  // otherwise, enable them
  console.log("changed");
  setDistance();
  render();
};

document.addEventListener(
  "click",
  e => {
    if (e.target.matches(".calc")) {
      handleCalcClick(e.target.dataset.metric);
      return;
    } else if (e.target.matches("header h2")) {
      handleHeaderClick(e.target.dataset.metric);
      return;
    }
  },
  false
);
function handleHeaderClick(metric) {
  model.selection = metric;
  render();
}
function handleCalcClick(metric) {
  if ("distance" === metric) {
    setAll();
    calculateDistance();
  } else if ("pace" === metric) {
    setAll();
    calculatePace();
  } else if ("time" === metric) {
    setAll();
    calculateTime();
  }
  render();
}

function setPace() {
  model.pace.seconds = toSeconds(
    0,
    parseInt(EL.PACE.MIN.value) || 0,
    parseInt(EL.PACE.SEC.value) || 0
  );
  model.pace.unit = EL.PACE.UNIT.selectedOptions[0].value;
}
function setTime() {
  model.time = toSeconds(
    parseInt(EL.TIME.HOUR.value) || 0,
    parseInt(EL.TIME.MIN.value) || 0,
    parseInt(EL.TIME.SEC.value) || 0
  );
}
function setDistance() {
  const event = EL.DISTANCE.EVENT.selectedOptions[0].value;
  const unit = EL.DISTANCE.UNIT.selectedOptions[0].value;

  if ("specify" === event) {
    model.distance.dist = parseFloat(EL.DISTANCE.INPUT.value) || 0; // distance is whatever is typed into the input
    model.distance.unit = unit;
  } else {
    model.distance.dist = parseFloat(DISTANCES[event].dist) || 0;
    model.distance.unit = DISTANCES[event].unit;
  }
  model.isDistanceEditable = "specify" === event;
}

function calculateDistance() {
  model.distance.dist = convert(
    { dist: model.time / model.pace.seconds, unit: model.pace.unit },
    model.distance.unit
  );
}
function calculatePace() {
  const dist = convert(model.distance, model.pace.unit);
  model.pace.seconds = model.time / dist;
}
function calculateTime() {
  const dist = convert(model.distance, model.pace.unit);
  model.time = dist * model.pace.seconds;
}

function render() {
  EL.SELECTION.className = model.selection;

  const event = EL.DISTANCE.EVENT.selectedOptions[0].value;
  if (
    "specify" !== event &&
    DISTANCES[event].dist !== +model.distance.dist.toFixed(2)
  ) {
    model.isDistanceEditable = true;
    EL.DISTANCE.EVENT.value = "specify";
  }
  EL.DISTANCE.INPUT.disabled = !model.isDistanceEditable;
  EL.DISTANCE.UNIT.disabled = !model.isDistanceEditable;
  EL.DISTANCE.INPUT.value = +model.distance.dist.toFixed(2);
  EL.DISTANCE.UNIT.value = model.distance.unit;

  const paceHMS = toHMS(model.pace.seconds);
  EL.PACE.MIN.value = paceHMS.MIN;
  EL.PACE.SEC.value = paceHMS.SEC;
  EL.PACE.UNIT.value = model.pace.unit;

  const timeHMS = toHMS(model.time);
  EL.TIME.HOUR.value = timeHMS.HOUR;
  EL.TIME.MIN.value = timeHMS.MIN;
  EL.TIME.SEC.value = timeHMS.SEC;
}

function convert(distance, target) {
  return distance.dist * CONVERSIONS[distance.unit][target];
}
function toSeconds(hours, minutes, seconds) {
  return 60 * 60 * hours + 60 * minutes + seconds;
}
function toHMS(seconds) {
  seconds = parseFloat(seconds) || 0;
  const h = Math.floor(seconds / (60 * 60));
  seconds = seconds % (60 * 60);
  const m = Math.floor(seconds / 60);
  seconds = Math.round(seconds % 60);
  return {
    HOUR: ("00" + h).slice(-2),
    MIN: ("00" + m).slice(-2),
    SEC: ("00" + seconds).slice(-2)
  };
}
function setAll() {
  setDistance();
  setPace();
  setTime();
}
setAll();
render();
