Utils = {
	toFixed:function(number, fraction) {
		with(Math){
			var carry = pow(10, fraction);
			return round(number*carry)/carry;
		}
	}
};

if (module) module.exports = Utils;