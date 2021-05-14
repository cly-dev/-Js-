import host from "../config/host.js";
	
    //发送请求事件
   export default(url,data,type="GET")=>{
        const promise=new Promise((resolve,reject)=>{
        const xhr=new XMLHttpRequest;
        xhr.open(type,`${host.baseUrl}${url}?${data}`);
        if(type=="GET"){
        xhr.send();
        }else if(type=="POST"){
            xhr.setRequestHeader("Content-Type","application/json");
            xhr.send(data);
        }
        xhr.onload=()=>{
            if(xhr.status=="200" && xhr.readyState==4){
                 resolve(xhr.responseText);
            }else{
                reject(new Error("请求失败"));
            }

        }
    })
    return promise;

    }
