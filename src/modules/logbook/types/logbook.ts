export type Logbook = {
  id                  ?: number
  date                : Date
  increments          : Increment[] // 96 items
  initials            : string

/* These won't be used, so all strings for now

  driverNumber: string
  signature: string
  coDriver: string
  homeOperatingCenter: string
  vehicleNo: string
  trailerNo: string
  otherTrailers: string[]
  Shipper: string
  loadId: string
*/
}

export type Remark = {
  city              : string
  state             : string
  commodity         : string
  detail            : string
  latitude?         : number
  longitude?        : number
}

export type Increment = {
  dutyStatus        : DutyStatus
  remark?           : Remark
}

export const dutyStatusOptions = ["OFF DUTY", "SLEEPER BERTH", "DRIVING", "ON DUTY"] as const;

export type DutyStatus = typeof dutyStatusOptions[number];
