<template>
		<view class="box">
			<image :src="fimgurl" mode="aspectFill" class="user-img"></image>
			<p>{{fname}}打来的了视频</p>
			<view class="btn-box">
				<button class="btn" @click="cancel">拒绝</button>
				<button class="btn" @click="asceptCall">接听</button>
			</view>
			
		</view>
</template>

<script>
	export default {
		name:"callbrand",
		data() {
			return {
				
			};
		},
		computed:{
			fimgurl() {
				return this.$store.state.friendImgUrl;
			},
			fname() {
				return this.$store.state.friendName;
			},
			fid(){
				return this.$store.state.friendId;
			}
		},
		props:{
			
		},
		methods:{
			asceptCall:function(){
				//打开视频界面，该表phone的状态
				this.$store.commit('changeCalling',false);
				this.$store.commit('changephoneShow',true);
				//告诉对方我同意了
				this.socket.emit('asceptCall',this.fid)
			},
			cancel:function(){
				//告诉对方我拒绝了
				this.socket.emit('cancel',this.fid)
				//改变状态栏状态
				this.$store.commit('changeCalling',false);
			}
		}
	}
</script>

<style lang="less">
	.box{
		position: fixed;
		top: 20rpx;
		z-index: 1202;
		width: 90%;
		height: 200rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		background-color:white;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		justify-content: space-between;
		border-radius: 20rpx;
		padding:40rpx 20rpx ;
		.user-img{
			width:120rpx;
			height: 120rpx;
			border-radius: 20rpx;
		}
		.btn-box{
			display: flex;
			.btn{
				width: 120rpx;
				height: 90rpx;
				display: flex;
				font-size: 30rpx;
				justify-content: center;
				align-items: center;
				border-radius: 40rpx;
				margin: 0;
			}
		}
		
	}
</style>