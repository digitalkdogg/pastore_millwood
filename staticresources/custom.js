$(document).ready(function () {
	if ($('.logo_slogan').length > 0 ) {
		$( '.logo_slogan' ).clone().appendTo( '.page_title' );
		$('.page_title .logo_slogan').addClass('mobile-tablet-hidden');
	}
})
