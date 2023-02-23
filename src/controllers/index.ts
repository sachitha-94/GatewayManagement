import express, { NextFunction } from "express";
import { Request, Response } from "express";

import { Gateway, Device } from "../types";
import { validateGateway, validateDevice } from "../validators";
import { GatewayModel } from "../models";

const app = express();

app.use(express.json());

export const getGateways = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const gateways = await GatewayModel.find().lean();
    res.json({ sucess: true, data: gateways });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
    next(error);
  }
};

export const getGatewayById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const serialNumber = req.params?.serialNumber;
    const gateway = await GatewayModel.findOne({ serialNumber });
    res.json({ sucess: true, data: gateway });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
    next(error);
  }
};

export const addGateway = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const gateway: Gateway = req.body;

    const isAvailable = await GatewayModel.findOne({
      serialNumber: gateway?.serialNumber,
    });
    if (isAvailable)
      throw `Gateway with the Serial Number ${gateway?.serialNumber} already exsists`;

    const validationErrors = validateGateway(gateway);

    if (validationErrors?.length > 0) {
      res.status(400).json({ success: false, error: validationErrors });
    } else {
      const newGateway = await GatewayModel.create(gateway);

      if (newGateway) res.status(201).json({ success: true, data: gateway });
      else throw new Error();
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
    next(error);
  }
};

export const updateGateway = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const serialNumber = req.params.serialNumber;
    const updatedGateway: Gateway = req.body;

    const validationErrors = validateGateway(updatedGateway);

    if (validationErrors?.length > 0) {
      res.status(400).json({ success: false, error: validationErrors });
    } else {
      const gateway = await GatewayModel.findOne({ serialNumber });
      if (!gateway) {
        throw `Gateway with the Serial Number ${serialNumber} not found`;
      }

      const updated = await GatewayModel.updateOne(
        { serialNumber },
        {
          $set: {
            name: updatedGateway?.name,
            ipv4Address: updatedGateway?.ipv4Address,
          },
        }
      );
      if (updated) {
        res.status(200).json({ success: true, data: gateway });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
    next(error);
  }
};

export const deleteGateway = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const serialNumber = req.params.serialNumber;
    const gateway = await GatewayModel.findOne({ serialNumber });
    if (!gateway) {
      throw `Gateway with Serial Number ${serialNumber} not found`;
    }

    const deleted = await GatewayModel.deleteOne({ serialNumber });
    if (deleted)
      res.status(200).json({
        success: true,
      });
    else throw new Error();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
    next(error);
  }
};

export const addDevice = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const serialNumber = req.params.serialNumber;
    const device: Device = req.body;

    device.dateCreated = new Date();
    device.uid = Date.now();

    const validationErrors = validateDevice(device);

    if (validationErrors?.length > 0) {
      res.status(400).json({ success: false, errors: validationErrors });
    } else {
      const gateway = await GatewayModel.findOne({
        serialNumber: serialNumber,
      });
      if (!gateway) {
        throw `Gateway with the Serial Number ${serialNumber} not found`;
      }
      if (gateway?.devices?.length >= 10) {
        throw `Gateway ${serialNumber} has reached the maximum number of devices`;
      }

      gateway.devices.push(device);

      const added = await gateway.save();

      if (added) res.status(201).json({ success: true, data: device });
      else throw new Error();
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
    next(error);
  }
};

export const removeDevice = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const serialNumber = req.params.serialNumber;
    const uid = parseInt(req.params.uid);
    const gateway = await GatewayModel.findOne({ serialNumber });
    if (!gateway) {
      throw `Gateway with Serial Number ${serialNumber} not found`;
    }

    let isAvailable = false;
    gateway.devices = gateway?.devices?.filter((device) => {
      if (device?.uid === uid) isAvailable = true;
      return device?.uid !== uid;
    });

    if (!isAvailable) throw `Device with UID ${uid} not found`;

    const deleted = await gateway.save();

    if (deleted) {
      res.status(200).json({ success: true });
    } else {
      throw "Device not found";
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
    next(error);
  }
};
