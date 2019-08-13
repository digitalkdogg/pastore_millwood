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
        	'menu' : JSON.parse(php_vars.menu),
        	'custom_super_options' : php_vars.custom_super_options,
        	'responsive' : {'ismobile': false},
        	'needindexphp': false
		},
		'templates' : {
			'events': php_vars.template_events,
			'events_single' : php_vars.template_events_single,
			'news_single' : php_vars.template_news_single,
			'fb_single' : php_vars.template_fb_single,
		},
		'utils': {
			'checkismobile': function () {
				var superdesktop = 1300;
				var breakpoint = millwood.wp_data.custom_super_options.menu_mobile
				var windowsize = window.innerWidth

				if (windowsize >= superdesktop) {
					$('body').addClass('desktop superdesktop');
					millwood.wp_data.responsive['ismobile'] = false;
					millwood.wp_data.responsive['isdesktop'] = true;
					millwood.wp_data.responsive['issuperdesktop'] = true;
				} else if(windowsize >= breakpoint) {
					$('body').addClass('desktop');
					$('body').removeClass('superdesktop');
					millwood.wp_data.responsive['breakpoint'] = breakpoint;
					millwood.wp_data.responsive['isdesktop'] = true;
					millwood.wp_data.responsive['ismobile'] = false;
					millwood.wp_data.responsive['issuperdesktop'] = false;
				} else {
					$('body').removeClass('desktop');
					millwood.wp_data.responsive['breakpoint'] = breakpoint
					millwood.wp_data.responsive['ismobile'] = true;
					millwood.wp_data.responsive['isdesktop'] = false;
					millwood.wp_data.responsive['issuperdesktop'] = false;
				}
				return null;
			},
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
			'switch_to_rev_arrows': function (selector) {
				$('<div />', {
					'id': 'slick-prev',
					'class': 'tp-leftarrow tparrows custom',
					'style': 'top: 60%; transform: matrix(1, 0, 0, 1, 30, -21); left: 10px;'
				}).insertBefore('#'+selector+' button.slick-prev.slick-arrow');
				$('#'+selector+ ' div#slick-prev').click(function (e) {
					e.preventDefault();
					var findprev = $(this).next('button.slick-prev');
					$(findprev).click();
				})

				$('<div />', {
					'id': 'slick-next',
					'class': 'tp-rightarrow tparrows custom',
					'style': 'top: 60%; transform: matrix(1, 0, 0, 1, 30, -21);'
				}).insertBefore('#'+selector+' button.slick-next.slick-arrow');
				$('#'+selector+' div#slick-next').click(function (e) {
					e.preventDefault();
					var findnext = $(this).next('button.slick-next');
					$(findnext).click();
				})
				$('#'+selector+' button.slick-next').addClass('hidden');
				$('#'+selector+' button.slick-prev').addClass('hidden');
			},
			'init_arrows' :function (ele, children, fullwidth) {


				var selector = ele[0];

				selector = $(selector).attr('id');

				console.log(children)

				if (children=='news') {
					if (millwood.wp_data.custom_super_options.homepage_news_rev_arrows=='yes') {
						millwood.utils.switch_to_rev_arrows(selector);
					}
				}

				if (children=='event') {
					if (millwood.wp_data.custom_super_options.homepage_events_rev_arrows=='yes') {
						millwood.utils.switch_to_rev_arrows(selector);
					}
				}

				if (children=='fb') {
					if (millwood.wp_data.custom_super_options.homepage_fb_rev_arrows=='yes') {
						millwood.utils.switch_to_rev_arrows(selector);
					}
				}

				$('#'+selector+ ' .'+children).each(function () {
					
					if ($(this).attr('data-num')=='3') {

						var screenwidth = 0;
						if (fullwidth == true) {
							screenwidth = $(window).width() - 80;
							$('#'+selector + ' button.slick-prev').css({
								'left': 30 + 'px' 
							})
							$('#'+selector + ' button.slick-next').css({
								'left': (screenwidth) + 'px' 
							})

							$('#'+selector + ' div#slick-next').css({
								'left': (screenwidth- 20) + 'px'
							})

						} else {

							var width = $(this).width();
							width = (width-12) * 3
							screenwidth = width;

							$('#'+ selector + ' button.slick-prev').css({
								'left': '20px'
							})

							$('#'+selector + ' button.slick-next').css({
								'left': (screenwidth) + 'px' 
							})

							$('#'+selector + ' div#slick-next').css({
								'left': (screenwidth-75) + 'px'
							})
							return false;
						}

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
					settings.infinite = true
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
						breakpoint: 1024,
						    settings: {
						    	arrows: false,
						        slidesToShow: 2,
						        slidesToScroll: 1
						      }
						  	}
					
					responsive.push(breakpoint);

					breakpoint = {
						breakpoint: 600,
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
					
						var thisdata = data[index];	
						$('<div />', {
							'text': thisdata.post_title,
							'class': 'event-title'
						}).appendTo($(this))
//
						$('<div />', {
							'html': thisdata.post_content,
							'class': 'event-content'
						}).appendTo($(this))
//
						$('<div />', {
							'html': '<a href = "' + thisdata.guid + '" target= "_blank"><button class = "event-btn">Read More</button></a>',
							'class': 'event-footer'
						}).appendTo($(this))
					})

					
					if (millwood.wp_data.custom_super_options.homepage_event_arrow_position =='fullwidth') {
						var settings = {'fullwidth' : true}
					} else { var settings = {}}

					$('#footer-event-wraper .event').each(function (index, val) {

						$(this).attr('data-num', index+1)
					})

					millwood.utils.slickthis($('#footer-event-wraper'), settings, 'event');

					$('<div />', {
						'class' : 'cat-title',
						'text' : 'Latest Activities At Millwood'
					}).prependTo('#footer-event-wraper');



				} //end data length check
			},//end output event widget
			'output_news_widget':   function(data) {
				if (data.length > 0 ) {

					$('<div />', {
						'id': 'footer-news-wraper'
					}).insertAfter('.page_content_wrap .content_wrap')

					$.each(data, function (index, val) {
						var $this = this;
						$('#footer-news-wraper').append(millwood.templates.news_single);

						$('#footer-news-wraper .news').each(function () {

							if ($this != undefined) {
								if ($(this).children().length == 0 ) {
									$('<div />' , {
										'class' : 'news-title',
										'text' : $this.post_title
									}).appendTo($(this))

									$('<div />' , {
										'class' : 'news-content',
										'html' : $this.post_content
									}).appendTo($(this))

									$('<div />' , {
										'class' : 'news-footer',
										'html' : '<a href = "' + $this.guid + '" target= "_blank"><button class = "news-btn">Read More</button></a>'
									}).appendTo($(this))

								}
							}
						});
					})//end each

					if (millwood.wp_data.custom_super_options.homepage_news_arrow_position =='fullwidth') {
						var settings = {'fullwidth' : true}
					} else { var settings = {}}

					$('#footer-news-wraper .news').each(function (index, val) {

						$(this).attr('data-num', index+1)
					})

					millwood.utils.slickthis($('#footer-news-wraper'), settings, 'news');


					$('<div />', {
						'class' : 'cat-title',
						'text' : 'What\'s happening at Millwood'
					}).prependTo('#footer-news-wraper');

				}

			}, //end output news widget
			output_fb_widget: function (data) {
				if (data.data.length > 0 ) {

					$('<div />', {
						'id': 'footer-fb-wraper'
					}).insertAfter('.page_content_wrap .content_wrap')

					$.each(data.data, function (index, val) {
						var $this = this;
						$('#footer-fb-wraper').append(millwood.templates.fb_single);

						$('#footer-fb-wraper .fb').each(function () {

							if ($this != undefined) {

								if ($(this).children().length == 0 ) {
									$(this).attr('id', $this.id);

									$('<div />' , {
										'class' : 'fb-content large-8 medium-8 small-8 columns',
										'html' : $this.message.substring(0, 300)
									}).appendTo($(this))

									if ($this.picture.length > 0 ) {
										$('<div />', {
											'class': 'img-wraper'
										}).appendTo($(this));

										$('<img />', {
											'src': $this.picture,
											'class' : 'fb-img large-4 medium-4 small-2 columns'
										}).appendTo('#'+$this.id+' .img-wraper');
									} 

									$('<div />', {
										'class' : 'row fb-footer'
									}).appendTo($(this))

									$('<div />' , {
										'class': 'large-12 medium-12 small-12 columns fb-footer-row',
									}).appendTo('#'+$this.id + ' .fb-footer');

									$('<span />', {
										'html': 'Posted At : ' + $this.created_time,
										'class': 'large-8 medium-8 small-8 columns'
									}).appendTo('#'+$this.id + ' .fb-footer-row');

									if ($this.story != undefined) {
										$('<span />', {
											'html': 'Headline : ' + $this.story,
											'class': 'large-6 medium-6 small-6 columns'
										}).appendTo('#'+$this.id + ' .fb-footer-row');
									}
									$('<a />', {
										'href' : '#',
										'class': 'large-4 medium-4 small-4 columns',
										'html' : '<button class = "fb-btn">Read More</button>'
									}).appendTo('#'+$this.id + ' .fb-footer-row')

								}
							}
						});
					})//end each

					if (millwood.wp_data.custom_super_options.homepage_fb_arrow_position =='fullwidth') {
						var settings = {'fullwidth' : true}
					} else { var settings = {}}

					$('#footer-fb-wraper .fb').each(function (index, val) {

						$(this).attr('data-num', index+1)
					})

					millwood.utils.slickthis($('#footer-fb-wraper'), settings, 'fb');


					$('<div />', {
						'class' : 'cat-title',
						'text' : 'Millwood Social'
					}).prependTo('#footer-fb-wraper');
				}
			}

		}

	}; //end millwood


	millwood.utils.checkismobile();

	$(window).resize(function () {
		millwood.utils.checkismobile();
	})





	if ($('.logo_slogan').length > 0 ) {
		$( '.logo_slogan' ).clone().appendTo( '.top_panel_title_inner .content_wrap' );
		$('.top_panel_title_inner .logo_slogan').addClass('mobile-tablet-hidden');
	}

	if ($('.page_content_wrap .content_wrap').length > 0) {
		var href = location.href;
		if (location.href.slice('-1') == '/') {
			href = href.substr(0, href.length-1);
		}

		$.each(millwood.wp_data.menu, function () {
			if (this.url.indexOf('index.php') >= 0) {
				millwood.wp_data.needindexphp = true;
			}
			return;
		});

		if (millwood.wp_data.homeurl == href) {
			millwood.wp_data['is_homepage'] = true;
			$('body').addClass('homepage')

			if (millwood.wp_data.needindexphp == true) {
				millwood.wp_data.homeurl = millwood.wp_data.homeurl + '/index.php';
			}

			if (millwood.wp_data.custom_super_options.homepage_show_events == 'yes') {

				$.ajax({
					'url': millwood.wp_data.rest_url + 'calendar/v1/latest-events',
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

			if (millwood.wp_data.custom_super_options.homepage_show_news == 'yes') {
				setTimeout(function () {
					$.ajax({
						'url': millwood.wp_data.rest_url + 'news/v1/latest-news',
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

			if (millwood.wp_data.custom_super_options.homepage_show_fb == 'yes') {

				var appid = millwood.wp_data.custom_super_options.homepage_fb_app_id;
				var apptoken = millwood.wp_data.custom_super_options.homepage_fb_access_token
				var settings = {
  					'async': true,
  					'crossDomain': true,
  					'url' :  'https://graph.facebook.com/v2.4/'+ appid + '/feed?fields=id,from,name,message,created_time,story,description,link,picture,object_id&limit=5&access_token='+apptoken,
  					'method': 'GET',
  					'headers': {
   						'cache-control': 'no-cache',
  					},
  					'success': function (data) {
  						setTimeout(function () {
  							millwood.success.output_fb_widget(data);
  						}, 500);
  					}
				}

				$.ajax(settings).complete(function (response) {
  					console.log(response);
				});
			} //end show fb true

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

	if ($('.direct-stripe').length>0) {
		var directstripe = $('.direct-stripe')
		var directbtn = $('button#ds-donate-btn')		
		$('<span />', {
			'text':'Amount : $ ',
			'class': 'lable'
		}).prependTo($(directstripe))

		$('<div />', {
			'id' : 'heart-wrapper',
			'class' : 'inline-block'
		}).prependTo($(directbtn))

		$('<i />', {
			'id': 'spinner',
			'class': 'icon-heart-light'
		}).prependTo($('#heart-wrapper'));

		$('input.donationvalue').val('0');

		$(directbtn).click(function () {
			var donateval = $('input.donationvalue').val();
			if (donateval.length > 0  && donateval > 0) {
				$('i.icon-heart-light').animate({
					'font-size': '1.6em',
				}, 500, function () {
					$(this).animate({
						'font-size': '.5em'
					}, 500, function () {
						$(this).animate({
							'font-size': '1.6em'
						}, 500, function () {
							$(this).animate({'font-size': '1em'})
						})
					})
				})
			}
		});
	}

	if (millwood.wp_data.responsive.ismobile == false) {
		if ($('body.desktop #menu_main > .menu-item').length < $('body.desktop #menu_main .menu-item').length) {
			$('body.desktop #menu_main > .menu-item').each(function() {
				var kids = $(this).children('ul');
				if (kids.length >0) {
					$(this).children('a').append('<span class="open_child_menu" />')
					var id = $(this).attr('id');
					var menu = id;
					id = id.replace(/menu-item-/g, '')

					$.each(millwood.wp_data.menu, function () {
						if (id == this.ID) {
							this.arrow = $('#' + menu + ' span.open_child_menu');
						}
					})
					
				}

				$(this).on('mouseenter' , function () {
					$('#'+menu+ ' span.open_child_menu').addClass('hover');
				})

				$(this).on('mouseleave' , function () {
					$('#'+menu+ ' span.open_child_menu').removeClass('hover');
				})

			})
		}

		if (millwood.wp_data.responsive.ismobile == false && millwood.wp_data.responsive.issuperdesktop == false) {
			var logotext = $('.top_panel_middle .logo_text')
			$('<div />', {
				html: logotext
			}).prependTo('.top_panel_middle .logo')
		}
	}
	
}(jQuery));

