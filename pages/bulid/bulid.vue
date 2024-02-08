<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" >
				<view class="text" @click="backup">
					取消
				</view>
			</view>
			<view class="top-bar-center">
				<view class="title">
					创建群聊
				</view>
			</view>
		</view>
		<view class="main">
			<view class="top">
				<view class="group-img">
					<image-cropper :src="tempFilePath" @confirm="confirm"  @cancel="cancel"></image-cropper>
					<image class="img" :src="cropFilePath" @tap="upload" ></image>
				</view>
				<view class="group-name">
					<input class="group-name-input" placeholder="输入群名称" placeholder-style="color:#aaa;font-weight:400;" v-model="groupName">
				</view> 
				<view class="title">用户</view>
			</view>
			
			<view class="friends">
				<view class="user" v-for="(item,index) in friends" :key="index" @click="selectUser(index)">
					<view class="selected" :class="{isSelected:item.select}">
						<image src='../../static/group/Group 2@2x.png' v-if="item.select" class="select-img"></image>
					</view>
					<image :src="item.imgurl" class="user-img"></image>
					<view class="name">
						{{item.name}}
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-bar" >
			<view class="bottom-btn" :class="{isEnough:selectNumber<=0 || groupName.length<=0}" @click="submit">创建{{selectNumber}}</view>
		</view>
	</view>
</template>

