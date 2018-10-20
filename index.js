// Start express app

var express = require('express'),
  path = require('path'),
  app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var server_port = 3000;

//set the port
app.set('port', server_port);

//tell express that we want to use the www folder
//for our static assets
app.use(express.static(path.join(__dirname, './public')));

http.listen(server_port, function(){
  console.log('listening on : ' + server_port);
});

// Listen for connections
io.on('connection', (sock) => {
    console.log('User connected!')
})

function updateClients(seats) {
    io.emit('update', seats)
}

// Monitor the database for updates

var Cloud = require('./cloud')

var pollInterval = 2000 // poll database every

setInterval(() => {
    Cloud.poll((res) => {
        if (res == null) {
            console.error("Null result! What do?")
            return
        }

        console.log(res)

        // Simulate the sensors array
        sensors = []

        sensors.push({
            'type': 'force',
            'value': res.payload.d.Force,
            //'loc': [43.659634, -79.397399]
            'loc': [43.659606, -79.397350]
        })

        sensors.push({
            'type': 'temp',
            'value': res.payload.d.Temp,
            'loc': [43.659612, -79.397291]
        })

        // Create an seat array
        seats = sensors.map(sensor => {
            switch (sensor.type) {
                case 'force':
                    return {
                        'loc': sensor.loc,
                        'active': sensor.value > 50
                    }
                case 'temp':
                    return {
                        'loc': sensor.loc,
                        'active': sensor.value > 28
                    }
            }
        })

        // Add some fake seats

        seats.push({'loc': [43.659704, -79.397270], 'active': false})
        seats.push({'loc': [43.659710, -79.397321], 'active': false})
        seats.push({'loc': [43.659326, -79.397541], 'active': false})
        seats.push({'loc': [43.659330, -79.397573], 'active': false})
        seats.push({'loc': [43.659330, -79.397594], 'active': false})
        seats.push({'loc': [43.659334, -79.397624], 'active': false})
        seats.push({'loc': [43.659592, -79.397737], 'active': false})
        seats.push({'loc': [43.659631, -79.397753], 'active': false})
        seats.push({'loc': [43.659683, -79.397756], 'active': false})

        seats.push({'loc': [43.659955, -79.397004], 'active': false})
        seats.push({'loc': [43.659869, -79.396967], 'active': false})
        seats.push({'loc': [43.659824, -79.396935], 'active': false})
        seats.push({'loc': [43.659783, -79.396926], 'active': true})
        seats.push({'loc': [43.659750, -79.396910], 'active': true})

        updateClients(seats)
    })
}, pollInterval)