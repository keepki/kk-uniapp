<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @click="tologin">
				<text class="back"><</text>
			</view>
		</view>
		<view class="logo">
			<image src="../../static/img/yaya.png"></image>
		</view>
		<view class="main">
			<view class="title">REGISTER</view>

			<view class="inputs">
				<view class="inputs-div">
					<input v-model="username" type="text" placeholder="请输入用户名" class="user" @blur="isName"/>
					
					<view  class="tip" v-if="nameinvaild">用户名不合法</view>
					<!-- <view  class="tip" v-if="nameexist">用户名已存在</view> -->
					<image class="ok" v-if="isuser" src="../../static/register/Group.png"></image>
				</view>
				<view class="inputs-div">
					<input v-model="email" type="text" placeholder="请输入邮箱" class="user" @blur="isEmail"/>
					<view class="tip" v-if="tip">邮箱已存在</view>
					<view class="email" v-if="invaild">邮箱无效</view>
					<image class="ok" v-if="isemail" src="../../static/register/Group.png"></image>
				</view>
				<view class="inputs-div">
					<input v-model="password" type="password" placeholder="请输入密码" class="password"/>
					<!-- <view class="tip" v-if="pwdtip">密码类型不对</view> -->
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
		<view :class="[{submit:isok},{submit1:!isok}]" @click="singup">注册</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nameexist:false,
				isuser:false,
				isemail:false,
				invaild:false,
				tip:false,
				nameinvaild:false,
				isok:false,
				username:'',
				email:'',
				password:'',
				countdown: 0,
				buttonText: '发送',
				emailCode:'',
				emailLint:'none',
				emailLintTip:'',
				iscounting:false,
			}
		},
		watch:{
			username:{
				handler:'isfull',
				deep:true
			},
			password:{
				handler:'isfull',
				deep:true
			},
			email:{
				handler:'isfull',
				deep:true
			},
			emailCode:{
				handler:'isfull',
				deep:true
			},
			tip:{
				handler:'isfull',
				deep:true
			},
			nameexist:{
				handler:'isfull',
				deep:true
			},
			isuser:{
				handler:'isfull',
				deep:true
			},
			isemail:{
				handler:'isfull',
				deep:true
			},
			iscounting:{
				handler:'isfull',
				deep:true
			},
		},
		computed:{
		},
		methods: {
			sendEmail() {
				if(this.email.length==0){
					this.emailLint='block'
					this.emailLintTip='邮箱为空'
					console.log('sss');
				}else{
					let reg= /^[a-zA-Z0-9][a-zA-Z0-9_]+\@[a-zA-Z0-9]+\.[a-zA-Z]{2,5}(\.[a-zA-Z]{2,5})*$/i;
					if(reg.test(this.email)){
						this.emailLint='none'
						this.emailLintTip=''
						if(this.isemail){
							
							if (this.countdown === 0) {
								
							  //发送获取验证码请求
							  uni.request({
							  	url:this.serverUrl +'/mail/emailRegister',
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
							this.emailLint='block'
							this.emailLintTip='邮箱已存在'
						}
						
					}else{
						this.emailLint='block'
						this.emailLintTip='邮箱不合法'
					}
				}
			    },
			startCountdown() {
			      this.countdown = 60;
			      this.updateButtonText();
					this.iscounting=true
			      const countdownInterval = setInterval(() => {
			        if (this.countdown > 0) {
			          this.countdown--;
					  
			          this.updateButtonText();
			        } else {
						this.iscounting=false
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
			
			
			
			isName:function(){
				let pat=/^[a-zA-Z0-9_-]{4,16}$/
				if(this.username.length>0){
					if(pat.test(this.username)){
						this.nameinvaild=false
						this.nameexist=false
						this.isuser=true
						//判断用户名
						// uni.request({
						// 	url:this.serverUrl +'/signup/judge',
						// 	data:{
						// 		data:this.username,
						// 		type:'name'
						// 	},
						// 	method:'POST',
						// 	success:(data)=>{
								
						// 		let status=data.data.status
						// 		if(status==200){
						// 			let res=data.data.result
						// 			if(res>0){
						// 				//用户名已经存在
						// 				this.nameexist=true
						// 				this.isuser=false
						// 			}else{
						// 				//不存在
						// 				this.nameexist=false
						// 				this.isuser=true
						// 			}
						// 		}else if(status==500){
						// 			uni.showToast({
						// 				title:'服务器发生错误',
						// 				duration:1500
						// 			})
						// 		}
						// 	}
						// })
					}else{
						this.nameinvaild=true
						this.nameexist=false
						this.isuser=false
					}
				}else{
					this.nameinvaild=false
					this.nameexist=false
					this.isuser=false
				}
			},
			isEmail:function(e){
				let reg= /^[a-zA-Z0-9][a-zA-Z0-9_]+\@[a-zA-Z0-9]+\.[a-zA-Z]{2,5}(\.[a-zA-Z]{2,5})*$/i;
			     this.emali=e.detail.value
				 if(this.emali.length>0){
					 if(reg.test(this.emali)){
						 this.invaild=false
						 //判断邮箱
						 uni.request({
						 	url:this.serverUrl +'/signup/judge',
						 	data:{
						 		data:this.email,
						 		type:'email'
						 	},
						 	method:'POST',
						 	success:(data)=>{
						 		let status=data.data.status
						 		if(status==200){
						 			let res=data.data.result
						 			if(res>0){
						 				//邮箱已经存在
						 				this.tip=true
						 				this.isemail=false
						 			}else{
						 				//不存在
						 				this.tip=false
						 				this.isemail=true
						 			}
						 		}else if(status==500){
						 			uni.showToast({
						 				title:'服务器发生错误',
						 				duration:1500
						 			})
						 		}
						 	}
						 })
					 }else{
						 this.invaild=true
						 this.isemail=false 
						 this.tip=false
					 }
				 }else{
					 this.invaild=false
					 this.isemail=false
					 this.tip=false
				 }
			},
				
			tologin:function(){
				uni.navigateTo({ 
					url:"../login/login"
				})
			},
			isfull:function(){
				if(this.username && this.password && this.email && this.emailCode.length>0){
					if(this.isuser && this.isemail && this.iscounting){
						this.isok=true
					}else{
						this.isok=false
					}	
				}else{
					this.isok=false
				}
			},
			singup:function(){
				if(this.isok){
					uni.request({
						url:this.serverUrl +'/mail/emailRegisterVerification',
						data:{
							name:this.username,
							email:this.email,
							pwd:this.password,
							emailCode:this.emailCode
						},
						method:'POST',
						success:(data)=>{
							let status=data.data.status
							if(status==200){
								//跳转登陆页
								uni.navigateTo({
									url:'../login/login?user='+this.email
								})
							}else if(status==500){
								uni.showToast({
									title:'服务器发生错误',
									icon:'none',
									duration:1500
								})
							}else if(status==403){
								uni.showToast({
									title:'验证码错误',
									icon:'none',
									duration:1500
								})
							}
						}
					})
				}else{
					console.log(this.emailCode);
				}
			}
		}
	}
</script>

<style lang="scss">
	.content { 
		// text-align: center;
		padding-top: var(--status-bar-height);

	}
.top-bar{
		position: fixed;
		z-index: 1000;
		// box-sizing: border-box;
		padding-top: var(--status-bar-height);
		left: 0;
		top: 0;
		width: 100%;
		height: 88rpx;
		background: $uni-bg-color;
		border-bottom: 1px solid $uni-border-color;
		.top-bar-left{
			float: left;
			width:88rpx ;
			
			padding-left: 14rpx;
			.register{
				font-size:$uni-font-size-lg;
				font-weight:500;
				color:$uni-text-color;
				line-height:88rpx;
			}
			.back{
				
				font-size: 60rpx;
			}
		}
	}
	.logo{
		text-align: center;
		image{
			padding-top: 160rpx;
			width:194rpx;
			height: 192rpx;
			margin: 0 auto;
		}
	}
	.main{
		padding: 54rpx $uni-spacing-row-lg 120rpx;
		.title{
			font-size: 56rpx;
			font-weight: 500;
			color: $uni-text-color;
			line-height: 80rpx;
		}
		.inputs{
			padding-top: 8rpx;
			input{
				padding-top: 40rpx;
				height: 88rpx;
				font-size: $uni-font-size-lg;
				font-weight: 500;
				color: $uni-text-color;
				line-height: 88rpx;
				border-bottom: 1px solid $uni-border-color;
			}
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
				border-bottom: 1px solid $uni-border-color;
				height: 88rpx;
				color: gray;
				display: flex;
				justify-content: center;
				padding-top: 40rpx;
				
				align-items: center;
			}
		}
		
		.inputs-div{
			position:relative;
		}
		.tip ,.email{
			position: absolute;
			top: 40rpx;
			right: 0;
			font-size: $uni-font-size-base;
			font-weight: 500;
			color: $uni-color-warning;
			line-height: 88rpx;
		}
		.ok{
			position: absolute;
			top: 76rpx;
			right: 0;
			width: 42rpx;
			height: 32rpx;
		}
	}
	.submit{
		margin: 0 auto;
		width: 520rpx;
		height: 96rpx;
		background:$uni-color-primary;
		box-shadow: 0px 50rpx 32rpx -36rpx rgba(255,228,49,0.4);
		border-radius: 48rpx;
		font-size: $uni-font-size-lg;
		font-weight:500;
		color: $uni-text-color;
		line-height: 96rpx;
		text-align: center;
	}
	.submit1{
		margin: 0 auto;
		width: 520rpx;
		height: 96rpx;
		background:rgba(39,40,50,0.2);
		border-radius: 48rpx;
		font-size: $uni-font-size-lg;
		font-weight:500;
		color: $uni-text-color-inverse;
		line-height: 96rpx;
		text-align: center;
	}
</style>
