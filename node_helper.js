/* Magic Mirror
 * Module: stocks
 *
 * By Alex Yakhnin https://github.com/alexyak & Elan Trybuch https://github.com/elaniobro
 * MIT Licensed.
 */
var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({
	start: function () {
		console.log('MMM-stocks: started'); /*eslint-disable-line*/
	},

	getStocks: function (url) {
		var self = this;

		request({ url: url, method: 'GET' }, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var result = JSON.parse(body);

				self.sendSocketNotification('STOCKS_RESULT', result);
			}
		});
	},

	getStocksMulti: function (urls) {
		var self = this;
		var count = urls.length;
		var counter = 0;
		var stockResults = [];

		urls.forEach((url) => {
			request(
				{ url: url, method: 'GET' },
				function (error, response, body) {
					if (error) {
						console.error(error);
						return;
					}
					if (response.statusCode != 200) {
						console.error(response);
						return;
					}
					stockResults.push(JSON.parse(body));
					counter++;

					if (counter === count) {
						self.sendSocketNotification(
							'STOCKS_RESULT',
							stockResults
						);
					}
				}
			);
		});
	},

	//Subclass socketNotificationReceived received.
	socketNotificationReceived: function (notification, payload) {
		if (notification === 'GET_STOCKS') {
			this.getStocks(payload);
		}
		if (notification === 'GET_STOCKS_MULTI') {
			this.getStocksMulti(payload);
		}
	},
});
