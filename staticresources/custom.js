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
        	'ajax_url' : PASTORE_CHURCH_STORAGE.ajax_url,
        	'show_events': true,
        	'show_news': true
		},
		'templates' : {
			'events': php_vars.template_events,
			'events_single' : php_vars.template_events_single,
			'news_single' : php_vars.template_news_single
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
			'init_arrows' :function (ele, children, fullwidth) {
				var selector = ele[0].parentElement;
				selector = $(selector).attr('id');
				$('#'+selector+ ' .'+children).each(function () {
					if ($(this).attr('data-num')=='3') {
						var width = $(this).width();
						var left = $(this).position().left
						var screenwidth = (width + left);
						if (fullwidth == true) {
							screenwidth = screenwidth - 70;
							$('#'+selector + ' button.slick-prev').css({
								'left': 20 + 'px' 
							})
						}

						$('#'+selector + ' button.slick-next').css({
							'left': (screenwidth) + 'px' 
						})

					}
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
			'slickthis': function (ele, settings, children) {
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

				if (settings.fullwidth == undefined) {
					settings.fullwidth = false;
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
					millwood.utils.init_arrows(ele, children, settings.fullwidth);

					$(window).resize(function () {
						millwood.utils.init_arrows(ele, children, settings.fullwidth);
					})
				}

				$('.slick-slide').children('div').each(function () {
					$(this).addClass('slick-event');
				})
			},
			'config_calendar': function () {
				$('td.tribe-events-has-events').each(function (){
					if ($(this).children('.tribe_events').length > 0) {
						$(this).addClass('has-event');
						$('<div />', {
							'class' : 'mobile-event desktop-hidden'
						}).appendTo($(this));

						$(this).children('.tribe_events').addClass('mobile-hidden')
					}
				})
			},
			'is_mobile' : function () {return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);}
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
					}).insertAfter('.page_content_wrap .content_wrap');

					$('#footer-event-wraper .event').each(function (index, val) {
						$(this).attr('data-num', index+1)
					})
					
					$( ".event" ).wrapAll( "<div class='grid-x' id = 'slickthis' />");

					$('<div />', {
						'id': 'footer-event-title',
						'html': 'Upcoming Events'
					}).insertAfter('.page_content_wrap .content_wrap');

					$('div#footer-event-title').wrap('<a href = "'+millwood.wp_data.homeurl + '/index.php/calendar" />');

					$('#footer-event-wraper .event').each(function (index, val) {
						$(this).attr('data-index', index) 

						$('<div />', {
							'class': 'event-name',
							'text': data[index].post_title
						}).appendTo($(this))

						$('<div />', {
							'class': 'event-content',
							'html': data[index].post_content
						}).appendTo($(this));

						$('<span />', {
							'class': 'sc_button sc_button_style_filled read-more',
							'text': 'Read More',
							'data-id' : data[index].post_name
						}).appendTo($(this));

					})

					$(document).on('click', 'span.read-more',function () {
						try {
							var dataid = $(this).attr('data-id');
							location.href = millwood.wp_data.homeurl+ '/index.php/event/'+dataid
						} catch(e) {console.log(e)}
					})


					try {
						millwood.utils.slickthis($('#footer-event-wraper #slickthis'), {}, 'event');
					} catch(e) {
						console.log(e);
					}

				} //end data length check
			},//end output event widget
			'output_news_widget':   function(data) {
				if (data.length > 0 ) {
					var html = '';
					$.each(data, function () {
						html = html+ millwood.templates.news_single;
					}); //end data each

					$('<div />', {
						'html': html,
						'id' : 'footer-news-wraper'
					}).insertAfter('.page_content_wrap .content_wrap');

					$('#footer-news-wraper .news').each(function (index, val) {
						$(this).attr('data-num', index+1)
					})

					$( ".news" ).wrapAll( "<div class='grid-x' id = 'slickthis' />");

					$('<div />', {
						'id': 'footer-news-title',
						'html': 'The Latest News'
					}).insertAfter('.page_content_wrap .content_wrap');

					//$('div#footer-news-title').wrap('<a href = "'+millwood.wp_data.homeurl + '/index.php/calendar" />');

					$('#footer-news-wraper .news').each(function (index, val) {
						$(this).attr('data-index', index) 

						$('<div />', {
							'class': 'news-name',
							'text': data[index].post_title
						}).appendTo($(this))

						$('<div />', {
							'class': 'news-content',
							'html': data[index].post_content
						}).appendTo($(this));

						$('<span />', {
							'class': 'sc_button sc_button_square sc_button_style_filled sc_button_size_small read-more',
							'text': 'Read More',
							'data-id' : data[index].post_name
						}).appendTo($(this));

					})


					var settings = {
						'fullwidth' : true
					}

					try {
						millwood.utils.slickthis($('#footer-news-wraper #slickthis'), settings, 'news');
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

	if ($('.page_content_wrap .content_wrap').length > 0) {
		var href = location.href;
		if (location.href.slice('-1') == '/') {
			href = href.substr(0, href.length-1);
		}

		if (millwood.wp_data.homeurl == href) {
			if (millwood.wp_data.rest_url.indexOf('index.php')<0) {
				millwood.wp_data.rest_url = millwood.wp_data.site_url + '/index.php/wp-json'
			}

			if (millwood.wp_data.show_events == true) {
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
				}) //end ajax calendar
			}//end showevents true

			if (millwood.wp_data.show_news == true) {
				setTimeout(function () {
					$.ajax({
						'url': millwood.wp_data.rest_url + '/news/v1/latest-news',
						'type': 'GET',
						'data': {'category': 'homepagenews'},
						'success': function (data) {
							if (data != null) {
								millwood.success.output_news_widget(data);
							//	millwood.success.output_event_widget(data);
							}// end if data length is more than 0
						}
					}) //end ajax calendar
			},500);
			} //end show news true

		}
	} //end contentwrap length

	if ($('table.tribe-events-calendar').length>0) {
		millwood.utils.config_calendar();

		if(millwood.utils.is_mobile() == true) {
			try {
				if (TribeList == undefined) {
					$('#tribe-bar-views-option-list').click();
				}
			} catch(e) {
				setTimeout(function () {
					$('#tribe-bar-views-option-list').click();
				},1000)
			}
		}
	}

}(jQuery));


