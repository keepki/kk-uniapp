<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @click="backup">
				取消
			</view>
			<view class="top-bar-center">
				邀请新成员
			</view>
		</view>
		<view class="search-main">
			<view class="search-area-box">
				<image src="../../static/group/search.svg" mode="aspectFill" class="search-image"></image>
				<input type="text" placeholder="搜索" class="search-area">
			</view>
		</view>
		<view class="friend-menu">
			<view class="menu-title" @click="showfriendlist">好友列表</view>
			<view class="menu-list" :style="{height: menuHeight + 'px'}">

				<view class="menu-li" ref="lists" v-for="(item,index) in friendsListTab" :key="index"
					@click="selectFriend(index)">


					<view class="selected" :class="{isSelected:item.selected}" v-show="item.canselected">

					</view>

					<view class="selected" :class="{defultSelected:true}" v-show="!item.canselected">

					</view>

					<image :src="item.imgurl" mode="aspectFill"></image>
					<view class="friend-explain">
						<view class="friend-name">{{item.name}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-bar">
			<view class="explain">
				<view class="">
					附带聊天记录
				</view>
				<view class="">
					近期没有聊天记录
				</view>
			</view>
			<button class="invit-button" :class="{invitButtonChoice:selectNumber>0}"
				@click="inviteFriend">({{selectNumber}})立即邀请</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				menuHeight: 0,
				selected: false,
				sddw: true,
				gid: '',
				friendsListTab: []
			};
		},
		onLoad: function(e) {
			this.gid = e.groupID
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
			selectNumber() {
				let selectNumber = 0
				this.friendsListTab.forEach(item => {
					if (item.selected == true) {
						selectNumber++
					}
				})
				return (selectNumber);
			}
		},
		mounted: async function() {

			this.friendsListTab = this.friendsList

			this.friendsListTab.forEach(item => {
				item.selected = false
			})

			const promiseMission = this.friendsListTab.map(item => {
				return new Promise((resolve, reject) => {
					uni.request({
						url: this.serverUrl + '/group/checkInGroup',
						data: {
							groupID: this.gid,
							friendID: item.id,
							token: this.token
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status;

							if (status == 200) {
								item.canselected = false //selected为false代表不可选，为true可选\
								resolve()
							} else if (status == 201) {
								item.canselected = true
								resolve()
							} else if (status == 500) {
								reject()
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
				})
			})
			await Promise.all(promiseMission)
			console.log(this.friendsListTab);
		},
		methods: {
			inviteFriend: function() {
				if (this.selectNumber > 0) {
					// 生成一个 promise 数组，每个 promise 对应一个请求
					const requestPromises = this.friendsListTab.map(item => {
						if (item.selected) {
							return new Promise((resolve, reject) => {
								uni.request({
									url: this.serverUrl + '/group/buildInviteMsg',
									data: {
										GroupID: this.gid,
										inviterName: this.uname,
										inviterID: this.uid,
										recevierName: item.name,
										receiverID: item.id,
										token: this.token
									},
									method: 'POST',
									success: (data) => {
										let status = data.data.status;
										if (status == 200) {
											resolve();
										} else if (status == 500) {
											reject();
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
							});
						} else {
							return Promise.resolve(); 
						}
					});

					// 等待所有请求完成
					Promise.all(requestPromises)
						.then(() => {
							uni.showToast({
								title: '邀请成功',
								icon: 'none',
								duration: 500
							});
							setTimeout(()=>{
								uni.navigateBack({
									delta:1
								})
							},1000)
							
						})
				}
			},

			selectFriend: function(e) {
				if (this.friendsListTab[e].canselected) {
					this.$set(this.friendsListTab, e, {
						...this.friendsListTab[e],
						selected: !this.friendsListTab[e].selected
					});
				}
			},
			showfriendlist: function() {
				this.menuHeight = this.menuHeight === 0 ? this.$refs.lists[0].$el.scrollHeight * this.friendsListTab
					.length : 0
			},
			backup: function() {
				uni.navigateBack({
					delta: 1
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

		.top-bar {
			position: fixed;
			z-index: 1000;
			padding-top: var(--status-bar-height);
			left: 0;
			top: 0;
			width: 100%;
			height: 88rpx;
			text-align: center;
			color: white;
			background: rgb(38, 196, 253, );
			border-bottom: 1px solid $uni-border-color;

			.top-bar-left {
				z-index: 1001;
				position: absolute;
				padding-left: $uni-spacing-col-base;
				width: 68rpx;
				height: 88rpx;
				display: flex;
				justify-content: center;
				align-items: center;

			}

			.top-bar-center {
				position: absolute;
				text-align: center;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				margin: 0;
				text-align: center;
				line-height: 80rpx;
				font-size: 30rpx;
				letter-spacing: -0.69rpx;
				font-weight: 400;
				;
			}
		}

		.search-main {
			padding-top: 100rpx;
			border-bottom: 10px solid rgb(245, 245, 245);

			.search-area-box {
				padding-left: 20rpx;
				width: 100%;
				display: flex;
				align-items: center;

				.search-image {
					width: 40rpx;
					height: 40rpx;
					margin-right: 10rpx;
				}

				.search-area {
					width: 100%;
					height: 80rpx;

				}
			}

		}

		.friend-menu {
			width: 100%;
			display: flex;
			flex-direction: column;
			padding: 20rpx 0 0 20rpx;

			.menu-title {
				width: 100%;
				height: 80rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
			}

			.menu-list {
				transition: all .3s ease-in-out;
				overflow: hidden;

				.menu-li {
					padding-left: 20rpx;
					padding-bottom: 30rpx;
					display: flex;
					align-items: center;

					image {
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
						margin-right: 25rpx;
					}

					.selected {
						flex: none;
						margin-right: 30rpx;
						width: 48rpx;
						height: 48rpx;
						background: white;
						border: 1px solid gray;
						box-sizing: border-box;
						border-radius: 24rpx;
						position: relative;
						display: flex;
						justify-content: center;
						align-items: center;

						.select-img {
							width: 48rpx;
							height: 48rpx;
						}

					}

					.isSelected {
						background: rgb(38, 196, 253, );
						border: none;
					}

					.defultSelected {
						background: gray;
						border: none;
					}

					.friend-explain {
						.friend-name {}

						.friend-mark {
							color: lightgray;
							font-size: 24rpx;
						}
					}
				}
			}
		}

		.bottom-bar {
			position: fixed;
			padding-left: 50rpx;
			bottom: 0;
			left: 0;
			width: 100%;
			display: flex;
			align-items: center;
			background-color: rgb(245, 245, 245);
			height: 130rpx;

			.explain {
				display: flex;
				flex-direction: column;
				color: gray;
				font-size: 25rpx;
			}

			.invit-button {
				background-color: rgb(120, 201, 249);
				color: rgb(291, 210, 244);
				width: 180rpx;
				font-size: 25rpx;
				height: 60rpx;
				display: flex;
				align-content: center;
				justify-content: center;
			}

			.invitButtonChoice {
				background-color: cornflowerblue;
				color: white;
				width: 180rpx;
				font-size: 25rpx;
				height: 60rpx;
				display: flex;
				align-content: center;
				justify-content: center;
			}
		}
	}
</style>
