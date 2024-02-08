<template>
	<view class="mains">
		<view class="brand">
			<image :src="uimgurl" mode="aspectFill" class="userimg"></image>
			<view class="intrduce">
				{{this.uname}}
				<view class="tik">
					账号:277278
				</view>
			</view>
		</view>
		<image src="../../static/img/background.webp" mode="aspectFill" class="background"></image>
		<view class="contents">
			<view class="columns">
				<view class="row" @click="gotoFriendCircle">
					<image src="../../static/img/dongtai.png" mode="aspectFill" class="row-img"></image>
					<view class="title">
						好友动态
					</view>
					<view class="cont">
					</view>
					<view class="more">
						<image src="../../static/userdetail/rightarr.png"></image>
					</view>
				</view>

				<view class="row">
					<image src="../../static/img/mycircle.png" mode="aspectFill" class="row-img"></image>
					<view class="title">
						我的朋友圈
					</view>
					<view class="cont">
					</view>
					<view class="more">
						<image src="../../static/userdetail/rightarr.png"></image>
					</view>
				</view>
				<view class="row">
					<image src="../../static/img/mycenter.png" mode="aspectFill" class="row-img"></image>
					<view class="title">
						个人中心
					</view>
					<view class="cont">
					</view>
					<view class="more">
						<image src="../../static/userdetail/rightarr.png"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "friendscircle",
		data() {
			return {

			};
		},
		methods:{
			gotoFriendCircle:function(){
				uni.navigateTo({
					url:'../../pages/circle/circle',
					animationType: 'pop-in',
						animationDuration: 200
				})
			}
		},
		computed: {
			uimgurl() {
				return this.$store.state.userImgUrl;
			},
			uname() {
				return this.$store.state.userName;
			},
		}
	}
</script>

<style lang="less">
	.mains {
		position: fixed;
		top: 0rpx;
		right: 0;
		z-index: 998;
		width: 100%;
		height: 100vh;
		
		background-color: #ffffff;
		
		
		.brand {
			color: darkblue;
			font-size: 50rpx;
			position: absolute;
			top: 100rpx;
			left: 50rpx;
			z-index: 2;
			display: flex;

			.intrduce {
				display: flex;
				flex-direction: column;

				.tik {
					font-size: 30rpx;
					color: white;
				}
			}

			.userimg {
				margin-right: 40rpx;
				border-radius: 50%;
				width: 160rpx;
				height: 160rpx;
				border: 4px solid #ffffff;
			}
		}

		.background {
			width: 100%;
			height: 680rpx;
			z-index: 1;
			margin-top: -40rpx;
			// background: url("../../static/img/background.webp") center/cover;
			background-color: antiquewhite;
		}

		.contents {
			position: fixed;
			bottom: 0rpx;
			width: 100%;
			height: 780rpx;
			z-index: 2;
			background-color: #ffffff;
			border-radius: 40rpx 40rpx 0 0;
			box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
			box-sizing: border-box;
			padding: 40rpx 30rpx 0;

			.columns {
				display: flex;
				flex-direction: column;
				width: 100%;

				.row {
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
				}

				.row-img {
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
				}

				.title {
					flex: none;
					padding: 0 32rpx;
					font-size: 32rpx;
					color: #333333;
					line-height: 112rpx;
				}

				.cont {
					flex: auto;
					font-size: 32rpx;
					color: #666666;
					line-height: 112rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
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
			}
		}
	}
</style>
