import { Time, Distance, Pace } from "./conversions";

const EL = {
  DISTANCE: {
    EVENT: document.querySelector("distance-dropdown"),
    INPUT: document.querySelector("distance-specify"),
    UNIT: document.querySelector("distance-units")
  },
  PACE: {
    MIN: document.querySelector("pace-minutes"),
    SEC: document.querySelector("pace-seconds"),
    UNIT: document.querySelector("pace-units")
  },
  TIME: {
    HOUR: document.querySelector("time-hours"),
    MIN: document.querySelector("time-minutes"),
    SEC: document.querySelector("time-seconds")
  },
  CALC_BTN: document.querySelector("calc"),
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

let model = {
  selection: "distance",
  isDistanceEditable: false,
  distance: { dist: null, unit: null },
  pace: { seconds: null, unit: null },
  time: null // seconds
};

// EL.DISTANCE.EVENT.onchange = e => {
//   // if pre-set event, overwrite the distance and unit inputs
//   // and disable them
//   // otherwise, enable them
//   setDistance();
//   render();
// };

document.addEventListener(
  "click",
  e => {
    if (e.target.matches("header h2")) {
      handleHeaderClick(e.target.dataset.metric);
      return;
    }
  },
  false
);
function handleHeaderClick(metric) {
  model.selection = metric;
  // render();
}

// function setPace() {
//   model.pace.seconds = toSeconds(
//     0,
//     parseInt(EL.PACE.MIN.value) || 0,
//     parseInt(EL.PACE.SEC.value) || 0
//   );
//   model.pace.unit = EL.PACE.UNIT.selectedOptions[0].value;
// }
// function setTime() {
//   model.time = toSeconds(
//     parseInt(EL.TIME.HOUR.value) || 0,
//     parseInt(EL.TIME.MIN.value) || 0,
//     parseInt(EL.TIME.SEC.value) || 0
//   );
// }
// function setDistance() {
//   const event = EL.DISTANCE.EVENT.selectedOptions[0].value;
//   const unit = EL.DISTANCE.UNIT.selectedOptions[0].value;

//   if ("specify" === event) {
//     model.distance.dist = parseFloat(EL.DISTANCE.INPUT.value) || 0; // distance is whatever is typed into the input
//     model.distance.unit = unit;
//   } else {
//     model.distance.dist = parseFloat(DISTANCES[event].dist) || 0;
//     model.distance.unit = DISTANCES[event].unit;
//   }
//   model.isDistanceEditable = "specify" === event;
// }

// function render() {
//   EL.SELECTION.className = model.selection;

//   const event = EL.DISTANCE.EVENT.selectedOptions[0].value;
//   if (
//     "specify" !== event &&
//     DISTANCES[event].dist !== +model.distance.dist.toFixed(2)
//   ) {
//     model.isDistanceEditable = true;
//     EL.DISTANCE.EVENT.value = "specify";
//   }
//   EL.DISTANCE.INPUT.disabled = !model.isDistanceEditable;
//   EL.DISTANCE.UNIT.disabled = !model.isDistanceEditable;
//   EL.DISTANCE.INPUT.value = +model.distance.dist.toFixed(2);
//   EL.DISTANCE.UNIT.value = model.distance.unit;

//   const paceHMS = toHMS(model.pace.seconds);
//   EL.PACE.MIN.value = paceHMS.MIN;
//   EL.PACE.SEC.value = paceHMS.SEC;
//   EL.PACE.UNIT.value = model.pace.unit;

//   const timeHMS = toHMS(model.time);
//   EL.TIME.HOUR.value = timeHMS.HOUR;
//   EL.TIME.MIN.value = timeHMS.MIN;
//   EL.TIME.SEC.value = timeHMS.SEC;
// }
// function setAll() {
//   setDistance();
//   setPace();
//   setTime();
// }
// setAll();
// render();
