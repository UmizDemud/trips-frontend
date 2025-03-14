export type Location = {
  name: string
  type: "fuel" | "current" | "pickup" | "dropoff"
  latitude: number
  longitude: number
  distance?: number
  time?: number
}

export type Trip = {
  id?: number

  locations           : Location[];
  cycle_hours         : number;   // e.g. 10.5 hours

  start_date          : string;   // Format: "YYYY-MM-DD"
}