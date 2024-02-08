<template>
		<view>
			<text>hello</text>
			<button @tap="test">click me</button>
			<video :src="src"></video>
		</view>
</template>

<script>
	import mytime from "../../commons/js/mytime.js"
	export default {
		data() {
			return {
				src: ''
			}
		},
		onLoad:function(){
			console.log(this.serverUrl);
		},
		methods: {
			test: function () {
				let url=mytime.fileName(new Date())
				var self = this;
				uni.chooseVideo({
					sourceType: ['camera', 'album'],
					success: function (res) {
						self.src = res.tempFilePath;
						console.log(this.serverUrl+'/files/upload');
						uni.showLoading({
							title:'上传中'
						})
						const uploadTask = uni.uploadFile({
							url: 'http://127.0.0.1:3000/files/upload', //接口地址
							filePath: res.tempFilePath,
							name: 'file',
							formData: {
								url: url,
								name:new Date().getTime()
							},
							success: (uploadFileRes) => {
								uni.hideLoading();
								console.log('成功反馈',uploadFileRes.data);
							}
						});
						 
						uploadTask.onProgressUpdate((res) => {

						});
					}
				});
			}
		}
	}
</script>

<style>

</style>
