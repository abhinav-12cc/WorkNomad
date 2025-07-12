import express from "express";
import {
  submitQuery,
  getQueries,
  updateQueryStatus,
} from "../controller/Query.js";

const router = express.Router();

router.post("/submit", submitQuery);
router.get("/all", getQueries);
router.put("/update-status/:queryId", updateQueryStatus);

export default router;
