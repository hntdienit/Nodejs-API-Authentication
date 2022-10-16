import express from "express";
import PromiseRouter from "express-promise-router";

import UserController from "../controllers/user.js";
import helper from "../helpers/routerHelpers.js";

// const router = express.Router();
const router = PromiseRouter();

router
  .route("/")
  .get(UserController.index)
  .post(helper.validateBody(helper.schemas.user), UserController.newUser);

router
  .route("/register")
  .post(helper.validateBody(helper.schemas.auth), UserController.registerPost);

router
  .route("/login")
  .post(helper.validateBody(helper.schemas.login), UserController.loginPost);

router.route("/secret").get(UserController.sercet);

router
  .route("/:id")
  .get(helper.validateParam(helper.schemas.id, "id"), UserController.getUser)
  .put(
    helper.validateParam(helper.schemas.id, "id"),
    helper.validateBody(helper.schemas.user),
    UserController.replaceUser
  )
  .patch(
    helper.validateParam(helper.schemas.id, "id"),
    helper.validateBody(helper.schemas.user),
    UserController.updateUser
  );

router
  .route("/:id/decks")
  .get(
    helper.validateParam(helper.schemas.id, "id"),
    UserController.getUserDecks
  )
  .post(
    helper.validateParam(helper.schemas.id, "id"),
    helper.validateBody(helper.schemas.deck),
    UserController.newUserDecks
  );

export default router;
