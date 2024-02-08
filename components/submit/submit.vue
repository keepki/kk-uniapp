<template>
	<view>
		<view class="submit">
			<view class="submit-chat">
				<view class="bt-img" @click="records">
					<image :src="toc"></image>
				</view>
				<textarea v-model="msg"  @focus="emojifocus" @input="inputs" :class="{displaynone:isrecord}" class="chat-send btn" auto-height="true"></textarea>
				<view class="record btn" :class="{displaynone:!isrecord}" @touchstart="touchstart" @touchend="touchend" @touchmove="touchmove">按住说话</view>
				<view class="bt-img" @click="emoji">
					<image src="../../static/submit/face.png"></image>
				</view>
				<view class="bt-img" @click="moreFun">
					<image src="../../static/submit/add.png"></image>
				</view>
			</view>
			
			<view :class="{displaynone:isemoji}" class="emoji" >
				<view class="emoji-send">
					<view class="emoji-send-det" @click="emojiBack">🪓</view>
					<view class="emoji-send-bt" @click="emojiSend">✈️</view>
					
				</view>
				
				<emoji @emotion=emotion :height="260"></emoji>
			</view>
			
			<view :class="{displaynone:ismore}" class="more" >
				<view class="more-list" @click="sendImg('album')">
					<image src="../../static/submit/picture.png"></image>
					<view class="more-list-title">图片</view>
				</view>
				<view class="more-list" @click="sendvideo">
					<image src="../../static/submit/camera.png"></image>
					<view class="more-list-title">摄像</view>
				</view>
				<view class="more-list">
					<image src="../../static/submit/look.png" @click="sendImg('camera')"></image>
					<view class="more-list-title">照相机</view>
				</view>
				<view class="more-list">
					<image src="../../static/submit/location.png" @click="chooseLocation"></image>
					<view class="more-list-title">位置</view>
				</view>
				<view class="more-list">
					<image src="../../static/submit/file.png"></image>
					<view class="more-list-title">文件</view>
				</view>
				<view class="more-list">
					<image src="../../static/submit/file.png" @click="hangups"></image>
					<view class="more-list-title">视频通话</view>
				</view>
			</view>
		</view>
		<view class="voice-bg" :class="{displaynone:VoiceBg}">
			<view class="voice-bg-len">
				<view class="voice-bg-time" :style="{width:voiceLength/0.3+'%'}">{{voiceLength}}</view>
			</view>
			<view class="voice-del" :animation="animationData">上滑取消</view>
		</view>
	</view>
</template>

