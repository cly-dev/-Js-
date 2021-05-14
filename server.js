const express=require("express");
const path=require("path");

const app=express();
app.use(express.static(path.join(__dirname,"www")));
app.all("/",(res,req)=>{
    req.send("你好");
})
app.listen(3000,()=>{
    console.log("服务器开启成功");
})