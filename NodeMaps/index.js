const restify = require('restify');

var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAF07lX380HC6HVbZJ-AC0zEtzDuafweeE',
    Promise: Promise
});

//Conecta Mysql
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host : '127.0.0.1',
        user : 'root',
        password : '',
        database : 'nodeapi'
    }
});

const server = restify.createServer({
    name: 'NodeMaps',
    version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.get('/all', function (req, res, next) {
    knex('places').then((dados) => {
        res.send(dados);
    }, next);
    return next();
});


server.post('/geocode', function (req, res, next) {
    const {lat, lng } = req.body;

    googleMapsClient.reverseGeocode({latlng: [lat, lng]}).asPromise()
        .then((response) => {
            const address = response.json.results[0].formatted_address
            const place_id = response.json.results[0].place_id;
            const image = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=450x300&sensor=false`;

            knex('places')
                .insert({place_id, address, image})
                .then(() => {
                    res.send({place_id, address, image});
                }, next)
        })
        .catch((err) => {
            res.send(err);
        });
});




server.get(/\/(.*)?.*/,restify.plugins.serveStatic({
    directory: './dist',
    default: 'index.html',
}));


server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});
