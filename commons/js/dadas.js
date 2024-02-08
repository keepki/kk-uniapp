export default{
	friends:function(){
		//模拟的是当前用户所关联的所有好友
		let friendarr=[
			{
			    id:1,
				imgurl:'work.jpg',
				tip:29,
				name:'大海',
				email:"666@63.com",
				time:new Date(),
				news:'TOP,常常遇到文章标题列表布局排版时候，有的标题比较长显示不完，这个时候即又不想换行',
			},
			{
			    id:2,
				imgurl:'我的.jpg',
				tip:2,
				name:'你是大便',
				email:"666@63.com",
				time:new Date(),
				news:'业务页面文件存放的目录',
			},
			{
			    id:3,
				imgurl:'洗脚.jpg',
				tip:2,
				name:'花开富贵',
				email:"6636@63.com",
				time:new Date(),
				news:'存放应用引用的本地静态资源（如图片、视频等）的目录，注意：静态资源只能存放于',
			},
			{
			    id:4,
				imgurl:'鸭子.jpg',
				tip:12,
				name:'谐音',
				email:"666@63.com",
				time:new Date(),
				news:' iOS原生资源目录',
			},
			{
			    id:5,
				imgurl:'暗黑.jpg',
				tip:8,
				name:'csy',
				email:"666@63.com",
				time:new Date(),
				news:'需注意在webview渲染的页面中，区域滚动的性能不及页面滚动。',
			},
			{
			    id:6,
				imgurl:'work.jpg',
				tip:29,
				name:'急哦大苏打',
				email:"666@63.com",
				time:new Date(),
				news:'TOP,常常遇到文章标题列表布局排版时候，有的标题比较长显示不完，这个时候即又不想换行',
			},
			{
			    id:7,
				imgurl:'我的.jpg',
				tip:2,
				name:'刚刚v成本',
				email:"666@63.com",
				time:new Date(),
				news:'业务页面文件存放的目录',
			},
			{
			    id:8,
				imgurl:'洗脚.jpg',
				tip:2,
				name:'花开富贵',
				email:"666@63.com",
				time:new Date(),
				news:'存放应用引用的本地静态资源（如图片、视频等）的目录，注意：静态资源只能存放于',
			},
			{
			    id:9,
				imgurl:'鸭子.jpg',
				tip:12,
				name:'高投入',
				email:"666@63.com",
				time:new Date(),
				news:' iOS原生资源目录',
			},
			{
			    id:10,
				imgurl:'暗黑.jpg',
				tip:8,
				name:'中心城市广东省',
				email:"666@63.com",
				time:new Date(),
				news:'需注意在webview渲染的页面中，区域滚动的性能不及页面滚动。',
			},
			{
			    id:11,
				imgurl:'work.jpg',
				tip:29,
				name:'海关大桥',
				email:"666@63.com",
				time:new Date(),
				news:'TOP,常常遇到文章标题列表布局排版时候，有的标题比较长显示不完，这个时候即又不想换行',
			},
			{
			    id:12,
				imgurl:'我的.jpg',
				tip:2,
				name:'dadarar',
				email:"666@63.com",
				time:new Date(),
				news:'业务页面文件存放的目录',
			},
			{
			    id:13,
				imgurl:'洗脚.jpg',
				tip:2,
				name:'dscaer',
				email:"666@63.com",
				time:new Date(),
				news:'存放应用引用的本地静态资源（如图片、视频等）的目录，注意：静态资源只能存放于',
			},
			{
			    id:14,
				imgurl:'鸭子.jpg',
				tip:12,
				name:'大师的去微软',
				email:"666@63.com",
				time:new Date(),
				news:' iOS原生资源目录',
			},
			{
			    id:15,
				imgurl:'暗黑.jpg',
				tip:8,
				name:'大炮个的人',
				email:"666@63.com",
				time:new Date(),
				news:'需注意在webview渲染的页面中，区域滚动的性能不及页面滚动。',
			},
		]
		return friendarr
	},
	//好友表
	isFriend:function(){
		//代表对应的用户id有多少个好友在数据库中可以理解为id为1他的friend有多少最后是调用接口查出来的
		let isfriend=[
			{
				userid:1,
				friend:2
			},
			{
				userid:1,
				friend:5,
			},
			{
				userid:1,
				friend:6
			},
			{
				userid:1,
				friend:8
			}
		]
		return isfriend
	},
	//信息列表
	message:function(){
		let msgs=[
			{
				id:'a',//用户id
				imgurl:'鸭子.jpg',
				message:'洗脚.jpg',
				type:1,//文字类型(0文字，1图片，2音频文件)
				time:new Date()-1000,
				tip:1,
			},
			{
				id:'b',//用户id
				imgurl:'洗脚.jpg',
				message:'与其他元素保持等分，会优先压缩内容',
				type:0,//文字类型(0文字，1图片，2音频文件)
				time:new Date()-1000*16,
				tip:2,
			},
			{
				id:'a',//用户id
				imgurl:'鸭子.jpg',
				message:'但是flex:1在尺寸不足时依然与其他元素保持等分，会优先压缩内容',
				type:0,//文字类型(0文字，1图片，2音频文件)
				time:new Date()-1000*60,
				tip:3,
			},
			{
				id:'b',//用户id
				imgurl:'洗脚.jpg',
				message:'与其他元素保持等分，会优先压缩内容',
				type:0,//文字类型(0文字，1图片，2音频文件)
				time:new Date()-1000*60*40,
				tip:4,
			},
			{
				id:'b',//用户id
				imgurl:'洗脚.jpg',
				message:'鸭子.jpg',
				type:1,//文字类型(0文字，1图片，2音频文件)
				time:new Date()-1000*60*57,
				tip:5,
			},
			{
				id:'a',//用户id
				imgurl:'鸭子.jpg',
				message:'66但是flex:1在尺寸不足时依然与其他元素保持等分，会优先压缩内容',
				type:0,//文字类型(0文字，1图片，2音频文件)
				time:new Date()-1000*60*60*24,
				tip:6,
			},
			{
				id:'b',//用户id
				imgurl:'洗脚.jpg',
				message:'apex.jpg',
				type:1,//文字类型(0文字，1图片，2音频文件)
				time:new Date()-1000*600*60*16,
				tip:7,
			},
			{
				id:'b',//用户id
				imgurl:'洗脚.jpg',
				message:'鸭子.jpg',
				type:1,//文字类型(0文字，1图片，2音频文件)
				time:new Date()-1000*60*57,
				tip:8,
			},
			{
				id:'a',//用户id
				imgurl:'鸭子.jpg',
				message:'66但是flex:1在尺寸不足时依然与其他元素保持等分，会优先压缩内容',
				type:0,//文字类型(0文字，1图片，2音频文件)
				time:new Date()-1000*60*60*24,
				tip:9,
			},
			{
				id:'b',//用户id
				imgurl:'洗脚.jpg',
				message:'与其他元素保持',
				type:0,//文字类型(0文字，1图片，2音频文件)
				time:new Date()-1000*600*60*240*1,
				tip:10,
			},
			{
				id:'a',//用户id
				imgurl:'鸭子.jpg',
				message:'66但是flex:1在尺寸不足时依然与其他元素保持等分，会优先压缩内容',
				type:0,//文字类型(0文字，1图片，2音频文件)
				time:new Date()-1000*60*60*24,
				tip:11,
			},
			{
				id:'b',//用户id
				imgurl:'洗脚.jpg',
				message:'与其他666元素保持',
				type:0,//文字类型(0文字，1图片，2音频文件)
				time:new Date()-1000*600*60*240*2,
				tip:12,//tip越大表示越是之前发的消息
			},
			{
				id:'a',//用户id
				imgurl:'鸭子.jpg',
				message:{
					voice:'a',
					time:60
				},
				type:2,//文字类型(0文字，1图片，2音频文件)
				time:new Date()-1000,
				tip:13,
			},
			{
				id:'b',//用户id
				imgurl:'洗脚.jpg',
				message:{
					voice:'a',
					time:20
				},
				type:2,//文字类型(0文字，1图片，2音频文件)
				time:new Date()-1000,
				tip:14,
			},
			{
				id:'b',//用户id
				imgurl:'洗脚.jpg',
				message:{
					name:'天安门广场',
					address:'背景天安门广场东侧第三个街道口',
					latitude:'39.909473',
					longitude:'116.39730899999999'
					
				},
				type:3,//文字类型(0文字，1图片，2音频文件,3地理位置)
				time:new Date()-1000,
				tip:15,
			},
			{
				id:'a',//用户id
				imgurl:'鸭子.jpg',
				message:{
					name:'天安门广场',
					address:'背景天安门广场东侧第三个街道口',
					latitude:'39.909473',
					longitude:'116.39730899999999'
				},
				type:3,//文字类型(0文字，1图片，2音频文件,3地理位置)
				time:new Date()-1000,
				tip:16,
			},
			
			{
				id:'b',//用户id
				imgurl:'洗脚.jpg',
				message:'鸭子.jpg',
				type:1,//文字类型(0文字，1图片，2音频文件)
				time:new Date()-1000*60*57,
				tip:17,
			},
			{
				id:'a',//用户id
				imgurl:'鸭子.jpg',
				message:'66但是flex:1在尺寸不足时依然与其他元素保持等分，会优先压缩内容',
				type:0,//文字类型(0文字，1图片，2音频文件)
				time:new Date()-1000*60*60*24,
				tip:18,
			},
			{
				id:'b',//用户id
				imgurl:'洗脚.jpg',
				message:'与其他元素保持',
				type:0,//文字类型(0文字，1图片，2音频文件)
				time:new Date()-1000*600*60*240*1,
				tip:19,
			},
			{
				id:'a',//用户id
				imgurl:'鸭子.jpg',
				message:'66但是flex:1在尺寸不足时依然与其他元素保持等分，会优先压缩内容',
				type:0,//文字类型(0文字，1图片，2音频文件)
				time:new Date()-1000*60*60*24,
				tip:20,
			},
			{
				id:'b',//用户id
				imgurl:'洗脚.jpg',
				message:'与其他666元素保持',
				type:0,//文字类型(0文字，1图片，2音频文件)
				time:new Date()-1000*600*60*240*2,
				tip:21,//tip越大表示越是之前发的消息
			},
			{
				id:'a',//用户id
				imgurl:'鸭子.jpg',
				message:{
					voice:'a',
					time:60
				},
				type:2,//文字类型(0文字，1图片，2音频文件)
				time:new Date()-1000,
				tip:22,
			},
			{
				id:'b',//用户id
				imgurl:'洗脚.jpg',
				message:{
					voice:'a',
					time:20
				},
				type:2,//文字类型(0文字，1图片，2音频文件)
				time:new Date()-1000,
				tip:23,
			},
			{
				id:'b',//用户id
				imgurl:'洗脚.jpg',
				message:{
					name:'天安门广场',
					address:'背景天安门广场东侧第三个街道口',
					latitude:'39.909473',
					longitude:'116.39730899999999'
					
				},
				type:3,//文字类型(0文字，1图片，2音频文件,3地理位置)
				time:new Date()-1000,
				tip:24,
			},
			{
				id:'a',//用户id
				imgurl:'鸭子.jpg',
				message:{
					name:'天安门广场',
					address:'背景天安门广场东侧第三个街道口',
					latitude:'39.909473',
					longitude:'116.39730899999999'
				},
				type:3,//文字类型(0文字，1图片，2音频文件,3地理位置)
				time:new Date()-1000,
				tip:25,
			},
		]
		return msgs
	}
}