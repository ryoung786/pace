export const Units = {
  MILE: "MILE",
  METER: "METER",
  KM: "KM",
  YARD: "YARD"
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

function toHMS(totalSeconds) {
  let seconds = totalSeconds;
  const h = Math.floor(seconds / (60 * 60));
  seconds = seconds % (60 * 60);
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return { hours: h, minutes: m, seconds: s };
}
function toTotalSeconds(hours, minutes, seconds) {
  return 60 * 60 * hours + 60 * minutes + (parseFloat(seconds) || 0);
}
function displayHMS(hours, minutes, seconds) {
  hours = parseFloat(hours) || 0;
  minutes = parseFloat(minutes) || 0;
  seconds = parseFloat(seconds) || 0;
  return {
    HOUR: hours === 0 ? "" : ("00" + hours).slice(-2),
    MIN: hours === 0 && minutes === 0 ? "" : ("00" + minutes).slice(-2),
    SEC:
      hours === 0 && minutes === 0 && seconds === 0
        ? ""
        : ("00" + seconds).slice(-2)
  };
}

export class Distance {
  constructor(distance, unit) {
    this.distance = distance;
    this.unit = unit;
  }
  display() {
    return new Distance(Math.round(100 * this.distance) / 100, this.unit);
  }
  displayAsString() {
    const d = Math.round(100 * this.distance) / 100;
    const u = { METER: "m", MILE: "miles", KM: "km", YARD: "yards" }[this.unit];
    return `${d} ${u}`;
  }
  static fromEvent(event) {
    return new Distance(event.dist, event.unit);
  }
  toUnit(unit) {
    if (unit === Units.MILE) {
      return this.toMiles();
    } else if (unit === Units.METER) {
      return this.toMeters();
    } else if (unit === Units.KM) {
      return this.toKM();
    } else if (unit === Units.YARD) {
      return this.toYards();
    }
  }
  toMiles() {
    return new Distance(
      this.distance * CONVERSIONS[this.unit][Units.MILE],
      Units.MILE
    );
  }
  toMeters() {
    return new Distance(
      this.distance * CONVERSIONS[this.unit][Units.METER],
      Units.METER
    );
  }
  toKM() {
    return new Distance(
      this.distance * CONVERSIONS[this.unit][Units.KM],
      Units.KM
    );
  }
  toYards() {
    return new Distance(
      this.distance * CONVERSIONS[this.unit][Units.YARD],
      Units.YARD
    );
  }
  calculatePace(time, units) {
    let d = this.toUnit(units);
    return Pace.fromTotalSeconds(time.toSeconds() / d.distance, units);
  }
  calculateTime(pace) {
    let d = this.toUnit(pace.unit);
    return Time.fromTotalSeconds(d.distance * pace.toSeconds());
  }
}

export class Pace {
  constructor(hours, minutes, seconds, unit) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
    this.unit = unit;
  }
  static fromTotalSeconds(seconds, unit) {
    const hms = toHMS(Math.ceil(seconds));
    return new Pace(hms.hours, hms.minutes, hms.seconds, unit);
  }
  toSeconds() {
    return toTotalSeconds(this.hours, this.minutes, this.seconds);
  }
  display() {
    return displayHMS(this.hours, this.minutes, this.seconds);
  }
  displayAsString() {
    const p = this.display();
    let arr = [];
    if (p.HOUR) arr.push(p.HOUR);
    if (p.MIN) arr.push(p.MIN);
    else arr.push("0");
    arr.push(p.SEC);
    if (arr[0].startsWith("0")) arr[0] = arr[0].slice(1);
    return `${arr.join(":")}/${this.unit.toLowerCase()}`;
  }
  calculateTime(distance) {
    let d = distance.toUnit(this.unit);
    return Time.fromTotalSeconds(this.toSeconds() * d.distance);
  }
  calculateDistance(time, units) {
    let d = new Distance(time.toSeconds() / this.toSeconds(), this.unit);
    return d.toUnit(units).display();
  }
}

export class Time {
  constructor(hours, minutes, seconds) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }
  static fromTotalSeconds(seconds) {
    const hms = toHMS(Math.round(seconds));
    return new Time(hms.hours, hms.minutes, hms.seconds);
  }
  toSeconds() {
    return toTotalSeconds(this.hours, this.minutes, this.seconds);
  }
  display() {
    return displayHMS(this.hours, this.minutes, this.seconds);
  }
  displayAsString() {
    const p = this.display();
    let arr = [];
    if (p.HOUR) arr.push(p.HOUR);
    if (p.MIN) arr.push(p.MIN);
    else arr.push("0");
    arr.push(p.SEC);
    if (arr[0].startsWith("0")) arr[0] = arr[0].slice(1);
    return arr.join(":");
  }
  calculateDistance(pace, units) {
    let d = new Distance(this.toSeconds() / pace.toSeconds(), pace.unit);
    return d.toUnit(units).display();
  }
  calculatePace(distance, units) {
    let d = distance.toUnit(units);
    return Pace.fromTotalSeconds(this.toSeconds() / d.distance, units);
  }
}