<script>
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	export default {
		data() {
			return {
				uid:'',
				token:'',
				tempFilePath:'',
				cropFilePath: "../../static/img/鸭子.jpg",
				gimgurl:'/group/group.png',
				heading:'',
				groupName:'',
				selectNumber:0,
				friends:[],
				user:[]
			};
		},
		onLoad:function(){
			this.getNumber()
			this.getStorage()
			this.getFriends()
		},
		components: {
			ImageCropper,
		},
		methods:{
			getStorage:function(){
				try{
					const value=uni.getStorageSync('user')
					if(value){
						this.uid=value.id
						this.token=value.token
					}else{
						uni.navigateTo({
							url:'../login/login'
						})
					}
				}catch(e){
					console.log('error')
				}
			},
			backup:function(){
				uni.navigateBack({
					delta:1
				})
			},
			upload() {
				uni.chooseImage({
				count: 1, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album','camera'], //从相册选择
				success: (res) => {
				     this.tempFilePath = res.tempFilePaths.shift()
				        }
				    });
				},
			confirm(e) {
				this.tempFilePath = "";
				this.cropFilePath = e.detail.tempFilePath;
				this.heading=e.detail.tempFilePath
				uni.uploadFile({
					url: this.serverUrl+'/files/upload',
					filePath: this.heading,
					name: "file",
					fileType: "image",
					formData:{
						url:'group',
						name:this.uid+new Date().getTime(),
						token:this.token
						},
					success: (uploadFileRes) => {
					  var backstr = uploadFileRes.data;
					  //自定义操作
					this.gimgurl=backstr
					},
			
			fail(e) {
				console.log("this is errormes " + e.message);
				},
			});
			},
			
			//获取好友
			getFriends: function() {
				uni.request({
					url: this.serverUrl + '/index/getfriend',
					data: {
						uid: this.uid,
						state: 0, //0代表已经是好友
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						this.refresh = true
						let status = data.data.status
						if (status == 200) {
							let res = data.data.result
							if (res.length > 0) {
								this.noone = false
								for (var i = 0; i < res.length; i++) {
									res[i].select=false
									res[i].imgurl = this.serverUrl + res[i].imgurl
									if (res[i].markname) {
										res[i].name = res[i].markname
									}
									this.friends.push(res[i])
								}
								console.log(this.friends);
							} else {
								// this.noone = true
							}
							//群列表
							// this.getGroup()
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
			
			//获取选择创建群人数
			getNumber:function(){
				this.selectNumber=0
				this.friends.forEach(item=>{
					if(item.select==true){
						this.selectNumber++
					}
				})
				return(this.selectNumber);
			},
			selectUser:function(e){
				this.friends[e].select=!this.friends[e].select
				console.log(this.getNumber()) 
			},
			//提交
			submit:function(){
				if(!(this.selectNumber<=0 || this.groupName.length<=0)){
					this.user=[]
					this.friends.forEach(item=>{
						if(item.select){
							this.user.push(item.id)
						}
					})
					console.log('user',this.user);
					uni.request({
						url: this.serverUrl + '/group/creategroup',
						data: {
							uid: this.uid,
							token: this.token,
							name:this.groupName,
							imgurl:this.gimgurl,
							user:this.user
						},
						method: 'POST',
						success: (data) => {
							this.refresh = true
							let status = data.data.status
							console.log('status',status);
							if (status == 200) {
								let res = data.data.result
								console.log('水水视',res);
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
				}
			}
		},
		
		
	}
</script>

<style lang="scss">
	.content{
			display: flex;
			flex-direction: column;
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
			text-align: center;
			background: $uni-bg-color;
			border-bottom: 1px solid $uni-border-color;
			.top-bar-left{
				z-index: 1111;
				float: left;
				padding-left: $uni-spacing-col-base;
				font-size: 40rpx;
				line-height: 80rpx;
			}
			.top-bar-center{
				position: absolute;
				text-align: center;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				margin: 0 auto;
				width: fit-content;
				text-align: center;
				line-height: 80rpx;
				font-size: 40rpx;
				color: #272832;
				letter-spacing: -0.69rpx;
				font-weight: 400;;
			}
		}
		.main{
			width: 100%;
			height: auto;
			display: flex;
			flex-direction: column;
			.top{
				padding-top: 110rpx;
				position: fixed;
				background: #fff;
				width: 100%;
				z-index: 100;
			}
			.group-img{
				width: 196rpx;
				height: 196rpx;
				margin: 0 auto;
				background: #FFE431;
				box-shadow: 0px 36px 40px 0px rgba(39,40,50,0.1);
				border-radius: 40rpx;
				overflow: hidden;
				.img{
					width: 196rpx;
					height: 196rpx;
				}
			}
			.group-name{
				padding: 62rpx $uni-spacing-col-base;
			}
			.group-name-input{
				text-align: center;
				height: 92rpx;
				background: $uni-bg-color-grey;
				border-radius: 46rpx;
				font-size: 32rpx;
				color: $uni-text-color;
			}
			.title{
				padding:$uni-spacing-row-base $uni-spacing-col-base 20rpx ;
				font-size: 44rpx;
				font-weight:600;
				color: $uni-text-color;
				line-height: 60rpx;
			}
			.friends{
				padding: 650rpx $uni-spacing-col-base 100rpx;
				.user{
					display: flex;
					flex-direction: row;
					align-items: center;
					height: 120rpx;
					.selected{
						flex: none;
						margin-right: 30rpx;
						width: 48rpx;
						height: 48rpx;
						background: rgba(255,228,49,0.5);
						border-radius: 24rpx;
						position: relative;
						display: flex;
						justify-content: center;
						align-items: center;
						.select-img{
							width: 30rpx;
							height: 20rpx;
						}
						
					}
					.isSelected{
						background: rgba(255,228,49,1);
					}
					.user-img{
						width: 80rpx;
						height: 80rpx;
						border-radius: $uni-border-radius-base;
						background-color: #FFE431;
					}
					.name{
						padding-left: 32rpx;
						font-size: 36rpx;
						color: $uni-text-color;
						display:-webkit-box;
						-webkit-box-orient:vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}
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
			background-color: rgba(255,255,255,0.9);
			box-shadow: 0px 1px 0px 0px rgba(0,0,0,0.25);
			.bottom-btn{
				text-align: center;
				line-height: 80rpx;
				font-size: 32rpx;
				// width: 684rpx;
				height: 80rpx;
				border-radius: $uni-border-radius-base;
				background: $uni-color-primary;
			}
			.isEnough{
				background:whitesmoke;
			}
		}
</style>
