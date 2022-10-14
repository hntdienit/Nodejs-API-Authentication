const index = (req, res, next) => {
  return res.status(200).json({
    message: "you requested to user handle",
  });
};

export default { index };
