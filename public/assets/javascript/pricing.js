function pricingPage (preSet) {
	this.components = [
		{
			type: 'provider',
			id: 'ooyala',
			price: 0,
			name: 'Ooyala',
			selected: false
		},
		{
			type: 'provider',
			id: 'vimeo',
			price: 0,
			name: 'Vimeo',
			selected: false
		},
		{
			type: 'provider',
			id: 'brightcove',
			price: 0,
			name: 'Brightcove',
			selected: false
		},
		{
			type: 'provider',
			id: 'livestream',
			price: 0,
			name: 'Livestream',
			selected: false
		},
		{
			type: 'provider',
			id: 'custom',
			price: -1,
			name: 'Not Listed',
			selected: false
		},
		{
			type: 'odd',
			id: '10k',
			price: 0,
			name: '0 - 10,000 views per month',
			selected: false
		},
		{
			type: 'odd',
			id: '100k',
			price: 99,
			name: '10k - 100k views per month',
			selected: false
		},
		{
			type: 'odd',
			id: '250k',
			price: 199,
			name: '100k - 250k views per month',
			selected: false
		},
		{
			type: 'odd',
			id: 'enterprise',
			price: -1,
			name: 'over 250k views per month',
			selected: false
		},
		{
			type: 'app',
			id: 'apple-ios',
			price: 10000,
			name: 'Apple iOS',
			selected: false
		},
		{
			type: 'app',
			id: 'apple-tv',
			price: 10000,
			name: 'Apple TV',
			selected: false
		},
		{
			type: 'app',
			id: 'android-tv',
			price: 10000,
			name: 'Android TV',
			selected: false
		},
		{
			type: 'app',
			id: 'android',
			price: 10000,
			name: 'Android',
			selected: false
		},
		{
			type: 'integration',
			id: 'adobepass',
			price: 15000,
			name: 'Adobe Pass',
			selected: false
		},
		{
			type: 'integration',
			id: 'cleeng',
			price: 15000,
			name: 'Cleeng',
			selected: false
		},
		{
			type: 'integration',
			id: 'piano',
			price: 15000,
			name: 'Piano',
			selected: false
		},
		{
			type: 'integration',
			id: 'tinypass',
			price: 15000,
			name: 'TinyPass',
			selected: false
		},
		{
			type: 'integration',
			id: 'int-livestream',
			price: 15000,
			name: 'LiveStream.com',
			selected: false
		},
		{
			type: 'integration',
			id: 'jwplayer',
			price: 5000,
			name: 'JW Player',
			selected: false
		}
	];

	this.selected = function () {
		var arr = this.components.filter(function(item) {
			return item.selected;
		});
		return arr;
	}

	this.providerChange = function (elem) {
		var val = elem.value;
		var checked = elem.checked;

		if (elem.id === 'livestream') {
			val = 'livestream';
		}

		this.components.map(function(item) {
			if (item.type === 'provider') {
				if (val === 'livestream') {
					if (item.id === 'livestream') {
						item.selected = checked;
					}
				} else {
					item.selected = item.id === val;
				}
			}
		});
		var arr = this.selected();
		return arr;
	};

	this.oddChange = function (elem) {
		var oddValue = $(elem).val();
		this.components.map(function(item) {
			if (item.type === 'odd') {
				item.selected = item.id === oddValue;
			}
		});
		var arr = this.selected();
		return arr;
	};

	this.appChange = function (elem) {
		var val = elem.id;
		var checked = elem.checked;

		this.components.map(function(item) {
			if (item.type === 'app' || item.type === 'integration') {
				if (item.id === val) {
					item.selected = checked;
				}
			}
		});
		var arr = this.selected();
		return arr;
	}

	this.updatedateSelected = function(elem) {
		var type = $(elem).data('type');
		var selected = [];
		switch (type){
			case 'provider':
				selected = this.providerChange(elem);
				break;
			case 'odd':
				selected = this.oddChange(elem);
				break;
			case 'app':
				selected = this.appChange(elem);
				break;
			case 'integration':
				selected = this.appChange(elem);
				break;
		}
		this.buildTable(selected);
	}

	this.buildTable = function (selectedArr) {
		$('#config-table .inserted').remove();
		var totalPrice = 0;
		var oddPrice = 0;
		var numProviders = 0;

		// reverse through the array to make apps ans integrations appear in order
		for (var i = selectedArr.length - 1; i >= 0; i--) {
			var item = selectedArr[i];
			var html = rowHtml(item);
			
			if (item.type === 'provider') {
				numProviders++;
			}
			$('#provider-none').toggle(numProviders === 0);
			
			if (item.type === 'odd') {
				oddPrice = item.price;
			} else {

				if (item.price >= 0) {
					totalPrice += item.price;
				}
			}

			var type = item.type === 'integration' ? 'app' : item.type;
			$(html).insertAfter('#' + type + '-after');
		};

		if (oddPrice < 0) {
			oddPrice = 'Contact Odd';
		} else {
			oddPrice = formatPrice(oddPrice);
		}

		$('#odd-cost').html(oddPrice);
		$('#total-cost').html(formatPrice(totalPrice));

		function formatPrice (amount) {
			if (typeof(amount) === 'string') {
				return amount;
			}
			// number to string with commas
			// from http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript

			var price =  amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

			return '$ ' + price;
		}

		function rowHtml(item) {
			var price = item.price >= 0 ? formatPrice(item.price) : 'Contact Odd';
			var html = '<tr class="inserted"><td class="component-name">';
			html += item.name + '</td><td class="component-price">';
			html += price + '</td></tr>';
			return html;
		}
	}

	this.initializeFromInterface  = function () {
		var elem = $('#odd-views-select')[0];
		this.updatedateSelected(elem);
	}

	if (preSet) {
		// this.initializeFromSelected(selected);
	} else {
		this.initializeFromInterface();
	}
}

// green 

function tabChange (elem, event) {
	event.preventDefault();
	var id = elem.href.split('#')[1];

	$.when( $('.pricing-config [id^=configure-]').hide() ).done( function () {
		$('#' + id).show();
	});

	$.when( $('.pricing-components [id^=configure-]').removeClass('active') ).done( function () {
		$('#' + id + '-image').addClass('active');
	});

	$.when( $('.tab-button').removeClass('active') ).done(function () {
		$(elem).addClass('active');
	});
}

const pricing = new pricingPage();

$(document).ready(function () {
	$('.tab-button').on('click', function () {
		tabChange(this, event);
	});
	$('[id^=configure] input, [id^=configure] select').on('change', function() {
		pricing.updatedateSelected(this);
	})
});
