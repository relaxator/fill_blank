module.exports = {
	isRealString: function(str){
		var isReal = false;
		if(typeof(str) === "string" && str.trim().length > 0){
			isReal = true;
		}
		return isReal;
	}

}

return module.exports;