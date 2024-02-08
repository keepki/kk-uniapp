<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @click="backto">
				<image src="../../static/usermain/back.png"></image>
				
			</view>
			<view class="top-bar-center" v-if="type==0">
				{{fname}}
			</view>
			<view class="top-bar-center" v-if="type==1">
				群:{{groupDetial.name}}
			</view>
			<view class="top-bar-right">
				<view class="grop-img" v-if='type==1' @click="goGroupHome">
					<image :src="groupDetial.imgurl + '?t=' + new Date().getTime()"></image>
				</view>
			</view>
		</view>
		<scroll-view class="chat" scroll-y="true" :scroll-into-view="scrollToView" :scroll-with-animation="swanition"
			@scrolltoupper="nextPage">
			<view class="chat-main" :style="{paddingBottom:inputh+'px'}">
				<view class="loading" :class="{displaynone:isloading}">
					<image src="../../static/img/loadiing.png" mode="" class="loading-img" :animation="animationData">
					</image>
				</view>
				
				<!-- 一对一消息 -->
				<view class="chat-ls" v-for="(item,index) in msgs" :key="index" :id="'msg'+item.id" v-if="type==0">
					<view class="chat-time" v-if="item.time!=''">{{changetime(item.time)}}</view>
					<view class="msg-m msg-left" v-if="item.fromId !=uid">
						<image :src="item.imgurl" class="user-img" @click="goUserHome(item.fromId)"></image>
						<!-- 文字 -->
						<view class="message" v-if="item.types==0">
							<view class="msg-text">{{item.message}}</view>
						</view>

						<!-- 图片 -->
						<view class="message" v-if="item.types==1">
							<image :src="item.message" class="left-img" mode="widthFix"
								@click="previewImg(item.message)"></image>
						</view>
						<!-- 音频 -->
						<view class="message" v-if="item.types==2">
							<view @click="playVoice(item.message.voice)" class="msg-text voice"
								:style="{width:item.message.time*4+'px'}">
								<image src="../../static/yingping.png" class="voice-img"></image>
								{{item.message.time}}"
							</view>
						</view>
						<!-- 位置 -->
						<view class="message" v-if="item.types==3">
							<view class="msg-map" @click="openLocation(item.message)">
								<view class="map-name">{{item.message.name}}</view>
								<view class="map-address">{{item.message.address}}</view>
								<!-- <map class="map" :markers="covers(item.message)" :latitude="item.message.latitude" :longitude="item.message.longitude"></map> -->
								<image src='../../static/ditu.png' mode="aspectFill" class="map-img"></image>
							</view>
						</view>
						<!-- 视频 -->
						<view class="message" v-if="item.types==4">
							<video :src="item.message" class="video"></video>
						</view>
					</view>

					<view class="msg-m msg-right" v-if="item.fromId ==uid">
						<image :src="item.imgurl" class="user-img" @click="goUserHome(uid)"></image>
						<view class="message" v-if="item.types==0">
							<view class="msg-text">{{item.message}}</view>
						</view>
						<view class="message" v-if="item.types==1">
							<image :src="item.message" class="right-img" mode="widthFix"
								@click="previewImg(item.message)"></image>
						</view>
						<view class="message" v-if="item.types==2">
							<view @click="playVoice(item.message.voice)" class="msg-text voice"
								:style="{width:item.message.time*4+'px'}">
								{{item.message.time}}"
								<image src="../../static/yingping.png" class="voice-img"></image>
							</view>
						</view>
						<view class="message" v-if="item.types==3">
							<view class="msg-map" @click="openLocation(item.message)">
								<view class="map-name">{{item.message.name}}</view>
								<view class="map-address">{{item.message.address}}</view>
								<image src='../../static/ditu.png' mode="aspectFill" class="map-img"></image>
								<!-- <map class="map" :markers="covers(item.message)" :latitude="item.message.latitude" :longitude="item.message.longitude"></map> -->
							</view>
						</view>
						<!-- 视频 -->
						<view class="message" v-if="item.types==4">
							<video :src="item.message" class="video"></video>
						</view>
					</view>
				</view>
				
				<!-- 群消息 -->
				<view class="chat-ls" v-for="(item,index) in msgs" :key="index" :id="'msg'+item.id" v-if="type==1">
					<view class="chat-time" v-if="item.time!=''">{{changetime(item.time)}}</view>
					<view class="msg-m msg-left" v-if="item.userID !=uid">
						<view class="sender" v-if="item.userID !=uid" >{{item.sender}}</view>
						<image :src="item.imgurl" class="user-img" @click="goUserHome(item.fromId)"></image>
						<!-- 文字 -->
						<view class="message" v-if="item.types==0">
							<view class="msg-text">{{item.message}}</view>
						</view>
				
						<!-- 图片 -->
						<view class="message" v-if="item.types==1">
							<image :src="item.message" class="left-img" mode="widthFix"
								@click="previewImg(item.message)"></image>
						</view>
						<!-- 音频 -->
						<view class="message" v-if="item.types==2">
							<view @click="playVoice(item.message.voice)" class="msg-text voice"
								:style="{width:item.message.time*4+'px'}">
								<image src="../../static/yingping.png" class="voice-img"></image>
								{{item.message.time}}"
							</view>
						</view>
						<!-- 位置 -->
						<view class="message" v-if="item.types==3">
							<view class="msg-map" @click="openLocation(item.message)">
								<view class="map-name">{{item.message.name}}</view>
								<view class="map-address">{{item.message.address}}</view>
								<!-- <map class="map" :markers="covers(item.message)" :latitude="item.message.latitude" :longitude="item.message.longitude"></map> -->
								<image src='../../static/ditu.png' mode="aspectFill" class="map-img"></image>
							</view>
						</view>
						<!-- 视频 -->
						<view class="message" v-if="item.types==4">
							<video :src="item.message" class="video"></video>
						</view>
					</view>
				
					<view class="msg-m msg-right" v-if="item.userID ==uid">
						<image :src="item.imgurl" class="user-img" @click="goUserHome(uid)"></image>
						<view class="message" v-if="item.types==0">
							<view class="msg-text">{{item.message}}</view>
						</view>
						<view class="message" v-if="item.types==1">
							<image :src="item.message" class="right-img" mode="widthFix"
								@click="previewImg(item.message)"></image>
						</view>
						<view class="message" v-if="item.types==2">
							<view @click="playVoice(item.message.voice)" class="msg-text voice"
								:style="{width:item.message.time*4+'px'}">
								{{item.message.time}}"
								<image src="../../static/yingping.png" class="voice-img"></image>
							</view>
						</view>
						<view class="message" v-if="item.types==3">
							<view class="msg-map" @click="openLocation(item.message)">
								<view class="map-name">{{item.message.name}}</view>
								<view class="map-address">{{item.message.address}}</view>
								<image src='../../static/ditu.png' mode="aspectFill" class="map-img"></image>
								<!-- <map class="map" :markers="covers(item.message)" :latitude="item.message.latitude" :longitude="item.message.longitude"></map> -->
							</view>
						</view>
						<!-- 视频 -->
						<view class="message" v-if="item.types==4">
							<video :src="item.message" class="video"></video>
						</view>
					</view>
				</view>
			</view>
			<!-- <view class="padbt"></view> -->
		</scroll-view>
		<submit @inputs='inputs' @height='height' @hangups='callRemote'></submit>
		
		<view class="call-interface" v-if=phone>
			<image :src="fimgurl" mode="aspectFill" class="caller-img" @click="cancel" ></image>
			<image :src="fimgurl" mode="aspectFill" class="calledimg" v-if="called && calling"></image>
			<view class="video" >
				<video ref="localVideo" src="" class="localVideo" id="localVideo" :controls="false" autoplay playsinline></video>
				<video ref="remoteVideo" src="" class="remoteVideo" :controls="false" ></video>
			</view>			
			<view class="control-box">
				<view class="caller" v-if='caller && calling'>
					<p class="text" style="color:white;">正在等待对方接听</p>
					<button @click="cancel" class="call-btn" >挂断</button>
				</view>
				
				<view class="called" v-if="called && calling" style="width: 100%;">					
				<p style="color:white;text-align: center; margin-bottom: 30rpx;">收到视频请求</p>
					<view class="box" style=" display: flex; flex-direction: row; justify-content: space-evenly;align-items: center;">
						<button @click="asceptCall" class="call-btn" >接听</button>
						<button @click="cancel" class="call-btn">挂断</button>
					</view>
				</view>
			</view>
			<view class="communitonbox" v-if="communication">
				<button @click="cancel" class="call-btn">挂断</button>
			</view>
		</view>
	</view>
