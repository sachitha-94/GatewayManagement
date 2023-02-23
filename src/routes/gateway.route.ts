import { Router } from "express";

import {
  addDevice,
  addGateway,
  deleteGateway,
  getGatewayById,
  getGateways,
  removeDevice,
  updateGateway,
} from "../controllers";

const router = Router();

router.get("/", getGateways);
router.get("/:serialNumber", getGatewayById);
router.post("/", addGateway);
router.put("/:serialNumber", updateGateway);
router.delete("/:serialNumber", deleteGateway);
router.post("/:serialNumber/device", addDevice);
router.delete("/:serialNumber/device/:uid", removeDevice);

export default router;
