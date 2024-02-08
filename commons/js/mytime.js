export default{
	dataTime(t){
		let old=new Date(t);
		let now=new Date();
		
		//获取oLd具体时间
		let d=old.getTime();
		let h=old.getHours();
		let m=old.getMinutes();
		let Y=old.getFullYear();
		let M=old.getMonth();
		let D=old.getDate();
		//获取now具体时间
		let nd=now.getTime();
		let nh=now.getHours();
		let n=now.getMinutes();
		let nY=now.getFullYear();
		let nM=now.getMonth();
		let nD=now.getDate();
		
		//当天时间
		if (D===nD&&M===nM&&Y===nY){
			if(h<10){
				h="0"+h
			}
			if(m<10){
				m="0"+m
			}
			return h+":"+m
		}
		//前天时间
		if (D+1===nD&&M===nM&&Y===nY){
			if(h<10){
				h="0"+h
			}
			if(m<10){
				m="0"+m
			}
			return "前天"+h+":"+m
		}
		//大于两天
		else{
			return Y+"/"+M+"/"+D
		}
	},
	//聊天时间
	dataTime1(t){
		let old=new Date(t);
		let now=new Date();
		
		//获取oLd具体时间
		let d=old.getTime();
		let h=old.getHours();
		let m=old.getMinutes();
		let Y=old.getFullYear();
		let M=old.getMonth();
		let D=old.getDate();
		//获取now具体时间
		let nd=now.getTime();
		let nh=now.getHours();
		let n=now.getMinutes();
		let nY=now.getFullYear();
		let nM=now.getMonth();
		let nD=now.getDate();
		
		//当天时间
		if (D===nD&&M===nM&&Y===nY){
			if(h<10){
				h="0"+h
			}
			if(m<10){
				m="0"+m
			}
			return h+":"+m
		}
		//前天时间
		if (D+1===nD&&M===nM&&Y===nY){
			if(h<10){
				h="0"+h
			}
			if(m<10){
				m="0"+m
			}
			return "昨天"+h+":"+m
		}
		//今年
		else if(Y===nY){
			if(h<10){
				h="0"+h
			}
			if(m<10){
				m="0"+m
			}
			return M+"月"+D+'日 '+h+':'+m
		}
		else{//大于今年
			if(h<10){
				h="0"+h
			}
			if(m<10){
				m="0"+m
			}
			return Y+'年'+M+"月"+D+'日 '+h+':'+m
		}
	},
	spacTime(old,now){
		old=new Date(old)
		now=new Date(now)
		var told=old.getTime()
		var tnow=now.getTime()
		
		if(tnow>(told+1000*60*5)){
			return now
		}else{
			return ''
		}
	},
	
	//详细时间
	dataTimeDetail(t){
		let old= new Date(t);
		let ds=old.getTime();
		let hs=old.getHours();
		let ms=old.getMinutes();
		let Ys=old.getFullYear();
		let Ms=old.getMonth()+1;
		let Ds=old.getDate();
		//当天时间
		if(Ms<10){
			Ms='0'+Ms;
		}
		if(Ds<10){
			Ds='0'+Ds;
		}
		if(hs<10){
			hs='0'+hs;
		}
		if(ms<10){
			ms='0'+ms;
		}
		return Ys+'-'+Ms+'-'+Ds+'-'+hs+':'+ms
	},
	//详细时间
	dataTimeDetail1(t){
		let old= new Date(t);

		let Ys=old.getFullYear();
		let Ms=old.getMonth()+1;
		let Ds=old.getDate();
		//当天时间
		if(Ms<10){
			Ms='0'+Ms;
		}
		if(Ds<10){
			Ds='0'+Ds;
		}
		
		return Ys+'-'+Ms+'-'+Ds
	},
	//文件夹时间
	fileName(t){
		let old= new Date(t);
		
		let Y=old.getFullYear();
		let M=old.getMonth()+1;
		let D=old.getDate();
		//当天时间
		if(M<10){
			M='0'+M;
		}
		if(D<10){
			D='0'+D;
		}
		
		return Y+''+M+''+D
	},
	Debounce(fn,t){
		let delay=t||500
		let timer
		return function(){
			let args=arguments
			if(timer){
				clearTimeout(timer)
			}
			timer=setTimeout(()=>{
				timer=null
				fn.apply(this,args)
			},delay)
		}
	},
	
	 formatTime(timeString) {
	  const eventDate = new Date(timeString);
	  const currentDate = new Date();
	  const timeDifference = currentDate - eventDate;
	
	  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
	
	  if (daysDifference === 0) {
	    const hours = eventDate.getHours();
	    const minutes = eventDate.getMinutes();
	    return `今天 ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
	  }
	  if (daysDifference === 1) {
	    return '昨天';
	  }
	  if (daysDifference === 2) {
	    return '前天';
	  }
	  if (daysDifference < 30) {
	    return `${daysDifference}天前`;
	  }
	
	  // 超过一个月，返回具体日期
	  const year = eventDate.getFullYear();
	  const month = eventDate.getMonth() + 1;
	  const day = eventDate.getDate();
	  return `${year}/${month < 10 ? '0' : ''}${month}/${day < 10 ? '0' : ''}${day}`;
	}
	
}