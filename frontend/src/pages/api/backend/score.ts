import type { NextApiRequest, NextApiResponse } from "next";
import { forwardJsonRequest } from "./_utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return forwardJsonRequest(req, res, "/v1/score");
}
