import express from "express";
import PromiseRouter from "express-promise-router";

import DeckController from "../controllers/deck.js";
import helper from "../helpers/routerHelpers.js";

// const router = express.Router();
const router = PromiseRouter();

router
  .route("/")
  .get(DeckController.index)
  .post(helper.validateBody(helper.schemas.newDeck), DeckController.newDeck);

router
  .route("/:id")
  .get(helper.validateParam(helper.schemas.id, "id"), DeckController.getDeck)
  .put(
    helper.validateParam(helper.schemas.id, "id"),
    helper.validateBody(helper.schemas.newDeck),
    DeckController.replaceDeck
  )
  .patch(
    helper.validateParam(helper.schemas.id, "id"),
    helper.validateBody(helper.schemas.newDeck),
    DeckController.updateDeck
  )
  .delete(
    helper.validateParam(helper.schemas.id, "id"),
    DeckController.deleteDeck
  );

export default router;