<script>
	import emoji from './emoji/emoji.vue'
	import mytime from "../../commons/js/mytime.js"
	//录音
	const recorderManager = uni.getRecorderManager();
	export default {
		data() {
			return {
				isrecord:false,
				isemoji:true,
				ismore:true,
				toc:"../../static/submit/output.png",
				msg:'',
				tiemer:'',
				voicePath: '',
				voiceLength:0,
				VoiceBg:true,
				pageY:'',
				isenough:false,
				animationData:{},
				serverUrl:''
			};
		},
		mounted() {
		  this.$nextTick(() => {
		    // 通过 this.$root 获取根实例
		    this.serverUrl = this.$root.serverUrl
		  });
		},
		components:{
			emoji
		},

		methods:{
			//获取模块高度
			getElementHeight:function(){
				const query=uni.createSelectorQuery().in(this);
				query.select(".submit").boundingClientRect(data=>{
					
					this.$emit('height',data.height)
				}).exec()
			},
			
			records:function(){
				//关闭其他
				this.isemoji=true
				this.ismore=true
				if(this.isrecord){
					this.isrecord=false
					this.toc="../../static/submit/output.png"
				}else{
					this.isrecord=true
					this.toc="../../static/submit/input.png"
				}
			},
			emoji:function(){
				this.isemoji=!this.isemoji,
				//关闭其他
				this.ismore=true
				if(this.isrecord){
					this.isrecord=false
					this.toc="../../static/submit/yuying.png"
				}
				setTimeout(()=>{
					this.getElementHeight()
				},10)
				
			},
			emotion:function(e){
				this.msg=this.msg+e
			},
			//更多
			moreFun:function(){
				this.ismore=!this.ismore,
				//关闭其他
				this.isemoji=true
				
				if(this.isrecord){
					this.isrecord=false
					this.toc="../../static/submit/yuying.png"
				}
				setTimeout(()=>{
					this.getElementHeight()
				},10)
			},
			//文字发送
			inputs:function(e){
				var chatm=e.detail.value
				var pos=chatm.indexOf('\n')
				if(pos!=-1 && chatm.length>1){
					this.send(this.msg,0)
				}
			},
			emojiSend:function(){
				if(this.msg.length>0){
					this.send(this.msg,0)
				}
			},
			emojiBack:function(){
				if(this.msg.length>0){
					this.msg=this.msg.substring(0,this.msg.length-1)
				}
			},
			emojifocus:function(){
				this.isemoji=true
				this.ismore=true
				setTimeout(()=>{
					this.getElementHeight()
				},10)
			},
			send:function(msg,type){
				let data={
					message:msg,
					types:type
				}
				this.$emit('inputs',data)
				setTimeout(()=>{
					this.msg=''
				},0)
			},
			hangups:function(){
				this.$emit('hangups')
			},
			//图片发送
			sendImg:function(e){
				let count=9
				if(e==='album'){
					count=9
				}else{
					count=1
				}
				uni.chooseImage({
					count: count, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: [e], //从相册选择
					success: (res)=>{
						const filePaths=res.tempFilePaths
						for(let i=0;i<filePaths.length;i++){
							this.send(filePaths[i],1)
						}
						
					}
				});

			},
			
			//音频处理
			//开始
			touchstart:function(e){
				this.pageY=e.changedTouches[0].pageY
				this.VoiceBg=false
				var i=1
				this.tiemer=setInterval(()=>{
					this.voiceLength=i
					i++
					console.log(i)
					if(i>30){
						clearInterval(this.tiemer)
						this.touchend()
					}
				},1000)
				recorderManager.start();
			},
			touchend:function(){
				clearInterval(this.tiemer)
				recorderManager.stop()
				recorderManager.onStop((res)=>{
					let data={
						voice:res.tempFilePath,
						time:this.voiceLength
					}
					if(!this.VoiceBg){
						this.send(data,2)
					}
					
			       this.voiceLength=0
				   this.VoiceBg=true
		        });
			},
			//停止录音
			touchmove:function(e){
				if(this.pageY-e.changedTouches[0].pageY>100){
					
					this.VoiceBg=true
				}
			},
			//停止动画
			addFriendAnimat:function(){
				this.isenough=!this.isenough;
				var animation = uni.createAnimation({
				    duration: 300,
				    timingFunction: 'ease',
				})
				if(this.isenough){
					animation.height(100).step()	
				}else{
					animation.height(250).step()	
				}
				this.animationData = animation.export()
			},
			//定位
			chooseLocation:function(){
				uni.chooseLocation({
					success: res =>{
						let data={
							name:res.name,
							address:res.address,
							latitude:res.latitude,
							longitude:res.longitude
						}
						let stringDate=JSON.stringify(data)
						this.send(stringDate,3)
					}
				});
			},
			//视频
			sendvideo:function(){
				let url=mytime.fileName(new Date())
				
				let baseURL=this.serverUrl
				uni.chooseVideo({
					sourceType: ['camera', 'album'],
					success: (res)=>{
						uni.showLoading({
							title:'上传中'
						})
						const uploadTask = uni.uploadFile({
							url: baseURL+'/files/upload', //接口地址
							filePath: res.tempFilePath,
							name: 'file',
							formData: {
								url: 'video',
								name:new Date().getTime()
							},
							success: (uploadFileRes)=>{
								uni.hideLoading();
								const filePaths=uploadFileRes.data
								this.send(filePaths,4) //4代表是视频
							}
						});
						 
						uploadTask.onProgressUpdate((res) => {
							
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.submit{
		background: rgba(244,244,244,0.96);
		border-top: 1px solid $uni-border-color;
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 1002;
		padding-bottom:env(safe-area-inset-bottom);
	}
	.displaynone{
		display: none;
	}
	.submit-chat{
		width: 100%;
		display: flex;
		align-items: flex-end;
		box-sizing: border-box;
		padding: 14rpx 14rpx;
		image{
			width: 56rpx;
			height: 56rpx;
			margin: 5rpx 10rpx;
			flex: auto;
			
		}
		.btn{
			flex: auto;
			background-color: #fff;
			border-radius: 20rpx;
			padding: 20rpx;
			max-height: 160rpx;
			margin: 0 10rpx;
		}
		.chat-send{
			line-height: 44rpx;
		}
		.record{
			line-height: 44rpx;
			text-align: center;
			font-size: $uni-font-size-lg;
			color: $uni-text-color-grey;
		}
	}
	.emoji{
		height: 436rpx;
		width: 100%;
		background: rgba(236,237,238,1);
		box-shadow: 0px -1rpx 0px rgba(0,0,0,1);
		.emoji-send{
			width:360rpx;
			height: 104rpx;
			background-color: rgba(236,237,238,0.6);
			padding-top: 24rpx;
			position: fixed;
			bottom:env(safe-area-inset-bottom);
			right: 0;
			display: flex;
			.emoji-send-bt{
				flex: 1;
				margin: 0 32rpx 0 20rpx;
				height: 80rpx;
				background: rgba(255,228,49,1);
				font-size: 42rpx;
				text-align: center;
				line-height: 80rpx;
				border-radius: 12rpx;
			}
			.emoji-send-det{
				flex: 1;
				margin-left: 24rpx;
				height: 80rpx;
				background:#fff;
				font-size: 42rpx;
				text-align: center;
				line-height: 80rpx;
				border-radius: 12rpx;
			}
		}
	}
	.more{
		height: 436rpx;
		width: 100%;
		background: rgba(236,237,238,1);
		box-shadow: 0px -1rpx 0px rgba(0,0,0,1);
		bottom:env(safe-area-inset-bottom);
		padding:8rpx 20rpx;
		box-sizing: border-box;
		.more-list{
			width: 25%;
			text-align: center;
			float: left;
			padding-top: 32rpx;
			image{
				width: 72rpx;
				height: 72rpx;
				padding: 24rpx;
				// border: 1px solid black;
				background: rgba(255,255,255,1);
				border-radius: 24rpx;
			}
			.more-list-title{
				font-size: 24rpx;
				color: rgba(39,48,50,0.5);
				line-height: 34rpx;
			}
		}
	}
	.voice-bg{
		height: 100%;
		width: 100%;
		background: rgba(0,0,0,0.3);
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
		z-index: 1001;
		.voice-bg-len{
			height: 84rpx;
			width: 600rpx;
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			margin: auto;
			background-color: rgba(255,255,255,0.2);
			border-radius: 42rpx;
			text-align: center;
		}
		.voice-bg-time{
			display: inline-block;
			line-height: 84rpx;
			background-color: $uni-color-primary;
			min-width: 120rpx;
			border-radius: 42rpx;
		}
		.voice-del{
			position: absolute;
			bottom: 148rpx; 
			
			margin-bottom:env(safe-area-inset-bottom) ;
			width: 100%;
			height: 100rpx;
			text-align: center;
			color: #fff;
			font-size: $uni-font-size-base;
		}
	}
</style>
