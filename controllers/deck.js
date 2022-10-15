import User from "../models/User.js";
import Deck from "../models/Deck.js";

const deleteDeck = async (req, res, next) => {
  const { id } = req.value.params;

  /* get a deck */
  const deck = await Deck.findById(id);
  const ownerId = deck.owner;

  /* get a owner */
  const owner = await User.findById(ownerId);

  /* remove the deck */
  await deck.remove();

  /* remove deck from owner's deck list */
  owner.decks.pull(deck);
  await owner.save();

  return res.status(200).json({ success: true });
};

const getDeck = async (req, res, next) => {
  const decks = await Deck.findById(req.value.params.id);
  return res.status(200).json({ decks });
};

const index = async (req, res, next) => {
  const decks = await Deck.find({});
  return res.status(200).json({ decks });
};

const newDeck = async (req, res, next) => {
  const owner = await User.findById(req.value.body.owner);

  const deck = req.value.body;
  delete deck.owner;

  deck.owner = owner._id;
  const newDeck = new Deck(deck);
  await newDeck.save();

  owner.decks.push(newDeck._id);
  await owner.save();
  return res.status(201).json({ deck: newDeck });
};

const replaceDeck = async (req, res, next) => {
  const { id } = req.value.params;
  const newDeck = req.value.body;
  const result = await Deck.findByIdAndUpdate(id, newDeck);

  /* check put user, remove deck in user model */
  return res.status(200).json({ success: true });
};

const updateDeck = async (req, res, next) => {
  const { id } = req.value.params;
  const newDeck = req.value.body;
  const result = await Deck.findByIdAndUpdate(id, newDeck);
  return res.status(200).json({ success: true });
};

export default {
  deleteDeck,
  getDeck,
  index,
  newDeck,
  replaceDeck,
  updateDeck,
};
