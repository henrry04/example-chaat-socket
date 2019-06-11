const { io } = require('./app');
const fs = require('fs')

var users = [];

io.on('connection', (client) => {
    //users = [];
    console.log("client: " + client.id);
    
    client.on('add user', (data) => {
        console.log("add user: " + data)
        let jsonData = {id: client.id, username: data}
        var exist = false;
        users.forEach(function (user){
            if(user.id == client.id)
                exist = true;
        })
        if(!exist)
            users.push(jsonData);
        console.log("users array 1: " + JSON.stringify(users))
        // Se convierte la variable a un objeto json
        /*let jsonDataString = JSON.stringify(jsonData)
        // Se escribe dentro del archivo json  la variable 
        fs.appendFileSync('./server/users.json', jsonDataString)*/
        if(data != null){
            client.emit('login', {
                numUsers: users.length
            })
            client.broadcast.emit('user joined', {
                numUsers: users.length,
                username: data
            })
        }
    })
    
    client.on('typing', (data) => {
        
    })
    
    client.on('new message', (message) => {
        var username;
        users.forEach(function (user){
            if(user.id == client.id)
                username = user.username;
        })
        client.broadcast.emit('new message', {
            username: username,
            message: message
        })
    })
    
    client.on('typing', (typing) => {
        var username;
        users.forEach(function (user){
            if(user.id == client.id)
                username = user.username;
        })
        client.broadcast.emit('typing', {
            username: username
        })
    })
    
    client.on('stop typing', (stop) => {
        var username;
        users.forEach(function (user){
            if(user.id == client.id)
                username = user.username;
        })
        client.broadcast.emit('stop typing', {
            username: username
        })
    })
    
    client.on('disconnect', (dis) => {
        var pos = 0;
        var userdis;
        users.forEach(function (user, i){
            if(user.id == client.id){
                pos = i
                userdis = user.username
            }
        })
        users.splice(pos, 1);
        console.log("users array 2: " + JSON.stringify(users))
        client.broadcast.emit('user left', {
            numUsers: users.length,
            username: userdis
        })
    })

});