import request from '../../../api/request.js';
window.addEventListener("load",()=>{
	class Song{
		//记录歌词对象
		lyric=[];
		//歌单id
		songId;
		//记录网易云的userid
		userId;
		//滑动条
		progress
		//减小声音
		reduce;
		//加大声音
		large;
		//时间戳
		timeStamp
		//播放状态
		isplay;
		//下一首按钮
		next;
		//上一首按钮
		upper;
		//播放按钮
		songPlay;
		//播放数据
		list;
		//播放歌曲下标
		index=0;
		//播放器
		player;
		constructor(next,upper,songPlay,player,large,reduce,progress,userId) {
			this.isplay=true;
			this.player=player;
			this.next=next;
			this.upper=upper;
			this.songPlay=songPlay;
			this.large=large;
			this.reduce=reduce;
			this.progress=progress;
			this.userId=userId;
			this.handleTimeUpdate();
			this.hanleStart();
			this.handleEnd();
			this.hanleNext();
			this.hanleUpper();
			this.hanleLarger();
			this.handleReduce();
			this.handleProgress();
			this.handleProgressClick();
			this.handlePlaying();
			this.hanlePause();
			let itertot=this.handleGetsongList();
			let result=itertot.next();
			result.then(async res=>{
				this.songId=JSON.parse(res.value).playlist[0].id;
				let data=await itertot.next();
				this.list=JSON.parse(data.value).playlist.tracks;
				this.GetSong(this.list,this.index);
			})
			this.handlePlay();
		}
		//播放事件
		 handlePlay(){
			this.songPlay.addEventListener("click",()=>{
				if(this.isplay){
					this.player.pause();
				}else{
					this.player.play();
				}
			})	
		}
		//开始播放事件
		hanleStart(){
			this.player.addEventListener("loadedmetadata",(e)=>{
				this.timeStamp=e.target.duration;
				document.querySelector(".song_end").innerText=this.changeTime(this.timeStamp);
			})
		}
		//监听播放
		handlePlaying(){
			this.player.addEventListener("play",()=>{
				this.isplay=true;
				document.querySelector(".song_img").classList.add('animateRotate');
				document.querySelector(".icon-bofang") ?document.querySelector(".icon-bofang").className="iconfont icon-zanting" : '';
			})
		}
		//
		//监听暂停
		hanlePause(){
			this.player.addEventListener("pause",()=>{
				console.log(11);
				this.isplay=false;
				document.querySelector(".song_img").classList.remove(('animateRotate'));
				document.querySelector(".icon-zanting").className="iconfont icon-bofang";

			})
		}
		//持续播放事件
		handleTimeUpdate(){
			//监听持续播放事件
			this.player.addEventListener("timeupdate",(e)=>{

				let obj=this.lyric.find(item=>Math.floor(e.target.currentTime * 1000)/1000<=item.time);
				let text=this.lyric.find(item=>obj.time<=item);
				console.log(text);
				document.querySelector(".song_lyric").innerText=obj.text;
				let move=Math.floor(350 * (e.target.currentTime / this.timeStamp));
				document.querySelector(".progress").style.width=`${move}px`;
				document.querySelector(".radius").style.left=`${move}px`;
				document.querySelector(".song_start").innerText=this.changeTime(e.target.currentTime);
			})
		}
		//监听播放结束
		handleEnd(){
			//ended播放结束
			this.player.addEventListener("ended",()=>{
				this.isplay=false;
				this.next.click();
			})
		}
		//点击下一首
		hanleNext(){
			this.next.addEventListener("click",()=>{
				this.index++;
				if(this.index>=this.list.length){
					this.index=0;
				}
				this.isplay=false;
				this.GetSong(this.list,this.index);
			})
		}
		//点击上一首
		hanleUpper(){
			this.upper.addEventListener("click",()=>{
				this.index--;
				if(this.index<0){
					this.index=this.list.length-1;
				}
				this.isplay=false;
				this.GetSong(this.list,this.index);
			})
		}
		//加大声音
		hanleLarger(){
			this.large.addEventListener("click",()=>{
				if(this.player.volume>0.9){
					alert("已经是最大声");
					this.player.volume
				}else{
				this.player.volume+=0.1;
				}
			})
		}
		//减小声音
		handleReduce(){
			this.reduce.addEventListener("click",()=>{
				if(this.player.volume<0.1){
					alert("静音");
					this.player.volume=0;
				}else{
					this.player.volume-=0.1;

				}
				
				
			})
		}
		//将歌曲给页面
		async GetSong(value,index){
			// this.player.src=value[index].src;
			if(value){
			console.log(value[index].id);
			this.muiscId=value;
			let p1=this.handleLyric(value[index].id);
			let p2=this.handleGetUrl(value[index].id);
			Promise.all([p1,p2]).then(res=>{
				// console.log(JSON.parse(res[0]).lrc.lyric);
				this.player.src=JSON.parse(res[1]).data[0].url;
				this.changeLyric(JSON.parse(res[0]).lrc.lyric);
				if(!JSON.parse(res[0]).lrc.lyric){
					document.querySelector(".song_lyric").innerText="暂无歌词"
				}
				console.log(JSON.parse(res[0]).lrc.lyric);
				document.querySelector(".song_name").innerHTML=value[index].name;
				document.querySelector(".song_img").src=value[index].al.picUrl;
				document.querySelector(".song_author").innerText="";
				value[index].ar.forEach(value=>{
					document.querySelector(".song_author").innerText+= value.name;
				})
				this.songPlay.click();
			})
		
		
			}
		}
		//滑动进度事件
		handleProgress(){
			this.progress.addEventListener("click",(e)=>{
				this.progress.addEventListener("mousemove",(event)=>{
					// console.log(event);
					let seek=event.movementX;
					// console.log(seek);
				})
			})
			// this.progress.removeEventListener("mousemove");
		}
		//点击进度条事件
		handleProgressClick(){
			this.progress.addEventListener("click",(e)=>{
				let left=e.offsetX;
				let seek=this.timeStamp*(left / 360);
				this.player.currentTime=seek;
			})
		}
		//时间转化
		changeTime(value){
			let mm=Math.floor((value) / 60);
			let ss=Math.ceil(value) % 60;
			if(mm<1){
				mm='00';
			}else{
				mm=`0${mm}`;
			}
			if(ss<10){
				ss=`0${ss}`
			}
			return `${mm}:${ss}`;
		}

		//转化分钟
		changeMs(value,ms){
			let time=value.split(":");
			let minute=time[0];
			let second=time[1];
			let sum=parseInt(minute*60)+second*1+ms*1;
			console.log(sum);
			return sum;
		}
		//请求网易云音乐事件
		async * handleGetsongList(){
			yield await request("/user/playlist",`uid=${this.userId}`);
			yield await request("/playlist/detail",`id=${this.songId}`)

		}
		//获取播放地址
		 handleGetUrl(value){
			let result=request("/song/url",`id=${value}`);
			return result;
		}
		//获取歌词
		handleLyric(value){
			let result=request("/lyric",`id=${value}`);
			return result;
		}
		//抽离歌词
		changeLyric(value){
			let arr=value.split(/\n/);
			this.lyric=[];
			arr.forEach((value,index)=>{
				let data=value.split("]")[0];
				let ms=data.slice(1).split(".")[1];
				let data1=data.slice(1).split(".")[0];
				this.lyric.push({
					time:this.changeMs(data1,ms),
					text:value.split("]")[1],
				});
			})
		}


	
		
			
	}
	let userId;
	let progress=document.querySelector(".song_progress");
	let larger=document.querySelector(".icon-yinliangjia");
	let reduce=document.querySelector(".icon-yinliangjian");
	let mp3=document.querySelector("audio");
	let songPlay=document.querySelector(".icon-bofang");
	let next=document.querySelector(".icon-icon-");
	let upper=document.querySelector(".icon-icon-1");
		if(localStorage.getItem("userId")){
			userId=localStorage.getItem("userId")
		}else{
		let result=Login()
		result.then(res=>{
			userId=JSON.parse(res).profile.userId;
			localStorage.setItem("userId",userId);
		})
		}
		const song=new Song(next,upper,songPlay,mp3,larger,reduce,progress,userId);

	async function Login(){
		let result=await request("/login/cellphone","phone=15960165171&&password=zyz123..");
		return result;
	}
	
})