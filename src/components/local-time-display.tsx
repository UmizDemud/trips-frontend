"use effect"

export const LocalTimeDisplay = ({date, datetime}: {date: Date, datetime: "date" | "time"}) => {

  switch (datetime) {
    case "date":
      return date.toLocaleDateString();
    case "time":
      return date.toLocaleTimeString();
  }

  return null;
}
