<template>
	<view class="content">
		<view class="top-bar">
			<view class="search-div">
				<image class="search-img" src="../../static/search/search.png"></image>
				<input v-model="keywords" type="search" class="search" placeholder="搜索你想要的" @input="search" />
			</view>
			<view class="top-bar-right" @click="backup">
				<view class="cancel">取消</view>
			</view>
		</view>
		<view class="main">
			<view class="search-user result">
				<view class="title" v-if="userarr.length>0">
					用户
				</view>
				<view class="title-tips" v-if="!userarr.length>0">
					啊哦，空空如也
				</view>
				<view class="list user" v-for="(item,index) in userarr" :key="index">
					<navigator :url="'../userhome/userhome?id='+item._id">
						<image :src="item.imgurl"></image>
					</navigator>
					<view class="names">
						<view class="name" v-html="item.names"></view>
						<view class="email" v-html="item.emails"></view>
					</view>
					<view class="right-bt send" v-if="item.tip==1" @click="toChatHome(item)">
						发消息
					</view>
					<view class="right-bt add" v-if="item.tip==0" @click="addFriendBtn(item._id)">
						加好友
					</view>
				</view>
			</view>
			<view class="">

			</view>
		</view>
		<!-- 弹出层 -->
		<view class="modify" :style="{bottom:-+widHeight+'px'}" :animation='animationData'>
			<view class="modify-header">
				<view class="close" @click="modify">取消</view>
				<view class="title">验证信息</view>
				<view class="define" @click="addSubmit">确定</view>
			</view>
			<view class="modify-main">

				<textarea v-model="msg" class="modify-content">

				</textarea>

			</view>
		</view>
	</view>
</template>

