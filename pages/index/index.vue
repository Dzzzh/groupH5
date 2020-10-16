<template>
	<view class="content">
		<video id="myVideo" :src="vLogData.vlogUrl" :controls="false" :enable-progress-gesture="false" :show-center-play-btn="false"
		 :show-fullscreen-btn="false" object-fit="contain" loop="true" @click="onPlay">
		</video>
		<image class="top-cart" src="../../static/img/icon/cart.png" @click="onPopup" />
		<view class="play-btn" @click="onPlay">
			<u-icon name="play-right-fill" color="#fff" size="100" v-if="flag"></u-icon>
		</view>
		<view class="bot-box" :class="moneyOff ? 'box-top-height':''">
			<view class="bot-box-top">
				<p v-if="vLogData.preferentialTerms">{{vLogData.preferentialTerms}}</p>
				<p v-if="vLogData.fullReduction">{{vLogData.fullReduction}}</p>
			</view>
			<p class="goods-title">{{vLogData.productName}}</p>
			<view class="bot-box-bot">
				<view class="address">
					<image src="../../static/img/icon/location.png"></image>
					<p>{{vLogData.address}} ></p>
				</view>
				<view class="right">
					<view class="like">
						<image src="../../static/img/icon/like.png"></image>
						<p>{{vLogData.collectionNum | likeNum}}</p>
					</view>

					<view class="kefu">
						<image src="../../static/img/icon/service.png"></image>
						<p>客服</p>
					</view>
				</view>
			</view>
		</view>
		<popup ref="popup" type="bottom">
			<view class="wrap">
				<view class="price">
					<p class="newPrice">{{vLogData.price}}</p>
					<p class="oldPrice" v-if="vLogData.discountPrice != 0">{{vLogData.discountPrice}}</p>
				</view>
				<p class="goods-title">{{vLogData.productName}}</p>
				<view class="pay-num">
					<p>购买数量</p>
					<view class="btn">
						<image src="../../static/img/icon/del.png" mode="" @click="onGoodsNumBtn('del')"></image>
						<p>{{goodsNum}}</p>
						<image src="../../static/img/icon/add.png" mode="" @click="onGoodsNumBtn('add')"></image>
					</view>
				</view>
				<view class="wrap-bot-box">
					<view class="bot-box-left">
						<image src="../../static/img/icon/kefuBlack.png" mode=""></image>
						<p>客服</p>
					</view>
					<view class="bot-box-right">
						<button class="box-right-left" @click="launchApp">加入购物车</button>
						<button class="box-right-right" @click="launchApp">立即购买</button>
					</view>
				</view>
				<image class="close" src="../../static/img/icon/guanbi.png" @click="onClose"></image>
			</view>
		</popup>

		<view class="open-app">
			<button class="open-app-btn" @click="launchApp">App内打开</button>
		</view>
	</view>
</template>

