export default{
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
	//排序
	paixu(arr,obj,tip){
		if(tip==0){
			//降序
			for(let i=1;i<arr.length;i++){
				for(let j=i;j>0;j--){
					if(arr[j][obj]>arr[j-1][obj]){
						let s=arr[j]
						arr[j]=arr[j-1]
						arr[j-1]=s
					}
				}
			}
			return arr
		}else if(tip==1){
			//升序
			for(let i=1;i<arr.length;i++){
				for(let j=i;j>0;j--){
					if(arr[j][obj]<arr[j-1][obj]){
						let s=arr[j]
						arr[j]=arr[j-1]
						arr[j-1]=s
					}
				}
			}
			return arr
		}
	}
}