<script>
	import datas from "../../commons/js/dadas.js"
	import myfun from "../../commons/js/myfun.js"
	export default {
		data() {
			return {
				keywords: '',
				userarr: [],
				uid: '',
				token: '',
				myname: '',
				animationData: {},
				widHeight: '',
				isModify: false,
				msg: '',
				fid:''
			}
		},
		onLoad: function() {
			this.getStorage()
		},
		onReady: function() {
			this.getElementStyle()
		},
		methods: {
			search: myfun.Debounce(function() {
				this.userarr = [];
				if (this.keywords.length > 0) {
					this.searchUser()
				}
			}, 500),
			//获取缓存
			getStorage: function() {
				try {
					const value = uni.getStorageSync('user')
					if (value) {
						this.uid = value.id
						this.token = value.token
						this.myname = value.name
					} else {
						uni.navigateTo({
							url: '../login/login'
						})
					}
				} catch (e) {
					console.log('error')
				}
			},
			searchUser: function() {
				uni.request({
			 	url: this.serverUrl + '/search/user',
					data: {
						data: this.keywords,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						if (status == 200) {
			 			let arr = data.data.result
							// let exp=eval("/"+this.keywords+"/g")
							if (this.keywords.length > 0) {
								let regex = new RegExp(this.keywords, 'i');
								for (let i = 0; i < arr.length; i++) {
									if (regex.test(arr[i].name) || regex.test(arr[i].email)) {
										this.ifsFriend(arr[i])
									}
								}
							}
							console.log('userarr', this.userarr);
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
			},
			//判断是否为好友
			ifsFriend: function(e) {
				let tip = 0
				let exp = eval("/" + this.keywords + "/g")
				//获取好友列表
				let arrs = datas.isFriend()
				if (e._id == this.uid) {
					tip = 2
					e.tip = tip
					e.imgurl = this.serverUrl  + e.imgurl;
					e.names = e.name.replace(exp, "<span style='color:#4AAAFF;'>" + this.keywords + "</span>");
					e.emails = e.email.replace(exp, "<span style='color:#4AAAFF;'>" + this.keywords + "</span>");
					this.userarr.push(e);
				} else {
					uni.request({
						url: this.serverUrl + '/search/isfriend',
						data: {
							uid: this.uid,
							fid: e._id,
							token: this.token
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status

							if (status == 200) {
								tip = 1
							} else if (status == 400) {

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
							e.tip = tip
							e.id=e._id
							e.type=1
							e.imgurl = this.serverUrl + e.imgurl;
							e.names = e.name.replace(exp, "<span style='color:#4AAAFF;'>" + this.keywords +
								"</span>");
							e.emails = e.email.replace(exp, "<span style='color:#4AAAFF;'>" + this
								.keywords + "</span>");
							this.userarr.push(e);
							
						}
					})
				}

			},
			//获取高度
			getElementStyle: function() {
				const query = uni.createSelectorQuery().in(this);
				query.select(".modify").boundingClientRect(data => {
					this.widHeight = data.height;
				}).exec()
			},
			//动画函数
			modify: function(type, date, ispwd) {
				this.modifytype = type
				this.cont = date
				this.ispwd = ispwd
				this.isModify = !this.isModify
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
			addFriendBtn: function(fid) {
				this.fid=fid
				this.msg = this.myname + '请求添加好友~~~~'
				this.modify()
			},
			//添加好友
			addSubmit: function() {
				if (this.msg.length > 0) {
					uni.request({
						url: this.serverUrl + '/friend/applyfriend',
						data: {
							uid:this.uid,
							fid:this.fid,
							token:this.token,
							msg:this.msg 
						},
						method: 'POST',
						success: (data) => {
							
							let status = data.data.status
							if (status == 200) {
								console.log(status);
								this.modify()
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
			backup: function() {
				uni.navigateBack({
					delta: 1
				})
			},
			toChatHome: function(data) {
				uni.navigateTo({
					url: '/pages/chatroom/chatroom?id='+data.id+'&name='+data.name+'&img='+data.imgurl+'&type='+data.type
				})
			}  
		}
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		padding-top: var(--status-bar-height);
		padding-bottom: $uni-spacing-col-base;
	}

	.top-bar {
		/* border: 1px solid black; */
		
		z-index: 1000;
		box-sizing: border-box;
		padding-top: var(--status-bar-height);
		left: 0;
		top: 0;
		width: 100%;
		height: 108rpx;
		background: $uni-bg-color;
		border-bottom: 1px solid gray;
		padding-top: 15rpx;
		padding-left: 20rpx;
		padding-right: 25rpx;

		.top-bar-right {
			margin-top: 20rpx;
			float: right;
			padding-right: 14rpx;

		}

		.search-div {
			float: left;
			/* border: 1px solid black; */
			width: 600rpx;
			height: 70rpx;
			background: #F3F4F6;
			border-radius: 10rpx;
			padding-top: 10rpx;

			.search {
				width: 520rpx;
				height: 60rpx;
				background: #F3F4F6;
				font-size: 35rpx;
				color: #272832;
				letter-spacing: -0.48rpx;
				font-weight: 500;

			}

			.search-img {
				margin-top: 10rpx;
				margin-right: 20rpx;
				float: right;
				width: 40rpx;
				height: 40rpx;
			}
		}

		.top-bar-right {

			margin-top: 10rpx;
			font-size: 35rpx;
			color: #272832;
			letter-spacing: -0.48rpx;
			font-weight: 500;
		}
	}

	.main {
		padding: 108rpx $uni-spacing-col-base;

		.result {
			padding-top: 32rpx;

			.title {
				font-size: 44rpx;
				color: #272832;
				letter-spacing: -0.75rpx;
				font-weight: 600;
			}

			.title-tips {
				font-size: 30rpx;
				color: #272832;
				letter-spacing: -0.75rpx;
				font-weight: 200;
			}

			.list {
				padding: 20rpx 0;
				width: 100%;
				height: 80rpx;

				image {
					float: left;
					width: 80rpx;
					height: 80rpx;
					border-radius: $uni-border-radius-base;
				}
			}

			.names {
				float: left;
				padding-left: $uni-spacing-col-base;
			}

			.name {
				font-size: 36rpx;
				color: $uni-text-color;
				line-height: 50rpx;
			}

			.email {
				font-size: 24rpx;
				color: rgba(39, 40, 50, 1);
				line-height: 28rpx;
			}

			.right-bt {
				float: right;
				width: 120rpx;
				height: 50rpx;
				border-radius: 24rpx;
				font-size: 24rpx;
				margin-top: 16rpx;
				text-align: center;
				line-height: 48rpx;
			}

			.send {
				background: $uni-color-primary;
				color: $uni-text-color;
			}

			.add {
				background: rgba(74, 170, 255, 0.1);
				color: $uni-color-success;
			}
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
