const express = require("express");
const morgan = require("morgan");
module.exports = {
  mock: app => {
    // app.use(express.logger());
    app.use(morgan(":method :url :status"));
    app.get("/rest/v1.0/instances", function(req, res) {
      res.json([
        {
          id: "mysql",
          name: "mysql"
        },
        {
          id: "oracle",
          name: "oracle"
        }
      ]);
    });
  }
};
