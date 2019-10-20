var ws = require("nodejs-websocket")
var arguments = process.argv.splice(2);
var fs = require("fs");
var port = 8092;
if(arguments[0]) {
    
    port = arguments[0];
}
var fileName = "/home/homework/websocket/"+port+".txt";
var server = ws.createServer(function (conn) {
    conn.on('connect',function(code){
        console.log("connect success"+code); 
    
    });
    conn.on("text", function (str) {
        var objReqData = JSON.parse(str);
        console.log(objReqData);
        if(objReqData.sign_no == "35001"){
            fs.unlink(fileName,(stat)=> {
                console.log(stat) 
        
            } ) 
         
        }else{
        fs.appendFile(fileName,new Date().getTime()+" "+str+"\n",() => {});
        } 
        conn.server.connections.forEach(function(conns){
            conns.sendText(str);
        })
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed"+code)
        console.log("Connection closed"+reason)
    })
    conn.on("error", function (err) {
        console.log("handdle error");
        console.log(err);
    })
}).listen(port);


console.log("websocket server listening on port "+port);
