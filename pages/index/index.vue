<template>
	<view class="content">
		<transition name="slide-fade" mode="out-in">
			<callbrand v-if="calling"></callbrand>
		</transition>

		<transition name="slide-fade" mode="out-in">
			<phone v-if="phoneShow"></phone>
		</transition>
		<view class="top-bar">
			<view class="top-bar-left">
				<image :src="imgurl" @click="toUserHome"></image>
			</view>

			<view class="top-bar-center">
				<image src="../../static/img/yaya.png" class="logo"></image>
			</view>
			<view class="top-bar-right">
				<view class="add" @click="tobuilGroup">
					<image src="../../static/index/add group.png"></image>
				</view>
				<view class="search" @click="tosearch">
					<image src="../../static/index/search.png"></image>
				</view>
			</view>
		</view>

		<view class="main">
			<view class="refresh" v-if="!refresh">
				<image src="../../static/img/meme.jpg"></image>
				<view class="ref-title">下拉刷新</view>
			</view>

			<view class="noone" v-if="noone">
				<image src="../../static/img/walk.png" mode="aspectFit"></image>
				<view class="no-title">
					你还没有好友
				</view>
				<view class="search-btn" @click="tosearch">
					搜索好友
				</view>
			</view>

			<view class="apply" v-if="requestData>0">
				<view class="friends">
					<view class="friend-list">
						<view class="friend-list-l">
							<text class="tip">{{requestData}}</text>
							<navigator url="../friendrequest/friendrequest">
								<image src="../../static/logo.png"></image>
							</navigator>

						</view>
						<view class="friend-list-r" @click="toFriendRequest">
							<view class="top">
								<view class="name">新的消息</view>
								<view class="time">{{changetime(requestTime)}}</view>
							</view>
							<view class="news">有{{requestData}}条新消息</view>
						</view>
					</view>
				</view>
			</view>
			<view class="friends">
				<view class="friend-list" v-for="(item,index) in friends" :key="index" v-if="item.msg!==''">
					<view class="friend-list-l" >
						<text class="tip" v-if="item.tip>0">{{item.tip}}</text>
						<navigator url="../userhome/userhome">
							<image :src="item.imgurl + '?t=' + new Date().getTime()"></image>
							<view class="group" v-if="item.type==1"></view>
						</navigator>

					</view>
					<view class="friend-list-r" @click="toChatHome(item)">
						<view class="top">
							<view class="name" v-if="item.type==0">{{item.name}}</view>
							<view class="name" v-if="item.type==1">群:{{item.name}}</view>
							<view class="time">{{changetime(item.lastTime)}}</view>
						</view>
						<view class="news">{{item.msg}}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- <transition name="slide-fade" mode="out-in" >
		      <friendcircle v-show="friendcircleShow"></friendcircle>
		</transition> -->

		<!-- <view class="bottom-bar">
			<view class="item" @click="indexshow">
				<image class="item-img" src="../../static/img/logo1.png" ></image>
			</view>
			<view class="item" @click="tanchu">
				<image class="item-img" src="../../static/img/logo2.png" ></image>
			</view>
			<view class="item" @click="tanchu">
				<image class="item-img" src="../../static/img/logo3.png" ></image>
			</view>
			<view class="item" @click="friendShow">
				<image class="item-img" src="../../static/img/logo4.png" ></image>
			</view>
		</view> -->

	</view>
</template>

