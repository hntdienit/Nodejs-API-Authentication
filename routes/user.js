import express from "express";

import UserController from "../controllers/user.js";

const router = express.Router();

router.route('/')
    .get(UserController.index)
    .post()
    .patch()
    .put()
    .delete()

export default router