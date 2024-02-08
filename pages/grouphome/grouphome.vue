<template>
	<view>
		<view class="top-bar">
			<view class="top-bar-left" @click="backTo">
				<image src="../../static/group/whiteback.png"></image>
			</view>
			<view class="top-bar-right">
				<view class="more" @click="touserdetial" >
					<image src="../../static/group/whitemore.png"></image>
				</view>
			</view>
		</view>
		<view class="top-bar bgbar" :animation='animationData1'>
			<view class="top-bar-left" @click="backTo">
				<image src="../../static/userdetail/rightarr.png"></image>
			</view>
			<view class="top-bar-right">
				<view class="more" @click="touserdetial" >
					<image src="../../static/usermain/more.png"></image>
				</view>
			</view>
		</view>
		
		<view class="bg">
			<image :src="groupDetial.imgurl + '?t=' + new Date().getTime()" class="bg-img" mode="aspectFill"></image>
		</view>
		<view class="main">
			<view class="main-inner">
				<view class="inf">
					<view class="name">{{groupDetial.name}}</view>
					<view class="time">2020/11/1</view>
					<view class="notice">女友“小阿俏”在评论区回应说：“因为她到了结婚的年龄，但是牛魔王始终没有结婚的打算”，所以两人才选择分开，是男方为了分手找的借口，根本不是买牛赔钱女友跑了。</view>
				</view>
				<view class="member">
					<view class="top">
						<view class="title">群成员</view>
						<view class="more">管理群成员</view>
						<image src="../../static/userdetail/rightarr.png" class="more-img"></image>
					</view>
					<view class="member-ls">
						<view class="member-li" v-for="(item,index) in groupmember" :key="index">
							<view class="imgs">
								<image src="../../static/img/delete.png" mode="aspectFill" class="delete"></image>
								
								<image class="user-img" :src="item.imgurl" mode="aspectFill"></image>
							</view>
							<view class="name"  v-if="item.id!==groupDetial.userID">{{item.name}}</view>
							<view class="name"  v-if="item.id==groupDetial.userID">群主:{{item.name}}</view>
						</view>
						<view class="member-li" @click="invite">
							<view class="imgs">
								<image src="../../static/submit/add.png" class="user-add" mode="aspectFill"></image>
								<view class="name">邀请</view>
							</view>
						</view>
					</view>
					<view class="clear"></view>
				</view>
				<view class="mitem">
					<view class="row" @click="modify('name','群名称',groupDetial.name ,true)" v-if="uid==groupDetial.userID">
						<view class="title">群名称</view>
						<view class="cont">{{groupDetial.name}}</view>
						<view class="more">
							<image src="../../static/userdetail/rightarr.png" mode="aspectFill"></image>
						</view>
					</view>
					<view class="row" v-if="uid!==groupDetial.userID" @click="Authortip">
						<view class="title">群名称</view>
						<view class="cont">{{groupDetial.name}}</view>
						<view class="more">
							
						</view>
					</view>
					
					<view class="row" v-if="uid==groupDetial.userID">
						<view class="title">群头像</view>
						<view class="cont">
							<view class="user-head" >
								<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
								<image class="group-img" :src="groupDetial.imgurl + '?t=' + new Date().getTime()" @tap="upload"></image>
							</view>
							<!-- <image :src="gimg" class="group-img" mode="aspectFill"></image> -->
						</view>
						<view class="more">
							<image src="../../static/userdetail/rightarr.png" mode="aspectFill"></image>
						</view>
					</view>
					
					<view class="row" v-if="uid!==groupDetial.userID" @click="Authortip">
						<view class="title">群头像</view>
						<view class="cont">
							<view class="user-head" >	
								<image class="group-img" :src="gimg" @tap="upload"></image>
							</view>
							<!-- <image :src="gimg" class="group-img" mode="aspectFill"></image> -->
						</view>
						<view class="more">
							
						</view>
					</view>
					
					<view class="row" @click="modify('notice','群公告',groupDetial.notice,true)" v-if="uid==groupDetial.userID">
						<view class="title">群公告</view>
						<view class="cont" v-if="groupDetial.notice">{{groupDetial.notice}}</view>
						<view class="cont"  v-if="!groupDetial.notice">还没有公告呢</view>
						<view class="more">
							<image src="../../static/userdetail/rightarr.png" mode="aspectFill"></image>
						</view>
					</view>
					<view class="row" v-if="uid!==groupDetial.userID" @click="Authortip">
						<view class="title">群公告</view>
						<view class="cont" v-if="groupDetial.notice">{{groupDetial.notice}}</view>
						<view class="cont"  v-if="!groupDetial.notice">还没有公告呢</view>
						<view class="more">
							
						</view>
					</view>
					
					<view class="row" @click="modify('giname','群内名','群名称的撒旦dsd该方法十大',true)">
						<view class="title">群内名</view>
						<view class="cont">群名称的撒旦dsd该方法十大</view>
						<view class="more">
							<image src="../../static/userdetail/rightarr.png" mode="aspectFill"></image>
						</view>
					</view>
					<view class="row">
						<view class="title">消息免打扰</view> 
						<view class="cont"></view>
						<view class="more">
							<switch :checked='swit' @change="switchChange" color="rgb(255,228,42)" class="switch"></switch>
						</view>
					</view>
				</view>
				<view class="bt-exit" v-if="groupDetial.userID==uid" @click="deleteGroupdialog">解散群</view>
				<view class="bt-exit" v-if="groupDetial.userID!==uid" @click="exitGroup">退出群</view>
			</view>
		</view>
		<view class="modify" :style="{bottom:-+widHeight+'px'}" :animation='animationData'>
			<view class="modify-header">
				<view class="close" @click="modify">取消</view>
				<view class="title">{{modifyTite}}</view>
				<view class="define" @click="modifySubmit">确定</view>
			</view>
			<view class="modify-main">
				<textarea v-model="data" class="modify-content"></textarea>
			</view>
			<uni-popup  ref="updatepopup" background-color="#aaffff">
					<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }"><text class="text">你还没有修改呢</text></view>
			</uni-popup>
		</view>
		<uni-popup  ref="popup" background-color="#aaffff" @change="change">
				<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }"><text class="text">只有管理员或者群主可以修改</text></view>
		</uni-popup>
		
		
		<uni-popup ref="deleteGroup" type="dialog">
			<uni-popup-dialog type="success" cancelText="取消" confirmText="解散" title=""
				content="确定要解散该群聊？" @confirm="deleteGroup" @close="dialogClose">
			</uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="success" cancelText="取消" confirmText="退出" title=""
				content="确定要退出群吗" @confirm="dialogConfirm" @close="dialogClose">
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import datas from '../../commons/js/dadas.js'
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	export default {
		data() {
			return {
				msgType:'center',
				messageText: '只有管理员或者群主可以修改',
				gid:'',
				gimg:'',
				groupName:'',
				swit:false,
				groupmember:[],//群成员详情
				groupDetial:'',//群详情
				top:0,
				animationData1:{},
				heading:'',
				tempFilePath:'',
				cropFilePath:'',
				modifyTite:'',
				data:'',
				oldData:'',
				type:'',
				animationData:{},
				isModify:false,
				widHeight:'1000'
				
			}
		},
		computed: {
			uimgurl() {
				return this.$store.state.userImgUrl;
			},
			uname() {
				return this.$store.state.userName;
			},
			uid() {
				return this.$store.state.userId;
			},
			utoken() {
				return this.$store.state.token;
			},
			...mapState(['friendsList']),
		},
		components:{
			ImageCropper
		},
		onLoad:function(e){
			this.gid=e.gid,
			this.gimg=e.gimg
			this.groupName=e.groupName
			this.getMember()
			this.getGroupDetial()
		},
		onReady:function(){
			this.getTop()
		},
		methods: {
			backTo:function(){
				uni.navigateBack({
					delta:1
				})
				uni.$emit('update',{msg:'页面更新'})
			},
			switchChange:function(){
				
			},
			getGroupDetial:function(){
				uni.request({
					url: this.serverUrl + '/group/getGroupDetial',
					data: {
						GroupID: this.gid,
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
			getMember:function(){
				uni.request({
					url: this.serverUrl + '/group/getGroupUserDetial',
					data: {
						GroupID: this.gid,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
				
						if (status == 200) {
							let res = data.data.result;
							this.groupmember=res
							this.groupmember.forEach(item=>{
								item.imgurl=this.serverUrl+item.imgurl
							})
							
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
			
			//解散群
			deleteGroupdialog:function(){
				this.$refs.deleteGroup.open()
			},
			
			deleteGroup:function(){
				uni.request({
					url: this.serverUrl + '/group/deleteGRoup',
					data: {
						groupID: this.gid,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
				
						if (status == 200) {
							uni.reLaunch({
								url:'../index/index'
							})
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
			//退出群
			exitGroup:function(){
				this.$refs.alertDialog.open()
				
			},
			
			
			dialogConfirm:function(){
				uni.request({
					url: this.serverUrl + '/group/exitGRoup',
					data: {
						groupID: this.gid,
						userID:this.uid,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
				
						if (status == 200) {
							uni.reLaunch({
								url:'../index/index'
							})
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
			
			invite:function(){
				uni.navigateTo({
					url:'/pages/invitefriends/invitefriends?groupID=' + this.gid
				})
			},
			getTop:function(){
				const query=uni.createSelectorQuery().in(this);
				query.select(".main-inner").boundingClientRect(data=>{
					this.top=data.top
					
				}).exec()
			},
			addAnimation:function(){
				var animation=uni.createAnimation({
					duration:300,
					timingFunction:'linear'
				})
				if(this.top<60){
					animation.opacity(1).step()
				}else{
					animation.opacity(0).step()
				}
				this.animationData1=animation.export()
			},
			onPageScroll:function(){
				this.getTop()
				this.addAnimation()
			},
			upload() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: (res) => {
						this.tempFilePath = res.tempFilePaths.shift()
						console.log(this.tempFilePath);
					}
				});
			},
			confirm(e) {
				this.tempFilePath = "";
				this.gimg = e.detail.tempFilePath;
				this.heading = e.detail.tempFilePath
				
				uni.uploadFile({
					url: this.serverUrl + "/files/upload",
					filePath: this.gimg,
					name: "file",
					fileType: "image",
					formData: {
						url: 'group',
						name: this.gid,
						token: this.token
					},
					success: (uploadFileRes) => {
						var backstr = uploadFileRes.data;
						
						uni.request({
							url: this.serverUrl + '/group/updateGroup',
							data: {
								groupID: this.gid,
								type:'imgurl',
								value:backstr, 
								token: this.token
							},
							method: 'POST',
							success: (data) => {
								let status = data.data.status;
						
								if (status == 200) {
									//更新数据
									this.getMember()
									this.getGroupDetial()
									uni.showToast({
										title: '修改成功',
										icon: 'none',
										duration: 2000
									});
									
								
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
					fail(e) {
						console.log("this is errormes " + e.message);
					},
				});
				
				//上传之后拿到反馈的数据之后修改群的数据
				
			
			},
			cancel() {
				console.log("canceled");
				this.tempFilePath = "";
			},
			//没权限点击提醒
			Authortip:function(){
				this.$refs.popup.open('top')
			},
			
			//动画函数
			modify: function(t, type, data, ispwd) {
					this.modifyTite = type
					this.data = data
					this.isModify = !this.isModify
					this.oldData = data
					//获取修改项类型
					this.type = t
					var animation = uni.createAnimation({
						duration: 300,
						timingFunction: 'ease',
					})
					if (this.isModify) {
						animation.bottom(0).step()
					} else {
						animation.bottom(-this.widHeight).step()
					}
					this.animationData = animation.export()
			},
			modifySubmit: function() {
				//提交修改
				if (this.data.length > 0 && this.oldData != this.data) {
					//满足所有条件进行修改
					this.type //修改项
					this.data 		//值
					console.log(this.type,this.data);
					uni.request({
						url: this.serverUrl + '/group/updateGroup',
						data: {
							groupID: this.gid,
							type:this.type,
							value:this.data, 
							token: this.token
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status;
					
							if (status == 200) {
								//更新数据
								this.getMember()
								this.getGroupDetial()
								uni.showToast({
									title: '修改成功',
									icon: 'none',
									duration: 2000
								});
							
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
					
					
					this.modify()
				}else{
					this.$refs.updatepopup.open('bottom')
				}
			},
		}
	}
</script>

<style lang="scss">
	.popup-content {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 15px;
			padding-top: 30px;
			height: 50px;
			background-color: white;
			
		}
		.popup-height {
				display: flex;
				width: 200px;
				border-radius: 20px;
			}
		
			.text {
				font-size: 15px;
				color: #333;
			}
	.clear{
		clear: both;
	}
	.bgbar{
		opacity: 0;
		background-color: #fff !important;
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
		width: 100%;
		height: 100%;
		background-color: #fff;
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;
		.bg-img{
			width: 100%;
			height:750rpx
		}
	}
	.main{
		padding-top: 360rpx;
		
		.main-inner{
			width: 100%;
			min-height: 720rpx;
			background-color: #fff;
			border-radius: 40rpx 40rpx 0 0;
			
		}
		.inf{
			padding:$uni-spacing-row-base $uni-spacing-col-base 0;
			padding-bottom: 40rpx;
			box-sizing: border-box;
			border-bottom: 1px solid #eee;
			.name{
				float: left;
				font-size: 48rpx;
				font-weight: 600;
				color: #272832;
				line-height: 66rpx;
			}
			.time{
				float: right;
				font-size: 28rpx;
				color: rgba(39,40,50,0.5);
				line-height: 66rpx;
			}
			.notice{
				padding-top: 20rpx;
				font-size: 28rpx;
				color: #272832;
				clear: both;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
		}
		.member{
			border-bottom: 1px solid #eee;
			.top{
				padding:$uni-spacing-row-base $uni-spacing-col-base 0;
				box-sizing: border-box;
				height: 100rpx;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				.title{
					flex: 1;
					font-size: 36rpx;
					font-weight: 600;
					color: #272832;
				}
				.more{
					float: right;
					padding-right: 10rpx;
					font-size: 32rpx;
					font-weight: 400;
					color: rgba(39,40,50,0.6);
				}
				.more-img{
					width: 42rpx;
					height: 40rpx;
				}
			}
			.member-ls{
				width: 100%;
				padding: 20rpx 16rpx;
				box-sizing: border-box;
				
			}
			.member-li{
				padding-bottom: 32rpx;
				width: 20%;
				float: left;
				text-align: center;
				.imgs{
					display: inline-block;
					position: relative;
					width: 104rpx;
					height: 104rpx;
					border-radius: 20rpx;
					background-color: $uni-color-primary;
				}
				.user-img{
					width: 104rpx;
					height: 104rpx;
					border-radius: 20rpx;
				}
				.delete{
					width: 30rpx;
					height: 30rpx;
					border-radius: 20rpx;
					background-color: red;
					position: absolute;
					top: -10rpx;
					right: -10rpx;
					z-index: 10;
				}
				.groupmaster{
					position: absolute;
					bottom: -10rpx;
					right: -10rpx;
				}
				.name{
					padding:0 8rpx;
					font-size: 28rpx;
					color: #272832; 
					line-height: 40rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}
				.user-add{
					width: 104rpx;
					height: 104rpx;
					padding: 32rpx;
					box-sizing: border-box;
				}
			}
		}
		.mitem{
			display: flex;
			flex-direction: column;
			padding-top: 22rpx;
			width: 100%;
			border-bottom: 1px solid #eee;
			.row {
				display: flex;
				flex-direction: row;
			}
			
			.title {
				flex: none;
				padding: 0 $uni-spacing-col-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 112rpx;
			}
					
			.cont {
				flex: auto;
				font-size: $uni-font-size-lg;
				color: $uni-text-color-grey;
				line-height: 112rpx;
				overflow: hidden;
				height: 112rpx;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.group-img{
				width: 80rpx;
				height: 80rpx;
				border-radius: 20rpx;
				margin-top: 16rpx;
			}
			.more {
				display: flex;
				flex: none;
				height: 112rpx;
				align-items: center;
			
				image {
					width: 50rpx;
					height: 50rpx;
				}
			}
			.switch{
				// margin-right: 10rpx;
			}
			
		}
		.bt-exit {
			margin-top: 80rpx;
			text-align: center;
			font-size: $uni-font-size-lg;
			color: $uni-color-warning;
			line-height: 88rpx;
			font-weight: 400;
			padding-bottom: env(safe-area-inset-bottom);
		}
		
	}
	.modify {
		position: fixed;
		z-index: 1112;
		left: 0;
		height: 100%;
		width: 100%;
		background-color: #fff;
	
		.modify-header {
			width: 100%;
			height: 88rpx;
			padding-top: var(--status-bar-height);
			display: flex;
			flex-direction: row;
			align-items: center;
			border-bottom: 1px solid $uni-border-color;
	
			.close {
				padding-left: $uni-spacing-col-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
			}
	
			.title {
				flex: auto;
				text-align: center;
				font-size: 40rpx;
				color: $uni-text-color;
				line-height: 88rpx;
			}
	
			.define {
				padding-right: $uni-spacing-col-base;
				font-size: $uni-font-size-lg;
				color: $uni-color-success;
				line-height: 44rpx;
			}
		}
	
		.modify-main {
			display: flex;
			padding: $uni-spacing-col-base;
			flex-direction: column;
	
			.modify-pwd {
				margin-bottom: $uni-spacing-col-base;
				padding: 0 20rpx;
				box-sizing: border-box;
				width: 100%;
				flex: auto;
				height: 88rpx;
				background: $uni-bg-color-grey;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 88rpx;
				border-radius: $uni-border-radius-base;
			}
	
			.modify-content {
				flex: auto;
				padding: 16rpx 20rpx;
				box-sizing: border-box;
				width: 100%;
				height: 386rpx;
				background: $uni-bg-color-grey;
				border-radius: $uni-border-radius-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
			}
		}
	}
</style>
