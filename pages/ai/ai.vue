<template>
	<view class="chat-container">
		<scroll-view class="chat" scroll-y="true" :scroll-into-view="scrollToView" :scroll-with-animation="swanition"
			@scrolltoupper="nextPage">
			<view class="chat-main" :style="{paddingBottom:input+'px'}">
				<!-- 一对一消息 -->
				<view class="chat-ls" v-for="(item,index) in msgs" :key="index">
					<view class="msg-m msg-left" v-if="item.fromId ==1">
						<image :src="item.imgurl" class="user-img"></image>
						<!-- 文字 -->
						<view class="message">
							<view class="msg-text">{{item.message}}</view>
						</view>
					</view>

					<view class="msg-m msg-right" v-if="item.fromId ==0">
						<image :src="item.imgurl" class="user-img"></image>
						<view class="message">
							<view class="msg-text">{{item.message}}</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="input-container">
			<input type="text" class="input-box" v-model="inputText" placeholder="输入消息">
			<view class="send-button" @click="sendMessage">发送</view>
		</view>
	</view>

</template>

<script>
	import axios from 'axios';

	export default {
		data() {
			return {
				msgs: [
				],
				inputText: '', // 输入框文本
				input: 100
			};
		},
		methods: {
			sendMessage() {
				this.msgs.push({
					imgurl: '../../static/img/我的.jpg',
					message: this.inputText,
					fromId: 0,
				})
				this.msgs.push({
					imgurl: '../../static/img/ailogo.png',
					message: '...',
					fromId: 1,
				})

				let dotsCount = 1;

				const updateDots = () => {
					this.msgs[this.msgs.length - 1].message = '.'.repeat(dotsCount);
					dotsCount = (dotsCount % 3) + 1;
				};

				const timer = setInterval(updateDots, 500);

				uni.request({
					url: this.serverUrl + '/ai/getAIResponse',
					data: {
						query: this.inputText
					},
					method: 'POST',
					success: (data) => {
						console.log(data.data)
						clearInterval(timer);
						let status = data.data.status
						if (status == 200) {
							this.msgs[this.msgs.length - 1].message = ''
							const responseLength = data.data.response.length;
							let index = 0;
							const print = setInterval(() => {
								if (index < responseLength) {
									this.msgs[this.msgs.length - 1].message += data.data.response[index];
									index++;
								} else {
									clearInterval(print);
									this.inputText = '';
								}
							}, 100);
						}
					}
				})
			},
		},
	};
</script>

<style lang="scss">
	.chat-container {
		// width: 100%;
		// height: 100%;
		// overflow-y: scroll;
		// background-color: $uni-bg-color-grey;
		display: flex;
		flex-direction: column;
		padding-top: var(--status-bar-height);
		
	}

	.input-container {
		position: fixed;
		bottom: 0rpx;
		left: 0;
		width: 100%;
		background-color: #fff;
		padding: 10rpx;
		display: flex;
		align-items: center;

		.input-box {
			flex: 1;
			height: 60rpx;
			padding: 10rpx;
			border: 1px solid #ccc;
			border-radius: 20rpx;
			margin-right: 10rpx;
			font-size: $uni-font-size-base;
		}

		.send-button {
			position: absolute;
			right: 30rpx;
			background-color: #007AFF;
			color: #fff;
			padding: 10rpx 20rpx;
			border-radius: 20rpx;
			font-size: $uni-font-size-base;
			cursor: pointer;
		}
	}

	.chat {
		height: 1700rpx;

		.padbt {
			height: env(safe-area-inset-bottom);
			width: 100%;
		}

		.loading {
			text-align: center;

			.loading-img {
				width: 60rpx;
				height: 60rpx;
			}
		}

		.chat-main {
			padding-left: $uni-spacing-col-base;
			padding-right: $uni-spacing-col-base;
			padding-top: 100rpx;
			display: flex;
			flex-direction: column;
		}

		.chat-ls {
			.chat-time {
				font-size: $uni-font-size-sm;
				color: rgba(39, 40, 50, 0.3);
				line-height: 34rpx;
				text-align: center;
				padding: 20rpx 0;
			}

			.msg-m {
				display: flex;
				padding: 20rpx 0;
				position: relative;

				.sender {
					position: absolute;
					top: -14rpx;
					left: 90rpx;
					font-size: 8rpx;
					color: gray;
				}

				.user-img {
					flex: none;
					width: auto;
					max-width: none;
					width: $uni-img-size-sm;
					height: $uni-img-size-sm;

					border-radius: $uni-border-radius-base;
				}

				.message {
					flex: none;
					max-width: 60%;
				}

				.msg-text {

					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 44rpx;
					padding: 18rpx 24rpx;
					word-break: break-all;
					word-wrap: break-word;
				}

				.video {
					max-width: 450rpx;
					border-radius: 40rpx;
				}

				.msg-map {
					background: #fff;
					width: 480rpx;
					height: 300rpx;
					overflow: hidden;

					.map-name {
						font-size: $uni-font-size-lg;
						color: $uni-text-color;
						line-height: 44rpx;
						padding: 18rpx 24rpx 0 24rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}

					.map-address {
						font-size: $uni-font-size-base;
						color: $uni-text-color-disable;
						padding: 0rpx 24rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}

					.map-img {
						padding-top: 8rpx;
						width: 480rpx;
						height: 180rpx;
					}
				}

				.voice {
					min-width: 80rpx;
					max-width: 400rpx;
				}

				.voice-img {
					width: 40rpx;
					height: 40rpx;
				}
			}

			.msg-left {
				flex-direction: row;

				.msg-text {
					margin-left: 16rpx;
					background: #fff;
					box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
					border-radius: 0px 20rpx 20rpx 20rpx;
				}

				.left-img {
					margin-left: 16rpx;
					max-width: 400rpx;
					border-radius: 50rpx;
				}

				.voice {
					text-align: right;

				}

				.video {
					margin-left: 16rpx;
				}

				.voice-img {
					float: left;

					width: 40rpx;
					height: 40rpx;
				}

				.msg-map {
					margin-left: 16rpx;

					border-radius: 0px 20rpx 20rpx 20rpx;
				}
			}

			.msg-right {
				flex-direction: row-reverse;

				.msg-text {
					margin-right: 16rpx;
					background: white;
					box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
					border-radius: 20rpx 0px 20rpx 20rpx;
				}

				.right-img {
					margin-right: 16rpx;
					max-width: 400rpx;
					border-radius: 50rpx;
				}

				.voice {
					text-align: left;

				}

				.video {
					margin-right: 16rpx;
				}

				.voice-img {
					float: right;
					transform: rotate(180deg);
					width: 40rpx;
					height: 40rpx;
				}

				.msg-map {
					margin-right: 16rpx;
					border-radius: 20rpx 0px 20rpx 20rpx;
				}
			}
		}
	}

	/* 样式可以根据实际需要进行调整 */
</style>
