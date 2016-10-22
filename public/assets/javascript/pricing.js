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
		console.log(arr);
		return arr;
	}

	this.updatedateSelected = function(elem) {
		var type = $(elem).data('type');
		switch (type){
			case 'provider':
				this.providerChange(elem);
				break;
			case 'odd':
				this.oddChange(elem);
				break;
			case 'app':
				this.appChange(elem);
				break;
			case 'integration':
				this.appChange(elem);
				break;
		}
	}

	this.initializeFromInterface  = function () {
		var elem = $('#odd-views-select')[0];
		this.oddChange(elem);
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