<script>
	import CallApp from "callapp-lib"; //跳转app
	import popup from "@/components/wyb-popup/wyb-popup.vue"
	export default {
		data() {
			return {
				vLogData: [],
				goodsNum: 1, //商品数量
				vLogNum: "1595303177557126633",
				flag: true,
				videoContext: null,
				openOptions: null,
				options: null,
				callLib: null
			};
		},
		components: {
			popup,
		},
		onLoad(options) {
			if (options.vlogId) {
				this.vLogNum = options.vlogId
			}
			//创建video
			this.videoContext = uni.createVideoContext('myVideo')

			//唤醒App
			this.callLibFn()

		},

		onShow() {
			this.init()
		},
		methods: {



			//唤醒App
			callLibFn() {
				this.openOptions = {
					path: '', //跳转APP的链接
					/*param: { //跳转携带的参数
						url: 'https://ihuolu.com/#/login', //必须开启vue路由history，不然安卓端接收不到pass和#号后面的login
						pass: 'vLog'
					}
*/
				};

				this.options = {
					scheme: { //打开IOS的标识
						protocol: 'weixin',
					},
					intent: { //打开安卓标识
						package: 'com.zhihu.android', //安卓协议 com.tencent.mm weixin
						scheme: 'zhihu',
					},
					appstore: 'https://apps.apple.com/cn/app/%E7%81%AB%E9%B9%BF/id1449119083', //App Store地址
					yingyongbao: 'https://android.myapp.com/myapp/detail.htm?apkName=com.wanjie.firedeer&ADTAG=mobile', //应用宝地址
					fallback: 'https://www.ihuolu.com/#/down-load', //唤端失败后跳转的地址。
					timeout: 2000, //等待唤端的时间（单位: ms），超时则判断为唤端失败。
				}
				this.callLib = new CallApp(this.options);
			},
			//唤醒App需要的URL
			checkUrl(url) {
				if (url.indexOf('#') !== -1) {
					return url.replace(/#/g, 'hashrouter');
				}

				return url;
			},

			//点击屏幕 暂停&播放
			onPlay() {
				this.flag = !this.flag
				this.flag == false ? this.videoContext.play() : this.videoContext.pause()
			},

			launchApp() {
				let path = window.location.href;
				
				let url =  this.checkUrl(path);
				let that = this;
				this.callLib.open({ path: url });
				this.callLib.generateScheme(that.callLib.generateIntent({
					path: ''
				}))
				// this.evokeByLocation(this.openOptions)

			},

			//初始化数据
			init() {
				let vLogId = this.$qs.stringify({
					vLogId: this.vLogNum
				})
				this.$common.requests(`/vlog/${this.$common.status}/v-log/v1/getShareVLogById`, vLogId)
					.then(res => {
						if (res.statusCode == 200) {
							console.log(res);
							this.vLogData = res.data.data
						}
					})
			},
			//调起购物车弹窗
			onPopup() {
				this.$refs["popup"].show()
			},

			//增加&减少商品
			onGoodsNumBtn(type) {
				if (type == "del") {
					this.goodsNum--
					this.goodsNum == 0 ? this.goodsNum = 1 : '';


				} else if (type == "add") {
					this.goodsNum++
				}
			},
			//点击 X 关闭弹窗
			onClose() {
				this.$refs["popup"].hide()
			}
		},
		filters: {
			//过滤点赞数量
			likeNum(val) {
				if (val >= 10000) {
					val /= 10000
					return val + '万'
				} else if (val <= 9999) {
					return val
				}
			}
		},
		computed: {
			//判断有没有优惠 增高.bot-box 高度
			moneyOff: function() {
				if (this.vLogData.preferentialTerms || this.vLogData.fullReduction) {
					return true
				} else {
					return false
				}
			}
		},

		//小程序分享当前页
		onShareAppMessage() {

			// return {
			// 	title: "百人团购,快来抢购。"
			// }
		}
	}
</script>

<style lang="scss">
	page {
		margin: 0;
		padding: 0;
	}

	.content {
		width: 100vw;
		height: 100vh;
		overflow: hidden;

		video {
			width: 100%;
			height: 100%;
			position: relative;
			z-index: 0;
		}

		.play-btn {
			width: 100rpx;
			height: 100rpx;
			display: flex;
			flex-direction: row-reverse;
			position: absolute;
			top: 46%;
			right: 50%;
			margin-top: -50rpx;
			margin-right: -50rpx;
			z-index: 999;
		}


		.top-cart {
			width: 60rpx;
			height: 60rpx;
			display: flex;
			flex-direction: row-reverse;
			position: absolute;
			top: 40rpx;
			right: 30rpx;
			z-index: 999;
		}

		.bot-box {
			width: 100%;
			height: 160rpx;
			padding: 0 20px;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			position: absolute;
			bottom: 0;
			left: 0;
			z-index: 999;

			.bot-box-top {
				display: flex;
				flex-direction: row;

				p {
					font-size: 26rpx;
					background-color: #FFA52F;
					color: #FFFFFF;
					font-weight: 600;
					padding: 10rpx;
					margin-right: 10rpx;
					border-radius: 6rpx;
				}
			}

			.goods-title {
				font-size: 28rpx;
				color: #fff;
			}

			.bot-box-bot {
				width: 100%;
				height: 60rpx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;


				.address {
					max-width: 400rpx;
					display: flex;
					flex-direction: row;
					height: 60rpx;

					image {
						width: 25rpx;
						height: 25rpx;
						margin: auto 0;
						margin-right: 10rpx;
					}

					p {
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						font-size: 24rpx;
						color: #fff;
						margin: auto 0;
					}
				}

				.right {
					display: flex;
					flex-direction: row;
					justify-content: space-between;

					.like {
						display: flex;
						flex-direction: row;
						align-items: center;
						margin-right: 40rpx;

						image {
							width: 20rpx;
							height: 20rpx;
							margin-right: 8rpx;
						}

						p {
							font-size: 24rpx;
							color: #fff;
						}
					}

					.kefu {
						display: flex;
						flex-direction: row;
						align-items: center;

						image {
							width: 20rpx;
							height: 20rpx;
							margin-right: 8rpx;
						}

						p {
							font-size: 24rpx;
							color: #fff;
						}
					}
				}
			}
		}

		.box-top-height {
			height: 200rpx;
		}

		.wrap {
			width: 100%;
			height: 420rpx;
			border-radius: 20rpx 20rpx 0 0;
			position: relative;
			background-color: #fff;
			display: flex;
			flex-direction: column;
			padding: 30rpx 20rpx;
			padding-bottom: 80rpx;
			box-sizing: border-box;
			justify-content: space-between;

			.price {
				display: flex;
				flex-direction: row;

				.newPrice {
					color: red;
				}

				.newPrice:before {
					content: "￥";
					font-size: 20rpx;
				}

				.oldPrice {
					font-size: 24rpx;
					color: #ccc;
					text-decoration: line-through;
					margin: 10rpx 0 0 20rpx;
				}

				.oldPrice:before {
					content: "￥";
					font-size: 16rpx;
				}
			}


			.goods-title {
				font-size: 28rpx;

			}

			.pay-num {
				display: flex;
				flex-direction: row;
				justify-content: space-between;

				p {
					font-size: 28rpx;
				}

				.btn {
					display: flex;
					flex-direction: row;

					image {
						width: 32rpx;
						height: 32rpx;
					}

					p {
						font-size: 26rpx;
						margin: 0 30rpx;
					}
				}

			}

			.wrap-bot-box {
				display: flex;
				flex-direction: row;
				justify-content: space-between;

				.bot-box-left {
					display: flex;
					flex-direction: row;
					align-items: center;

					image {
						width: 22rpx;
						height: 22rpx;

					}

					p {
						font-size: 22rpx;
						margin-left: 10rpx;
					}
				}

				.bot-box-right {
					display: flex;
					flex-direction: row;

					.box-right-left {
						width: 280rpx;
						height: 60rpx;
						border: 1px #000 solid;
						color: #000;
						line-height: 60rpx;
						text-align: center;
						box-sizing: border-box;
						font-size: 26rpx;
					}

					.box-right-right {
						width: 280rpx;
						height: 60rpx;
						background-color: #000;
						color: #fff;
						line-height: 60rpx;
						text-align: center;
						font-size: 26rpx;
					}
				}
			}

			.close {
				position: absolute;
				top: 20rpx;
				right: 20rpx;
				width: 26rpx;
				height: 26rpx;
			}
		}

		.popup-mid {
			width: 300rpx;
			height: 300rpx;
			background-color: red;
		}

		.open-app {
			width: 180rpx;
			height: 60rpx;
			position: fixed;
			bottom: 40rpx;
			left: 50%;
			margin-left: -100rpx;
			z-index: 999;

			.open-app-btn {
				width: 100%;
				height: 100%;
				line-height: 60rpx;
				background-color: #23A9F2;
				border-radius: 20rpx;
				font-size: 24rpx;
				font-weight: 600;
				color: #fff;
			}
		}
	}
</style>
