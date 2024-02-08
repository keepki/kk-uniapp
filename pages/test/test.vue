<template>
	<view>
		<view class="upload" @click="upload">
			上传文件
		</view>
		<image :src="item" v-for="(item,index) in img" :key="index"></image>
	</view>
</template>

<script>
	import mytime from "../../commons/js/mytime.js"
	export default {
		data() {
			return {
				id:'asdsad',
				img:[]
			};
		},
		methods: {
			upload: function() {
				let url=mytime.fileName(new Date())
				
				uni.chooseImage({
					count:9,
					sizeType:['original','compressed'],
					sourceType:['album','camera'],
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						
						for(var i=0;i<tempFilePaths.length;i++){
							const uploadTask = uni.uploadFile({
								url: this.serverUrl+'/files/upload', //接口地址
								filePath: tempFilePaths[i],
								name: 'file',
								formData: {
									url: url,
									name:new Date().getTime()+this.id+i
								},
								success: (uploadFileRes) => {
									
									console.log(uploadFileRes);
									let path=this.serverUrl+uploadFileRes.data
									this.img.push(path)
									
								}
							});
							 
							uploadTask.onProgressUpdate((res) => {
								console.log('上传进度' + res.progress);
								console.log('已经上传的数据长度' + res.totalBytesSent);
								console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
							
								// 测试条件，取消上传任务。
								// if (res.progress > 50) {
								// 	uploadTask.abort();
								// }
							});
						}
						
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.upload{
		display: inline-block;
		margin: 0 300rpx;
	}
</style>
