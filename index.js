require("src/app/business/nav/view/leftMenu.html");
require("src/app/business/database/view/instance_database.html");
require("src/app/business/redis/view/instance_redis.html");
// require('theme/default/css/module.css');

export default function() {
  const router = require("src/app/business/nav/router/routeConfig");
  //   return new Promise((resolve, reject) => {
  //     resolve(router);
  //   });
  
  return router;
}
