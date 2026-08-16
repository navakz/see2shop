import express from "express";
import { validateVisionRequest } from "../models/vision.js";
import { MockVisionProvider } from "../providers/mock-vision-provider.js";
import { visionRateLimit } from "../security/rate-limit.js";

const router = express.Router();

const visionProvider =
  new MockVisionProvider();

router.post(
  "/analyze",
  visionRateLimit,
  async (req, res) => {
    try {
      const validation =
        validateVisionRequest(req.body);

      if (!validation.valid) {
        return res.status(400).json({
          error: validation.error
        });
      }

      const result =
        await visionProvider.analyze(
          req.body.image
        );

      return res.json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error(
        "Vision request failed:",
        error
      );

      return res.status(500).json({
        error: "Vision analysis failed."
      });
    }
  }
);

export default router;
