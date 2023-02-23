import { Gateway, Device, Status, ipv4Regex } from "../types";

export function validateGateway(gateway: Gateway): string[] {
  const errors: string[] = [];
  if (!gateway.name) {
    errors.push("Name is required");
  }
  if (!gateway.ipv4Address) {
    errors.push("IPv4 address is required");
  } else {
    if (!ipv4Regex.test(gateway.ipv4Address)) {
      errors.push("Invalid IPv4 address");
    }
  }
  if (gateway.devices && gateway.devices.length > 10) {
    errors.push("A gateway has reached the maximum number of devices");
  }
  return errors;
}

export function validateDevice(device: Device): string[] {
  const errors: string[] = [];
  if (!device.uid) {
    errors.push("UID is required");
  }
  if (!device.vendor) {
    errors.push("Vendor is required");
  }
  if (
    !device.status ||
    (device.status !== Status.online && device.status !== Status.offline)
  ) {
    errors.push(`Status must be either ${Status.online} or ${Status.offline}`);
  }
  return errors;
}
