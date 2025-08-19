import { Router } from "express";
import { reseedFromJson } from "../admin/reseed";

export const reseedRoutes = Router();

reseedRoutes.post("/", async (req, res) => {
  try {
    const { deltaDays, anchorDaysAgo } = req.body ?? {};
    const result = await reseedFromJson({ deltaDays, anchorDaysAgo });
    res.json({ ok: true, ...result });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ ok: false, error: e?.message ?? "reseed failed" });
  }
});
