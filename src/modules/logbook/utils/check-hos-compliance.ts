import { Increment } from "../types/logbook";

export const checkCompliance = (dailyIncrements: Increment[][], type: "70/8") => {

  if (dailyIncrements.length === 0) return true

  // routine
  for (let i = 0; i < dailyIncrements.length; i++) {
    if (dailyIncrements[i].length !== 96) {
      throw `
Number of increments do not add up to a day.
Entered count: ${dailyIncrements[i].length}
@ Index: ${i}
`;
    }
  }

  switch (type) {
    case "70/8":
      return check70o8(dailyIncrements);
  }

}

export const check70o8 = (dailyIncrements: Increment[][]) => {
  if (dailyIncrements.length < 8) return true;

  let runningTotal = 0;

  const dailyCCU = dailyIncrements.map(logbookIncrementsToCCU);

  for (let i = 0; i < dailyCCU.length; i++) {

    if (i > 8) {
      runningTotal -= dailyCCU[i - 8];
    }

    runningTotal += dailyCCU[i];

    if (runningTotal > 70) {
      return false;
    }
  }

  return true;
}

export const logbookIncrementsToCCU = (increments: Increment[]) => increments.reduce((acc, cur) => {
  if (cur.dutyStatus === "DRIVING") {
    return acc + 0.25;
  }

  return acc;
}, 0)
