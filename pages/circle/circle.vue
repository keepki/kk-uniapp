<template>
	<view class="friend-home">
		<view :class="{ 'top-bar': true, 'top-bar-untransparent': isTransparent }">
			<view class="top-bar-left" @click="backTo">
				<image src="../../static/img/lestarr.svg"></image>
			</view>
			<view class="top-bar-right">
				<view class="more" @click="CircleContent">
					<image src="../../static/img/camer.svg"></image>
				</view>
			</view>
		</view>
		<scroll-view class="content" scroll-y="true" @scroll='scrollChange'>
			<view class="img-box">
				<image src="../../static/img/circlebg.jpg" mode="aspectFill" class="top-bg"></image>
				<image :src="uimgurl" mode="aspectFill" class="userimg"></image>
			</view>
			
			<view class="messageTip" v-if="messageTips.length>0" @click="toMessage">
				<image :src="messageTips[messageTips.length-1].uimgurl" mode="aspectFill" class="userimage"></image>
				<view class="messagenumber">
					{{messageTips.length}}条新信息
				</view>
			</view>
			
			<view class="circle-list">
				<view class="circle-li" v-for="(item,index) in circleList" :key="index">
					<image :src="item.userImgUrl" mode="aspectFill" class="circle-user-img"></image>
					<view class="circle-box">
						<view class="circle-name">{{item.userName}}</view>
						<view class="circle-content">
							<view class="text-content" v-if="item.textcontent.length>0">
								{{item.textcontent}}
							</view>
							<image :src="item.imgcontent[0]" mode="aspectFill" class="circle-content-img" v-if="item.imgcontent.length==1" @click="previewuserImg(item.imgcontent,item.imgcontent[0])"></image><!-- 单图片 -->
							<view class="content-img-box" v-if="item.imgcontent.length>1">
								<!-- 多图片 -->
								<view class="img-box-item" v-for="(img,is) in item.imgcontent" :key="is">
									<image :src="img" mode="aspectFill" class="img-box-item-img" @click="previewuserImg(item.imgcontent,img)"></image>
								</view>
							</view>
							<view class="video-content" v-if="false">
								<video src=""></video>
							</view>
							<view class="time-more-module">
								<view class="time">{{changetime(item.time)}} 
									<image src="../../static/img/delete.svg" mode="aspectFill" class="deleteimg" v-if="uid==item.userID" @click="dialogToggle(item.circleID)"></image>
								</view>
								
								<view :class="{comments:true,commentshow: iscommentshow[index] ? true : false }">
									<view class="dianzan">
										点赞
									</view>
									<view class="say" @click="creatComment(index)">
										评论
									</view>
								</view>
								<view class="more" @click="commmentshow(index)">..</view>
							</view>
							<view class="commentslist" v-if="item.comments.length>0">
								<view class="comment-li" v-for="(li,inde) in item.comments" :key="inde" >
									<view class="sigle" v-if="li.type==1" @click="RepeteShow(item.circleID,li.senderID,li.senderName,index,2)"><!-- 评论朋友圈 -->
										{{li.senderName}}:{{li.comment}}
									</view>
									<view class="unsigle" v-if="li.type==2"  @click="RepeteShow(item.circleID,li.senderID,li.senderName,index,2)"><!-- 回复人 -->
										{{li.senderName}} 回复:{{li.receiverName}}:{{li.comment}}
									</view>
								</view>
							</view>
							<view class="input-container" v-if="iswritecomment[index]">
								<input type="text" class="input-box" v-model="inputText" placeholder="输入消息"><!-- @blur="blur(index)" -->
								<view class="send-button" @click="sendMessage(item.circleID,item.userID,item.userName,index,1)">发送</view>
							</view>
							<!-- 评论 -->
							<view class="input-container" v-if="iswriterepete[index]">
								<input type="text" class="input-box" v-model="inputText" placeholder="输入消息"><!-- @blur="blur(index)" -->
								<view class="send-button" @click="sendRepete(index)">发送</view>
							</view>
						</view>
					</view>
				</view>
				<uni-popup ref="alertDialog" type="dialog">
					<uni-popup-dialog type="success" cancelText="取消" confirmText="删除" title="" content="确定要删除此朋友圈吗" @confirm="dialogConfirm()" @close="dialogClose">
					</uni-popup-dialog>
				</uni-popup>
			</view>
		</scroll-view>


	<transition name="slide-fade" mode="out-in">
		<scroll-view class="buildcontent" v-if="editor" scroll-y="true">
		
			<view :class="{ 'top-bar': true }">
				<view class="top-bar-left" @click="cancelbuild">
					<image src="../../static/userdetail/back.png"></image>
				</view>
				<view class="top-bar-right">
					<view :class="{more:!enough,enoughmore: enough }" @click="buildCircle">
						发表
					</view>
				</view>
			</view>
		
			<view class="editorbox">
				<view class="texteditor">
					<!-- <textarea placeholder="这一刻的想法" name="" id="" cols="30" rows="1" @input="adjustTextareaHeight" ref="autoResizeTextarea"></textarea> -->
					<div contenteditable="true" class="editable-div" ref="editableDiv" @input="handleInput"
						@focus="handleFocus" @blur="handleBlur" v-model="textcontent"></div>
					<span v-if="isPlaceholderVisible" class="placeholder">请输入内容...</span>
				</view>
		
				<view class="imgbox">
					<view class="imgchoose" v-if="ImgChooseBox.length<9" @click="chooseImg">
						<image src="../../static/img/addmore.png" mode=""></image>
					</view>
					<view class="imgbox-item" v-for="(img,is) in ImgChooseBox" :key="is" v-if="ImgChooseBox.length>0">
						<image src="../../static/img/cancel.svg" class="cancel" @click="deleteImg(is)"></image>
						<image :src="img" mode="aspectFill" class="imgbox-item-img" @click="previewImg(img)"></image>
					</view>
				</view>
			</view>
		
			<view class="option">
				<view class="columns">
					<view class="row" @click="gotoFriendCircle">
						<image src="../../static/img/location.svg" mode="aspectFill" class="row-img"></image>
						<view class="title">
							所在位置
						</view>
						<view class="cont">
						</view>
						<view class="mores">
							<image src="../../static/userdetail/rightarr.png"></image>
						</view>
					</view>
		
					<view class="row">
						<image src="../../static/img/dingyue.svg" mode="aspectFill" class="row-img"></image>
						<view class="title">
							艾特谁看
						</view>
						<view class="cont">
						</view>
						<view class="mores">
							<image src="../../static/userdetail/rightarr.png"></image>
						</view>
					</view>
					<view class="row">
						<image src="../../static/img/my.svg" mode="aspectFill" class="row-img"></image>
						<view class="title">
							谁可以看
						</view>
						<view class="cont">
						</view>
						<view class="mores">
							<image src="../../static/userdetail/rightarr.png"></image>
						</view>
					</view>
				</view>
			</view>
		
		</scroll-view>
	</transition>
		

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
				willDeleteCircleID:'',
				isTransparent: false,
				commentList:[{
					senderName:'kk2',
					senderID:12345,
					receiveName:'kk2',
					receiveID:123456,
					comment:'dsaijdoi',
				},
				{
					senderName:'kk2',
					senderID:12345,
					receiveName:'kk3',
					receiveID:123456,
					comment:'ffqewrf',
				},
				{
					senderName:'kk3',
					senderID:123456,
					receiveName:'kk2',
					receiveID:12345,
					comment:'dsai23oi',
				}
				],
				circleList: [],
				ImgChooseBox: [],
				imgbox: [],
				imgchoose: false,
				isPlaceholderVisible: true,
				textcontent: '',
				enough: false,
				editor: false,
				// iscommentshow:false
				iscommentshow:[],
				iswritecomment:[],
				iswriterepete:[],
				inputText:'',
				tempRepet:'',
				messageTips:[]
			};
		},
		onPullDownRefresh() {
			this.socket.emit('login',this.uid)
			this.getCircle()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
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
		mounted: function() {
			this.$store.commit('emptycircleMessage')
			
			this.socket.emit('login',this.uid)
			this.getCircle()
			this.socket.on('getcomment',(circleID,receiverID,receiverName,senderID,senderName,msg,type,uimgurl,time)=>{
				//uid是发送者id,uname发送者name
				
				//有一条消息，需要做存储
				this.messageTips.push({
							circleID:circleID,
							comment:msg,
							receiverID:receiverID,
							receiverName:receiverName,
							senderID:senderID,
							senderName:senderName,
							type:type,
							uimgurl:uimgurl,
							time:time
						})
						console.log('messageTips',this.messageTips);
				this.$store.commit('setcircleMessage',this.messageTips)
				this.circleList.forEach(item=>{
					if(item.circleID==circleID){
						item.comments.push({
							circleID:circleID,
							comment:msg,
							receiverID:receiverID,
							receiverName:receiverName,
							senderID:senderID,
							senderName:senderName,
							type:type
						})
					}
				})
			})
			this.socket.on('getrepete',(circleID,receiverID,receiverName,senderID,senderName,msg,type,uimgurl,time)=>{
				//uid是发送者id,uname发送者name
				this.messageTips.push({
							circleID:circleID,
							comment:msg,
							receiverID:receiverID,
							receiverName:receiverName,
							senderID:senderID,
							senderName:senderName,
							type:type,
							uimgurl:uimgurl,
							time:time
						})
						console.log('push');
					console.log('messageTips',this.messageTips);
				this.$store.commit('setcircleMessage',this.messageTips)
				
				this.circleList.forEach(item=>{
					if(item.circleID==circleID){
						item.comments.push({
							circleID:circleID,
							comment:msg,
							receiverID:receiverID,
							receiverName:receiverName,
							senderID:senderID,
							senderName:senderName,
							type:type
						})
					}
				})
			})
			
		},
		methods: {

			//查询朋友圈
			getCircle: async function() {
			    uni.request({
			        url: this.serverUrl + '/circle/getcircle',
			        data: {
			            userID: this.uid,
			            friendArry: this.friendsList,
			            token: this.utoken
			        },
			        method: 'POST',
			        success: async function(data) {  // 将箭头函数改成普通函数，并加上 async 关键字
			            try {
			                let status = data.data.status
			                if (status == 200) {
			                    let res = data.data.result
			                    
			                    for (let i = 0; i < res.length; i++) {
			                        let item = res[i];
			
			                        if (item.imgcontent && item.imgcontent.length > 0) {
			                            item.imgcontent = item.imgcontent.map(imgUrl => {
			                                // 在每个图片地址前添加前缀
			                                return this.serverUrl + imgUrl;
			                            });
			                        }
			                        
			                        if (item.video && item.video.length > 0) {
			                            item.video = this.serverUrl + videoUrl
			                        }
			
			                        let comments = await this.getComment(item.circleID);
									console.log(comments);
			                        item.comments = comments;
			                    }
			
			                    this.circleList = res
								
			                    console.log('盆友全列表', this.circleList);
			                    this.iscommentshow = Array(this.circleList.length).fill(false);
			                    this.iswritecomment = Array(this.circleList.length).fill(false);
								this.iswriterepete = Array(this.circleList.length).fill(false);
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
			            } catch (error) {
			                console.error('处理朋友圈数据时发生错误', error);
			            }
			        }.bind(this)  // 绑定 this，确保在函数内可以访问到正确的上下文
			    });
			},


			//选择图片
			chooseImg: function() {
				uni.chooseImage({
					count: 9, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						for(var i=0;i<res.tempFilePaths.length;i++){
							this.ImgChooseBox.push(res.tempFilePaths[i]) 
						}
						
					}
				});
			},
			//删除图片
			deleteImg: function(index) {
				this.ImgChooseBox.splice(index, 1);
			},
			//预览图片
			previewImg: function(e) {
				let index = 0
				for (let i = this.ImgChooseBox.length - 1; i >= 0; i--) {
					if (this.ImgChooseBox[i] == e) {
						index = i;
					}
				}
				uni.previewImage({
					current: index,
					urls: this.ImgChooseBox,
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
			previewuserImg: function(imglist,e) {
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

			scrollChange(event) {
				const scrollTop = event.detail.scrollTop;
				this.isTransparent = scrollTop > 50;
				if (scrollTop === 0) {
					this.isTransparent = false;
				}
			},
			CircleContent: function() {
				this.editor = true
			},
			commmentshow(index) {
			      this.$set(this.iscommentshow, index, !this.iscommentshow[index]);
			},
			RepeteShow(circleID,senderID,senderName,index,type) {
				if(senderID!=this.uid){
					this.$set(this.iswriterepete, index, !this.iswriterepete[index]);
					let data={
						circleID: circleID,
						//senderID: this.uid, //无论怎么样，这一条都是自己
						receiverID: senderID,//但是接收者是选择回复的人的id，就是这一条信息的senderID
						//senderName: this.uname,
						receiverName: senderName, //但是接收者是选择回复的人的name，就是这一条信息的senderName
						type:type,
					}
					this.tempRepet=data
					console.log(this.tempRepet);
				}
			      
			},
			// 创建朋友圈
			buildCircle: function() {
				// 先上传图片
				let url = myfun.fileName(new Date());
				this.imgbox=[]
				const uploadPromises = this.ImgChooseBox.map(item => {
					return new Promise((resolve, reject) => {
						const uploadTask = uni.uploadFile({
							url: this.serverUrl + '/files/upload', 
							filePath: item,
							name: 'file',
							formData: {
								url: 'circle',
								name: new Date().getTime() + this.uid + Math.ceil(Math.random() * 10),
							},
							success: (uploadFileRes) => {
								this.imgbox.push(uploadFileRes.data);
								resolve(uploadFileRes.data); 
							},
							fail: (error) => {
								reject(error);
							}
						});
						uploadTask.onProgressUpdate((res) => {});
					});
				});

				
				Promise.all(uploadPromises).then(() => {
						// 所有图片上传完成后执行 
						uni.request({
							url: this.serverUrl + '/circle/buildCircle',
							data: {
								userID: this.uid,
								userName: this.uname,
								userImgUrl: this.uimgurl,
								textcontent: this.$refs.editableDiv.innerText,
								imgcontent: this.imgbox,
								video: '',
								token: this.utoken
							},
							method: 'POST',
							success: (data) => {
								let status = data.data.status;
								if (status == 200) {
									let res = data.data.result;
									console.log('发布成功');
									this.editor=false
									this.getCircle()
									this.ImgChooseBox=[]
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
					})
					.catch((error) => {
						console.error('Error uploading images:', error);
						// 处理图片上传失败的情况
					});
			},
			//写评论
			creatComment(index) {
			      this.$set(this.iswritecomment, index, !this.iswritecomment[index]);
				  this.$set(this.iscommentshow, index, !this.iscommentshow[index]);
			},
			//发送评论
			sendMessage:function(circleID,userID,userName,index,type){
				
				//发送给这个朋友圈的创建者我这条评论circleID朋友圈id，userid是这条朋友群的创建者id
				if(userID!=this.uid){
					this.socket.emit('sendcomment',circleID,userID,userName,this.uid,this.uname,this.inputText,type,this.uimgurl,new Date())
				}
				
				this.circleList.forEach(item=>{
					if(item.circleID==circleID){
						item.comments.push({
							circleID:circleID,
							comment:this.inputText,
							receiverID:userID,
							receiverName:userName,
							senderID:this.uid,
							senderName:this.uname,
							type:type,
							time:new Date()
						})
					}
				})
				//常规评论
				uni.request({
					url: this.serverUrl + '/circle/buildComment',
					data: {
						circleID: circleID,
						senderID: this.uid, //无论怎么样，这一条都是自己
						receiverID: userID,//但是接收者是书写这天条朋友圈的userid
						senderName: this.uname,
						receiverName: userName,
						comment: this.inputText,
						type:type,
						token: this.utoken
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						if (status == 200) {
							console.log('发表成功');
							this.inputText=''
							this.$set(this.iswritecomment, index, !this.iswritecomment[index]);
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
			//回复他人的评论
			sendRepete:function(index){
				//开启输入
				
				console.log(this.tempRepet);
				let asdf=this.tempRepet
				if(this.uid!=this.tempRepet.senderID){
					
					this.socket.emit('sendeRepete',asdf.circleID,asdf.receiverID,asdf.receiverName,this.uid,this.uname,this.inputText,asdf.type,this.uimgurl,new Date())
					
					this.circleList.forEach(item=>{
						if(item.circleID==this.tempRepet.circleID){
							item.comments.push({
								circleID:this.tempRepet.circleID,
								comment:this.inputText,
								receiverID:this.tempRepet.receiverID,
								receiverName:this.tempRepet.receiverName,
								senderID:this.uid,
								senderName:this.uname,
								type:this.tempRepet.type
							})
						}
					})
					
					
					console.log(this.tempRepet);
					uni.request({
						url: this.serverUrl + '/circle/buildComment',
						data: {
							circleID: this.tempRepet.circleID,
							senderID: this.uid, //无论怎么样，这一条都是自己
							receiverID: this.tempRepet.receiverID,//但是接收者是选择回复的人的id，就是这一条信息的senderID
							senderName: this.uname,
							receiverName: this.tempRepet.receiverName, //但是接收者是选择回复的人的name，就是这一条信息的senderName
							comment: this.inputText,
							type:this.tempRepet.type,
							token: this.utoken
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status;
							if (status == 200) {
								console.log('发表成功');
								this.inputText=''
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
			///获取评论
			getComment: function(circleID) {
			    return new Promise((resolve, reject) => {
			        let tempCommentList = [];
			
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
			                    tempCommentList = data.data.result;
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
			                    reject(new Error('登录失效'));
			                } else {
			                    reject(new Error('未知错误'));
			                }
			            },
			            fail: (error) => {
			                console.error('请求失败', error);
			                reject(error);
			            }
			        });
			    });
			},

			blur:function(index){
				this.$set(this.iswritecomment, index, !this.iswritecomment[index]);
			},
			adjustTextareaHeight() {
				// 调整 textarea 的高度，使其适应内容
				this.$refs.autoResizeTextarea.$el.style.height = 'auto';
				this.$refs.autoResizeTextarea.$el.style.height = this.$refs.autoResizeTextarea.scrollHeight + 'px';
				console.log(this.$refs.autoResizeTextarea.$el.scrollHeight);
			},
			handleInput() {
				const content = this.$refs.editableDiv.innerText;
				if (content.length > 0) {
					this.enough = true
				} else {
					this.enough = false
				}
				// 根据输入内容显示或隐藏 placeholder
				this.isPlaceholderVisible = content === '';
			},
			handleFocus() {
				// 聚焦时隐藏 placeholder
				this.isPlaceholderVisible = false;
			},
			handleBlur() {
				// 失焦时检查是否需要显示 placeholder
				const content = this.$refs.editableDiv.innerText;
				this.isPlaceholderVisible = content === '';
			},
			dialogConfirm:function(){
				if(this.willDeleteCircleID){
					//删除朋友圈
					uni.request({
						url: this.serverUrl + '/circle/deleteByCircleID',
						data: {
							circleID: this.willDeleteCircleID,
							token: this.utoken
						},
						method: 'POST',
						success: async (data) => {
							let status = data.data.status;
					
							if (status == 200) {
								uni.showToast({
									title: '删除成功',
									duration: 2000,
								});
								this.getCircle()
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
				}
				
			},
			dialogClose:function(){
				
				this.willDeleteCircleID=''
			},
			dialogToggle:function(cirlceID) {
			
				this.willDeleteCircleID=cirlceID
				
				this.$refs.alertDialog.open()
			},
			
			cancelbuild:function(){
				this.editor=false
				this.ImgChooseBox=[]
			},
			changetime: function(time) {
				return myfun.formatTime(time)
			},
			toMessage:function(){
				this.messageTips=[]
				uni.navigateTo({
					url:'../../pages/circlemessage/circlemessage'
				})
			},
			backTo: function() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="less">
	.slide-fade-enter-active, .slide-fade-leave-active {
	  transition: opacity 0.5s, transform 0.5s;
	}
	.slide-fade-enter, .slide-fade-leave-to {
	  opacity: 0;
	  transform: translateY(-20px);
	}
	
	.friend-home {
		.top-bar-untransparent {
			background: white !important;
		}

		.top-bar {
			position: fixed;
			z-index: 1000;
			padding-top: var(--status-bar-height);
			left: 0;
			top: 0;
			width: 100%;
			height: 88rpx;
			background: transparent;

			.top-bar-left {

				float: left;
				padding-left: 32rpx;
				padding-top: 15rpx;

				image {

					width: 58rpx;
					height: 58rpx;
				}

			}

			.top-bar-right {
				float: right;
				padding-right: 14rpx;

				.more {
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

		.content {
			height: 1700rpx;
			.messageTip{
				width: 35%;
				margin: 60rpx auto 0;
				height: 80rpx;
				background-color: rgba(0, 0,0,.5);
				display: flex;
				border-radius: 20rpx;
				padding: 10rpx 30rpx 10rpx 10rpx;
				box-sizing: border-box;
				justify-content: space-between;
				align-items: center;
				font-size: 30rpx;
				color: white;
				.userimage{
					width: 50rpx;
					height: 50rpx;
				}
			}
			.img-box {
				position: relative;
				width: 100%;
				// height: 800rpx;
				background-color: black;
				display: flex;
				justify-content: center;
				align-items: center;

				.userimg {
					bottom: -80rpx;
					right: 0rpx;
					position: absolute;
					border-radius: 50%;
					width: 160rpx;
					height: 160rpx;
					border: 4px solid #ffffff;
				}

				.top-bg {
					width: 100%;
				}
			}

			.circle-list {
				margin-top: 100rpx;
				width: 100%;
				padding: ;
				display: flex;
				flex-direction: column;

				.circle-li {
					display: flex;
					flex-direction: row;
					border-bottom: 0.5px solid pink;
					padding: 20rpx;

					.circle-user-img {
						width: 80rpx;
						height: 80rpx;
						background-color: brown;
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
						font-size: 25rpx;
						color: rgb(217, 217, 217);
					}
					.commentshow{
						width: 300rpx !important;
						opacity: 1 !important;
					}
					.comments{
						position: absolute;
						right: 80rpx;
						width:0rpx;
						opacity: 0;
						height: 60rpx;
						justify-content: center;
						align-items: center;
						font-size: 25rpx;
						background-color: rgba(0,0,0,0.6);
						transition: all,.3s;
						display: flex;
						color: aliceblue;
						.dianzan{
							flex: 1;
							display: flex;
							justify-content: center;
							align-items: center;
						}
						.say{
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
				.commentslist{
					width: 100%;
					background-color: rgb(247,247,247);
					border-radius: 10rpx;
					padding: 10rpx;
					.comment-li{
						color: black;
						font-size: 30rpx;
						font-weight: 200;
						padding: 5rpx;
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
						font-size:25rpx;
						cursor: pointer;
					}
				}
			}

		}

		.buildcontent {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: white;
			z-index: 1001;
			display: flex;
			flex-direction: column;

			.top-bar {
				position: fixed;
				z-index: 1000;
				padding-top: var(--status-bar-height);
				left: 0;
				top: 0;
				width: 100%;
				height: 88rpx;
				background: transparent;

				.top-bar-left {

					float: left;
					padding-left: 32rpx;
					padding-top: 15rpx;

					image {
						width: 58rpx;
						height: 58rpx;
					}

				}

				.top-bar-right {
					float: right;
					padding: 14rpx;

					.more {
						width: 108rpx;
						height: 68rpx;
						border-radius: 20rpx;
						background-color: gainsboro;
						display: flex;
						justify-content: center;
						color: plum;
						align-items: center;
						box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
					}

					.enoughmore {
						width: 108rpx;
						height: 68rpx;
						border-radius: 20rpx;
						background-color: darkgoldenrod;
						box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
						color: white;
						display: flex;
						justify-content: center;

						align-items: center;
					}
				}
			}

			.editorbox {

				min-height: 50%;

				.texteditor {
					padding: 120rpx 60rpx 80rpx 60rpx;

					position: relative;

					.editable-div {
						font-size: 30rpx;
						min-height: 20px;
						outline: none;
					}

					.placeholder {
						color: #aaa;
						font-size: 30rpx;
						position: absolute;
						top: 120rpx;
					}
				}

				.imgbox {
					width: 100%;
					display: grid;
					grid-template-columns: repeat(3, 1fr);
					grid-auto-flow: dense;
					gap: 20rpx;
					padding: 0 60rpx;
					box-sizing: border-box;

					.imgbox-item {
						display: flex;
						justify-content: center;
						align-items: center;
						width: 100%;
						position: relative;

						.cancel {
							position: absolute;
							top: -20rpx;
							right: -20rpx;
							width: 40rpx;
							height: 40rpx;
							z-index: 2;
							background-color: azure;
							border-radius: 50%;
						}

						.imgbox-item-img {
							width: 100%;
							height: 180rpx;
						}
					}

					.imgchoose {
						box-sizing: border-box;
						display: flex;
						justify-content: center;
						align-items: center;
						width: 180rpx;
						height: 180rpx;
						box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

						image {
							width: 120rpx;
							height: 120rpx;
						}
					}
				}

			}

			.option {

				background-color: white;

				.columns {
					display: flex;
					flex-direction: column;
					width: 100%;
					box-sizing: border-box;
					padding: 60rpx 60rpx 0 60rpx;

					.row {
						height: 100rpx;
						box-sizing: border-box;
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;
						border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
					}

					.row-img {
						width: 40rpx;
						height: 40rpx;
						border-radius: 50%;
					}

					.title {
						flex: none;
						height: auto;
						padding: 0 32rpx;
						font-size: 28rpx;
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

					.mores {
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
	}
</style>
