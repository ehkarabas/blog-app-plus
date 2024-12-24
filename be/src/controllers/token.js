"use strict";

// Token Controller:
const Token = require("../models/token");
module.exports = {
  list: async (req, res) => {
    /*
      #swagger.ignore = true
    */
    const data = await res.getModelList(Token);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Token),
      result: data,
    });
  },
  create: async (req, res) => {
    /*
      #swagger.ignore = true
    */
    const data = await Token.create(req.body);
    res.status(201).send({
      error: false,
      result: data,
    });
  },
  read: async (req, res) => {
    /*
      #swagger.ignore = true
    */
    const data = await Token.findOne({ _id: req.params.tokenId });
    res.status(200).send({
      error: false,
      result: data,
    });
  },
  update: async (req, res) => {
    /*
      #swagger.ignore = true
    */
    const data = await Token.findOneAndUpdate(
      { _id: req.params.tokenId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(202).send({
      error: false,
      body: req.body,
      new: data,
    });
  },
  destroy: async (req, res) => {
    /*
      #swagger.ignore = true
    */
    const data = await Token.deleteOne({ _id: req.params.tokenId });
    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      result: data,
    });
  },
};
