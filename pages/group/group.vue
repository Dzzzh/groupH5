<template>
	<view class="content">
		<vTabs class="tabs" v-model="current" color="#fff" :scroll="true" :tabs="tabbarMsgs" @change="changeTab" lineColor="#fff"
		 activeColor="#fff"></vTabs>
		<image class="position" src="../../static/img/groupBackground.png"></image>
		<block v-for="(item, index) in groupData" :key="item.id">
			<view class="wrap" v-if="index == current">
				<view class="goods">
					<view class="goods-title">
						<p>{{item.narration}} </p>
						<p>{{item.state}}</p>
					</view>
					<view class="goods-time">
						<p class="goods-time-text">距离结束</p>
						<view class="goods-time-wrap">
							<u-count-down :timestamp="item.time" bg-color="#fff" color="#159AFF" :show-days="false" font-size="26"></u-count-down>
						</view>
					</view>
					<image class="goods-img" :src="item.picture" />
				</view>
				<view class="message">
					<view class="message-title">
						<h2>{{item.content}} </h2>
						<p>{{item.maxNumber}}件</p>
					</view>
					<view class="message-price">
						<view class="price-num">
							<p class="price">{{item.price}}</p>
						</view>
						<view class="price-text">￥{{item.oldPrice}}</view>
					</view>
					<button class="message-btn" open-type="launchApp" app-parameter="wechat" @error="launchAppError" @launchapp="onApp">参与拼单,立即成团</button>
					<view class="message-bot">
						<image src="../../static/img/messageImg.png"></image>
						<view class="message-bot-box">
							<view class="bot-box-title">
								<p>已有{{participant}}人支持团购,</p>
								<u-count-down :timestamp="item.time" :show-days="false" bg-color="#EBF6FA" style="display: flex;" font-size="26"></u-count-down>
								<p>后结束</p>
							</view>
							<view class="bot-box-wrap">
								<block v-for="(item, index) in userPic" :key="index">
									<image class="box-wrap-item" :src="item.headPortrait" />
								</block>
							</view>
						</view>
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	import vTabs from '@/components/v-tabs/v-tabs.vue'

	export default {
		data() {
			return {
				goodsNum: 0, //团购商品下标
				groupData: [{
					id: "1600400033906174828",
					picture: "https://huolu-cdn.oss-cn-beijing.aliyuncs.com/pc/1277804230770417666/goods/20200918113351_wkjr.png",
					content: "风扇",
					narration: "风扇描述",
					price: 2,
					minNumber: 1,
					maxNumber: 20,
					state: "拼团中",
					currentNumber: 0,
					number: 0,
					oldPrice: 1,
					markGroupId: "markGroup-1593488585782134812",
					time: 649616574
				}],
				current: 0,
				isNum: 2,
				tabbarMsgs: [],
				participant: [], //参团人数
				userPic: [], //参团用户头像
				markGroup: "markGroup-1593488585782134812",
				groupId: "1600399022420167498"

			};
		},
		components: {
			vTabs,
		},
		onLoad(options) {
			if (options.markGroup) {
				this.markGroup = options.markGroupId
			}
		},
		onShow() {
			// 初始化团购数据
			this.init()
			this.getUser()
		},
		methods: {
			//获取用户头像
			getUser() {
				this.$common.requests(`/order/${this.$common.status}/group-buy-order/v1/groupList`, {
						groupId: this.groupId
					})
					.then(res => {
						if (res.statusCode == 200) {
							this.participant = res.data.total
							this.userPic = res.data.data
						}
					})
			},

			//初始化团购数据
			init() {
				let obj = this.$qs.stringify({
					page: 1,
					size: 20,
					markGroupId: this.markGroup
				});
				this.$common.requests(`/operate/${this.$common.status}/groupBuyCommunity/v1/shareList`, obj)
					.then(res => {
						if (res.statusCode == 200) {
							this.groupData = res.data.data.list
							this.tabbarMsgs = res.data.data.tapBar
						}
					})
			},

			//点击tabbar 重新渲染对应的index 的数据
			changeTab(index) {
				uni.showLoading({
					title: "加载中",
				})
				this.init()
				this.goodsNum = index;

				this.groupId = this.groupData[this.goodsNum].id;
				if (this.groupData[this.goodsNum]) {
					setTimeout(() => {
						uni.hideLoading()
					}, 200)

				}

			},

			onApp() {
				console.log("APP打开成功");
			},

			//监听打开 APP 的错误事件
			launchAppError(e) {
				uni.showLoading({
					title: '正在跳转...'
				});

				setTimeout(function() {
					uni.hideLoading();
					//没有APP显示
					uni.showModal({
						content: '哇哦! 还没拥有火鹿? 赶紧去下载火鹿App,享受更多优惠!是否需要帮您跳转到下载页?',
						confirmText: "太好了",
						success: function(res) {
							if (res.confirm) {
								//用户点击确定跳转
								uni.navigateTo({
									url: "../downLoad/downLoad"
								})
							} else if (res.cancel) {}
						}
					});
				}, 1000);
			},
		},

		//小程序分享当前页
		onShareAppMessage() {
			return {
				title: "百人团购,快来抢购。"
			}
		}
	}
