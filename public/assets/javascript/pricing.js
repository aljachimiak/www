function pricingPage (selected) {
	this.components = [
		{
			type: 'provider',
			id: 'ooyala',
			price: 0,
			name: 'Ooyala'
		},
		{
			type: 'provider',
			id: 'vimeo',
			price: 0,
			name: 'Vimeo',
		}
	]
}

function tabChange (me, event) {
	event.preventDefault();
	var id = me.href.split('#')[1];
	console.log(id);
	$.when( $('.pricing-config [id^=configure-]').hide() ).done( function () {
		$('#' + id).show();
	});

	$.when( $('.pricing-components [id^=configure-]').removeClass('active') ).done( function () {
		$('#' + id + '-image').addClass('active');
	});

	$.when( $('.tab-button').removeClass('active') ).done(function () {
		$(me).addClass('active');
	});
}

const pricing = new pricingPage({});

$(document).ready(function () {
	$('.tab-button').on('click', function () {
		tabChange(this, event);
	});
});
