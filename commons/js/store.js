import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// 定义状态（state）
const state = {
  // 在这里定义你的应用程序状态
   calling:false,
   phoneShow:false,
   friendId:'',
   friendImgUrl:'',
   friendName:'',
   userId:'',
   userImgUrl:'',//自己的信息
   userName:'',
   token:'',
   friendsList:[],
   circleMessage:[],
  // 其他状态...
};

// 定义操作（mutations）
const mutations = {
  // 在这里定义修改状态的方法
  changeCalling(state,status) {
    state.calling=status;
  },
  changephoneShow(state,status){
	  state.phoneShow=status;
  },
  setFriendId(state,fid) {
    state.friendId=fid
  },
  setUserId(state,uid) {
    state.userId=uid
  },
  setFriendImgUrl(state,fimgurl) {
    state.friendImgUrl=fimgurl
  },
  setFriendName(state,fname){
	  state.friendName=fname
  },
  setUserImgUrl(state,uimgurl) {
    state.userImgUrl=uimgurl
  },
  setuserName(state,uname) {
    state.userName=uname
  },
  setToken(state,token){
	  state.token=token
  },
  setfriendsList(state,friends){
	  state.friendsList=friends
  },
  setcircleMessage(state,circlemessage){
  	  state.circleMessage=circlemessage
  },
  emptycircleMessage(state){
	  state.circleMessage=[]
	  console.log('circleMessage清空');
  }
  // 其他操作...
};

// 创建 Vuex store 实例
const store = new Vuex.Store({
  state,
  mutations,
});

export default store;
