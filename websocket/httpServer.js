var http = require('http');
var fs = require("fs");
var url = require("url");
http.createServer(function (request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    var strObject = new Object();
    strObject.error = 0
    strObject.errMsg = "";
    strObject.data = new Array();
    console.log(strObject);
    response.writeHead(200, {'Content-Type': 'text/plain'});
    var requset_url = request.url;
    var strurl  = url.parse(requset_url,true).query;
    var pathCode = strurl.roomId;
    console.log(pathCode);
    if(pathCode){
        let pathtext = pathCode+'.txt';
        fs.exists(pathtext,(exists)=>{
            if(exists){
                
        var data = fs.readFileSync(pathCode+'.txt');
        let strData = data.toString();
        console.log(strData);
       let arrStr = strData.split(/[(\r\n)\r\n]+/);
       if(!arrStr){
            strObject.errMsg = "数据错误"; 
            strObject.error = 1000; 
            response.end(JSON.stringify(strObject));
            return false;
       }
       arrStr.forEach((arrItem) => {
        let arrItemTemp = arrItem.split(" ");
        if(arrItemTemp && arrItemTemp.length>=2){
            strObject.data.push(JSON.parse(arrItemTemp[1]));
        }
       })
        response.end(JSON.stringify(strObject));

            }
        })
    }else {
   response.end("信令不存在") 
    }
}).listen(6789);

console.log('Server running 6789/');
