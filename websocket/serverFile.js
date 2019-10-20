var ws = require("nodejs-websocket")
var arguments = process.argv.splice(2);
var fs = require("fs");
var port = 7089;
var fileName = "/home/homework/websocket/";
var roomConnList = new Object;
var server = ws.createServer(function (conn) {
    var reqStr = "";
    conn.on("text", function (str) {
        reqStr = str; 
        var objReqData = JSON.parse(str);
        console.log(objReqData);
       if(!objReqData.room_id){
         return false; 
       }
        let roomId = objReqData.room_id;
        var filePath = fileName+roomId+".txt";
       if(objReqData.sig_no == 10000) {
       if( roomConnList[roomId] == undefined){
            roomConnList[roomId] = new Object;
       }
        roomConnList[roomId][conn.key] = conn;
        conn.sendText("加入房间成功，当前房间号："+roomId);
        return "";
        }
        console.log(roomConnList);
        if(objReqData.sig_no == "35001"){
            fs.unlink(filePath,(stat)=> {
                console.log(stat) 
            }) 
        }
        fs.appendFile(filePath,new Date().getTime()+" "+str+"\n",() => {});
        
        //发送消息
        if(roomConnList[roomId] == undefined || roomConnList[roomId][conn.key]==undefined){
            conn.sendText("请先加入房间");
            return false;
        }
       Object.keys(roomConnList[roomId]).forEach((connItem)=>{
        roomConnList[roomId][connItem].sendText(str);
       }) 
    })
    conn.on("close", (code, reason) => {
        console.log("str "+reqStr)
        console.log("Connection closed "+reason)
        console.log("Connection closed "+reason)
    })
    conn.on("error", function (err) {
        console.log("handdle error");
        console.log(err);
    })
});
server.listen(port);
console.log("websocket server listening on port "+port);
