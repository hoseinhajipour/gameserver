var express=require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);
var colors=require('colors');
var UserID=0;
var Clients=[];

io.on('connection',function(socket){
    var currentUser;
     socket.on("Connect",function(data){
        console.log("USER CONNECTED!".blue); 
         socket.emit("Connect",{name:data.name});
           for(var i=0; i<Clients.length; i++){
            socket.emit("LIST",{
                id:Clients[i].id,name:Clients[i].name,position:Clients[i].position});
        }
         
     });
    socket.on("SENDLIST",function(){
        for(var i=0; i<Clients.length; i++){
        socket.emit("GETLIST",{name:Clients[i].name,id:Clients[i].id});
    }
    });
    socket.on("PLAY",function(data){
        UserID+=1;
        currentUser={
            id:UserID,
            name:data.name,
            position:data.position,
            rotation:data.rotation,
            firepos:data.firepos,
            firerot:data.firerot,
            guntype:data.guntype,
            bulletSpeed:data.bulletSpeed
        }
      
        Clients.push(currentUser);
        
    console.log("User:".green+currentUser.name.red+" Joined To game!".green);
              socket.emit("PLAY",currentUser);
        socket.broadcast.emit("OTHERPLAY",currentUser);
              });
    socket.on("MOVING",function(data){
       // console.log(data);
        if(data!=null){
            currentUser.position=data.position;
            currentUser.rotation=data.rotation;
            socket.broadcast.emit("MOVING",currentUser);
        }
       
    });

    socket.on("SHOOTING",function(data){
        console.log("user : "+data.id +" SHOOTING");
        if(data!=null){
            currentUser.firepos=data.firepos;
            currentUser.firerot=data.firerot;
            currentUser.bulletSpeed=data.bulletSpeed;
            socket.broadcast.emit("SHOOTING",currentUser);
        }
       
    });

      socket.on("disconnect",function(){
           console.log("USER:"+ currentUser.name.red+"Left The Game!");
      for(var i=0; i<Clients.length; i++){
            if(Clients[i].id===currentUser.id){
                socket.broadcast.emit("LEFTTHESERVER",Clients[i]);
               Clients.splice(i,1);
               
               }
        }
      });
      });


app.set('port',process.env.PORT || 3000);
server.listen(app.get('port'),function(){
    console.log("WELCOME TO SERVER!".yellow);
    setTimeout(function(){
        console.log("SERVER IS ONLINE!".green);
    },1000);
    
    
});
