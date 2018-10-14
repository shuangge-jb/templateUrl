module.exports = {
  "GET /rest/v1.0/orders": (req, res) => {
    return res.json([
        {
          id: "order1",
          name: "myOrder666"
        },
        {
          id: "order2",
          name: "myOrder2"
        }
      ]);
  },
  "GET /rest/v1.0/instances": (req, res) => {
    return res.json([
      {
        id: "mysql",
        name: "mysql"
      },
      {
        id: "oracle",
        name: "oracle"
      }
    ]);
  }
};
