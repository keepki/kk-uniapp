<template>
	<view class="messageList">
		<view class="message-li" v-for="(item,index) in circleMessage" :key="index">
			<image :src="item.uimgurl" mode="aspectFill"></image>
			<view class="messagebox" @click="toCirclesingle(item.circleID)">
				<view class="messagedetial">
					<view class="sendername">
						{{item.senderName}}
					</view>
					<view class="sendermessage">
						回复<span class="revicername">{{item.receiverName}}</span>:{{item.comment}}
					</view>
					<view class="time">
						{{changetime(item.time)}}
					</view>
				</view>
				<view class="circledetial">
					<view class="unimgcircle" v-if="!item.circleimgdetial">{{item.circletextcontent}}</view>
					<image :src="item.circleimgdetial" mode="aspectFill" class="image" v-if="item.circleimgdetial">
					</image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import myfun from '../../commons/js/mytime.js'
	export default {
		data() {
			return {

			};
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
			...mapState(['circleMessage']),
		},
		beforeMount: async function() {
			const requests = this.circleMessage.map(item => {
				return new Promise(resolve => {
					uni.request({
						url: this.serverUrl + '/circle/searchcircle',
						data: {
							circleID: item.circleID,
							token: this.utoken
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status;

							if (status == 200) {
								let res = data.data.result;
								item.circleimgdetial = this.serverUrl + res[0].imgcontent[
									0];
								item.circletextcontent = res[0].textcontent;
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
							resolve();
						}
					});
				});
			});
			await Promise.all(requests);
			console.log(this.circleMessage);
			//重新渲染页面
			this.$forceUpdate();
		},

		methods: {
			changetime: function(time) {
				return myfun.formatTime(time)
			},
			toCirclesingle: function(circleID) {
				uni.navigateTo({
					url: '../circledetial/circledetial?circleID='+ circleID
				})
			}
		}
	}
</script>

<style lang="less">
	.messageList {
		display: flex;
		flex-direction: column;

		.message-li {
			width: 100%;

			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: flex-start;
			padding: 20rpx;
			box-sizing: border-box;

			image {
				width: 80rpx;
				height: 80rpx;
			}

			.messagebox {
				padding: 0 20rpx 20rpx 20rpx;
				flex: auto;
				border-bottom: 0.5px solid rgba(0, 0, 0, .1);
				display: flex;
				justify-content: space-between;
				align-items: center;

				.messagedetial {
					display: flex;
					flex-direction: column;
					justify-content: flex-start;
					align-items: flex-start;

					.sendername {
						color: darkturquoise;
						padding-bottom: 10rpx;
					}

					.sendermessage {
						padding-bottom: 10rpx;

						.revicername {
							color: blueviolet;
						}
					}

					.time {
						font-size: 25rpx;
						padding-bottom: 20rpx;
					}
				}

				.circledetial {
					.unimgcircle {
						display: flex;
						/* 添加这行 */
						width: 160rpx;
						height: 160rpx;
						color: black;
						font-size: 20rpx;
						justify-content: center;
						align-items: center;
					}

					.image {
						width: 160rpx;
						height: 160rpx;
					}
				}
			}
		}
	}
</style>
