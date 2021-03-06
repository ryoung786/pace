import { Time, Distance, Pace, Units as u } from "./conversions";

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
  distance: Distance.fromEvent(EVENTS.marathon),
  time: new Time(3, 0, 0),
  pace: Distance.fromEvent(EVENTS.marathon).calculatePace(
    new Time(3, 0, 0),
    u.MILE
  )
};
let scrolling = false;

// #region scrolling
function handleScroll() {
  const main = document.getElementsByTagName("main")[0];

  if (main.scrollLeft === model.scrollingTo) {
    // have we reached the destination?  if so, clear our scrollingTo
    model.scrollingTo = null;
    return;
  } else if (null !== model.scrollingTo) return;

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
  if (!scrolling) {
    window.requestAnimationFrame(function() {
      handleScroll();
      scrolling = false;
    });

    scrolling = true;
  }
});

document.querySelector("header").addEventListener("click", function(e) {
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
// #endregion scrolling

document.addEventListener("submit", e => {
  e.preventDefault();
  const sectionID = e.target.closest("section").id;
  const form = e.target.closest("form");
  if (sectionID.match(/distance|pace/)) {
    model.time = new Time(
      form.querySelector(".time .hours").value,
      form.querySelector(".time .minutes").value,
      form.querySelector(".time .seconds").value
    );
  }
  if (sectionID.match(/distance|time/)) {
    model.pace = new Pace(
      0,
      form.querySelector(".pace .minutes").value,
      form.querySelector(".pace .seconds").value,
      form.querySelector(".pace .units").value
    );
  }
  if (sectionID.match(/time|pace/)) {
    model.distance = new Distance(
      form.querySelector(".distance .input").value,
      form.querySelector(".distance .units").value
    );
  }

  if (sectionID.startsWith("distance")) {
    model.distance = model.pace.calculateDistance(model.time, model.pace.unit);
  } else if (sectionID.startsWith("pace")) {
    model.pace = model.distance.calculatePace(model.time, model.distance.unit);
  } else if (sectionID.startsWith("time")) {
    model.time = model.pace.calculateTime(model.distance);
  }

  render();
});

document.addEventListener("change", e => {
  if (e.target.matches(".computed select")) {
    const metric = e.target.dataset.metric;
    if ("distance" === metric) {
      model.distance = model.pace.calculateDistance(model.time, e.target.value);
    } else if ("pace" === metric) {
      model.pace = model.distance.calculatePace(model.time, e.target.value);
    }
    render();
  } else if (e.target.matches(".distance select")) {
    model.distance = Distance.fromEvent(EVENTS[e.target.value]);
    render();
  }
});

document.addEventListener("focusin", e => {
  if (e.target.matches("input")) {
    e.target.select();
  }
});

function render() {
  renderSelectedTab();
  renderInputFields();
  renderComputed();

  function renderSelectedTab() {
    document.querySelectorAll("header > div").forEach(e => {
      e.classList.remove("selected");
    });
    document
      .querySelector("header > div." + model.selected_tab.toLowerCase())
      .classList.add("selected");
  }
  function renderComputed() {
    document.querySelector(
      "#distance-section .computed span"
    ).textContent = model.distance.displayAsString();
    document.querySelector(
      "#pace-section .computed span"
    ).textContent = model.pace.displayAsString();
    document.querySelector(
      "#time-section .computed span"
    ).textContent = model.time.displayAsString();
  }
  function renderInputFields() {
    const paceDisplay = model.pace.display();
    const timeDisplay = model.time.display();
    document.querySelectorAll("form .pace input.minutes").forEach(e => {
      e.value = paceDisplay.MIN;
    });
    document.querySelectorAll("form .pace input.seconds").forEach(e => {
      e.value = paceDisplay.SEC;
    });
    document.querySelectorAll("form .pace select.units").forEach(e => {
      e.value = model.pace.unit;
    });
    document.querySelectorAll("form .time input.hours").forEach(e => {
      e.value = timeDisplay.HOUR;
    });
    document.querySelectorAll("form .time input.minutes").forEach(e => {
      e.value = timeDisplay.MIN;
    });
    document.querySelectorAll("form .time input.seconds").forEach(e => {
      e.value = timeDisplay.SEC;
    });
    document.querySelectorAll("form .distance input.input").forEach(e => {
      e.value = model.distance.display().distance;
    });
    document.querySelectorAll("form .distance select.units").forEach(e => {
      e.value = model.distance.unit;
    });
  }
}

render();
