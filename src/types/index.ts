export interface Device {
  uid: number;
  vendor: string;
  dateCreated?: Date;
  status: Status;
}

export interface Gateway {
  serialNumber: string;
  name: string;
  ipv4Address: string;
  devices: Device[];
}

export enum Status {
  online = "online",
  offline = "offline",
}

export const ipv4Regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