</script>

<style lang="scss">
	.content {
		width: 100vw;
		height: 100vh;
		position: relative;

		.tabs {
			position: absolute;
			top: 4rpx;
			left: 0;
			z-index: 10;
		}

		.position {
			width: 100%;
			height: 100%;
			position: relative;
			display: block;
		}

		.wrap {
			width: 100%;
			height: 94vh;
			display: flex;
			flex-direction: column;
			align-items: center;
			position: absolute;
			top: 70rpx;
			left: 0;

			.goods {
				width: 100%;
				height: 42vh;
				padding: 0 20rpx;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-around;


				.goods-title {
					display: flex;
					flex-direction: row;
					justify-content: center;

					p {
						max-width: 600rpx;
						font-weight: 600;
						font-size: 46rpx;
						color: #007EDD;
						text-align: center;
					}
				}

				.goods-time {
					width: 400rpx;
					height: 70rpx;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;
					background-color: #159AFF;
					border-radius: 80rpx;
					padding: 10rpx 30rpx;
					box-sizing: border-box;

					.goods-time-text {
						width: 140rpx;
						font-size: 26rpx;
						color: #fff;
					}

					.goods-time-wrap {
						display: flex;
						flex-direction: row;
						font-size: 32rpx;
						line-height: 40rpx;


					}
				}

				.goods-img {
					width: 160rpx;
					height: 180rpx;
				}


			}

			.message {
				width: 90%;
				height: 50vh;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-around;
				background-color: #fff;

				.message-title {
					display: flex;
					flex-flow: row nowrap;

					h2 {
						font-size: 32rpx;
						font-weight: 600;
					}

					p {
						margin-left: 20rpx;
						font-size: 26rpx;
						line-height: 46rpx;
					}
				}

				.message-price {
					display: flex;
					flex-direction: row;

					.price-num {
						color: #CF0000;
						font-weight: 400;
						font-size: 24rpx;
						display: flex;
						flex-direction: row;

						.price {
							color: #CF0000;
							font-weight: 600;
							font-size: 32rpx;
						}

						.price:before {
							content: '￥';
							color: #CF0000;
							font-size: 20rpx;
						}
					}

					.price-text {
						text-decoration: line-through;
						font-size: 24rpx;
						color: #A0A0A0;
						line-height: 60rpx;
						margin-left: 30rpx;
					}
				}

				.message-btn {
					width: 650rpx;
					height: 80rpx;
					color: #fff;
					// background-color: #55CFFD;
					background-image: linear-gradient(#6FE9FF, #159BFC);
					line-height: 80rpx;
					font-size: 28rpx;
				}

				.message-bot {
					width: 640rpx;
					height: 280rpx;
					position: relative;
					display: flex;

					image {
						width: 100%;
						height: 100%;
					}

					.message-bot-box {
						width: 640rpx;
						height: 250rpx;
						margin-top: 30rpx;
						position: absolute;
						top: 0;
						left: 0;
						display: flex;
						flex-direction: column;
						padding: 0 50rpx;
						padding-top: 0;
						box-sizing: border-box;
						justify-content: space-around;
						align-items: center;

						.bot-box-title {
							font-size: 26rpx;
							display: flex;
							flex-direction: row;

							p {
								font-size: 24rpx;
								line-height: 50rpx;

							}
						}

						.bot-box-wrap {
							width: 530rpx;
							height: 160rpx;
							display: flex;
							flex-direction: row;
							flex-wrap: wrap;
							margin-bottom: 20rpx;

							.box-wrap-item {
								width: 80rpx;
								height: 80rpx;
								margin: 4rpx;
								background-color: yellow;
								border-radius: 50%;
							}

						}

					}
				}

			}
		}

	}
</style>
