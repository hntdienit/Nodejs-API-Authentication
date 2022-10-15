import User from "../models/User.js";
import Deck from "../models/Deck.js";
import joi from "@hapi/joi"

const getUser = async (req, res, next) => {
  const { id } = req.value.params;
  const user = await User.findById(id);

  return res.status(200).json({ user });
};

const getUserDecks = async (req, res, next) => {
  const { id } = req.value.params;
  const user = await User.findById(id).populate("decks");

  return res.status(200).json({ deck: user.decks });
};

const index = async (req, res, next) => {
  // Callback
  // User.find({}, (err, users) => {
  //   if (err) next(err);
  //   return res.status(200).json({ users });
  // });

  // Promises
  // User.find({})
  //   .then((users) => {
  //     return res.status(200).json({ users });
  //   })
  //   .catch((err) => next(err));

  // Async/Await
  // don't need to use try-catch if use express-promise-router
  // try {
  const users = await User.find({});
  // throw new Error("loi");
  return res.status(200).json({ users });
  // } catch (err) {
  //   next(err);
  // }
};

const newUser = async (req, res, next) => {
  // create object model
  const newUser = new User(req.value.body);

  // callback
  // newUser.save((err, user) => {
  //   return res.status(201).json({ user });
  // });

  // Promises
  // newUser
  //   .save()
  //   .then((user) => {
  //     return res.status(201).json({ user });
  //   })
  //   .catch((err) => next(err));

  // Async/Await
  try {
    await newUser.save();
    return res.status(201).json({ user: newUser });
  } catch (err) {
    next(err);
  }
};

const newUserDecks = async (req, res, next) => {
  const { id } = req.value.params;
  const user = await User.findById(id);
  const newDeck = new Deck(req.body);

  newDeck.owner = user;
  await newDeck.save();

  user.decks.push(newDeck._id);
  await user.save();

  return res.status(201).json({ deck: newDeck });
};

const replaceUser = async (req, res, next) => {
  const { id } = req.value.params;
  const newUser = req.value.body;

  const result = await User.findByIdAndUpdate(id, newUser);

  return res.status(200).json({ user: result });
};

const updateUser = async (req, res, next) => {
  const { id } = req.value.params;
  const newUser = req.value.body;

  const result = await User.findByIdAndUpdate(id, newUser);

  return res.status(200).json({ user: result });
};

export default {
  getUser,
  getUserDecks,
  index,
  newUser,
  newUserDecks,
  replaceUser,
  updateUser,
};
