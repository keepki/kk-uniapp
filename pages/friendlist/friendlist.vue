<template>
	<view class="friend-content">
		<view class="friend-top-bar">
			<view class="friend-title">
				联系人
			</view>
			<view class="friend-more">
				<image src="../../static/img/mycenter.png" mode=""></image>
				<image src="../../static/img/addmore.png" mode=""></image>
			</view>
		</view>
			
			<!-- v-for="(item,index) in friendname" -->
		<view class="friend-menu">
			<view class="menu-title" @click="showfriendlist">好友列表 <image ref="friendli" src="../../static/img/lestarr.svg"></image></view>
			<view class="menu-list" :style="{height: menuHeight + 'px'}">
				<view class="menu-li" ref="lists" v-for="(item,index) in Friendlist" :key="index" @click="touserdetial(item.id)">
					<image :src="item.imgurl" mode="aspectFill"></image>
					<view class="friend-explain">
						<view class="friend-name">{{item.name}}</view>
						<view class="friend-mark" v-if="item.explain">{{item.explain}}</view>
					</view>
				</view>
			</view>
			<view class="menu-title menu-group" @click="showgrouplist">群列表 <image ref="groupli" src="../../static/img/lestarr.svg"></image></view>
			<view class="menu-list" :style="{height: menuGroupHeight + 'px'}">
				<view class="menu-li" ref="listsGroup" v-for="(item,index) in Grouplist" :key="index" @click="toChatHome(item,1)">
					<image :src="item.imgurl" mode=""></image>
					<view class="friend-explain">
						<view class="friend-name">{{item.name}}</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	
	export default {
		data(){
			return {
				list: {},
				Friendlist:[],
				Grouplist:[],
				menuHeight: 0,
				menuGroupHeight:0
			}
		},
		mounted:function(){
		},
		onShow: function() {
			console.log('...',this.friendsList);
			let friendIDArry=this.friendsList.map(item=>{
				return item.id
			})
					uni.request({
						url: this.serverUrl + '/friend/getFriendList',
						data: {
							friendIDArry: friendIDArry,
							token: this.utoken
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status;
			
							if (status == 200) {
								this.Friendlist=data.data.result
								this.Friendlist.forEach(item=>{
									
									item.imgurl=this.serverUrl+item.imgurl
								})
								console.log(this.Friendlist);
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
					
					uni.request({
						url: this.serverUrl + '/group/getUserGroups',
						data: {
							userId: this.uid,
							token: this.utoken
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status;
								
							if (status == 200) {
								this.Grouplist=data.data.result
								console.log();
								this.Grouplist.forEach(item=>{
									item.imgurl=this.serverUrl+item.imgurl
								})
								console.log(this.Grouplist);
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

			//重新渲染页面
			this.$forceUpdate();
			
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
		methods: {
			touserdetial:function(id){
					uni.navigateTo({
						url:'../userhome/userhome?id='+id,
					})
			},
			toChatHome:function(data,type) {
				
				 uni.navigateTo({
				 	url: '/pages/chatroom/chatroom?id='+data.id+'&name='+data.name+'&img='+data.imgurl+'&type='+type
				 })
			},
			showfriendlist:function(){
				this.$refs.friendli.$el.style.transform=this.menuHeight === 0 ? 'rotate(270deg)' :'rotate(0deg)'
				this.menuHeight=this.menuHeight === 0 ? this.$refs.lists[0].$el.scrollHeight*this.Friendlist.length : 0
			},
			showgrouplist:function(){
				this.$refs.groupli.$el.style.transform=this.menuGroupHeight === 0 ? 'rotate(270deg)' :'rotate(0deg)'
				
				this.menuGroupHeight=this.menuGroupHeight === 0 ? this.$refs.listsGroup[0].$el.scrollHeight*this.Grouplist.length : 0
			}
		},
		
	}

		
		
			
	
	
</script>

<style lang="less">
	.friend-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: var(--status-bar-height);
		.friend-top-bar {
			z-index: 8;
			width: 100%;
			display: flex;
			justify-content: space-between;
			position: fixed;
			top: 0;
			height: 80rpx;
			position: relative;
			align-items: center;
			background-color: whitesmoke;

			.friend-title {
				font-size: 15px;
				color: black;
				margin: 0 auto;
			}

			.friend-more {
				position: absolute;
				right: 0;
				display: flex;

				image {
					width: 60rpx;
					height: 60rpx;
				}
			}
		}

		.friend-menu{
			width: 100%;
			display: flex;
			flex-direction: column;
			padding: 20rpx 20rpx 0 20rpx;
			box-sizing: border-box;
			.menu-title{
				width: 100%;
				height: 80rpx;
				padding: 20rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-radius: 20rpx;
				box-sizing: border-box;
				margin-bottom: 20rpx;
				box-shadow: 1px 1px 5px 1px rgba(85, 255, 255, 1.0);
				image{
					width: 30rpx;
					height: 30rpx;
					float: right;
					transform:rotate(0deg);
					transition: all .3s; 
				}
			}
			.menu-group{
				box-shadow: 1px 1px 5px 1px rgba(255, 170, 0, 1.0);
			}
			.menu-list{
				transition: all .3s ease-in-out;
				overflow: hidden;
				.menu-li{
					padding-left: 20rpx;
					padding-bottom: 30rpx;
						display: flex;
						align-items: center;
					
					image{
						width: 80rpx;
						height: 80rpx;
						margin-right: 25rpx;
					}
					.friend-explain{
						.friend-name{
							
						}
						.friend-mark{
							color: lightgray;
							font-size: 24rpx;
						}
					}
				}
			}
		}
	}
</style>
