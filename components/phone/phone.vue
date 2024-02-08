<template>
	<view class="call-interface" >
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
</template>

<script>
	export default {
		name:"phone",
		data() {
			return {
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
		computed:{
			fimgurl() {
				return this.$store.state.friendImgUrl;
			},
			fname() {
				return this.$store.state.friendName;
			},
			fid(){
				return this.$store.state.friendId;
			},
			uid(){
				return this.$store.state.userid;
			}
		},
		mounted:function(){
			this.join(this.uid)
		},
		methods:{
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
					console.log('挂断');
					
					this.caller=false
					this.called=false
					this.called=false
					this.communication=false
					//对方已拒绝
					this.pree=''
					this.stopMusic()
					//关闭视频窗口
					this.$store.commit('changephoneShow',false);
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
				this.socket.emit('callRemote',this.fid)
			},
			//同意视频请求
			asceptCall:function(){
				this.socket.emit('asceptCall',this.fid)
			},
			//取消
			cancel:function(){
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
				this.$store.commit('changephoneShow',false);
				
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
		}
	}
</script>

<style>
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
</style>