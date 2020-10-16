export default {
	baseUrl: 'http://ihuolu.natapp1.cc',
	// baseUrl: 'https://api.ihuolu.com',
	//环境
	status: 'dev', //线上 prod 测试 dev

	//获取时分秒
	toHHmmss: (data) => {
		let s;
		let hours = parseInt((data % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		let minutes = parseInt((data % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = parseInt((data % (1000 * 60)) / 1000);
		s = (hours < 10 ? ('0' + hours) : hours) + ':' + (minutes < 10 ? ('0' + minutes) : minutes) + ':' + (seconds < 10 ?
			('0' + seconds) : seconds);
		return s;
	},

	//url  地址
	//data json参数
	//type 请求方式 
	requests: function(url, datas, type) {
		var that = this;
		return new Promise((resolve, reject) => {
			var data = datas || {};
			if (url == undefined) {
				console.log('必须传入URL');
				return false;
			}
			// if (data.token == undefined) {
			// 	data.token = uni.getStorageSync('token');
			// }
			if (type == undefined) {
				type = 'POST';
			}
			uni.request({
				url: that.baseUrl + url,
				header: {
					'Content-Type': 'application/json;charset=UTF-8',
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: data,
				// sslVerify: false, 
				method: type,
				success: (res) => {
					resolve(res)
				},
				fail: (err) => {
					reject(err)
				}
			})
		})
	},

	// 获取日期，如果不传则返回当前日期  yyyy-mm-dd
	timestampToDay: daystamp => {
		if (!daystamp) {
			daystamp = new Date().getTime() - (24 * 60 * 60 * 1000); // 获取当前时间 前一天的时间
		}
		const dateObj = new Date(daystamp) // ps, 必须是数字类型，不能是字符串, +运算符把字符串转化为数字，更兼容
		const year = dateObj.getFullYear() // 获取年，
		const month = dateObj.getMonth() + 1 // 获取月，必须要加1，因为月份是从0开始计算的
		const date = dateObj.getDate() // 获取日，记得区分getDay()方法是获取星期几的。
		return year + '-' + month + '-' + date
	},



}
