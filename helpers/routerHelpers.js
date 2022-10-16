import joi from "@hapi/joi";

const validateBody = (schema) => {
  return (req, res, next) => {
    const validatorResult = schema.validate(req.body);
    if (validatorResult.error) {
      return res.status(400).json(validatorResult.error);
    } else {
      if (!req.value) req.value = {};
      req.value.body = validatorResult.value;
      next();
    }
  };
};

const validateParam = (schema, name) => {
  return (req, res, next) => {
    const validatorResult = schema.validate({ param: req.params[name] });

    if (validatorResult.error) {
      return res.status(400).json(validatorResult.error);
    } else {
      if (!req.value) req.value = {};
      if (!req.value["params"]) req.value.params = {};
      req.value.params[name] = req.params[name];
      next();
    }
  };
};

const schemas = {
  deck: joi.object().keys({
    name: joi.string().min(6).required(),
    description: joi.string().min(10).required(),
  }),

  id: joi.object().keys({
    param: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),

  login: joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  }),

  newDeck: joi.object().keys({
    name: joi.string().min(6).required(),
    description: joi.string().min(10).required(),
    owner: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),

  auth: joi.object().keys({
    firstName: joi.string().min(2).required(),
    lastName: joi.string().min(2).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  }),

  user: joi.object().keys({
    firstName: joi.string().min(2).required(),
    lastName: joi.string().min(2).required(),
    email: joi.string().email().required(),
  }),
};

export default { validateParam, validateBody, schemas };
