<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @click="backup">
				<image src="../../static/userdetail/back.png"></image>
			</view>
			<view class="top-bar-center">
				详情
			</view>
			<view class="top-bar-left" >
				<view class="emptybox">
					
				</view>
			</view>
		</view>
		<view class="main">
			<view class="column heads">
				<view class="row head">
					<view class="title">
						头像
					</view>
					<view class="user-head" v-if="id==uid">
						<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
						<image class="user-img" :src="cropFilePath" @tap="upload"></image>
					</view>
					<view class="more" v-if="id==uid">
						<image src="../../static/userdetail/rightarr.png"></image>
					</view>
					<image :src="user.imgurl" class="user-img" v-if="id!=uid"></image>
				</view>
				<view class="row" @click="modify('explain','签名',user.explain,false)" v-if="id==uid">
					<view class="title">
						签名
					</view>
					<view class="cont">
						{{user.explain}}
					</view>
					<view class="more">
						<image src="../../static/userdetail/rightarr.png"></image>
					</view>
				</view>
				<view class="row" v-if="id!=uid">
					<view class="title">
						签名
					</view>
					<view class="cont">
						{{user.explain}}
					</view>
				</view>

				<view class="row">
					<view class="title">
						注册
					</view>
					<view class="cont">
						{{changetime(user.time)}}
					</view>
				</view>
			</view>

			<view class="column ">
				<view class="row" @click="modify('name','昵称',user.name,false)" v-if="id==uid">
					<view class="title">
						昵称
					</view>
					<view class="cont">
						{{user.name}}
					</view>
					<view class="more">
						<image src="../../static/userdetail/rightarr.png"></image>
					</view>
				</view>
				<view class="row" v-if="id!=uid" @click="modify('markname','昵称',markname,false)">
					<view class="title">
						昵称
					</view>
					<view class="cont">
						{{markname}}
					</view>
					<view class="more">
						<image src="../../static/userdetail/rightarr.png"></image>
					</view>
				</view>

				<view class="row">
					<view class="title">
						性别
					</view>
					<view class="cont">
						<picker @change="bindPickerChange" :value="index" :range="array" v-if="id==uid">
							<view class="uni-input">{{array[index]}}</view>
						</picker>
						<view class="uni-input" v-if="id!=uid">{{array[index]}}</view>
					</view>
					<view class="more" v-if="id==uid">
						<image src="../../static/userdetail/rightarr.png"></image>
					</view>
				</view>
				<view class="row">
					<view class="title">
						生日
					</view>
					<view class="cont">
						<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange"
							v-if="id==uid">
							<view class="uni-input">{{date}}</view>
						</picker>
						<view class="uni-input" v-if="id!=uid">{{date}}</view>
					</view>
					<view class="more" v-if="id==uid">
						<image src="../../static/userdetail/rightarr.png"></image>
					</view>
				</view>

				<view class="row" >
					<view class="title">
						账户
					</view>
					<view class="cont">
						{{userAgentID}}
					</view>
					<view class="more" v-if="id==uid">
						
					</view>
				</view>
				<view class="row" v-if="id!=uid">
					<view class="title">
						账户
					</view>
					<view class="cont">
						{{userAgentID}}
					</view>
				</view>


				<view class="row" @click="modify('email','邮箱',user.email,true)" v-if="id==uid">
					<view class="title">
						邮箱
					</view>
					<view class="cont">
						{{user.email}}
					</view>
					<view class="more">
						<image src="../../static/userdetail/rightarr.png"></image>
					</view>
				</view>
				<view class="row" v-if="id!=uid">
					<view class="title">
						邮箱
					</view>
					<view class="cont">
						{{user.email}}
					</view>
				</view>
			</view>

			<view class="column ">
				<view class="row " v-if="id==uid"  @click="modify('psw','密码','',true)">
					<view class="title">
						密码
					</view>
					<view class="cont">
						*******
					</view>
					<view class="more">
						<image src="../../static/userdetail/rightarr.png"></image>
					</view>
				</view>
			</view>
			<view class="bt-exit" v-if="id!=uid" @click="deleteFriend">删除好友</view>
			<view class="bt-exit" v-if="id==uid" @click="quit">退出登录</view>
		</view>
		<view class="modify" :style="{bottom:-+widHeight+'px'}" :animation='animationData'>
			<view class="modify-header">
				<view class="close" @click="modify(modifytype,'',false)">取消</view>
				<view class="title">{{modifytype}}</view>
				<view class="define" @click="modifySubmit">确定</view>
			</view>
			<view class="modify-main">
				<input type="safe-password" v-model="pwd" class="modify-pwd" placeholder="请输入旧密码" v-if="ispwd">
				<textarea v-model="data" class="modify-content"></textarea>
			</view>
		</view>
	</view>
