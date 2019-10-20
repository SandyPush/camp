var ws = require("nodejs-websocket")
var arguments = process.argv.splice(2);
var fs = require("fs");
var port = 6089;
//var fileName = "/home/homework/websocket/"+port+".txt";
var roomConnList = new Object;
var server = ws.createServer(function (conn) {
    var reqStr = "";
    var roomId = 0;
    conn.on("text", function (str) {
        
        console.log(conn.key)
        reqStr = str; 
        var objReqData = JSON.parse(str);
        console.log(objReqData);
       if(!objReqData.room_id){
         return false; 
       }
         roomId = objReqData.room_id;
        var fileName = "/home/homework/websocket/"+roomId+".txt";
        console.log("fileName:--"+fileName);
       //roomConnList = {[roomId]:{[conn.key]:conn}};
       if(objReqData.sig_no == 10000) {
       if( roomConnList[roomId] == undefined){
            roomConnList[roomId] = new Object;
       }
        roomConnList[roomId][conn.key] = conn;
        conn.sendText("加入房间成功，当前房间号："+roomId);
        return "";
        }
//        console.log(roomConnList);
        if(objReqData.sig_no == "35001"){
            fs.unlink(fileName,(stat)=> {
                console.log(stat) 
            } ) 
         
        }
        fs.appendFile(fileName,new Date().getTime()+" "+str+"\n",() => {});
        //发送消息
//console.log( roomConnList);
        if(roomConnList[roomId] == undefined || roomConnList[roomId][conn.key]==undefined){
            conn.sendText("请先加入房间");
            return false;
        }
       Object.keys(roomConnList[roomId]).forEach((connItem)=>{

           roomConnList[roomId][connItem].sendText(str);
       // connItem.server.connections.forEach(function(conns){
       //     conns.sendText(str);
       // })
       }) 
    })
    conn.on("close", (code, reason) => {
        console.log("str "+conn)
       delete roomConnList[roomId][conn.key];
    })
    conn.on("error", function (err) {
        delete roomConnList[roomId][conn.key];
        console.log("handdle error");
        console.log(err);
    })
}).listen(port);
console.log("websocket server listening on port "+port);