<script>
	import mytime from "../../commons/js/mytime.js"
	import datas from "../../commons/js/dadas.js"
	import myfun from '../../commons/js/myfun.js'

	import phone from '../../components/phone/phone.vue'
	import callbrand from '../../components/callbrand.vue'
	import friendcircle from '../../components/friendscircle/friendscircle.vue'

	export default {
		data() {
			return {
				friends: [],
				groups: [],
				uid: '', //用户id
				imgurl: '', //用户头像地址
				token: '',
				userAgentID:'',//用户账号
				requestData: 0,
				requestTime: '',
				myname: '',
				refresh: false,
				noone: false,
				callerimg: '',
				callername: '',
				friendId: '', //打电话过来的朋友id
				friendcircleShow: false
			}
		},
		components: {
			callbrand,
			phone,
			friendcircle
		},
		computed: {
			phoneShow() {
				return this.$store.state.phoneShow;
			},
			calling() {
				return this.$store.state.calling;
			}
		},
		onShow() {
			if (this.friends.length == 0) {
				this.getStorages()
				this.friendRequest()
				this.groupRequest()
				this.getFriends2(()=>{
					
					this.getGroup()
				})
				this.join(this.uid)
				this.receiveSocketMsg()
				this.groupSocket()
				this.leaveChatr()
			}
		},
		mounted: function() {
			
			this.socket.on('callRemote', (uid, fimgurl, uname, fid) => {
				//有朋友打电话过来，存储一下朋友的信息,uid才是打电话过来的朋友id
				this.$store.commit('setFriendId', fid)
				this.$store.commit('setFriendImgUrl', fimgurl)
				this.$store.commit('setFriendName', uname)
				this.$store.commit('changeCalling', true);
				this.$store.commit('setUserId', uid)
			})
			this.socket.on('cancel', () => {
				this.calling = false
			})
		},
		onPullDownRefresh() {
			this.friends = []
			this.groups=[]
			this.getStorages()
			this.friendRequest()
			this.groupRequest()
			this.getFriends2(()=>{
				
				this.getGroup()
			})
			this.join(this.uid)
			this.groupSocket()
			this.leaveChatr()
			
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			tanchu: function() {
				alert('别点了还没作呢')
			},
			indexshow: function() {
				this.friendcircleShow = false
			},
			friendShow: function() {
				this.friendcircleShow = true
			},
			changetime: function(time) {
				return mytime.dataTime(time)
			},
			getStorages: function() {
				try {
					const value = uni.getStorageSync('user')
					if (value) {
						this.uid = value.id,
						this.imgurl = this.serverUrl + value.imgurl,
						this.token = value.token
						this.myname = value.name
						this.userAgentID=value.userAgentID,
						this.$store.commit('setUserImgUrl', this.imgurl)
						this.$store.commit('setuserName', this.myname)
						this.$store.commit('setToken', this.token)
						this.$store.commit('setUserId', this.uid)
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

			getFriends2: function(callback) {
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
									res[i].imgurl = this.serverUrl + res[i].imgurl
									if (res[i].markname) {
										res[i].name = res[i].markname
									}
									this.friends.push(res[i])
								}
								this.$store.commit('setfriendsList', this.friends)
								
							} else {
								this.noone = true
							}
							//群列表
							callback(); 
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
			//好友申请列表
			friendRequest: function() {
				uni.request({
					url: this.serverUrl + '/index/getfriend',
					data: {
						uid: this.uid,
						state: 1, //1是代表别人盛情我，还在申请中，2代表我申请别人
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						this.refresh = true
						let status = data.data.status
						if (status == 200) {
							this.noone = false
							let res = data.data.result

							this.requestData = res.length
							if (res.length > 0) {
								this.requestTime = res[0].lastTime
								for (var i = 0; i < res.length; i++) {
									if (this.requestTime < res[i].lastTime) {
										this.requestTime = res[i].lastTime
									}
								}
							} else {
								this.noone = true
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
			//群申请列表
			groupRequest:function(){
				uni.request({
					url:this.serverUrl+'/group/getGroupInviteMsg',
					data:{
						userID:this.uid,
						token:this.token
					},
					method:'POST',
					success:(data)=>{
						let status=data.data.status
						if(status==200){
							let res=data.data.result
							if(this.requestData>0){
								//说明已经获取到了好友的请求，
								this.requestData += res.length
							}else{
								this.requestData = res.length
							}
							
							if (res.length > 0) {
								this.requestTime = res[0].time
								for (var i = 0; i < res.length; i++) {
									if (this.requestTime < res[i].time) {
										this.requestTime = res[i].time
									}
								}
							}else {
								this.noone = true
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
			//获取群列表
			getGroup: function() {

				uni.request({
					url: this.serverUrl + '/group/getUserGroups',
					data: {
						userId: this.uid,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						
						if (status == 200) {
							let res = data.data.result
							if (res.length > 0) {
								let groupCount = res.length;
								let processedCount = 0;
								
								const processGroup = (group) => {
									this.getLatGroupMsg(group, (modifiedGroup) => {
										processedCount++;
										this.groups.push(modifiedGroup);
										this.socket.emit('group', modifiedGroup.id);

										if (processedCount === groupCount) {
											
											this.isOk(this.friends);
										}
									});
								};

								for (var i = 0; i < res.length; i++) {
									res[i].imgurl = this.serverUrl + res[i].imgurl;
									processGroup(res[i]);
								}
							}
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

			getLatGroupMsg: function(resd, callback) {
				
				uni.request({
					url: this.serverUrl + '/group/getlastgroupmsg',
					data: {
						gid: resd.id,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;

						if (status == 200) {
							let res = data.data.result;
							
							if (res.types == 0) {
								// 文字
							} else if (res.types == 1) {
								// 图片
								res.message = '[图片]';
							} else if (res.types == 2) {
								// 音频
								res.message = '[音频]';
							} else if (res.types == 3) {
								// 位置
								res.message = '[位置]';
							} else if (res.types == 4) {
								// 位置
								res.message = '[视频]';
						}
							resd.msg = res.name + ':' + res.message;
							resd.lastTime = resd.time; 
							resd.type=1
							delete resd.time;
							callback(resd);
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
						else if (status == 304) {
							//没有消息
							resd.msg=''
							resd.type=1
							resd.lastTime = resd.time;
							delete resd.time;
							callback(resd);
						}
					}
				});
			},

			//群消息接受
			// 群与好友排序
			isOk: function(e) {
				console.log(e);
				if (e.length > 0) {
					this.friends = this.friends.concat(this.groups)
					this.friends = myfun.paixu(this.friends, 'lastTime', 0)
					console.log(this.friends);
				}
			},
			//获取未读消息数
			getUnread: function(arr, i) {
				uni.request({
					url: this.serverUrl + '/index/unreadmsg',
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
							e.tip = res
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


			//socket 模块使用
			//用户登录
			join: function(uid) {
				this.socket.emit('login', uid)
			},
			//聊天数据接受
			receiveSocketMsg: function(msg) {
				this.socket.on('msg', (msg, fromid, tip) => {

					let nmsg = ''
					if (msg.types == 0) {
						nmsg = msg.message
					} else if (msg.types == 1) {
						nmsg = '[图片]'
					} else if (msg.types == 2) {
						nmsg = '[语音]'
					} else if (msg.types == 3) {
						nmsg = '[定位]'
					} else if (msg.types == 4) {
						nmsg = '[视频]'
					}

					for (var i = 0; i < this.friends.length; i++) {
						if (this.friends[i].id == fromid) {
							let e = this.friends[i]
							e.lastTime = new Date()
							e.msg = nmsg
							e.tip++
							this.friends.splice(i, 1)
							this.friends.unshift(e)
						}
					}

				})
			},
			groupSocket: function() {
				this.socket.on('groupmsg', (msg, gid, uname, uimg, fromid, tip) => {
					
					let nmsg = ''
					if (msg.types == 0) {
						nmsg = msg.message
					} else if (msg.types == 1) {
						nmsg = '[图片]'
					} else if (msg.types == 2) {
						nmsg = '[语音]'
					} else if (msg.types == 3) {
						nmsg = '[定位]'
					} else if (msg.types == 3) {
						nmsg = '[视频]'
					}

					for (var i = 0; i < this.friends.length; i++) {
						if (this.friends[i].id == gid) {
							let e = this.friends[i]
							e.lastTime = new Date()
							if (fromid == this.uid) {
								e.msg = nmsg
							} else {
								e.msg = uname + ': ' + nmsg
							}
							e.tip++
							this.friends.splice(i, 1)
							this.friends.unshift(e)
						}
					}
				})
			},
			//修改已读
			leaveChatr: function() {
				this.socket.on('leavechatr', (uid, fid) => {
					
					for (var i = 0; i < this.friends.length; i++) {
						if (this.friends[i].id == fid) {
							let e = this.friends[i]
							e.tip = 0
							this.friends.splice(i, 1, e)
						}
					}
				})
			},
			tosearch: function() {
				uni.navigateTo({
					url: "/pages/search/search"
				})
			},
			tobuilGroup: function() {
				uni.navigateTo({
					url: "/pages/bulid/bulid"
				})
			},
			toUserHome: function() {
				uni.navigateTo({
					url: "../userhome/userhome?id=" + this.uid
				})
			},
			toFriendRequest: function() {
				uni.navigateTo({
					url: "../friendrequest/friendrequest"
				})
			},
			toChatHome: function(data) {

				uni.navigateTo({
					url: '/pages/chatroom/chatroom?id=' + data.id + '&name=' + data.name + '&img=' + data.imgurl + '&type=' + data.type
				})
			},
		}
	}
</script>

<style lang="scss">
	.slide-fade-enter-active,
	.slide-fade-leave-active {
		transition: opacity 0.5s, transform 0.5s;
	}

	.slide-fade-enter,
	.slide-fade-leave-to {
		opacity: 0;
		transform: translateY(-20px);
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
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
		background: $uni-bg-color;
		border-bottom: 1px solid $uni-border-color;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.top-bar-left {
			z-index: 1101;
			
			padding-left: $uni-spacing-col-base;

			image {
				z-index: 1100;
				// padding-top: 5rpx;
				width: 88rpx;
				height: 88rpx;
				border-radius: 25rpx;
				background-color: yellow;
			}
		}

		.top-bar-center {

			display: flex;
			align-items: center;
			.logo {
				
				width: 88rpx;
				height: 62rpx;
			}
		}

		.top-bar-right {
			
			padding-right: 14rpx;

			.search {

				width: 88rpx;
				height: 88rpx;
				display: inline-block;

			}

			.add {
				width: 88rpx;
				height: 88rpx;
				display: inline-block;

			}

			image {
				padding: 18rpx 0 0 18rpx;
				width: 52rpx;
				height: 52rpx;
			}
		}
	}

	.main {
		width: 100%;
		padding-top: 108rpx;

	}

	.refresh {
		text-align: center;
		padding-top: 480rpx;

		image {
			width: 32rpx;
			height: 32rpx;
		}

		.ref-title {
			padding-top: 10rpx;
			font-size: $uni-font-size-base;
			color: rgba(39, 40, 50, 0.4);
			line-height: 40rpx;
		}
	}

	.noone {
		text-align: center;
		padding-top: 400rpx;

		image {
			height: 250rpx;
			width: 158rpx;
		}

		.no-title {
			padding: 30rpx 0;
			font-size: $uni-font-size-base;
			color: rgba(39, 40, 50, 0.4);
			line-height: 40rpx;
		}

		.search-btn {
			text-align: center;
			display: inline-block;
			width: 240rpx;
			height: 96rpx;
			background: $uni-color-primary;
			box-shadow: 0px 52rpx 36rpx -32rpx rgba(255, 228, 49, 0.4);
			border-radius: 48rpx;
			font-size: $uni-font-size-base;
			color: rgba(39, 40, 50, 1);
			line-height: 88rpx;
		}
	}

	.friend-list {
		height: 96rpx;
		padding: 16rpx 10rpx;

		&:active {
			background-color: $uni-bg-color-grey;
		}

		.friend-list-l {
			position: relative;
			float: left;
			padding-left: $uni-spacing-col-base;

			image {
				width: 96rpx;
				height: 96rpx;
				border-radius: $uni-border-radius-base;
				background-color: $uni-color-primary;
			}

			.tip {
				position: absolute;
				z-index: 10;
				top: -6rpx;
				left: 98rpx;
				min-width: 36rpx;
				height: 36rpx;
				background: $uni-color-warning;
				border-radius: $uni-border-radius-circle;
				font-size: $uni-font-size-sm;
				color: $uni-text-color-inverse;
				line-height: 36rpx;
				text-align: center;
			}

			.group {
				position: absolute;
				z-index: 10;
				bottom: 8rpx;
				right: 0rpx;
				width: 16rpx;
				height: 16rpx;
				background: darkgoldenrod;
				border-radius: 8rpx;
				opacity: 0.8;
				box-shadow: 0prx 2rpx 12rpx rgba(0, 0, 0, 0.8);
			}
		}

		.friend-list-r {
			padding-left: 148rpx;

			.top {
				height: 50rpx;

				.name {
					float: left;
					font-size: 36rpx;
					color: $uni-text-color;
					letter-spacing: -0.62px;
					font-weight: 400;
				}

				.time {
					float: right;
					font-size: $uni-font-size-sm;
					color: $uni-text-color-disable;
					line-height: 50rpx;
				}
			}

			.news {
				font-size: $uni-font-size-base;
				color: $uni-text-color-grey;
				line-height: 40rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
			}
		}
	}

	.bottom-bar {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 90rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid gainsboro;

		.item {
			flex: 1;
			height: 100%;
			padding: 0 40rpx;
		}

		.item-img {
			width: 100%;
			height: 100%;
			/* 使图片自适应高度 */
			object-fit: contain
		}
	}
</style>
