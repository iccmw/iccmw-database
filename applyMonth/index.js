/**
 * applyJanuaryIqamah.js
 *
 * - Applies fixed Iqamah schedule for January 2026
 * - Forces Fajr Adhaan clock to AM (data integrity rule)
 */

const fs = require("fs");

const inputFile = "file.json";
const outputFile = "january-2026.updated.json";

const data = JSON.parse(fs.readFileSync(inputFile, "utf8"));

function getRange(day) {
  if (day >= 1 && day <= 10) return "early";
  if (day >= 11 && day <= 20) return "mid";
  return "late";
}

const IQAMAH_SCHEDULE = {
  early: {
    Fajr: { time: "6:15", clock: "AM" },
    Dhuhr: { time: "1:15", clock: "PM" },
    Asr: { time: "3:15", clock: "PM" },
    Isha: { time: "7:30", clock: "PM" },
  },
  mid: {
    Fajr: { time: "6:15", clock: "AM" },
    Dhuhr: { time: "1:15", clock: "PM" },
    Asr: { time: "3:30", clock: "PM" },
    Isha: { time: "7:30", clock: "PM" },
  },
  late: {
    Fajr: { time: "6:15", clock: "AM" },
    Dhuhr: { time: "1:15", clock: "PM" },
    Asr: { time: "3:45", clock: "PM" },
    Isha: { time: "7:30", clock: "PM" },
  },
};

const january = data["2026"]["January"];

Object.keys(january).forEach((dayKey) => {
  const day = parseInt(dayKey, 10);
  const range = getRange(day);
  const schedule = IQAMAH_SCHEDULE[range];

  // Apply Iqamah overrides
  ["Fajr", "Dhuhr", "Asr", "Isha"].forEach((prayer) => {
    if (!january[dayKey][prayer]) return;

    january[dayKey][prayer].Iqamah = {
      time: schedule[prayer].time,
      clock: schedule[prayer].clock,
      notification: true,
    };
  });

  // FORCE Fajr Adhaan clock to AM
  if (january[dayKey].Fajr?.Adhaan) {
    january[dayKey].Fajr.Adhaan.clock = "AM";
  }
});

fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));

console.log("✔ January Iqamah applied and Fajr Adhaan clock normalized to AM.");
