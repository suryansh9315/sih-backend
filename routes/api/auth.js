const express = require("express");
const dotenv = require("dotenv").config();
const { sign_jwt } = require("../../utils/jwt_helpers");
const { verifyToken } = require("../../middlewares/auth");
const { mongoClient } = require("../../database");

const database = mongoClient.db("infoLex");
const clients = database.collection("client");
const admins = database.collection("admin");
const providers = database.collection("provider");
const app = express.Router();

app.post("/login-client", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ status: "error", message: "Missing fields for Login..." });
  }
  const email = req.body.email;
  const password = req.body.password;
  const query = { email };
  const client = await clients.findOne(query);
  if (!client) {
    return res.status(400).json({
      status: "error",
      message: "User with this email doesn't exist.",
    });
  } else {
    if (client.password === password) {
      const token = sign_jwt({ id: client._id });
      return res.status(200).json({
        status: "success",
        message: "Logged In...",
        token,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Wrong Password.",
      });
    }
  }
});

app.post("/register-client", async (req, res) => {
  if (!req.body.email || !req.body.name || !req.body.password) {
    return res
      .status(400)
      .json({ status: "error", message: "Missing fields for Registration..." });
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const query = { email };
  const client = await clients.findOne(query);
  if (client) {
    return res.status(400).json({
      status: "error",
      message: "User with this email already exists.",
    });
  }
  // Hash the password before uploading it to Database
  const clientObject = {
    email,
    name,
    password,
    verified: false,
  };
  const newClient = await clients.insertOne(clientObject);
  res.status(200).json({
    status: "success",
    message: "Client created.",
  });
});

app.post("/login-provider", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ status: "error", message: "Missing fields for Login..." });
  }
  const email = req.body.email;
  const password = req.body.password;
  const query = { email };
  const provider = await providers.findOne(query);
  if (!provider) {
    return res.status(400).json({
      status: "error",
      message: "Provider with this email doesn't exist.",
    });
  } else {
    if (provider.password === password) {
      const token = sign_jwt({ id: provider._id });
      return res.status(200).json({
        status: "success",
        message: "Logged In...",
        token,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Wrong Password.",
      });
    }
  }
});

app.post("/register-provider", async (req, res) => {
  if (
    !req.body.email ||
    !req.body.name ||
    !req.body.password ||
    !req.body.type
  ) {
    return res
      .status(400)
      .json({ status: "error", message: "Missing fields for Registration..." });
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const type = req.body.type;
  const query = { email };
  const provider = await providers.findOne(query);
  if (provider) {
    return res.status(400).json({
      status: "error",
      message: "Provider with this email already exists.",
    });
  }
  // Hash the password before uploading it to Database
  const providerObject = {
    email,
    name,
    password,
    verified: false,
    type,
  };
  const newProvider = await clients.insertOne(providerObject);
  res.status(200).json({
    status: "success",
    message: "Provider created.",
  });
});

app.post("/login-admin", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ status: "error", message: "Missing fields for Login..." });
  }
  const email = req.body.email;
  const password = req.body.password;
  const query = { email };
  const admin = await admins.findOne(query);
  if (!admin) {
    return res.status(400).json({
      status: "error",
      message: "Admin with this email doesn't exist.",
    });
  } else {
    if (admin.password === password) {
      const token = sign_jwt({ id: admin._id });
      return res.status(200).json({
        status: "success",
        message: "Logged In...",
        token,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Wrong Password.",
      });
    }
  }
});

module.exports = app;
