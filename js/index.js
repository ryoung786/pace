import { Time, Distance, Pace } from "./conversions";
import { isNull } from "util";

const _tabIndicator = document.getElementById("tab-indicator");

const EVENTS = {
  "400m": { dist: 400, unit: "METER" },
  mile: { dist: 1, unit: "MILE" },
  "5k": { dist: 5, unit: "KM" },
  "10k": { dist: 10, unit: "KM" },
  half: { dist: 13.1, unit: "MILE" },
  marathon: { dist: 26.2, unit: "MILE" }
};

let model = {
  selected_tab: "distance",
  scrollingTo: null,
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
function handleScroll() {
  const main = document.getElementsByTagName("main")[0];

  if (main.scrollLeft === model.scrollingTo) {
    // have we reached the destination?  if so, clear our scrollingTo
    model.scrollingTo = null;
    return;
  } else if (!isNull(model.scrollingTo)) return;

  let selection = "time";
  if (main.scrollLeft < main.offsetWidth / 2) {
    selection = "distance";
  } else if (main.scrollLeft < main.offsetWidth * 1.5) {
    selection = "pace";
  }

  if (selection !== model.selected_tab) {
    model.selected_tab = selection;
    render();
  }
}
document.getElementsByTagName("main")[0].addEventListener("scroll", e => {
  setTimeout(handleScroll, 250);
});

document
  .querySelector("header")
  .addEventListener("click", function(e) {
    const headerDiv = e.target.closest("header > div");
    if (headerDiv) {
      handleHeaderClick(headerDiv.dataset.metric);
    }
  });
function handleHeaderClick(metric) {
  model.selected_tab = metric;
  if ("distance" === metric.toLowerCase()) {
    model.scrollingTo = 0;
  } else if ("pace" === metric.toLowerCase()) {
    model.scrollingTo = window.innerWidth;
  } else if ("time" === metric.toLowerCase()) {
    model.scrollingTo = window.innerWidth * 2;
  }
  render();
  document.getElementsByTagName("main")[0].scrollTo(model.scrollingTo, 0);
}
function render() {
  document.querySelectorAll("header > div").forEach(e => {
    e.classList.remove("selected");
  });
  document
    .querySelector("header > div." + model.selected_tab.toLowerCase())
    .classList.add("selected");
}
