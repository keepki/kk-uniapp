<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @click="backTo">
				<image src="../../static/userdetail/back.png"></image>
			</view>
			<view class="top-bar-right">
				<view class="more" @click="touserdetial" v-if="relation==0 || relation==1">
					<image src="../../static/usermain/more.png"></image>
				</view>
			</view>
		</view>
		<view class="bg">
			<view class="bg-bai"></view>
			<image mode="aspectFill" class="bg-img" :src="user.imgurl"></image>
		</view>
		<view class="main">
			<view class="user-header">
				<image class="user-img" :animation="animationData2" :src="user.imgurl"></image>
			</view>
			<view class="user-mesg">
				<view class="name">{{markname}}</view>
				<view class="nick">昵称：{{user.name}}</view>
				<view class="intr">{{user.explain}}</view>
			</view>
		</view>
		<view class="bottom-bar"><!-- 有bug -->
			<view class="bottom-btn" @click="addFriendBtn" v-if="relation==2">加为好友</view>
			<view class="bottom-btn" v-if="relation==1" @click="toChatHome()">发送信息</view>
		</view>
		<view class="add" :animation="animationData" :style="{height:addHeight+'px',bottom:-+addHeight+'px'}">
			<view class="name">{{user.name}}</view>
			<textarea class="add-mesg" v-model="msg" maxlength="120"></textarea>
		</view>
		<view class="add-btn" :animation="animationData1">
			<view class="close" @click="addFriendAnimat">取消</view>
			<view class="send" @click="addSubmit">发送</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				animationData:{},
				animationData1:{},
				animationData2:{},
				isAdd:false,
				addHeight:'1000',
				sexBg:'rgba(255,93,91,1)',
				id:'',
				uid:'',
				token:'',
				myname:'',
				markname:'',
				user:{},
				img:'',
				relation:''  ,//好友关系0是自己1是别人2就是陌生人
				msg:''
			}
		},
		onLoad:function(e){
			console.log(e)
			if(e.id){
				this.id=e.id
				this.getStorage()
				this.getUser()
				this.judgeFriend()
			}
		},
		onReady:function(){
			this.getElementStyle()
		},
		methods: {
			//获取缓存
			getStorage:function(){
				try{
					const value=uni.getStorageSync('user')
					if(value){
						this.uid=value.id
						this.token=value.token
						this.myname=value.name
					}else{
						uni.navigateTo({
							url:'../login/login'
						})
					}
				}catch(e){
					console.log('error')
				}
			},
			//获取用户信息
			getUser:function(){
				uni.request({
					url:this.serverUrl+'/user/detial',
					data:{
						id:this.id,
						token:this.token
					},
					method:'POST',
					success:(data)=>{
						let status=data.data.status
						if(status==200){
							let res=data.data.result
							res.imgurl=this.serverUrl+res.imgurl
							//处理简介
							
							if(!res.explain){
								
								res.explain='这个人很懒，什么都没有留下'
							}
							//处理markname
							if(this.markname.length==0){
								this.markname=res.name
							}
							this.user=res
							console.log(this.user);
						}else if(status==300){
							uni.navigateTo({
								url:'../login/login?name='+this.myname
							})										
						}else if(status==500){
							uni.showToast({
								title:'服务器出错',
								icon:'none',
								duration:2000
							})
						}
					}
				})
			},
			judgeFriend:function(){
				if(this.id==this.uid){
					this.relation=0
				}else{
					//如果不是自己进行后端验证
					uni.request({
						url:this.serverUrl+'/search/isfriend',
						data:{
							uid:this.uid,
							fid:this.id,
							token:this.token
						},
						method:'POST',
						success:(data)=>{
							let status=data.data.status
							if(status==200){
								//说明是好友
								this.relation=1
								this.getMarkname()
							}else if (status==400){
								//不是好友不认识
								this.relation=2
							}else if(status==500){
								uni.showToast({
									title:'服务器出错',
									icon:'none',
									duration:2000
								})
							}else if(status==300){
								uni.navigateTo({
									url:'../login/login?name='+this.myname
								})
							}
						}
					})
				}
			},
			//获取好友昵称
			getMarkname:function(){
				uni.request({
					url:this.serverUrl+'/user/getmarkname',
					data:{
						uid:this.uid,
						fid:this.id,
						token:this.token
					},
					method:'POST',
					success:(data)=>{
						let status=data.data.status
						if(status==200){
							let res=data.data.result
							
							if(res.markname!=undefined){
								this.markname=res.markname
							}
						}else if(status==500){
							uni.showToast({
								title:'服务器出错',
								icon:'none',
								duration:2000
							})
						}else if(status==300){
								uni.navigateTo({
									url:'../login/login?name='+this.myname
								})
							}
					}
				})
			},
			backTo:function(){
				uni.navigateBack({
					delta:1
				})
			},
			touserdetial:function(){
				uni.navigateTo({
					url:"../userdetail/userdetail?id="+this.id
				})
			},
			toChatHome:function() {
				
				 uni.navigateTo({
				 	url: '/pages/chatroom/chatroom?id='+this.user._id+'&name='+this.user.name+'&img='+this.user.imgurl+'&type='+0
				 })
			},
			
			getElementStyle:function(){
				const query=uni.createSelectorQuery().in(this);
				query.select(".bg").boundingClientRect(data=>{

					this.addHeight=data.height-186;
				}).exec()
			},
			//添加好友按钮
			addFriendBtn: function(fid) {
				this.fid=fid
				this.msg = this.myname + '请求添加好友~~~~'
				this.addFriendAnimat()
			},
			//添加好友
			addSubmit: function() {
				if (this.msg.length > 0) {
					this.addFriendAnimat() 
					uni.request({
						url: this.serverUrl + '/friend/applyfriend',
						data: {
							uid:this.uid,
							fid:this.id,
							token:this.token,
							msg:this.msg 
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status
							if (status == 200) {
								uni.showToast({
									title: '发送成功',
									icon: 'none',
									duration: 2000
								})
							} else if (status == 300) {
								uni.navigateTo({
									url: '../login/login?name=' + this.myname
								})
							} else if (status == 500) {
								uni.showToast({
									title: '服务器出错',
									icon: 'none',
									duration: 2000 
								})
							}
						}
					})
				}
			},
			//添加好友动画
			addFriendAnimat:function(){
				this.isAdd=!this.isAdd;
				var animation = uni.createAnimation({
				    duration: 300,
				    timingFunction: 'ease',
				})
				var animation1 = uni.createAnimation({
				    duration: 300,
				    timingFunction: 'ease',
				})
				var animation2 = uni.createAnimation({
				    duration: 300,
				    timingFunction: 'ease',
				})
				var animation3 = uni.createAnimation({
				    duration: 300,
				    timingFunction: 'ease',
				})
					if(this.isAdd){
						animation.bottom(0).step()
						animation1.bottom(0).step()
						animation2.scale(0.5,0.5).rotate(360).step()
						
					}else{
						animation.bottom(-this.addHeight).step()
						animation1.bottom(-100).step()
						animation2.width(200).height(200).top(0).step()
						
					}
				    this.animationData = animation.export()
					this.animationData1 = animation1.export()
					this.animationData2 = animation2.export()
				
			}
		}
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: var(--status-bar-height);
		padding-bottom: $uni-spacing-col-base;
	}
	.top-bar{
		position: fixed;
		z-index: 1000;
		padding-top: var(--status-bar-height);
		left: 0;
		top: 0;
		width: 100%;
		height: 88rpx;
		background: transparent;
		border-bottom: 1px solid $uni-border-color;
		.top-bar-left{
			
			float: left;
			padding-left: $uni-spacing-col-base;
			padding-top: 15rpx;
			image{
				
				width: 58rpx;
				height: 58rpx;
			}
		
		}
		.top-bar-right{
			float: right;
			padding-right: 14rpx;
			.more{
				width: 88rpx;
				height: 88rpx;
				display: inline-block;
			}
			image{
				padding: 36rpx 0 0 18rpx;
				width: 52rpx;
				height: 12rpx;
			}
		}
	}
	.bg{
		z-index:-2;
		position: fixed;
		top:0;
		left:0;
		width: 100%;
		height: 100%;
		

		.bg-img{
			position: absolute;
			z-index: -1;
			opacity: 0.4;
			width: 110%;
			height: 110%;
			filter: blur(10px);
		}
	}
	.main{	
		text-align: center;
		padding-top: 148rpx;
		.user-header{
			width: 412rpx;
			height: 412rpx;
			margin: 0 auto;
			position: relative;
		.sex{
			z-index: 11;
			position: absolute;
			bottom: 22rpx;
			right: 22rpx;
			width: 64rpx;
			height: 64rpx;
			// background: rgba(255,93,91,1);
			border-radius: $uni-border-radius-circle;
			image{
				// z-index: 13;
				padding: 16rpx;
				width: 32rpx;
				height: 32rpx;
			}
		}
		.user-img{
			z-index: 10;
			top: 0;
			width: 400rpx;
			height: 400rpx;
			border: 6rpx solid #FFFFFF;
			border-radius: 50%;
		}
		}
		.user-mesg{
			padding-top:42rpx;
			.name{
				height: 74rpx;
				font-size: 52rpx;
				color: #272832;
				line-height: 74rpx;
			}
			.nick{
				font-size: $uni-font-size-base;
				line-height: 48rpx;
				color:$uni-text-color;
			}
			.intr{
				padding-top: 20rpx;
				width: 552rpx;
				font-size: $uni-font-size-base;
				color: $uni-text-color;
				// letter-spacing: 5rpx;
				line-height: 48rpx;
				font-weight: 300;
			}
		}
	}
	.bottom-bar{
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 90rpx;
		padding-top: 10rpx;
		// padding: 12rpx $uni-spacing-col-base;
		padding-bottom:env(safe-area-inset-bottom) ;
		background-color: transparent;
		.bottom-btn{
			text-align: center;
			line-height: 80rpx;
			font-size: 32rpx;
			// width: 684rpx;
			height: 80rpx;
			border-radius: $uni-border-radius-base;
			background: $uni-color-primary;
		}
	}
	.add{
		position: fixed;
		// bottom: 0;
		width: 100%;
		padding: 40rpx 56rpx;
		box-sizing: border-box;
		background: rgba(255,255,255,1);
		border-radius: 40rpx 40rpx 0rpx 0rpx;
		.name{
			padding: 168rpx 0 40rpx;
			font-size: 52rpx;
			color: #272832;
			line-height: 74rpx;
		}
		.add-mesg{
			padding: 18rpx 22rpx;
			width: 100%;
			box-sizing: border-box;
			height: 420rpx;
			background:$uni-bg-color-grey;
			border-radius: $uni-border-radius-base;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			line-height: 44rpx;
		}
	}
	.add-btn{
		position: fixed;
		bottom: -104rpx;
		width: 100%;
		height: 104rpx;
		box-sizing: border-box;
		padding: 12rpx $uni-spacing-col-base;
		z-index: 100;
		height: 104rpx;
		background-color: transparent;
		display: flex;
		.close{
			// flex: auto;
			width: 172rpx;
			margin: 0 auto;
			text-align: center;
			line-height: 80rpx;
			font-size: 32rpx;
			height: 80rpx;
			color: $uni-text-color;
			background: $uni-bg-color-hover;
			border-radius: $uni-border-radius-sm;
		}
		.send{
			margin-left: $uni-spacing-col-base;
			flex: auto;
			// margin: 0 auto;
			text-align: center;
			line-height: 80rpx;
			font-size: 32rpx;
			color: $uni-text-color;
			background: $uni-color-primary;
			height: 80rpx;
			border-radius: $uni-border-radius-sm;
		}
	}
</style>
