<template>
	<view class="content">
		
		<!-- 
		<view class="top-bar">
			<view class="top-bar-right" @click="toregister">
				<view class="register">
					<!-- 注册 -->
				<!-- </view>
			</view>
		</view> --> 
		
		
		<view class="new">
			<view class="logo">
				<!-- <image src="../../static/img/丫丫.png"></image> -->
				KKChat
				<view class="notice">
					everything is possible
				</view>
			</view>
			<transition name="slide-fade">
				<view class="bottom-box" v-if="showSignInbox">
					<view class="agentSigin" @click="SiginWithAgent">
						SIGN IN WITH KID
					</view>
					<view class="emailSigin"  @click="SiginWithEmail">
						SIGN IN WITH EMAIL
					</view>
					<view class="singTip" @click="toregister">Don’t have an account</view>
				</view>
			</transition>
			
			<transition name="slide-fade-down">
			<view v-if="showAgentSignIn" class="main-box">
				<view class="main">
					<!-- <view class="title">登录</view>
					<view class="slogan">你好，欢迎来到kk聊天</view> -->
					<view class="inputs">
						<input v-model="user" type="text" placeholder="邮箱/用户名" placeholder-class="placeholder" class="user"/>
						<input v-model="psw" type="password" placeholder="密码" placeholder-class="placeholder" class="password"/>
					</view>
					<view class="tips" :style="{display:mon}">
						输入用户名或密码错误
					</view>
				</view>
				<view @click="login" class="submit">登录</view> 
				<view class="backchoose" @click="backChoose">
					返回选择
				</view>
			</view>
			</transition>
			
			
			<!-- 邮箱验证码登录 -->
			<transition name="slide-fade-down">
			<view v-if="showEmaliSignIn" class="main-box">
				<view class="main">
					<!-- <view class="title">登录</view>
					<view class="slogan">你好，欢迎来到kk聊天</view> -->
					<view class="inputs">
						<input v-model="email" type="text" placeholder="邮箱" placeholder-class="placeholder" class="user"/>
						<view class="tips" :style="{display:emptyEmail}">
							{{emailtip}}
						</view>
						<view class="emai-send-box">
							<input v-model="emailCode" type="text" placeholder="验证码" placeholder-class="placeholder"/>
							<view class="sendemail" @click="sendEmail" :disabled="countdown">
								 {{ buttonText }}
							</view>
						</view>
						<view class="tips" :style="{display:emailLint}">
							{{emailLintTip}}
						</view>
					</view>
					
				</view>
				<view @click="loginByEmail" class="submit">登录</view> 
				<view class="backchoose" @click="backChoose">
					返回选择
				</view>
			</view>
			</transition>
			
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				user:'',
				psw:'',
				mon:'none',
				emptyEmail:'none',
				showSignInbox:false,
				showAgentSignIn:false,
				showEmaliSignIn:false,
				email:'',
				emailCode:'',
				emailLint:'none',
				countdown: 0,
				buttonText: '发送',
				emailLintTip:'',
				emailtip:'',
			}
		},
		onLoad:function(e){
			console.log(e);
			if(e.user){
				//注册页过来的参数user，用户名
				this.user=e.user
				uni.showToast({
					title:'注册成功请登录',
					icon:'none',
					duration:1500
				})
			}
			if(e.name){
				//token过期过来的的参数name，用户名
				this.user=e.name
				uni.showToast({
					title:'身份已过期请重新登录',
					icon:'none',
					duration:2000
				})
			}
			if(e.cgpwd){
				//密码过期
				this.user=e.name
				uni.showToast({
					title:'身份已过期请重新登录',
					icon:'none',
					duration:2000
				})
			}
		},
		mounted:function(){
			this.showSignInbox = true;
		},
		methods: {
			loginByEmail:function(){
				if(this.emailCode==''){
					this.emailLintTip='验证码为空'
				}else{
					this.emailLintTip=''
				}
				if(this.emailtip=='' && this.emailLintTip=='' && this.emailCode.length>0 && this.email.length>0){
					uni.request({
						url:this.serverUrl +'/mail/emailMatch',
						data:{
							email:this.email,
							emailCode:this.emailCode
						},
						method:'POST',
						success:(data)=>{
							let status=data.data.status
							if(status==200){
								let res=data.data.back
								//登陆成功,本地存储一下缓存信息
								uni.showToast({
									title:'登陆成功',
									icon:'none',
									duration:1500
								})
								try{
									uni.setStorageSync('user',
									{
										'id':res.id,
										'agentID':res.userAgentID,
										'name':res.name,
										'imgurl':res.imgurl,
										'token':res.token,
									})
								}catch(e){
									//error
									console.log('存储出错');
								}
								setTimeout(()=>{
									uni.switchTab({
										url:"../index/index"
									})	
								},2000)
								
							}else if(status==400){
								this.mon='block'
								this.psw=''
							}else if(status==500){
								uni.showToast({
									title:'服务器发生错误',
									icon:'none',
									duration:1500
								})
							}
						}
					})
				}
				
			},
			
			sendEmail() {
				if(this.email.length==0){
					this.emptyEmail='block'
					this.emailtip='邮箱为空'
				}else{
					
					let reg= /^[a-zA-Z0-9][a-zA-Z0-9_]+\@[a-zA-Z0-9]+\.[a-zA-Z]{2,5}(\.[a-zA-Z]{2,5})*$/i;
					if(reg.test(this.email)){
						this.emptyEmail='none'
						this.emailtip=''
						if (this.countdown === 0) {
						  //发送获取验证码请求
						  uni.request({
						  	url:this.serverUrl +'/mail/emailLint',
						  	data:{
						  		email:this.email,
						  	},
						  	method:'POST',
						  	success:(data)=>{
						  	}
						  })				  
						  this.startCountdown();		
						  // 模拟请求成功后的逻辑
						  setTimeout(() => {
						    // 请求成功后的逻辑，你可以在这里添加处理成功后的操作
						  }, 1000);
						}
					}else{
						this.emptyEmail='block'
						this.emailtip='邮箱不合法'
					}
				}
			    },
			startCountdown() {
			      this.countdown = 60;
			      this.updateButtonText();
			
			      const countdownInterval = setInterval(() => {
			        if (this.countdown > 0) {
			          this.countdown--;
			          this.updateButtonText();
			        } else {
			          clearInterval(countdownInterval);
			        }
			      }, 1000);
			},
			updateButtonText() {
			  if (this.countdown > 0) {
			    this.buttonText = `${this.countdown}s`;
			  } else {
			    this.buttonText = '发送';
			  }
			},
				
			backChoose:function(){
				this.showSignInbox = true;
				this.showAgentSignIn=false
				this.showEmaliSignIn=false
			},
			SiginWithAgent:function(){
				this.showSignInbox = false;
				this.showAgentSignIn=true
			},
			SiginWithEmail:function(){
				this.showSignInbox = false;
				this.showEmaliSignIn=true
			},
			
			toregister:function(){
				uni.navigateTo({
					url:"../register/register"
				})
			},
			login:function(){
				if(this.user && this.psw){
					console.log(this.user,this.psw);
					uni.request({
						url:this.serverUrl +'/signin/match',
						data:{
							data:this.user,
							pwd:this.psw
						},
						method:'POST',
						success:(data)=>{
							let status=data.data.status
							if(status==200){
								this.mon='none'
								let res=data.data.back
								//登陆成功,本地存储一下缓存信息
								uni.showToast({
									title:'登陆成功',
									icon:'none',
									duration:1500
								})
								try{
									uni.setStorageSync('user',
									{
										'id':res.id,
										'agentID':res.userAgentID,
										'name':res.name,
										'imgurl':res.imgurl,
										'token':res.token,
									})
								}catch(e){
									//error
									console.log('存储出错');
								}
								setTimeout(()=>{
									uni.switchTab({
										url:"../index/index"
									})	
								},2000)
								
								
							}else if(status==400){
								this.mon='block'
								this.psw=''
							}else if(status==500){
								uni.showToast({
									title:'服务器发生错误',
									icon:'none',
									duration:1500
								})
							}
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.slide-fade-enter-active, .slide-fade-leave-active {
	  transition: opacity 0.5s, transform 2s;
	}
	.slide-fade-enter, .slide-fade-leave-to {
	  opacity: 0;
	  transform: translateY(-1000px);
	}
	
	.slide-fade-down-enter-active, .slide-fade-down-leave-active {
	  transition: opacity 0.5s, transform 2s;
	}
	.slide-fade-down-enter, .slide-fade-down-leave-to {
	  opacity: 0;
	  transform: translateY(1000px);
	}
	
	.placeholder{
		color: white;
	}
	.content { 
		// text-align: center;
		padding-top: var(--status-bar-height);

	}
	.new{
		width: 100%;
		height: 100vh;
		background-image: url('../../static/login/loginBG.jpg');
		background-position: 0 0;
		background-size: contain;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		.bottom-box{
			position: fixed;
			bottom: 0;
			width: 100%;
			box-sizing: border-box;
			padding: 40rpx 80rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-end;
			.agentSigin{
				width: 100%;
				height: 120rpx;
				border-radius: 30px;
				margin-bottom: 20px;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color:darkorchid;
				color: white;
				 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.2);
			}
			.emailSigin{
				width: 100%;
				height: 120rpx;
				border-radius: 30px;
				margin-bottom: 30px;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color:white;
				color: black;
				box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.2);
			}
			.singTip{
				width: 100%;
				display: flex;
				color: gray;
				justify-content: center;
				align-items: center;
				
			}
		}
		.main-box{
			width: 100%;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			.main{
				padding: 254rpx $uni-spacing-row-lg 120rpx;
				width: 100%;
				box-sizing: border-box;
				.title{
					font-size: 56rpx;
					font-weight: 500;
					color: $uni-text-color;
					line-height: 80rpx;
				}
				.slogan{
					font-size: 40rpx;
					color: $uni-text-color-grey;
					line-height: 56rpx;
				}
				.inputs{
					padding-top: 8rpx;
					width: 100%;
					input{
						padding-top: 40rpx;
						height: 88rpx;
						font-size: $uni-font-size-lg;
						font-weight: 500;
						color: white;
						line-height: 88rpx;
						border-bottom: 1px solid rgba(244,244,244,.5);
					}
					.emai-send-box{
						display: flex;
						input{
							width: 80%;
						}
						display: flex;
						width: 100%;
						.sendemail{
							flex: auto;
							border-bottom: 1px solid rgba(244,244,244,.5);
							height: 88rpx;
							color: white;
							display: flex;
							justify-content: center;
							padding-top: 40rpx;
							
							align-items: center;
						}
					}
					
				}
				.tips{
					float: left;
					color: $uni-color-warning;
					line-height: 88rpx;
					
				}
			}
		}
		
	}
	
	
.top-bar{
		position: fixed;
		z-index: 1000;
		color: #55aaff;
		// box-sizing: border-box;
		padding-top: var(--status-bar-height);
		left: 0;
		top: 0;
		width: 100%;
		height: 88rpx;
		background: $uni-bg-color;
		border-bottom: 1px solid $uni-border-color;
		.top-bar-right{
			float: right;
			padding-right: 14rpx;
			.register{
				font-size:$uni-font-size-lg;
				font-weight:500;
				color:$uni-text-color;
				line-height:88rpx;
			}
		}
	}
	.logo{
		text-align: center;
		margin-top: 20%;
		font-size:60px;
		color: white;
		.notice{
			font-size: 13px;
			color: gainsboro;
		}
		image{
			width:194rpx;
			height: 192rpx;
			margin: 0 auto;
		}
	}
	
	.submit{
		margin: 0 auto;
		width: 520rpx;
		height: 96rpx;
		background:white;
		box-shadow: 0px 50rpx 32rpx -36rpx rgba(255,228,49,0.4);
		border-radius: 48rpx;
		font-size: $uni-font-size-lg;
		font-weight:500;
		color: $uni-text-color;
		line-height: 96rpx;
		text-align: center;
	}
	.backchoose{
		margin-top: 30rpx;
		display: inline-block;
		font-size: 15px;
		color: rgba(244,244,244,.5);
	}
</style>