</template>

<script>
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	import mytime from "@/commons/js/mytime.js"
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				array: ['男', '女', '难道是..'],
				index: 0,
				date: currentDate,
				tempFilePath: "",
				cropFilePath: "",
				heading: '',
				data: '',
				pwd:undefined,
				animationData: {},
				isModify: false,
				widHeight: '1000',
				modifytype: '',
				ispwd: false,
				type: '',
				id: '',
				user: '',
				markname: '',
				uid: '',
				token: '',
				myname: '',
				oldData: '',
				
				userAgentID:'',
			};
		},
		components: {
			ImageCropper,
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		onLoad: function(e) {
			this.id = e.id
			this.getStorage()
			this.getUser()
			this.getMarkname()
		},
		onReady: function() {
			this.getElementStyle()
		},
		methods: {
			//获取缓存
			getStorage: function() {
				try {
					const value = uni.getStorageSync('user')
					if (value) {
						console.log(value);
						this.uid = value.id
						this.token = value.token
						this.myname = value.name
						this.userAgentID=value.agentID
					} else {
						uni.navigateTo({
							url: '../login/login'
						})
					}
				} catch (e) {
					console.log('error')
				}
			},
			//获取用户信息
			getUser: function() {
				uni.request({
					url: this.serverUrl + '/user/detial',
					data: {
						id: this.id,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						if (status == 200) {
							let res = data.data.result
							res.imgurl = this.serverUrl + res.imgurl
							//处理简介
							if (res.explain == undefined) {
								res.explain = '这个人很懒，什么都没有留下'
							}
							//处理markname
							if (this.markname.length == 0) {
								//是自己
								this.markname = res.name
							}
							//处理生日
							if (res.birth == undefined) {
								this.date = '0000-00-00'
							} else {
								let birth=mytime.dataTimeDetail1(res.birth)
								this.date = birth
							}
							//处理生日
							if (res.phone == undefined) {
								res.phone = '000 000 000'
							}
							this.judgesex(res.sex)
							this.user = res
							this.cropFilePath = this.user.imgurl
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
			//获取好友昵称
			getMarkname: function() {
				if (this.id != this.uid) {
					uni.request({
						url: this.serverUrl + '/user/getmarkname',
						data: {
							uid: this.uid,
							fid: this.id,
							token: this.token
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status
							if (status == 200) {
								let res = data.data.result
								if (res.markname != undefined) {
									this.markname = res.markname
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
				}

			},
			//判断性别
			judgesex: function(e) {
				if (e == 'female') {
					this.index = 1
				} else if (e == 'male') {
					this.index = 0
				} else {
					this.index = 2
				}

			},
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				let oldIndex = this.index
				this.index = e.detail.value
				if (this.index != oldIndex) {
					let sex = 'asexual'
					if (this.index == 0) {
						sex = 'male'
					} else if (this.index == 1) {
						sex = 'female'
					}
					this.update(sex,'sex',undefined)
				}

			},
			//日期选择
			bindDateChange: function(e) {
				let oldDate=this.date
				this.date = e.detail.value
				if (this.date!= oldDate) {
					this.update(this.date,'birth',undefined)
				}
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			upload() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: (res) => {
						this.tempFilePath = res.tempFilePaths.shift()
					}
				});
			},
			confirm(e) {
				this.tempFilePath = "";
				this.cropFilePath = e.detail.tempFilePath;
				this.heading = e.detail.tempFilePath
				uni.uploadFile({
					url: this.serverUrl + "/files/upload",
					filePath: this.cropFilePath,
					name: "file",
					fileType: "image",
					formData: {
						url: 'user',
						name: this.uid,
						token: this.token
					},
					success: (uploadFileRes) => {
						var backstr = uploadFileRes.data;
						// this.user.imgurl=this.serverUrl+'/user/'+backstr
						//本地信息修改
						try {
							uni.setStorageSync('user', {
								'id': this.uid,
								'name': this.myname,
								'imgurl': backstr,
								'token': this.token,
							})
						} catch (e) {
							//error
							console.log('存储出错');
						}
						//修改信息之后保存到数据库
						this.update(backstr, 'imgurl', undefined)
						// this.$router.go(0)
					},
					fail(e) {
						console.log("this is errormes " + e.message);
					},
				});

			},
			cancel() {
				console.log("canceled");
				this.tempFilePath = "";
			},
			backup: function() {
				uni.navigateBack({
					delta: 1
				})
			},
			//修改数据库用户数据
			update: function(data2, type, pwd) {
				uni.request({
					url: this.serverUrl + '/user/update',
					data: {
						id: this.uid,
						data: data2,
						type: type,
						pwd: pwd,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						
						if (status == 200) {
							this.user[type] = data2
							if(type=='name'){
								this.myname=data2
							}
							if(type=='psw'){
								//修改密码成功重新登录并清除缓存
								uni.removeStorage({
									key:'user',
									success:function(res){
										console.log('success');
									}
								})
								uni.navigateTo({
									url: '../login/login?cgpwd=' + this.myname
								})
							}
							uni.showToast({
								title: '修改成功',
								icon: 'none',
								duration: 2000
							})
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
						}else if (status == 600) {
							uni.showToast({
								title: '邮箱已存在',
								icon: 'none',
								duration: 2000
							})
						}else if (status == 400) {
							uni.showToast({
								title: '密码错误',
								icon: 'none',
								duration: 2000
							})
						}
					}
				})
			},
			//好友昵称修改
			updateFriendName: function(data) {
				if (this.data.length > 0 && this.oldData != this.data) {
					uni.request({
						url: this.serverUrl + '/user/updatemarkname',
						data: {
							uid: this.uid,
							fid: this.id,
							name: this.data,
							token: this.token
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status
							if (status == 200) {
								console.log(status);
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
			modify: function(t, type, data, ispwd) {
				this.pwd=undefined
				this.modifytype = type
				this.data = data
				this.ispwd = ispwd
				if(this.ispwd){
					this.pwd='******'
				}
				this.isModify = !this.isModify
				this.oldData = data
				//获取修改项类型
				this.type = t
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
			modifySubmit: function() {
				//提交修改
				
				if (this.data.length > 0 && this.oldData != this.data) {
					if (this.type == 'markname') {
						this.updateFriendName()
						this.markname = this.data
					}else if(this.type=='email'){
						
						let reg= /^[a-zA-Z0-9][a-zA-Z0-9_]+\@[a-zA-Z0-9]+\.[a-zA-Z]{2,5}(\.[a-zA-Z]{2,5})*$/i;
						if(reg.test(this.data)){							
							this.update(this.data, this.type, this.pwd)
							this.pwd=undefined
					}else{
							uni.showToast({
								title: '邮箱格式错误 ',
								icon: 'none',
								duration: 2000
							})
						}
					} else {
						
						this.update(this.data, this.type, this.pwd)
						//前端更新数据
						// this.user[this.type] = this.data
					}
					this.modify()
				}
			},
			changetime: function(time) {
				return mytime.dataTimeDetail(time)
			},
			//退出登录
			quit:function(){
				uni.removeStorage({
					key:'user',
					success:function(res){
						
					}
				})
				uni.navigateTo({
					url: '../login/login'
				})
			},
			//删除好友
			deleteFriend:function(){
				uni.showModal({
					title:'提示',
					content:'确定删除这个好友吗',
					success:(res)=>{
						if(res.confirm){
							uni.request({
								url: this.serverUrl + '/friend/deletefriend',
								data: {
									uid: this.uid,
									fid: this.id,
									token: this.token
								},
								method: 'POST',
								success: (data) => {
									let status = data.data.status
									if (status == 200) {
										//删除跳转主页
										uni.navigateTo({
											url: '../index/index'
										})
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
						}else if(res.cancel){
							
						}
					}
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
		display: flex;
		align-items: center;
		justify-content: space-between;
		.top-bar-left {
			z-index: 1111;
			
			padding-left: $uni-spacing-col-base;

			image {
				z-index: 1100;
				// padding-top: 5rpx;
				margin-top: 10rpx;
				width: 68rpx;
				height: 68rpx;
				border-radius: 25rpx;
			}
			.emptybox{
				width: 68rpx;
				height: 68rpx;
			}
		}

		.top-bar-center {
			font-size: 40rpx;
			color: #272832;
			letter-spacing: -0.69rpx;
			font-weight: 400;
			;
		}
	}

	.main {
		padding-top: 118rpx;
		display: flex;
		flex-direction: column;

		.column {
			display: flex;
			flex-direction: column;
			border-bottom: 1px solid $uni-border-color;
			width: 100%;

			.row {
				display: flex;
				flex-direction: row;
			}

			.title {
				flex: none;
				padding: 0 $uni-spacing-col-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 112rpx;
			}

			.head {
				display: flex;
				height: 148rpx;
				align-items: center;
			}

			.user-head {
				display: flex;
				flex: auto;
			}

			.user-img {
				width: $uni-img-size-lg;
				height: $uni-img-size-lg;
				border-radius: $uni-border-radius-base;
			}

			.cont {
				flex: auto;
				font-size: $uni-font-size-lg;
				color: $uni-text-color-grey;
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

		.bt-exit {
			margin-top: 160rpx;
			text-align: center;
			font-size: $uni-font-size-lg;
			color: $uni-color-warning;
			line-height: 88rpx;
			font-weight: 400;
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
