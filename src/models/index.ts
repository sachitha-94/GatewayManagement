import mongoose, { Document, Model } from "mongoose";

import { Gateway, Device, Status, ipv4Regex } from "../types";

const deviceSchema = new mongoose.Schema({
  uid: {
    type: Number,
    required: true,
  },
  vendor: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: Status,
  },
});

const gatewaySchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  ipv4Address: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => {
        return ipv4Regex.test(value);
      },
      message: (props) => `${props.value} is not a valid IPv4 address!`,
    },
  },
  devices: [deviceSchema],
});

const GatewayModel: Model<Document & Gateway> = mongoose.model<
  Document & Gateway
>("Gateway", gatewaySchema);
const DeviceModel: Model<Document & Device> = mongoose.model<Document & Device>(
  "Device",
  deviceSchema
);

export { GatewayModel, DeviceModel };
