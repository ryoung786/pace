import { Time, Distance, Pace, Units } from "./conversions";

test("Calculate Time", () => {
  const d = new Distance(5, Units.MILE);
  const p = new Pace(0, 6, 0, Units.MILE);
  expect(d.calculateTime(p).minutes).toBe(30);
  expect(p.calculateTime(d).minutes).toBe(30);
});
test("Calculate Time 5K", () => {
  const d = new Distance(5, Units.KM);
  const p = new Pace(0, 6, 0, Units.MILE);
  let t = d.calculateTime(p);
  expect(t.minutes).toBe(18);
  expect(t.seconds).toBe(38);
  t = p.calculateTime(d);
  expect(t.minutes).toBe(18);
  expect(t.seconds).toBe(38);
});
test("Calculate Time 5000M", () => {
  const d = new Distance(5000, Units.METER);
  const p = new Pace(0, 6, 0, Units.MILE);
  let t = d.calculateTime(p);
  expect(t.minutes).toBe(18);
  expect(t.seconds).toBe(38);
  t = p.calculateTime(d);
  expect(t.minutes).toBe(18);
  expect(t.seconds).toBe(38);
});

test("Calculate Pace", () => {
  const d = new Distance(1, Units.MILE);
  const t = new Time(0, 7, 0);
  let p = d.calculatePace(t, Units.MILE);
  expect(p.minutes).toBe(7);
  p = t.calculatePace(d, Units.MILE);
  expect(p.minutes).toBe(7);
});
test("Calculate Pace 5K", () => {
  const d = new Distance(5, Units.KM);
  const t = new Time(0, 18, 38);
  let p = d.calculatePace(t, Units.MILE);
  expect(p.minutes).toBe(6);
  expect(p.unit).toBe(Units.MILE);
  p = d.calculatePace(t, Units.MILE);
  expect(p.minutes).toBe(6);
  expect(p.unit).toBe(Units.MILE);
});
test("Calculate Pace 5K round up", () => {
  const d = new Distance(5, Units.KM);
  const t = new Time(0, 18, 39);
  let p = d.calculatePace(t, Units.MILE);
  expect(p.toSeconds()).toBe(361);
});

test("Calculate Distance 5K", () => {
  const p = new Pace(0, 6, 0, Units.MILE);
  const t = new Time(0, 18, 38);
  let d = p.calculateDistance(t, Units.KM);
  expect(d.distance).toBe(5);
});
test("Calculate Distance 5K", () => {
  const p = new Pace(0, 6, 0, Units.MILE);
  const t = new Time(0, 18, 39);
  let d = p.calculateDistance(t, Units.METER);
  expect(d.distance).toBe(5002.37);
});

test("can i do this", () => {
  let d = Distance.fromEvent({dist: 26.2, unit: Units.MILE});
  expect(d.distance).toBe(26.2);
});

test("displayHMS", () => {
  let d = new Time(0, 5, 33).display();
  expect(d.HOUR).toBe("");
  expect(d.MIN).toBe("05");
  expect(d.SEC).toBe("33");
  d = new Time(0, 0, 33).display();
  expect(d.HOUR).toBe("");
  expect(d.MIN).toBe("");
  expect(d.SEC).toBe("33");
});
