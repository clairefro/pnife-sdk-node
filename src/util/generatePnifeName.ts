import short = require("short-uuid");

import { DEFAULT_PNIFE_NAME } from "../constants";

export function generatePnifeName(): string {
  return `${DEFAULT_PNIFE_NAME}_${short.generate()}`;
}
