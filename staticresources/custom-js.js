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
        	'needindexphp': false,
					'cookie': {}
		},
		'templates' : {
			'events': php_vars.template_events,
			'events_single' : php_vars.template_events_single,
			'news_single' : php_vars.template_news_single,
			'fb_single' : php_vars.template_fb_single,
			'stripe_form': php_vars.template_stripe_form,
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
			'showmodal': function (modal) {
				$(modal.id).show();
				$(modal.id).css({'visibility': 'visible'})
				$(modal.id).children('h2#modalTitle').text(modal.title);
				$(modal.id).children('p#modalBody').html(modal.html);
				$(modal.id).children('a.close-reveal-modal').click(function () {
					millwood.utils.hidemodal(modal);
				})
			},
			'hidemodal': function (modal) {
				$(modal.id).hide();
				$(modal.id).children('h2#modalTitle').text('');
				$(modal.id).children('p#modalBody').html('')
			},
			'getreadabledate': function (date) {
				 date = new Date(date);
				 let montharray = ['Jan', 'Feb', 'March', 'April', 'May', 'June',
			 									'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
				 return montharray[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear();
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
					'style': 'top: 65%; transform: matrix(1, 0, 0, 1, 30, -21); left: 10px;'
				}).insertBefore('#'+selector+' button.slick-prev.slick-arrow');
				$('#'+selector+ ' div#slick-prev').click(function (e) {
					e.preventDefault();
					var findprev = $(this).next('button.slick-prev');
					$(findprev).click();
				})

				$('<div />', {
					'id': 'slick-next',
					'class': 'tp-rightarrow tparrows custom',
					'style': 'top: 65%; transform: matrix(1, 0, 0, 1, 30, -21);'
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
			'get_location_from_url': function () {
				var pathname = window.location.pathname
				pathname = pathname.split('/');

				for (var i = 0; i<pathname.length; i++) {
					if (pathname[i] != "") {
						pathname[i] = pathname[i];
					} else {
						pathname.splice(i, 1);
					}
				}

				millwood.wp_data['location'] = window.location;


				for (var i=0; i< pathname.length; i++) {
					if ((i+1) == pathname.length) {
						millwood.wp_data.location['endingpath'] = pathname[i];
					}
				}

				var params = {};
				var parser = document.createElement('a');
				parser.href = window.location.href;
				var query = parser.search.substring(1);
				var vars = query.split('&');
				for (var i = 0; i < vars.length; i++) {
					var pair = vars[i].split('=');
					params[pair[0]] = decodeURIComponent(pair[1]);
				}
				millwood.wp_data.location['params'] = params;

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

									if($this.thumbnail == false) {
										$('<div />' , {
											'class' : 'news-content',
											'html' : $this.post_excerpt.substring(0, 235)
										}).appendTo($(this))
									}


									if($this.thumbnail != undefined && $this.thumbnail != false) {
										$('<img />', {
											'class': 'post-thumb',
											'src': $this.thumbnail
										}).appendTo($(this))
									}

									var link = $this.guid;
									if ($this['meta']['facebook_link'] != undefined) {
										link = $this['meta']['facebook_link'];
									}
									$('<div />' , {
										'class' : 'news-footer',
										'html' : '<a href = "' + link + '" target= "_blank"><button class = "news-btn">Read More</button></a>'
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
			'output_fb_widget': function (data) {
				if (data.data.length > 0 ) {

					$('<div />', {
						'id': 'footer-fb-wraper'
					}).insertAfter('.page_content_wrap .content_wrap')



					$.each(data.data, function (index, val) {

						if (this.name != undefined) {
							if (this.name.indexOf('cover photo')>0 ) {
								delete this;
								return;
							}


						}



						var $this = this;

						$('#footer-fb-wraper').append(millwood.templates.fb_single);

						$('#footer-fb-wraper .fb').each(function () {


							//first check for dups
						if ($('#id_'+$this.id+'.fb').length===0) {
							if ($this != undefined) {

								if ($(this).children().length == 0 ) {
									$(this).attr('id', 'id_' + $this.id);

										if($this.message != undefined) {
													$('<div />' , {
														'class' : 'fb-content large-12 medium-12 small-12 columns',
														'html' : $this.message.substring(0, 300)
													}).appendTo($(this))

													if ($this.picture != undefined) {
														$('<div />', {
															'class': 'fb-img-wrap large-12 medium-12 small-12 columns',
														}).appendTo($(this))

														$('<img />', {
															'class': 'fb-img',
															'src': $this.picture
														}).appendTo($('#id_'+$this.id + ' .fb-img-wrap'))
													}

													if ($this.link != undefined) {
														var link = 'https://facebook.com/millwoodchurch/posts/' + $this.id

														$('<div />', {
																'class' : 'row fb-footer'
														}).appendTo($(this))

														$('<div />' , {
															'class': 'large-12 medium-12 small-12 columns fb-footer-row',
														}).appendTo('#id_'+$this.id + ' .fb-footer');

														$('<div />', {
															'class' :'large-7 medium-7 small-7 columns',
															'html': 'Posted At : ' + millwood.utils.getreadabledate($this.created_time),
															'id': 'fb-left-trix'
														}).appendTo('#id_'+$this.id + ' .fb-footer-row');

														$('<div />', {
															'class': 'large-4 medium-4 small-4 columns',
															'id': 'fb-right-trix'
														}).appendTo('#id_'+$this.id + ' .fb-footer-row');
														if ($this.link != undefined) {
															$('<a />', {
																	'href': $this.link,
																	'html' : '<button class = "fb-btn">Read More</button>',
																	'target': '_blank'
															}).appendTo('#id_'+$this.id + ' .fb-footer-row #fb-right-trix')
														}
												}
											}//end message not undefined

											if ($('#id_'+$this.id).children().length == 0) {
												$('#id_'+$this.id).remove();
											}

										}
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
			},
			'output_cc_news': function (data) {
				var ele;

				if ($('.page_content_wrap .content .post_content').length> 0) {
					$('.page_content_wrap .content .post_content').each(function(index, val) {
						$(this).addClass(index)
						if (index == 0) {
							ele = $(this);
						}
					})
				}

				$(ele).empty();

				$('<div />', {
					'class': 'cc-news-wrap'
				}).appendTo(ele)

				var html = '<h2 id="modalTitle"></h2><p id = "modalBody" class="lead"></p><a class="close-reveal-modal" aria-label="Close">&#215;</a>';
				$('<div />', {
					'id': 'myModal',
					'class': 'reveal-modal',
					'data-reveal' : '',
					'aria-labelledby': 'modalTitle',
					'aria-hidden': 'true',
					'role': 'dialog',
					'html': html
				}).appendTo('article.post_item .post_content .cc-news-wrap');

				$.each(data, function () {

					var created_at = new Date(this.created_at);
					var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

					$('<div />', {
						'id': this.cc_id,
						'class': 'row'
					}).appendTo('article.post_item .post_content .cc-news-wrap');

					$('<div />', {
						'class': 'large-2 medium-2 small-12 columns date',
						'html': '<span class = "months">' + months[created_at.getMonth()] + '</span><br /><span class = "dates">' + created_at.getDate() + '</span>'
					}).appendTo('article.post_item .post_content .cc-news-wrap #'+this.cc_id)

					$('<div />', {
						'class': 'large-4 medium-4 small-14 columns title',
						'text': this.title
					}).appendTo('article.post_item .post_content .cc-news-wrap #'+this.cc_id)

					if (this.permalink_url != null) {
						$('<a />', {
							'data-href' : this.permalink_url,
							'data-title' : this.title,
							'href' : '#',
							'data-reveal-id': 'myModal',
							'class': 'large-4 medium-4 small-12 columns cc-link',
							'html' : '<span class = "read-more">Read More</span>',
						}).appendTo('article.post_item .post_content .cc-news-wrap #'+this.cc_id)

						$('#'+this.cc_id + ' a.cc-link').on('click', function () {
							var modal = {'id': '#myModal',
									'title': $(this).attr('data-title'),
									'html': '<iframe class = "cc-news" src = "' + $(this).attr('data-href') + '"></iframe>',
									'action': 'show'}
							millwood.utils.showmodal(modal);
						})
					}

				})
			},
			'setup_stripe_api': function () {

				var stripe_utils = {
						'clear_error': function () {

							$(this.wrapperele).find('.card-errors').each(function () {
								$(this).html('')
							})

								$(this.wrapperele).find('.error').each(function () {
									$(this).removeClass('error');
								})
						},
						'get_payment_intents' : function (amount) {

							$.ajax({
								'url': millwood.wp_data.rest_url + 'stripe/v1/create_intent',
								'type': 'POST',
								'data': {'amount': parseInt(amount+'00'),
												'type': stripe_utils.mode,
												'name': stripe_utils.ownerInfo.owner.name,
												'email':stripe_utils.ownerInfo.owner.email,
												'address': {'line1': stripe_utils.ownerInfo.owner.address.line1,
																		'city': stripe_utils.ownerInfo.owner.address.city,
																		'state': stripe_utils.ownerInfo.owner.address.state,
																		'postal_code': stripe_utils.ownerInfo.owner.address.postal_code
																	}
												},
								'success': function (data) {
										if (data.error) {
											$('.confirm-wrapper .card-errors').html(data.error);
											stripe_utils['valid'] == false;
										} else {

											stripe_utils['payment_intent'] =  data;
											stripe_utils['valid'] = true;
											//$('button#payment').removeClass('disabled');
											stripe_utils.create_stripe_token();
									}
							},
							'error': function (data) {
								$('.confirm-wrapper .card-errors').html('There was an unexpected error');
							}
						})
					}, //end get_payment_intents
					'confirm_card_payment' : function () {
							var client_secret = this.payment_intent.client_secret;
							this.stripe.confirmCardPayment(
								 client_secret, {
									payment_method: {card: this.card},
									shipping: {
														'name': stripe_utils.ownerInfo.owner.name,
														'address': {'line1': stripe_utils.ownerInfo.owner.address.line1,
																				'city': stripe_utils.ownerInfo.owner.address.city,
																				'state': stripe_utils.ownerInfo.owner.address.state,
																				'postal_code': stripe_utils.ownerInfo.owner.address.postal_code
																			}
														},
									//email: 'dsfdsak@gmail.com'
								}
							).then(function(result) {
								$('#confirm-section button#submit .spinner').removeClass('spin');
								if (result.error) {
									$(this.wrapperele).find('#confirm-section .card-errors').html('opps there was an error with your transaction');
							// Display error.message in your UI.
								} else {
									$('#confirm-section').addClass('hide');
									$('#success-wrapper').removeClass('hide');

									stripe_utils.amount = null;
									stripe_utils.valid = 'complete'
									$('#infotab.tab').addClass('disabled');
									$('#paymenttab.tab').addClass('disabled');
									$('#confirmtab.tab').addClass('disabled');
									$('.amount-cell.active').click();
								}
						});
					},
					'create_stripe_source': function () {

						this.stripe.createSource(this.card, this.ownerInfo).then(function(result) {

							if (result.error) {
								// Inform the user if there was an error
								stripe_utils.valid = false;
								var errorElement = document.getElementById('card-errors');
								errorElement.textContent = result.error.message;
							} else {
								// Send the source to your server
								stripe_utils.valid = true;
								// Insert the source ID into the form so it gets submitted to the server
								var form = document.getElementById('payment-form');
								var hiddenInput = document.createElement('input');
								hiddenInput.setAttribute('type', 'hidden');
								hiddenInput.setAttribute('name', 'stripeSource');
								hiddenInput.setAttribute('value', result.source.id);
								form.appendChild(hiddenInput);
								if (result.source.status == 'chargeable') {

									if (stripe_utils.check_goodtogo() == true) {

										stripe_utils.valid = true;
										stripe_utils.chargable = true;
										stripe_utils.confirm_card_payment();
									//	$('#confirm-section button#submit').removeClass('disabled');
									}
								} else {
									stripe_utils.valid = false;
								}


							}
						}); //end stripe create source
					},
					'create_stripe_token': function () {
						stripe_utils.stripe.createToken(stripe_utils.card).then(function(result) {
							stripe_utils['token'] = result;
							if (result.error) {
								stripe_utils['valid'] = false;
								$('.card-errors').each(function () {
									$('#confirm-section button#submit').removeClass('spin')
									$(this).html(result.error.message);
								})
							} else {

								stripe_utils['valid'] = true;
								// Insert the token ID into the form so it gets submitted to the server
								if (result.token != undefined || result.token != '') {
									var form = document.getElementById('payment-form');
									var hiddenInput = document.createElement('input');
									hiddenInput.setAttribute('type', 'hidden');
									hiddenInput.setAttribute('name', 'stripeToken');
									hiddenInput.setAttribute('value', result.token.id);
									form.appendChild(hiddenInput);
									stripe_utils.create_stripe_source();

								}

							}
						});
					},
					'generate_stripe_data': function () {
						stripe_utils['ownerInfo'] = {};
						stripe_utils.ownerInfo['owner'] = {};
						stripe_utils.ownerInfo.owner['address'] = {};
						stripe_utils.ownerInfo.owner['name'] = $(this.wrapperele).find('input#names').val();
						stripe_utils.ownerInfo.owner.address['line1'] = $(this.wrapperele).find('input#addresss').val()
						stripe_utils.ownerInfo.owner.address['city'] = $(this.wrapperele).find('input#citys').val()
						stripe_utils.ownerInfo.owner.address['state'] = $(this.wrapperele).find('input#states').val()
						stripe_utils.ownerInfo.owner.address['postal_code'] = $(this.wrapperele).find('input#zips').val()
						stripe_utils.ownerInfo.owner['email'] = $(this.wrapperele).find('input#emails').val()


					},
					'generate_init_data': function () {
							this.wrapperele =  millwood.wp_data.custom_super_options.api_stripe_payment_id,
							this.stripe_live_key = millwood.wp_data.custom_super_options.api_stripe_payment_live_key,
							this.stripe_test_key = millwood.wp_data.custom_super_options.api_stripe_payment_test_key
							this.amount = 0;
							this.unlockconfirm = false;
					},
					'nav_to_next': function (_this) {
						$(stripe_utils.wrapperele + ' .tab').each(function () {
							$(this).removeClass('active');
						})

						$('.tab-section').each(function () {
							$(this).addClass('hide');
						})

						let nextele = $(_this).attr('data-next');
						let nexttab = $(_this).attr('data-tab');

						$('#'+nextele).removeClass('hide');
						$('#'+nexttab+'.tab').addClass('active');
						$('#'+nexttab+'.tab').removeClass('disabled');



					},
					'check_amount_decimal': function () {
							if (stripe_utils.amount.indexOf('.')>=0) {

							}

					},
					'check_amount': function () {

						if (stripe_utils.amount == 0 || stripe_utils.amount == '0') {
							stripe_utils.valid=false;
							$('#amount-section .card-errors').html('Please Enter an amount on the amount section')
							$('#amount-section .amount-wrap').addClass('error');
							$('#confirm-section .card-errors').html('Please Enter an amount on the amount section')

							return false;
						}

						if (stripe_utils.amount.indexOf('.')>=0) {
							stripe_utils.valid=false;
							$('#amount-section .card-errors').html('Please Enter a WHOLE dollar amount')
							$('#amount-section .amount-wrap').addClass('error');
							$('#confirm-section .card-errors').html('Please Enter a WHOLE dollar amount')
							return false;
						}

						return true;
					},
					'check_userinfo': function () {
						var isvalid = true;
						this.clear_error();
						$('input.info.required').each(function () {

							if ($(this).val().length==0) {
								$(this).addClass('error');
								$('#form-wrapper .card-errors').append($(this).attr('data-msg')+'<br />');
								isvalid = false;;
							}
						})

						if (isvalid == false) {
							return false;
						}
						return true;
					},
					'check_goodtogo': function () {
						if (stripe_utils.ownerInfo != undefined) {
								if(stripe_utils.ownerInfo.owner.name.length <= 0) {
									stripe_utils.valid=false;
									$('#confirm-section .card-errors').html('Please Enter a name on the info section before confirming your donation')
									return false;
								}
								if(stripe_utils.ownerInfo.owner.email.length <= 0) {
									stripe_utils.valid=false;
									$('#confirm-section .card-errors').html('Please Enter an email on the info section before confirming your donation')
									return false;
								}
						} else {
							stripe_utils.valid=false;
							$('#confirm-section .card-errors').html('Please go to the info section and enter your info before confirming your donation')
							return false;
						}

						if (stripe_utils.amount == 0 || stripe_utils.amount == '0') {

							stripe_utils.valid=false;
							$('#confirm-section .card-errors').html('Please Enter an amount on the amount section')
							return false;
						}
						return true;
					},

				} //end stripe utils
				$.getScript( "https://js.stripe.com/v3/", function( data, textStatus, jqxhr ) {
					//var stripe = '';

					stripe_utils.generate_init_data();

					if (millwood.wp_data.location.host == 'yoda' || millwood.wp_data.location.host == 'localhost') {
						stripe_utils['stripe'] = Stripe(stripe_utils.stripe_test_key);
						stripe_utils['key'] = stripe_utils.stripe_test_key;
						stripe_utils['mode'] = 'test';
					} else if (millwood.wp_data.location.host == 'millwoodchurchnwa.com' || millwood.wp_data.location.host == 'millwoodchurch.com' ) {
							stripe_utils['stripe'] = Stripe(stripe_utils.stripe_live_key);
							stripe_utils['key'] = stripe_utils.stripe_live_key;
							stripe_utils['mode'] = 'live';
					}

					var stripeWrapper = $(stripe_utils.wrapperele);
					if (stripeWrapper.length > 0 ) {
						$(stripeWrapper).html(millwood.templates.stripe_form)
					}

					stripe_utils['element_obj'] = stripe_utils.stripe.elements();

					stripe_utils['card'] = stripe_utils.element_obj.create('card', {
						'hidePostalCode': true,
						'style': {
							'base': {
								'iconColor': '#000',
								'font-size': '16px',
								'color': '#000',
								'backgroundColor': '#f7f7f7',
								'::placeholder': {
									'color': '#555',
								}
							},
							'invalid': {
								'iconColor': '#ff4f4f',
								'color': '#ff4f4f',
							}
						}
					})

					stripe_utils.card.mount('#card-element');
					$(stripe_utils.wrapperele).find('input#names').focus()

					$('button#submit').click(function (e) {
						e.preventDefault();

					})

					stripe_utils.card.on('change', function (event) {
						stripe_utils.clear_error();
						if (event.error) {
							stripe_utils.valid = false;
							$(stripe_utils.wrapperele).find('button#payment').addClass('disabled');
							$(stripe_utils.wrapperele).find('#confirmtab').addClass('disabled');
							$('#payment-section .card-errors').html(event.error.message);

						}
						if (event.complete) {
								//stripe_utils.get_payment_intents(stripe_utils.amount);
								$('button#payment').removeClass('disabled');
								stripe_utils['valid'] = true;
						}

					})

					$(stripe_utils.wrapperele + ' button#submit').on('click', function (e) {
						e.preventDefault();
						if ($(this).hasClass('disabled')!=true) {
							stripe_utils.get_payment_intents(stripe_utils.amount);
							$('#confirm-section button#submit .spinner').addClass('spin');
							//stripe_utils.confirm_card_payment();
						}

					})


					$(stripe_utils.wrapperele + ' .amount-cell').on('click', function () {
						$(stripe_utils.wrapperele + ' .amount-cell').each(function () {
							$(this).removeClass('active');
						})
						let amount = $(this).attr('data-amount');

						stripe_utils.clear_error();


						if ($(this).attr('data-active')=='false') {
							$(this).addClass('active');
							$(this).attr('data-active', 'true');
							$(stripe_utils.wrapperele).find('input#amount').val(amount)
							$(stripe_utils.wrapperele).find('div#amount-result').html('$'+amount)
							stripe_utils.amount = amount;
							stripe_utils['valid'] = true;
						} else {
							amount = 0;
							$(this).removeClass('active');
							$(this).attr('data-active', 'false');
							$(stripe_utils.wrapperele).find('input#amount').val(amount);
							$(stripe_utils.wrapperele).find('div#amount-result').html('$'+amount);
							stripe_utils.amount = amount;
							stripe_utils['valid'] = false;
						}

					})


					$(stripe_utils.wrapperele + ' input#amount').on('focus', function () {
						$(this).addClass('active')
						stripe_utils.clear_error();
					})

					$(stripe_utils.wrapperele + ' input#amount').on('focusout', function () {
						$(this).removeClass('active');
						var amount = $(this).val();
				//		$(this).val(parseInt(amount));


					//	$('div#amount-result').html('$'+amount)
						stripe_utils.amount = amount

					  console.log(amount.indexOf('.'))

					})

					$(stripe_utils.wrapperele + ' input#amount').on('input', function () {
						stripe_utils.clear_error();
						$(stripe_utils.wrapperele).find('div#amount-result').html('$'+$(this).val())
					  if ($(stripe_utils.wrapperele).find('.amount-cell.active').length > 0 ) {
								$(stripe_utils.wrapperele).find('.amount-cell.active').attr('data-active', false);
								$(stripe_utils.wrapperele).find('.amount-cell.active').removeClass('active');
						}
					})

					$(stripe_utils.wrapperele + ' .tab ').on('click', function () {
						if($(this).hasClass('disabled')!=true) {	stripe_utils.clear_error();
							$(stripe_utils.wrapperele + ' .tab').each(function () {
								$(this).removeClass('active');
							})
							$(this).addClass('active');

							let id = $(this).attr('data-active');
							$('.tab-section').each(function () {
								$(this).addClass('hide');
							})
							$('#'+id).removeClass('hide');
						}

					})

					$(stripe_utils.wrapperele + ' button.continue').on('click', function (e) {
						e.preventDefault();
						if ($(this).hasClass('disabled')!=true) {

							let nextele = $(this).attr('data-next');

							if (nextele == 'confirm-section') {
								stripe_utils.check_goodtogo();
								stripe_utils.unlockconfirm = true;
							}

							if (nextele == 'form-wrapper') {
								if (stripe_utils.check_amount() != false) {
									stripe_utils.nav_to_next(this);
								}
							} else {
								if (stripe_utils.check_userinfo() != false) {
									if (nextele == 'confirm-section') {
										$('#confirm-section button#submit').removeClass('disabled');
										$('#confirm-section #cardno').html('Valid');
									}
									stripe_utils.nav_to_next(this);
								}
							}
						}
					})

					$(stripe_utils.wrapperele+' input.info').on('change', function () {
						let resultele = $(this).attr('data-result');
						$(stripe_utils.wrapperele).find('#confirm-section #'+resultele).text($(this).val())

						stripe_utils.generate_stripe_data();
					})

				}); //end get script

			}//end setup-stripe-api
		}

	}; //end millwood


	millwood.utils.checkismobile();
	millwood.utils.get_location_from_url();

	$(window).resize(function () {
		millwood.utils.checkismobile();

	})

	if ($('.logo_slogan').length > 0 ) {
		$( '.logo_slogan' ).clone().appendTo( '.top_panel_title_inner .content_wrap' );
		$('.top_panel_title_inner .logo_slogan').addClass('mobile-tablet-hidden');
	}

	if ($('.top_panel_title_inner').length > 0) {
		let bgimg = $('.top_panel_title_inner').css('background-image');
		$('.top_panel_wrap_inner').css({'background-image': bgimg})
		$('.header_mobile').css({'background-image': bgimg})

		$('.top_panel_title_inner').css({'background-image': 'none'})
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
				var apptoken = millwood.wp_data.custom_super_options.homepage_fb_access_token;
				var limit = millwood.wp_data.custom_super_options.homepage_fb_limit
				var monthsago = new Date();
				monthsago.setMonth(monthsago.getMonth() - parseInt(millwood.wp_data.custom_super_options.homepage_fb_months_ago));
				monthsago = monthsago.getFullYear() + '-' + monthsago.getMonth() + '-' + monthsago.getDate();

			//	var settings = {
  		//			'async': true,
  	//				'crossDomain': true,
  	//				'url': 'https://graph.facebook.com/v4.0/'+ appid + '/feed?since='+monthsago+'&limit='+limit+'&access_token='+apptoken,
  					//'url' :  'https://graph.facebook.com/v4.0/'+ appid + '/feed?fields=id,from,name,message,created_time,story,description,link,picture&limit=5&access_token='+apptoken,
  	//				'method': 'GET',
  	//				'headers': {
   	//					'cache-control': 'no-cache',
  	//				},
  	//				'success': function (data) {
  	//					setTimeout(function () {
  	//						millwood.success.output_fb_widget(data);
  	//					}, 500);
  	//				}
	//			}

	//			$.ajax(settings).complete(function (response) { })
			} //end show fb true
		}  else {//end is homepagge
			if (millwood.wp_data.location.endingpath == millwood.wp_data.custom_super_options.api_news_page) {
				if (millwood.wp_data.custom_super_options.api_show_cc_news == 'yes') {
					$('.pasge_content_wrap .content_wrap .content').empty();
					$.ajax({
						'url': millwood.wp_data.rest_url + 'cc/v1/latest-cc',
						'type': 'GET',
						'data': {},
						'success': function (data) {
							if (data != null) {
								data = JSON.parse(data);
								millwood.success.output_cc_news(data);
							}// end if data length is more than 0
						}
					}) //end ajax calendar
				}
			}
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

if ($('div#stripe-api').length>0) {
	millwood.success.setup_stripe_api();
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

			$('.ds_form_title').each(function () {
				if ($(this).text().trim()=='Billing information') {
					  $(this).text('Contact Information');
				}
			})


			$('fieldset input.input').each(function () {
					if($(this).attr('id').indexOf('-phone')>0) {
						$(this).closest('div.row').remove()
					}
			})

			$('fieldset select.input').each(function () {
					if($(this).attr('id').indexOf('-country')>0) {
						$(this).closest('div.field').remove()
					}
			})

			$('fieldset input.shippingData').prev('hr').remove()
			$('fieldset input.shippingData').next('hr').remove()
			$('fieldset input.shippingData').next('.dsShippingDetails').hide();
			$('fieldset input.shippingData').next('label').remove();
			$('fieldset input.shippingData').css({'visibility':'hidden', 'height':'0px', 'margin-top':'0px', 'margin-bottom':'0px'})


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
					$('#'+menu+ ' span.open_child_menu ').css({'display':'block'});
					setTimeout(function () {
						$('#'+menu+ ' span.open_child_menu').addClass('hover');
					},100)

				})

				$(this).on('mouseleave' , function () {
					$('#'+menu+ ' span.open_child_menu ').css({'display':'none'});
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


			if (millwood.wp_data.responsive.ismobile == true) {
					let toppos = $(document).scrollTop();
					if (toppos > 150) {
							$('body.page').addClass('top_panel_fixed');
					}


				$(window).scroll(function () {
					let toppos = $(document).scrollTop();
					if (toppos > 150) {
						$('body.page').addClass('top_panel_fixed');
					} else {
						$('body.page').removeClass('top_panel_fixed');
					}
				})

				$('.menu_button.icon-menu').addClass('mill_menu_button');
	  		$('.menu_button.icon-menu').removeClass('menu_button')
				$('.mill_menu_button.icon-menu').click(function (event) {
						event.preventDefault();
					 $(this).parent().parent().find('.side_wrap').toggleClass('open');
					 return false;
				})

				$('body').click(function (event) {
					if ($(event.target).hasClass('mill_menu_button')==false) {
						if ($(event.target).is('a') == false) {

							 	$('.side_wrap').each(function () {
									$(this).removeClass('open');
								})
							}

				}

				})

			  $('.top_panel_wrap').hide();
				$('.header_mobile').show();
			}

			if (millwood.wp_data.homeurl.replace('/index.php', '') == href) {
				if (millwood.wp_data.custom_super_options.banner_on_off == 'yes') {
						var bg_image = '';
						if (millwood.wp_data.custom_super_options.banner_custom_image != null) {
							bg_image = millwood.wp_data.custom_super_options.banner_custom_image
						}

						$('<div />', {
								'id': 'banner-area-wrap',
								'style': 'background:url('+ bg_image +'); background-size:cover;'
						}).insertAfter('.page_wrap .top_panel_title')

						var banner = $('#banner-area-wrap')
						if (millwood.wp_data.custom_super_options.banner_area != null) {

							$('<div />', {
								'id':'banner-area',
								///'html': millwood.wp_data.custom_super_options.banner_area
							}).appendTo(banner);

							$('<div />', {
								'id':'banner-text',
								'html': millwood.wp_data.custom_super_options.banner_area
							}).appendTo($(banner).find('#banner-area'))

							if (millwood.wp_data.custom_super_options.banner_more_area != null) {
								$('<div />', {
									'id':'banner-area-show-more',
								//	'html': '<span class = "open_child_menu close"></span>'
								}).appendTo($(banner).find('#banner-area'));

								$('<span />', {
									class : 'open_child_menu close'
								}).appendTo($(banner).find('#banner-area'))

								$('<div />', {
									'id':'banner-more-area',
									'class':'hidden',
									'html': millwood.wp_data.custom_super_options.banner_more_area
								}).appendTo(banner);

								$(banner).find('#banner-area').click(function () {
									 $(this).parent().toggleClass('active');
									 $(banner).find('#banner-more-area').toggleClass('hidden')
									 $(banner).find('#banner-more-area').addClass('show animate')
									 $(banner).find('.open_child_menu').toggleClass('open')

									 if (millwood.wp_data.responsive.isdesktop == true) {
										if($('#banner-area #banner-text').length>0) {

											let toppos = $('#banner-area #banner-text').position().top
											if (toppos != undefined) {

												$('#banner-area #banner-area-show-more').css({'top': toppos-20 + 'px'})
											}
										}
									}
								})

								if (millwood.wp_data.responsive.isdesktop == true) {
									if($('#banner-area #banner-text').length>0) {

										let toppos = $('#banner-area #banner-text').position().top
										if (toppos != undefined) {

											$('#banner-area #banner-area-show-more').css({'top': toppos-20 + 'px'})
										}
									}
								}


							}
						}
					}
			}
}(jQuery));
