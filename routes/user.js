import express from "express";
import PromiseRouter from "express-promise-router";
import passport from "passport";

import UserController from "../controllers/user.js";
import helper from "../helpers/routerHelpers.js";
import "../middlewares/passport.js";

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
  .route("/auth/google")
  .post(
    passport.authenticate("google-plus-token", { session: false }),
    UserController.authGoogle
  );

router
  .route("/auth/facebook")
  .post(
    passport.authenticate("facebook-token", { session: false }),
    UserController.authFacebook
  );

router
  .route("/login")
  .post(
    helper.validateBody(helper.schemas.login),
    passport.authenticate("local", { session: false }),
    UserController.loginPost
  );

router
  .route("/secret")
  .get(passport.authenticate("jwt", { session: false }), UserController.sercet);

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
