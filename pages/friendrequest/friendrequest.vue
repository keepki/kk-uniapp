<template>
	<view class="content">
		

		<view class="top-bar">
			<view class="top-bar-left" @click="backup">
				<image src="../../static/userdetail/rightarr.png"></image>
			</view>
			<view class="top-bar-center">
				好友请求
			</view>
		</view>
		<view class="main">
			<view class="requester" v-if="requester.length==0 && groupRequester.length==0">
				空空如也。。。
			</view>
			
			<view class="requester" v-for="(item,index) in requester" :key="index">
				<view class="request-top">
					<view class="reject btn" @click="refuse(item.id)">拒绝</view>
					<view class="header-img">
						<image :src="item.imgurl"></image>
					</view>

					<view class="aggree btn" @click="agree(item.id)">同意</view>
				</view>
				<view class="requester-center">
					<view class="title">{{item.name}}</view>
					<view class="time">{{changetime(item.lastTime)}}</view>
				</view>
				<view class="notice">
					<text>留言:</text>
					<view class="msgbox">
						{{item.msg}}
					</view>

				</view>
			</view>

		<transition-group name="fade" mode="out-in">
			<view class="requester" v-for="(item,index) in groupRequester" :key="index">
				<view class="request-top">
					<view class="reject btn" @click="RefuseGroupInvite(item)">拒绝</view>
					<view class="header-img">
						<image :src="item.Inviterimgurl"></image>
					</view>

					<view class="aggree btn" @click="AgreeGroupInvite(item)">同意</view>
				</view>
				<view class="requester-center">
					<view class="title">{{item.InviterName}}:邀请你加入群聊:{{item.groupID.name}}</view>
					<view class="time">{{changetime(item.time)}}</view>
				</view>
				<view class="notice">
					<text>留言:</text>
					<view class="msgbox">
						群邀请通知
					</view>

				</view>
			</view>
			</transition-group>
		</view>
		<uni-popup ref="message" type="message">
			<uni-popup-message type="success" message="已拒绝" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
	
</template>