</template>

<script>
	import datas from '../../commons/js/dadas.js'
	import myfun from '../../commons/js/mytime.js'
	import submit from "../../components/submit/submit.vue"
	// const innerAudioContext = uni.createInnerAudioContext();
	export default {
		data() {
			return {
				msgs: [],
				imgMsg: [],
				oldTime: 0,
				scrollToView: '',
				inputh: '60',
				animationData: {},
				nowpage: 0,
				loading: '',
				isloading: true,
				swanition: true,
				beginloading: true,
				groupDetial:[],

				uid: '',
				imgurl: '',
				token: '',
				uname: '',
				fid: '',
				fname: '',
				type: '',
				fimgurl: '',
				uimgurl: '',
				pagesize: 10,
				
				phone:false,
				caller:false,
				called:false,
				calling:false,
				control:false,
				audioElement:'',
				localStream:'',
				pree:'',
				communication:false//是否开始通话
				
			};
		},
		onLoad: function(e) {
			
			this.fid = e.id
			this.type = e.type
			//群图片以及群名称使用实时获取的方式
			this.fimgurl = e.img
			this.fname = e.name
			this.getStorages()
			// this.getMsg(1)
			if(this.type==0){
				this.getMsg1()
			}else{
				this.getGroupMsg()
			}
			this.receiveSocketMsg()
			this.receiveGroupSocketMsg()
			// this.nextPage()
		},
		mounted:function(){
			this.join(this.uid)
			if(this.type==1){
				this.getGroupDetial()
			}
			uni.$on('update',(data)=>{
				if(this.type==0){
					this.getMsg1()
				}else{
					// this.getGroupMsg()
					this.getGroupDetial()
				}
			})
		},
		components: {
			submit
		},
		methods: {
			//获取群相关信息
			getGroupDetial:function(){
				uni.request({
					url: this.serverUrl + '/group/getGroupDetial',
					data: {
						GroupID: this.fid,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
				
						if (status == 200) {
							let res= data.data.result;
							this.groupDetial=res[0]
							this.groupDetial.imgurl=this.serverUrl+this.groupDetial.imgurl
							console.log(this.groupDetial);
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错',
								icon: 'none',
								duration: 2000
							});
						} else if (status == 300) {
							uni.navigateTo({
								url: '../login/login?name=' + this.myname
							});
						}
					}
				});
			},
			
			
			join:async function(uid){
				this.socket.emit('login',uid)
				this.socket.on('connectionSuccess',(userid)=>{
					console.log('连接成功用户id是',userid);
				})
				this.socket.on('callRemote',()=>{
					this.phone=true
					this.called=true
					this.calling=true
				})
				this.socket.on('asceptCall',async ()=>{
					console.log('对方同意了');
					//创建pree对象
					this.pree=new RTCPeerConnection()
					//将本地音视频流添加进去
					this.pree.addStream(this.localStream)
					
					//通过监听oneicecandidate事件获取candidate信息
					this.pree.onicecandidate=(event)=>{
						if(event.candidate){
							//发送candidate信息
							this.socket.emit('sendCandidate',this.fid,event.candidate)
						}
					}
					//交换音视频流
					this.pree.onaddstream=(event)=>{
						console.log('收到用户B的stream',event.stream);
						this.$refs.remoteVideo.$refs.video.srcObject=event.stream
						this.$refs.remoteVideo.play()
						this.stopMusic()
						setTimeout(()=>{
							this.communication=true
						},500)
						this.calling=false
					}
					//生成offer
					const offer=await this.pree.createOffer({
						offerToReceiveAudio:1,
						offerToReceiveVideo:1
					})
					//本地设置offer信息
					await this.pree.setLocalDescription(offer)
					//发送offer
					this.socket.emit('sendOffer',offer,this.fid)
				})
				this.socket.on('sendOffer',async (offer)=>{
					console.log('收到offer:',offer);
					//用户b创建自己的RTCPeerConnection对象，添加本地音视频流，并设置远端表述信息（就是接收到的offer），生成answer
					this.pree=new RTCPeerConnection()
					const stream=await this.getLocalStream()
					this.pree.addStream(stream)
					//通过监听oneicecandidate事件获取candidate信息
					this.pree.onicecandidate=(event)=>{
						if(event.candidate){
							//发送candidate信息
							this.socket.emit('sendCandidate',this.fid,event.candidate)
						}
					}
					//交换音视频流
					this.pree.onaddstream=(event)=>{
						console.log('收到用户A的stream',event.stream);
						this.$refs.remoteVideo.$refs.video.srcObject=event.stream
						this.$refs.remoteVideo.play()
						this.stopMusic()
						setTimeout(()=>{
							this.communication=true
						},500)
						this.calling=false
					}
					//设置远端描述信息
					await this.pree.setRemoteDescription(offer)
					//生成answer
					const answer=await this.pree.createAnswer()
					//本地设置answer信息
					await this.pree.setLocalDescription(answer)
					//发送answer
					this.socket.emit('sendAnswer',answer,this.fid)
				})
				
				//收到answer
				this.socket.on('sendAnswer',async (answer)=>{
					console.log('用户A收到answer');
					//存储用户b的sdp信息
					await this.pree.setRemoteDescription(answer)
				})
				//收到Candidate信息
				this.socket.on('sendCandidate',async (candidate)=>{
					console.log('收到candidate信息',candidate);
					await this.pree.addIceCandidate(candidate)
				})
				this.socket.on('cancel',()=>{
					console.log('对方拒绝');
					this.phone=false
					this.caller=false
					this.called=false
					this.called=false
					this.communication=false
					//对方已拒绝
					this.pree=''
					this.stopMusic()
				})
			},
			//获取本地音视频流
			getLocalStream:async function(){
				try{
						const stream= await navigator.mediaDevices.getUserMedia({
							audio:true,
							video:true
						})
					this.$refs.localVideo.$refs.video.srcObject=stream
					this.$refs.localVideo.play()
					this.localStream=stream
					return stream
				}catch (error) {
					console.error('Error accessing media devices:', error);
				}
			},
			callRemote:async function(){
				this.phone=true
				this.caller=true //当前是否是呼叫人
				this.calling=true//是否处于呼叫中
				await this.getLocalStream()
				this.playMusic()
				//通过socket向用户b发起请求
				console.log(this.fimgurl);
				this.socket.emit('callRemote',this.fid,this.uimgurl,this.uname,this.uid)
			},
			//同意视频请求
			asceptCall:function(){
				this.socket.emit('asceptCall',this.fid)
			},
			//取消
			cancel:function(){
				this.phone=false
				this.caller=false
				this.called=false
				this.communication=false
				//清空自己的pree
				this.pree=''
				this.socket.emit('cancel',this.fid)
				this.stopMusic()
				setTimeout(()=>{
					this.receiveMsg({message:'视频通话,通话时长:----',types:0},this.uid,this.uimgurl,0)
				},500)
			},
			//通话铃声
			playMusic: function() {
			    const musicUrl = '../../static/audio/weixincall.mp3';
			    this.audioElement= new Audio(musicUrl);
				this.audioElement.loop = true;
			    this.audioElement.play();
			},
			//关闭
			stopMusic: function() {
			    if (this.audioElement) {
			        this.audioElement.pause();
			        this.audioElement.currentTime = 0;
			    }
			},
			
			//获取缓存
			getStorages: function() {
				try {
					const value = uni.getStorageSync('user')
					if (value) {
						this.uid = value.id,
							this.uimgurl = this.serverUrl + value.imgurl,
							this.token = value.token
						this.uname = value.name

					} else {
						uni.navigateTo({
							url: "../login/login"
						})
					}
				} catch (e) {
					//error
					console.log('读取出错');
				}

			},
			changetime: function(time) {
				return myfun.dataTime1(time)
			},
			backto: function() {
				//修改已读
				this.socket.emit('leaveChatr',this.uid, this.fid)
				uni.navigateBack({
					delta: 1
				})
			},
			goGroupHome:function(){
				uni.navigateTo({
					url:'../grouphome/grouphome?gid='+this.fid+'&gimg='+this.fimgurl+'&groupName='+this.fname,
					// url:"/pages/grouphome/grouphome"
				})
			},
			goUserHome:function(id){
				uni.navigateTo({
					url:'../userhome/userhome?id='+id,
					// url:"/pages/grouphome/grouphome"
				})
			},
			//滚动顶部加载下一页
			nextPage: function() {
				if (this.nowpage > 0 && this.beginloading) {
					//出现loading
					this.isloading = false
					//禁止重复加载
					this.beginloading = false

					var animation = uni.createAnimation({
						duration: 1000,
						timingFunction: 'step-start'
					})

					this.animation = animation

					let i = 1
					this.loading = setInterval(function() {
						animation.rotate(i * 30).step()
						this.animationData = animation.export()
						i++
						//获取聊天数据
						if (i > 20) {
							this.getMsg1(this.nowpage)
						}
					}.bind(this), 100)
				}
			},
			//获取聊天数据
			getMsg1: function() {
				console.log('找人');
				uni.request({
					url: this.serverUrl + '/chat/msg',
					data: {
						uid: this.uid,
						fid: this.fid,
						nowPage: this.nowpage,
						pageSize: this.pagesize,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						if (status == 200) {
							let msg = data.data.result
							msg.reverse()
							console.log(msg);
							if (msg.length > 0) {
								let oldtime = msg[0].time
								let imgarr = []
								for (var i = 1; i < msg.length; i++) {
									msg[i].imgurl = this.serverUrl + msg[i].imgurl
									//时间间隔
									if (i < msg.length - 1) {
										let t = myfun.spacTime(oldtime, msg[i].time)
										if (t) {
											oldtime = t
										}
										msg[i].time = t
									}
									//匹配最大时间
									if (this.nowpage == 0) {

										this.oldTime = msg[0].time
										if (msg[i].time > this.oldTime) {

											this.oldTime = msg[i].time
										}
									}
									if (msg[i].types == 1) {
										msg[i].message = this.serverUrl + msg[i].message
										imgarr.push(msg[i].message)
									}
									//json还原
									if (msg[i].types == 3) {
										msg[i].message = JSON.parse(msg[i].message)
									}
									if (msg[i].types == 4) {
										msg[i].message = this.serverUrl + msg[i].message
										imgarr.push(msg[i].message)
									}
								}
								
								this.msgs = msg.concat(this.msgs)
								this.imgMsg = imgarr.concat(this.imgMsg)
								console.log('消息列表',this.imgMsg);
							}

							if (msg.length == 10) {
								this.nowpage++
							} else {
								this.nowpage = -1
							}
							this.$nextTick(function() {
								this.swanition = false
								this.scrollToView = 'msg' + this.msgs[msg.length - 1].id
							})
							clearInterval(this.loading)
							this.loading = true
							this.beginloading = true
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错',
								icon: 'none',
								duration: 2000
							})
						} else if (status == 300) {
							uni.navigateTo({
								url: '../login/login?name=' + this.myname
							})
						}
					}
				})
			},
			//获取群聊天数据
			getGroupMsg: function() {
				
				uni.request({
					url: this.serverUrl + '/group/getGroupMsg',
					data: {
						groupID: this.fid,
						nowPage: this.nowpage,
						pageSize: this.pagesize,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						if (status == 200) {
							let msg = data.data.result
							console.log('群消息',msg);
							msg.reverse()
			
							if (msg.length > 0) {
								let oldtime = msg[0].time
								let imgarr = []
								for (var i = 1; i < msg.length; i++) {
									msg[i].imgurl = this.serverUrl + msg[i].imgurl
									//时间间隔
									if (i < msg.length - 1) {
										let t = myfun.spacTime(oldtime, msg[i].time)
										if (t) {
											oldtime = t
										}
										msg[i].time = t
									}
									//匹配最大时间
									if (this.nowpage == 0) {
			
										this.oldTime = msg[0].time
										if (msg[i].time > this.oldTime) {
			
											this.oldTime = msg[i].time
										}
									}
									if (msg[i].type == 1) {
										msg[i].message = this.serverUrl + msg[i].message
										imgarr.push(msg[i].message)
									}
									//json还原
									if (msg[i].type == 3) {
										msg[i].message = JSON.parse(msg[i].message)
									}
								}
								this.msgs = msg.concat(this.msgs)
								this.imgMsg = imgarr.concat(this.imgMsg)
								console.log('群消息',this.msgs);
							}
			
							if (msg.length == 10) {
								this.nowpage++
							} else {
								this.nowpage = -1
							}
							this.$nextTick(function() {
								this.swanition = false
								this.scrollToView = 'msg' + this.msgs[msg.length - 1].id
							})
							clearInterval(this.loading)
							this.loading = true
							this.beginloading = true
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出s错',
								icon: 'none',
								duration: 2000
							})
						} else if (status == 300) {
							uni.navigateTo({
								url: '../login/login?name=' + this.myname
							})
						}
					}
				})
			},

			getMsg: function(page) {
				let msg = datas.message()
				let maxpages = msg.length
				if (msg.length > (page + 1) * 10) {
					maxpages = (page + 1) * 10
					this.nowpage++
				} else {
					this.nowpage = -1
				}
				for (var i = page * 10; i < maxpages; i++) {
					msg[i].imgurl = '../../static/img/' + msg[i].imgurl
					//时间间隔
					if (i < msg.length - 1) {
						let t = myfun.spacTime(this.oldTime, msg[i].time)
						if (t) {
							this.oldTime = t
						}
						msg[i].time = t
					}

					if (msg[i].type == 1) {
						msg[i].message = '../../static/img/' + msg[i].message
						this.imgMsg.unshift(msg[i].message)
					}
					this.msgs.unshift(msg[i])
				}
				this.$nextTick(function() {
					this.swanition = false
					this.scrollToView = 'msg' + this.msgs[maxpages - page * 10 - 1].tip

				})
				clearInterval(this.loading)
				this.isloading = true
				this.beginloading = true
			},
			//图片预览
			previewImg: function(e) {
				console.log(e);
				let index = 0
				for (let i = this.imgMsg.length - 1; i >= 0; i--) {
					if (this.imgMsg[i] == e) {
						index = i;
					}
				}
				console.log(this.imgMsg);
				uni.previewImage({
					current: index,
					urls: this.imgMsg,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			//获取输入消息内容
			receiveMsg: function(e, id, img, tip) {
				//socket提交
				
				if (e.types == 0 || e.types == 3) {
					//文字或者定位
					
					this.sendSocket(e)
				}
				if (e.types == 1) {
					this.imgMsg.push(e.message)
					//提交图片
					let url = myfun.fileName(new Date())
					const uploadTask = uni.uploadFile({
						url: this.serverUrl + '/files/upload', //接口地址
						filePath: e.message,
						name: 'file',
						formData: {
							url: url,
							name: new Date().getTime() + this.uid + Math.ceil(Math.random() * 10),
						},
						success: (uploadFileRes) => {
							console.log(uploadFileRes);
							let data = {
								message:uploadFileRes.data,
								types: e.types
							}
							
							this.sendSocket(data)
						}
					});

					uploadTask.onProgressUpdate((res) => {});
				}
				if (e.types == 2) {
					//提交音频
					let url = myfun.fileName(new Date())
					const uploadTask = uni.uploadFile({
						url: this.serverUrl + '/files/upload', //接口地址
						filePath: e.message.voice,
						name: 'file',
						formData: {
							url: url,
							name: new Date().getTime() + this.uid + Math.ceil(Math.random() * 10),
						},
						success: (uploadFileRes) => {
							console.log(uploadFileRes);
							let data = {
								message: uploadFileRes.data,
								types: e.types
							}
							this.sendSocket(data)
							// let path=this.serverUrl+uploadFileRes.data
							// this.img.push(path)

						}
					});
					uploadTask.onProgressUpdate((res) => {});
				}
				if(e.types==4){
					console.log(e);
					this.sendSocket(e)
				}
				//数据渲染
				this.swanition = true
				let len = this.msgs.length
				let nowTime = new Date()
				let t = myfun.spacTime(this.oldTime, nowTime)
				if (t) {
					this.oldTime = t
				}

				nowTime = t
				if (e.types == 3) {
					e.message = JSON.parse(e.message)
				}
				let data
				if(this.type==1){
					data = {
						groupID:this.fid,
						userID: id, //发送者id
						imgurl: img,
						message: e.message,
						types: e.types, //文字类型(0文字，1图片，2音频文件)
						time: nowTime,
						sender:this.uname,
						id: len,
					}
				}else{
					data = {
						fromId: id, //发送者id
						imgurl: img,
						message: e.message,
						types: e.types, //文字类型(0文字，1图片，2音频文件,3是地址，4是视频)
						time: nowTime,
						id: len,
					}
				}	
				this.msgs.push(data)
				// this.goBottom()
				this.$nextTick(function() {
					this.scrollToView = 'msg' + len
				})

			},
			//聊天数据发送后端
			sendSocket: function(e) {
				if (this.type == 0) { //type为0是好友1则是群聊
					this.socket.emit('msg', e, this.uid, this.fid)
					
				} else {
					this.socket.emit('groupMsg', e, this.uid, this.fid,this.uname,this.uimgurl)
					
				}
			},
			//聊天数据接受
			receiveSocketMsg: function() {
				this.socket.on('msg', (msg, fromid, tip) => {
					
					if (fromid == this.fid && tip == 0) {
						this.swanition = true
						let len = this.msgs.length
						let nowTime = new Date()
						let t = myfun.spacTime(this.oldTime, nowTime)
						if (t) {
							this.oldTime = t
						}
						nowTime = t
						if (msg.types == 1 || msg.types == 2) {
							msg.message = this.serverUrl + msg.message
						}
						let data = {
							fromId: fromid, //发送者id
							imgurl: this.fimgurl,
							message: msg.message,
							types: msg.types, //文字类型(0文字，1图片，2音频文件)
							time: nowTime,
							id: len,
						};

						this.msgs.push(data)
						if (msg.types == 1) {
							this.imgMsg.push(msg.message)
						}
						this.$nextTick(function() {
							this.scrollToView = 'msg' + len
						})
					}
				})
			},
			receiveGroupSocketMsg:function(){
				this.socket.on('groupmsg', (msg, gid, uname,uimg,fromid,tip) => {
					console.log(tip);
					if (gid == this.fid && tip==0) {
						this.swanition = true
						let len = this.msgs.length
						let nowTime = new Date()
						let t = myfun.spacTime(this.oldTime, nowTime)
						if (t) {
							this.oldTime = t
						}
						nowTime = t
						if (msg.types == 1 || msg.types == 2) {
							msg.message = this.serverUrl + msg.message
						}
						let data = {
							groupID: gid, //群id
							userID:fromid,
							imgurl: uimg,
							message: msg.message,
							types: msg.types, //文字类型(0文字，1图片，2音频文件)
							time: nowTime,
							id: len,
							sender:uname
						};
				
						this.msgs.push(data)
						if (msg.types == 1) {
							this.imgMsg.push(msg.message)
						}
						this.$nextTick(function() {
							this.scrollToView = 'msg' + len
						})
					}
				})
			},
			//获到信息
			inputs: function(e) {
				this.receiveMsg(e, this.uid, this.uimgurl, 0)
			},
			
			height: function(e) {
				this.inputh = e + 6
				this.goBottom()

			},
			//滚动到底部
			goBottom: function() {
				this.swanition = true
				this.scrollToView = ''
				this.$nextTick(function() {
					let len = this.msgs.length - 1
					this.scrollToView = 'msg' + this.msgs[len].id
				})
			},
			//音频播放
			playVoice: function(e) {
				innerAudioContext.src = e;
				innerAudioContext.Play()
			},
			covers: function(e) {
				let map = [{
					latitude: e.latitude,
					longitude: e.longitude,
					iconPath: "../../static/submit/位置.png"
				}]
				return map
			},
			//导航
			openLocation: function(e) {
				console.log(e.latitude + 'kkk' + e.longitude)
				uni.openLocation({
					latitude: e.latitude,
					longitude: e.longitude,
					name: e.name,
					address: e.address,
					success: function() {
						console.log('success');
					}
				});

			},
			
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		background: rgba(244, 244, 244, 1);
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: var(--status-bar-height);
		padding-bottom: $uni-spacing-col-base;
	}
	.call-interface{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(23, 34, 43, .5);
		z-index: 10000;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 200rpx;
		box-sizing: border-box;
		.communitonbox{
			z-index: 10004;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			.call-btn{
				width: 150rpx;
				height: 150rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 50%;
				margin: 0;
			}
		}
		.calledimg{
			position: absolute;
			top: 0;
			right: 0;
			z-index: 10002;
			width: 100%;
			height: 100%;
		}
		.caller-img{
			margin-top: 100rpx;
			z-index: 10004;
			width: 200rpx;
			height: 200rpx;
			border-radius: 30rpx;
		}
		.video{
			top: 0;
			position: absolute;
			z-index: 10001;
			width: 100%;
			height: 100%;
			.localVideo{
				width: 100%;
				height: 100%;
			}
			.remoteVideo{
				position: absolute;
				bottom: 0;
				right: 0;
				width: 300rpx;
				height: 300rpx;
			}
		}
		.control-box{
			width: 100%;
			z-index: 10004;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			
			.call-btn{
				width: 150rpx;
				height: 150rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 50%;
				margin: 0;
			}
		}
	}
	.top-bar {
		position: fixed;
		z-index: 1000;
		padding-top: var(--status-bar-height);
		left: 0;
		top: 0;
		width: 100%;
		height: 88rpx;
		text-align: center;
		background: rgba(244, 244, 244, 0.96);
		border-bottom: 1px solid $uni-border-color;

		.top-bar-left {
			z-index: 1101;
			float: left;
			padding-left: $uni-spacing-col-base;

			image {
				z-index: 1100;
				margin-top: 10rpx;
				width: 68rpx;
				height: 68rpx;
				border-radius: 25rpx;
			}
		}

		.top-bar-center {
			position: absolute;
			text-align: center;
			left: 0rpx;
			right: 0;
			top: 0;
			bottom: 0;
			margin: 0;
			text-align: center;
			line-height: 80rpx;
			font-size: 40rpx;
			color: #272832;
			letter-spacing: -0.69rpx;
			font-weight: 400;
			;
		}

		.top-bar-right {
			float: right;
			padding-right: 14rpx;

			.grop-img {
				width: 88rpx;
				height: 88rpx;
				display: inline-block;
				border-radius: $uni-border-radius-base;
				overflow: hidden;

			}

			image {
				width: 88rpx;
				height: 88rpx;
			}
		}
	}

	.displaynone {
		display: none;
	}

	.chat {
		height: 1700rpx;

		.padbt {
			height: env(safe-area-inset-bottom);
			width: 100%;
		}

		.loading {
			text-align: center;

			.loading-img {
				width: 60rpx;
				height: 60rpx;
			}
		}

		.chat-main {
			padding-left: $uni-spacing-col-base;
			padding-right: $uni-spacing-col-base;
			padding-top: 100rpx;
			display: flex;
			flex-direction: column;
		}

		.chat-ls {
			.chat-time {
				font-size: $uni-font-size-sm;
				color: rgba(39, 40, 50, 0.3);
				line-height: 34rpx;
				text-align: center;
				padding: 20rpx 0;
			}

			.msg-m {
				display: flex;
				padding: 20rpx 0;
				position: relative;
				.sender{
					position: absolute;
					top: -14rpx;
					left: 90rpx;
					font-size: 8rpx;
					color: gray;
				}
				.user-img {
					flex: none;
					width: auto;
					max-width: none;
					width: $uni-img-size-sm;
					height: $uni-img-size-sm;
					background-color: rgba(255, 228, 49, 0.8);
					border-radius: $uni-border-radius-base;
				}

				.message {
					flex: none;
					max-width: 480rpx;
				}

				.msg-text {

					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 44rpx;
					padding: 18rpx 24rpx;
					word-break: break-all;
					word-wrap: break-word;
				}
				.video{
					max-width: 450rpx;
					border-radius: 40rpx;
				}
				
				.msg-map {
					background: #fff;
					width: 480rpx;
					height: 300rpx;
					overflow: hidden;

					.map-name {
						font-size: $uni-font-size-lg;
						color: $uni-text-color;
						line-height: 44rpx;
						padding: 18rpx 24rpx 0 24rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}

					.map-address {
						font-size: $uni-font-size-base;
						color: $uni-text-color-disable;
						padding: 0rpx 24rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}

					.map-img {
						padding-top: 8rpx;
						width: 480rpx;
						height: 180rpx;
					}
				}

				.voice {
					min-width: 80rpx;
					max-width: 400rpx;
				}

				.voice-img {
					width: 40rpx;
					height: 40rpx;
				}
			}

			.msg-left {
				flex-direction: row;

				.msg-text {
					margin-left: 16rpx;
					background: #fff;
					border-radius: 0px 20rpx 20rpx 20rpx;
				}

				.left-img {
					margin-left: 16rpx;
					max-width: 400rpx;
					border-radius: 50rpx;
				}

				.voice {
					text-align: right;

				}
				.video{
					margin-left: 16rpx;
				}
				.voice-img {
					float: left;

					width: 40rpx;
					height: 40rpx;
				}

				.msg-map {
					margin-left: 16rpx;

					border-radius: 0px 20rpx 20rpx 20rpx;
				}
			}

			.msg-right {
				flex-direction: row-reverse;

				.msg-text {
					margin-right: 16rpx;
					background: rgba(255, 228, 49, 0.8);
					border-radius: 20rpx 0px 20rpx 20rpx;
				}

				.right-img {
					margin-right: 16rpx;
					max-width: 400rpx;
					border-radius: 50rpx;
				}

				.voice {
					text-align: left;

				}
				.video{
					margin-right: 16rpx;
				}
				.voice-img {
					float: right;
					transform: rotate(180deg);
					width: 40rpx;
					height: 40rpx;
				}

				.msg-map {
					margin-right: 16rpx;
					border-radius: 20rpx 0px 20rpx 20rpx;
				}
			}
		}
	}
</style>
