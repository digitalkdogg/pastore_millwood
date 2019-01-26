var millwood;

(function($) {
	"use strict";

	millwood = {
		'wp_data': {
			'stylesheet_dir':php_vars.stylesheet_dir,
        	'template': php_vars.template,
        	'homeurl' : php_vars.home_url,
        	'site_url' : php_vars.site_url,
        	'is_admin' : php_vars.is_admin,
        	'rest_url' : php_vars.rest_url,
        	'ajax_url' : PASTORE_CHURCH_STORAGE.ajax_url
		},
		'templates' : {
			'events': php_vars.template_events,
			'events_single' : php_vars.template_events_single
		},
		'utils': {
			'getmysqlnow' :function () {
				var date;
				date = new Date();
				date = date.getUTCFullYear() + '-' +
    			('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
    			('00' + date.getUTCDate()).slice(-2) + ' ' + 
    			('00' + date.getUTCHours()).slice(-2) + ':' + 
    			('00' + date.getUTCMinutes()).slice(-2) + ':' + 
    			('00' + date.getUTCSeconds()).slice(-2);
				return date;
			},
			'init_arrows' :function (ele) {
				var screenwidth = $(ele).width();
				$('button.slick-next').css({
					'left': (screenwidth- 30) + 'px' 
				})

				$('button.slick-arrow').each(function () {
					if ($(this).hasClass('slick-prev') == true) {
						$(this).text('<')
					}
					if ($(this).hasClass('slick-next') == true) {
						$(this).text('>')
					}
				});
			},
			'slickthis': function (ele, settings) {
				if (settings==undefined) {
					settings = {};
				}

				if (settings.dots == undefined) {
					settings.dots = false
				}
				if (settings.speed == undefined) {
					settings.speed = 300
				}
				if (settings.infinite == undefined) {
					settings.infinite = false
				}
				if (settings.slidesToShow == undefined) {
					settings.slidesToShow =3
				}
				if (settings.slidesToScroll == undefined) {
					settings.slidesToScroll = 1
				}
				if (settings.arrows == undefined) {
					settings.arrows = true;
				}

				if (settings.responsive == undefined) {
					var responsive = new Array();
					var breakpoint = {
						breakpoint: 600,
						    settings: {
						    	arrows: false,
						        slidesToShow: 2,
						        slidesToScroll: 2
						      }
						  	}
					
					responsive.push(breakpoint);

					breakpoint = {
						breakpoint: 480,
						settings: {
							arrows: false,
						    slidesToShow: 1,
						    slidesToScroll: 1
						    }
						}

					responsive.push(breakpoint)
				
					settings.responsive = responsive
				}

				$(ele).not('slick-intialized').slick(settings);
				
				if (settings.arrows == true) {
					millwood.utils.init_arrows(ele);

					$(window).resize(function () {
						millwood.utils.init_arrows(ele);
					})
				}
			}
		},
		'success': {
			'output_event_widget' : function (data) {	
				if (data.length > 0 ) {
					var html = '';
					$.each(data, function () {
						html = html+ millwood.templates.events_single;
					}); //end data each

					$('<div />', {
						'html': html,
						'id' : 'footer-event-wraper'
					}).prependTo('.footer_area');
					
					$( ".event" ).wrapAll( "<div class='grid-x' id = 'slickthis' />");

					$('<div />', {
						'id': 'footer-event-title',
						'html': 'Upcoming Events'
					}).prependTo('.footer_area');

					$('#footer-event-wraper .event').each(function (index, val) {
						$(this).attr('data-index', index) 

						$('<div />', {
							'class': 'event-name',
							'text': data[index].post_title
						}).appendTo($(this))

						$('<span />', {
							'class': 'event-content',
							'html': data[index].post_content
						}).appendTo($(this));

					})

					try {
						millwood.utils.slickthis($('#slickthis'));
					} catch(e) {
						console.log(e);
					}

				}
			
			}
		}

	}; //end millwood

	if ($('.logo_slogan').length > 0 ) {
		$( '.logo_slogan' ).clone().appendTo( '.top_panel_title_inner .content_wrap' );
		$('.top_panel_title_inner .logo_slogan').addClass('mobile-tablet-hidden');
	}

	if ($('.footer_area').length > 0 ) {

		if (millwood.wp_data.rest_url.indexOf('index.php')<0) {
			millwood.wp_data.rest_url = millwood.wp_data.site_url + '/index.php/wp-json'
		}

		$.ajax({
			'url': millwood.wp_data.rest_url + '/calendar/v1/latest-events',
			'type': 'GET',
			'data': {'post_type': 'tribe_events',
					'start_date': millwood.utils.getmysqlnow()
					},
			'success': function (data) {
				if (data != null) {
					millwood.success.output_event_widget(data);
				}// end if data length is more than 0

			}
		})
	}

}(jQuery));


