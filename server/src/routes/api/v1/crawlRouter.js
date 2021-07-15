import express from "express";

import objection from "objection";
const { ValidationError } = objection;

import { Auction } from "../../../models/index.js";

import scrapToDatabase from "../../../controllers/scrapToDatabase.js";

import getData from "../../../controllers/getData.js";

const crawlRouter = new express.Router();

crawlRouter.get("/", getData);

crawlRouter.get("/scrap", scrapToDatabase);

crawlRouter.get("/:id", async (req, res) => {
  const crawlId = req.params.id;
  try {
    const auction = await Auction.query().findOne({ crawlId: crawlId });
    return res.status(200).json({ auction: auction });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
});

crawlRouter.post("/", async (req, res) => {
  const address = req.body;
  try {
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(422).json({ errors: error.data });
    }

    return res.status(500).json({ errors: error });
  }
});

export default crawlRouter;
