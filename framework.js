export default function() {
    const framework = require('src/app/framework/framework');
    require('src/app/service/httpService');
    require('src/app/service/utilService');
    require('src/app/framework/controller/serviceCtrl');
    return new Promise((resolve, reject) => {
        resolve(framework);
    });
}