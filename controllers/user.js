import User from "../models/User.js";
import Deck from "../models/Deck.js";
import jwt from "jsonwebtoken";

const endCode = (userID) => {
  return jwt.sign(
    {
      iss: "ThanhDien",
      sub: userID,
      iat: new Date().setTime(),
      exp: new Date().setDate(new Date().getDate() + 3),
    },
    process.env.JWT_SECRET
  );
};

const authFacebook = async (req, res, next) => {
  const token = endCode(req.user._id);
  res.setHeader("Authorization", token);
  return res.status(200).json({ Authorization: true });
};

const authGoogle = async (req, res, next) => {
  const token = endCode(req.user._id);
  res.setHeader("Authorization", token);
  return res.status(200).json({ Authorization: true });
};

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

const loginPost = async (req, res, next) => {
  const token = endCode(req.user._id);
  res.setHeader("Authorization", token);
  return res.status(200).json({ Authorization: true });
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

const registerPost = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.value.body;

  const foundUser = await User.findOne({ email });
  if (foundUser)
    return res.status(403).json({ error: "email is already in use!" });

  const newUser = new User({ firstName, lastName, email, password });
  await newUser.save();

  // endcode
  const token = endCode(newUser._id);
  res.setHeader("token", token);

  return res.status(201).json({ newUser });
};

const sercet = async (req, res, next) => {
  return res.status(200).json({ resources: true });
};

const updateUser = async (req, res, next) => {
  const { id } = req.value.params;
  const newUser = req.value.body;

  const result = await User.findByIdAndUpdate(id, newUser);

  return res.status(200).json({ user: result });
};

export default {
  authFacebook,
  authGoogle,
  getUser,
  getUserDecks,
  index,
  loginPost,
  newUser,
  newUserDecks,
  replaceUser,
  registerPost,
  sercet,
  updateUser,
};
