<template>
	<view class="circle-li">
		<image :src="circle.userImgUrl" mode="aspectFill" class="circle-user-img"></image>
		<view class="circle-box">
			<view class="circle-name">{{circle.userName}}</view>
			<view class="circle-content">
				<view class="text-content" v-if="circle.textcontent.length>0">
					{{circle.textcontent}}
				</view>
				<image :src="circle.imgcontent[0]" mode="aspectFill" class="circle-content-img"
					v-if="circle.imgcontent.length==1" @click="previewuserImg(circle.imgcontent,circle.imgcontent[0])">
				</image><!-- 单图片 -->
				<view class="content-img-box" v-if="circle.imgcontent.length>1">
					<!-- 多图片 -->
					<view class="img-box-item" v-for="(img,is) in circle.imgcontent" :key="is">
						<image :src="img" mode="aspectFill" class="img-box-item-img"
							@click="previewuserImg(circle.imgcontent,img)"></image>
					</view>
				</view>
				<view class="video-content" v-if="false">
					<video src=""></video>
				</view>
				<view class="time-more-module">
					<view class="time">
						{{changetime(circle.time)}}
						<image src="../../static/img/delete.svg" mode="aspectFill" class="deleteimg" v-if="uid==circle.userID" @click="dialogToggle"></image>
					</view>
					<uni-popup ref="alertDialog" type="dialog">
						<uni-popup-dialog type="success" cancelText="取消" confirmText="删除" title=""
							content="确定要删除此朋友圈吗" @confirm="dialogConfirm(circle.circleID)" @close="dialogClose">
						</uni-popup-dialog>
					</uni-popup>
					<view :class="{comments:true,commentshow: iscommentshow ? true : false }">
						<view class="dianzan">
							点赞
						</view>
						<view class="say" @click="creatComment()">
							评论
						</view>
					</view>
					<view class="more" @click="commmentshow">..</view>
				</view>
				<view class="commentslist" v-if="circle.comments.length>0">
					<view class="comment-li" v-for="(li,inde) in circle.comments" :key="inde">
						<view class="sigle" v-if="li.type==1"
							@click="RepeteShow(circle.circleID,li.senderID,li.senderName,2)">
							<!-- 评论朋友圈 -->
							{{li.senderName}}:{{li.comment}}

							<view class="time">
								{{changetime(li.time)}}
							</view>
						</view>
						<view class="unsigle" v-if="li.type==2"
							@click="RepeteShow(circle.circleID,li.senderID,li.senderName,2)">
							<!-- 回复人 -->
							{{li.senderName}} 回复:{{li.receiverName}}:{{li.comment}}
							<view class="time">
								{{changetime(li.time)}}
							</view>
						</view>
					</view>
				</view>
				<view class="input-container" v-if="iswritecomment">
					<input type="text" class="input-box" v-model="inputText" placeholder="输入消息">
					<!-- @blur="blur(index)" -->
					<view class="send-button" @click="sendMessage(circle.circleID,circle.userID,circle.userName,1)">发送
					</view>
				</view>
				<!-- 评论 -->
				<view class="input-container" v-if="iswriterepete">
					<input type="text" class="input-box" v-model="inputText" placeholder="输入消息">
					<!-- @blur="blur(index)" -->
					<view class="send-button" @click="sendRepete(index)">发送</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import myfun from '../../commons/js/mytime.js'
	export default {
		data() {
			return {
				circleID: '',
				circle: '',
				iscommentshow: false,
				iswritecomment: false,
				iswriterepete: false,
				inputText: '',
				tempRepet: [],

				messageText: '这是一条成功提示',
				value: ''
			};
		},
		onLoad: function(e) {

			if (e.circleID) {
				//注册页过来的参数user，用户名
				this.circleID = e.circleID
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
		},
		mounted: async function() {
			uni.request({
				url: this.serverUrl + '/circle/searchcircle',
				data: {
					circleID: this.circleID,
					token: this.utoken
				},
				method: 'POST',
				success: async (data) => {
					let status = data.data.status;

					if (status == 200) {
						let res = data.data.result;
						this.circle = res
						let comment = await this.getComment(this.circle[0].circleID)
						this.circle[0].comments = comment

						this.circle = this.circle[0]


						if (this.circle.imgcontent && this.circle.imgcontent.length > 0) {
							this.circle.imgcontent = this.circle.imgcontent.map(imgUrl => {
								// 在每个图片地址前添加前缀
								return this.serverUrl + imgUrl;
							});
						}
						console.log(this.circle);
						this.$forceUpdate()
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
		methods: {

			dialogConfirm:function(circleID){
				console.log('确定');
				//删除朋友圈
				uni.request({
					url: this.serverUrl + '/circle/deleteByCircleID',
					data: {
						circleID: circleID,
						token: this.utoken
					},
					method: 'POST',
					success: async (data) => {
						let status = data.data.status;
				
						if (status == 200) {
							console.log('删除成功');
							uni.navigateTo({
								url:'/pages/circle/circle'
							})
						} else if(status==404){
							alert('删除失败')
						}
						else if (status == 500) {
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
			dialogClose:function(){
				console.log('点击关闭')
			},
			dialogToggle:function() {
				this.$refs.alertDialog.open()
			},
			//回复他人的评论
			sendRepete: function(index) {
				//开启输入

				console.log(this.tempRepet);
				let asdf = this.tempRepet
				if (this.uid != this.tempRepet.senderID) {
					this.circle.comments.push({
						circleID: this.tempRepet.circleID,
						comment: this.inputText,
						receiverID: this.tempRepet.receiverID,
						receiverName: this.tempRepet.receiverName,
						senderID: this.uid,
						senderName: this.uname,
						type: this.tempRepet.type,
						time: new Date()
					})
					console.log(this.tempRepet);
					uni.request({
						url: this.serverUrl + '/circle/buildComment',
						data: {
							circleID: this.tempRepet.circleID,
							senderID: this.uid, //无论怎么样，这一条都是自己
							receiverID: this.tempRepet.receiverID, //但是接收者是选择回复的人的id，就是这一条信息的senderID
							senderName: this.uname,
							receiverName: this.tempRepet.receiverName, //但是接收者是选择回复的人的name，就是这一条信息的senderName
							comment: this.inputText,
							type: this.tempRepet.type,
							token: this.utoken
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status;
							if (status == 200) {
								console.log('发表成功');
								this.inputText = ''
								this.$set(this.iswriterepete, index, !this.iswriterepete[index]);
							} else if (status == 500) {
								uni.showToast({
									title: '服务器出错',
									icon: 'none',
									duration: 2000
								});
							} else if (status == 300) {
								uni.navigateTo({
									url: '../login/login?name=' + this.uname
								});
							}
						}
					});
				}

			},
			sendMessage: function(circleID, userID, userName, type) {
				this.circle.comments.push({
					circleID: circleID,
					comment: this.inputText,
					receiverID: userID,
					receiverName: userName,
					senderID: this.uid,
					senderName: this.uname,
					type: type,
					time: new Date()
				})
				//常规评论
				uni.request({
					url: this.serverUrl + '/circle/buildComment',
					data: {
						circleID: circleID,
						senderID: this.uid, //无论怎么样，这一条都是自己
						receiverID: userID, //但是接收者是书写这天条朋友圈的userid
						senderName: this.uname,
						receiverName: userName,
						comment: this.inputText,
						type: type,
						token: this.utoken
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						if (status == 200) {
							console.log('发表成功');
							this.inputText = ''
							this.iswritecomment = !this.iswritecomment
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错',
								icon: 'none',
								duration: 2000
							});
						} else if (status == 300) {
							uni.navigateTo({
								url: '../login/login?name=' + this.uname
							});
						}
					}
				});
			},
			RepeteShow(circleID, senderID, senderName, type) {
				if (senderID != this.uid) {
					this.iswriterepete = !this.iswriterepete
					let data = {
						circleID: circleID,
						//senderID: this.uid, //无论怎么样，这一条都是自己
						receiverID: senderID, //但是接收者是选择回复的人的id，就是这一条信息的senderID
						//senderName: this.uname,
						receiverName: senderName, //但是接收者是选择回复的人的name，就是这一条信息的senderName
						type: type,
					}
					this.tempRepet = data

				}

			},
			commmentshow() {
				this.iscommentshow = !this.iscommentshow
			},
			//写评论
			creatComment() {
				this.iswritecomment = !this.iswritecomment
			},
			previewuserImg: function(imglist, e) {
				let index = 0
				for (let i = imglist.length - 1; i >= 0; i--) {
					if (imglist[i] == e) {
						index = i;
					}
				}
				uni.previewImage({
					current: index,
					urls: imglist,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			///获取评论
			getComment: function(circleID) {
				return new Promise((resolve, reject) => {
					uni.request({
						url: this.serverUrl + '/circle/getComment',
						data: {
							circleID: circleID,
							token: this.utoken
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status;
							if (status == 200) {
								let tempCommentList = data.data.result;
								resolve(tempCommentList);
							} else if (status == 500) {
								uni.showToast({
									title: '服务器出错',
									icon: 'none',
			  				duration: 2000
								});
								reject(new Error('服务器出错'));
							} else if (status == 300) {
								uni.navigateTo({
									url: '../login/login?name=' + this.uname
								});
								reject(new Error('登录错误'));
							}
						},
					});
				});
			},
			changetime: function(time) {
				return myfun.formatTime(time)
			},

		},
	}
</script>

<style lang="less">
	.circle-li {
		display: flex;
		flex-direction: row;
		padding: 20rpx;

		.circle-user-img {
			width: 80rpx;
			height: 80rpx;
		}

		.circle-box {
			box-sizing: border-box;
			padding: 0 20rpx;
			// border: 1px solid;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			flex: 1;

			.circle-name {
				font-size: 30rpx;
				color: skyblue;
			}

			.circle-content {
				width: 100%;

				.text-content {
					margin-bottom: 20rpx;
				}

				.video-content {
					width: 60%;
				}

				.time-more-module {
					padding: 50rpx 0 20rpx 0;
					width: 100%;
					height: 50rpx;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					position: relative;

					.deleteimg {
						width: 30rpx;
						height: 30rpx;
						margin-left: 20rpx;
					}

					.time {
						display: flex;

						justify-content: space-between;

						font-size: 25rpx;
						color: rgb(217, 217, 217);
					}

					.commentshow {
						width: 300rpx !important;
						opacity: 1 !important;
					}

					.comments {
						position: absolute;
						right: 80rpx;
						width: 0rpx;
						opacity: 0;
						height: 60rpx;
						justify-content: center;
						align-items: center;
						font-size: 25rpx;
						background-color: rgba(0, 0, 0, 0.6);
						transition: all, .3s;
						display: flex;
						color: aliceblue;

						.dianzan {
							flex: 1;
							display: flex;
							justify-content: center;
							align-items: center;
						}

						.say {
							flex: 1;
							display: flex;
							justify-content: center;
							align-items: center;
						}
					}

					.more {
						background-color: rgb(249, 249, 249);
						padding: 0 20rpx 24rpx 20rpx;
						box-sizing: border-box;
						font-size: 50rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						vertical-align: baseline;
						line-height: 1;
						height: 50rpx;
						border-radius: 20rpx;
					}
				}

				.commentslist {
					width: 100%;
					background-color: rgb(247, 247, 247);
					border-radius: 10rpx;
					padding: 10rpx;

					.comment-li {
						color: black;
						font-size: 30rpx;
						font-weight: 200;
						padding: 5rpx;

						.sigle {
							display: flex;
							justify-content: space-between;
						}

						.unsigle {
							display: flex;
							justify-content: space-between;
						}

						.time {
							font-size: 22rpx;
							color: gray;
						}
					}
				}

				.input-container {

					width: 100%;
					background-color: #fff;
					padding: 20rpx 0rpx;
					display: flex;
					align-items: center;

					.input-box {
						flex: 1;
						height: 60rpx;
						padding: 10rpx;
						border: 1px solid #ccc;
						border-radius: 20rpx;
						margin-right: 10rpx;
						font-size: 25rpx;
					}

					.send-button {
						position: absolute;
						right: 60rpx;
						background-color: #007AFF;
						color: #fff;
						padding: 10rpx 20rpx;
						border-radius: 20rpx;
						font-size: 25rpx;
						cursor: pointer;
					}
				}

				.circle-content-img {
					width: 60%;
				}

				.content-img-box {
					width: 100%;
					display: grid;
					grid-template-columns: repeat(3, 1fr);
					grid-auto-flow: dense;
					gap: 20rpx;

					.img-box-item {
						display: flex;
						justify-content: center;
						align-items: center;

						.img-box-item-img {
							width: 180rpx;
							height: 160rpx;
						}
					}
				}



			}
		}
	}
</style>
