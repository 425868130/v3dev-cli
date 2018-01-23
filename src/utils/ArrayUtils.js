var indexOf = function(array,item){
	var index = -1;
	if(array){
		for(var i=0,l=array.length;i<l;i++){
			if(array[i]==item){
				index = i;
				break;
			}
		}
	}
	return index;
}

var contains = function(array,item){
	return indexOf(array,item)==-1 ? false:true;
}

exports.indexOf = indexOf;
exports.contains = contains;