<script>
	import datas from "@/commons/js/dadas.js"
	import mytime from "@/commons/js/mytime.js"
	export default {
		data() {
			return {
				requester: [],
				groupRequester: [],
				uid: '',
				imgurl: '',
				token: '',
			};
		},
		computed: {
			uimgurl() {
				return this.$store.state.userImgUrl;
			},
			uname() {
				return this.$store.state.userName;
			},

			utoken() {
				return this.$store.state.token;
			},
		},
		onLoad: function() {
			this.getStorages()
			// this.getRequester()
			this.friendRequest()
			this.groupRequest()
		},
		onPullDownRefresh() {
			this.getStorages()
			// this.getRequester()
			this.friendRequest()
			this.groupRequest()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			getStorages: function() {
				try {
					const value = uni.getStorageSync('user')
					if (value) {
						this.uid = value.id,
						console.log(this.uid);
						this.token = value.token
						this.myname = value.name

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
				return mytime.dataTime(time)
			},
			getRequester: function() {
				this.requester = datas.friends();
				for (let i = 0; i < this.requester.length; i++) {
					this.requester[i].imgurl = "../../static/img/" + this.requester[i].imgurl
				}
			},
			backup: function() {
				uni.navigateBack({
					delta: 1
				})
			},
			//同意群邀请
			AgreeGroupInvite: function (item) {
			  // 封装成 Promise 的请求函数
			  const sendInvitFriendRequest = () => {
			    return new Promise((resolve, reject) => {
			      uni.request({
			        url: this.serverUrl + '/group/invitFriend',
			        data: {
			          groupID: item.groupID._id,
			          userID: this.uid,
			          token: this.token
			        },
			        method: 'POST',
			        success: (data) => {
			          let status = data.data.status;
			          if (status == 200) {
			            console.log('同意成功');
			            resolve(status);
			          } else if (status == 500) {
			            uni.showToast({
			            		title: '服务器出错',
			            		icon: 'none',
			            		duration: 2000
			            	})
			            reject('服务器出错');
			          } else if (status == 300) {
			            uni.navigateTo({
			            		url: '../login/login?name=' + this.myname
			            	})
			            reject('用户未登录');
			          } 
			        },
			        fail: (err) => {
			          console.error(err);
			          reject(err);
			        }
			      });
			    });
			  };
			
			  const sendRefuseInviteRequest = () => {
			    return new Promise((resolve, reject) => {
			      uni.request({
			        url: this.serverUrl + '/group/refuseInvite',
			        data: {
			          groupID: item.groupID._id,
			          inviterID: item.InviterID,
			          receiverID: this.uid,
			          token: this.token
			        },
			        method: 'POST',
			        success: (data) => {
			          let status = data.data.status;
			          if (status == 200) {
			            this.groupRequest();
			            console.log('邀请消息成功删除');
			            resolve(status);
			          } else if (status == 500) {
			            uni.showToast({
								title: '服务器出错',
								icon: 'none',
								duration: 2000
							})
			            reject('服务器出错');
			          } else if (status == 300) {
			            uni.navigateTo({
								url: '../login/login?name=' + this.myname
							})
			            reject('用户未登录');
			          } 
			        },
			        fail: (err) => {
			          console.error(err);
			          reject(err);
			        }
			      });
			    });
			  };
			
			  // 使用 Promise.all 来按顺序执行两个请求
			  Promise.all([sendInvitFriendRequest(), sendRefuseInviteRequest()])
			    .then(() => {
			      // 在这里可以处理两个请求都成功的情况
				  uni.showToast({
				  		title: '成功加入群聊',
				  		icon: 'none',
				  		duration: 2000
				  	})
			    })
			    .catch((error) => {
			      // 处理任何一个请求失败的情况
			      console.error(error);
			    });
			},

			//拒绝群邀请
			RefuseGroupInvite: function(item) {
				
				uni.request({
					url: this.serverUrl + '/group/refuseInvite',
					data: {
						groupID: item.groupID._id,
						inviterID: item.InviterID,
						receiverID: this.uid,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						if (status == 200) {
							let res = data.data.result
							this.groupRequest()
							console.log('拒绝成功');
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

			//好友申请列表
			friendRequest: function() {
				uni.request({
					url: this.serverUrl + '/index/getfriend',
					data: {
						uid: this.uid,
						state: 1, //1是代表我申请别人，还在申请中
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						if (status == 200) {
							let res = data.data.result

							for (var i = 0; i < res.length; i++) {
								res[i].imgurl = this.serverUrl + res[i].imgurl
								this.getleave(res, i)
							}
							this.requester = res

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
			//群申请列表
			groupRequest: function() {
				uni.request({
					url: this.serverUrl + '/group/getGroupInviteMsg',
					data: {
						userID: this.uid,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						if (status == 200) {
							let res = data.data.result
							console.log(res);
							for (var i = 0; i < res.length; i++) {
								res[i].groupID.imgurl = this.serverUrl + res[i].groupID.imgurl
								res[i].Inviterimgurl = this.serverUrl + res[i].Inviterimgurl
							}
							this.groupRequester = res
							console.log(this.groupRequester);
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

			//拒绝好友申请
			refuse: function(fid) {
				uni.request({
					url: this.serverUrl + '/friend/deletefriend',
					data: {
						uid: this.uid,
						fid: fid,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						if (status == 200) {
							for (var i = 0; i < this.requester.length; i++) {
								if (this.requester[i].id == fid) {
									this.requester.splice(i, 1)
								}
							}

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

			//同意好友申请
			agree: function(fid) {
				uni.request({
					url: this.serverUrl + '/friend/updatefriendstate',
					data: {
						uid: this.uid,
						fid: fid,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						if (status == 200) {
							for (var i = 0; i < this.requester.length; i++) {
								if (this.requester[i].id == fid) {
									this.requester.splice(i, 1)
								}
							}

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

			//获取留言
			getleave: function(arr, i) {
				uni.request({
					url: this.serverUrl + '/index/getlastmsg',
					data: {
						uid: this.uid,
						fid: arr[i].id,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						if (status == 200) {
							let res = data.data.result
							let e = arr[i]
							e.msg = res.message
							arr.splice(i, 1, e)


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
		}
	}
</script>

<style lang="scss">
	.fade-enter-active, .fade-leave-active {
	  transition: opacity 0.5s;
	}
	.fade-enter, .fade-leave-to {
	  opacity: 0;
	}
	.content {
		display: flex;
		flex-direction: column;
		padding-top: var(--status-bar-height);
		padding-bottom: $uni-spacing-col-base;
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
		background: $uni-bg-color;
		border-bottom: 1px solid $uni-border-color;

		.top-bar-left {
			z-index: 1111;
			float: left;
			padding-left: $uni-spacing-col-base;

			image {
				z-index: 1100;
				// padding-top: 5rpx;
				margin-top: 10rpx;
				width: 68rpx;
				height: 68rpx;
				border-radius: 25rpx;
			}
		}

		.top-bar-center {
			position: absolute;
			text-align: center;
			left: 110rpx;
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
	}

	.main {
		padding: 100rpx $uni-spacing-col-base;

		.requester {
			margin-top: 112rpx;
			padding: $uni-spacing-col-base;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px 24rpx 64rpx -8rpx rgba(0, 0, 0, 0.1);
			border-radius: $uni-border-radius-base;
		}

		.request-top {
			display: flex;
			flex-direction: row;

			.btn {
				text-align: center;
				flex: auto;
				width: 160rpx;
				height: 60rpx;
				background: rgba(255, 93, 91, 0.1);
				border-radius: 40rpx;
				line-height: 64rpx;
				font-size: $uni-font-size-lg;
			}

			.reject {
				color: $uni-color-warning;
				background-color: rgba(255, 93, 91, 0.1);
			}

			.aggree {
				color: $uni-text-color;
				background-color: $uni-color-primary;
			}

			.header-img {
				margin-top: -104rpx;
				flex: auto;
				text-align: center;

				image {
					width: 144rpx;
					height: 144rpx;
					border-radius: 50%;
				}
			}
		}

		.requester-center {
			text-align: center;
			padding-top: 20rpx;
			padding-bottom: 40rpx;

			.title {
				font-size: 36rpx;
				font-weight: 500;
				color: $uni-text-color-disable;
				line-height: 50rpx;
			}

			.time {
				font-size: $uni-font-size-sm;
				color: $uni-text-color-disable;
				line-height: 34rpx;
			}
		}

		.notice {
			padding: $uni-spacing-row-sm $uni-spacing-col-base;
			border-radius: $uni-border-radius-base;
			background-color: $uni-bg-color-grey;
			font-size: $uni-font-size-base;
			color: $uni-text-color;
			line-height: 48rpx;
		}

		.msgbox {
			// padding: 0 20rpx;
			// margin-left: 20rpx;
			// border-radius: 20rpx;
			// background-color: antiquewhite;
			display: inline-block;
		}
	}
</style>
