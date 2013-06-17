/* ----------------------------------
jQuery Timelinr 0.9.53
tested with jQuery v1.6+

Copyright 2011, CSSLab.cl
Free under the MIT license.
http://www.opensource.org/licenses/mit-license.php

instructions: http://www.csslab.cl/2011/08/18/jquery-timelinr/
---------------------------------- */

jQuery.fn.timelinr = function(options){

	var src = $(this);     

	// default plugin settings
	settings = jQuery.extend({
		orientation: 				'horizontal',		// value: horizontal | vertical, default to horizontal
		datesDiv: 					'#dates',			// value: any HTML tag or #id, default to #dates
		datesSelectedClass: 		'selected',			// value: any class, default to selected
		datesSpeed: 				'normal',			// value: integer between 100 and 1000 (recommended) or 'slow', 'normal' or 'fast'; default to normal
		issuesDiv: 					'#issues',			// value: any HTML tag or #id, default to #issues
		issuesSelectedClass: 		'selected',			// value: any class, default to selected
		issuesSpeed: 				'fast',				// value: integer between 100 and 1000 (recommended) or 'slow', 'normal' or 'fast'; default to fast
		issuesTransparency: 		0.2,				// value: integer between 0 and 1 (recommended), default to 0.2
		issuesTransparencySpeed: 	500,				// value: integer between 100 and 1000 (recommended), default to 500 (normal)
		prevButton: 				'#prev',			// value: any HTML tag or #id, default to #prev
		nextButton: 				'#next',			// value: any HTML tag or #id, default to #next
		arrowKeys: 					'false',			// value: true | false, default to false
		startAt: 					1,					// value: integer, default to 1 (first)
		autoPlay: 					'false',			// value: true | false, default to false
		autoPlayDirection: 			'forward',			// value: forward | backward, default to forward
		autoPlayPause: 				2000				// value: integer (1000 = 1 seg), default to 2000 (2segs)
	}, options);

	$(function(){
								
		// setting variables... many of them
		
		var howManyDates = src.find(settings.datesDiv+' li').length;		
		var howManyIssues = src.find(settings.issuesDiv+' li').length;
		var currentDate = src.find(settings.datesDiv).find('a.'+settings.datesSelectedClass);
		var widthContainer = src.width();
		var heightContainer = src.height();
		var widthIssues = src.find(settings.issuesDiv).width();
		var heightIssues = src.find(settings.issuesDiv).height();
		var widthIssue = src.find(settings.issuesDiv+' li').width();
		var heightIssue = src.find(settings.issuesDiv+' li').height();
		var widthDates = src.find(settings.datesDiv).width();
		var heightDates = src.find(settings.datesDiv).height();
		var widthDate = src.find(settings.datesDiv+' li').width();
		var heightDate = src.find(settings.datesDiv+' li').height();
		
		

		// set positions!
		if(settings.orientation == 'horizontal') {	
			src.find(settings.issuesDiv).width(widthIssue*howManyIssues);						
			src.find(settings.datesDiv).width(widthDate*howManyDates).css('marginLeft',widthContainer/2-widthDate/2);
			var defaultPositionDates = parseInt(src.find(settings.datesDiv).css('marginLeft').substring(0,src.find(settings.datesDiv).css('marginLeft').indexOf('px')));
		} else if(settings.orientation == 'vertical') {
			src.find(settings.issuesDiv).height(heightIssue*howManyIssues);
			src.find(settings.datesDiv).height(heightDate*howManyDates).css('marginTop',heightContainer/2-heightDate/2);
			var defaultPositionDates = parseInt(src.find(settings.datesDiv).css('marginTop').substring(0,src.find(settings.datesDiv).css('marginTop').indexOf('px')));
		}
		
		src.find(settings.datesDiv+' a').click(function(event){
			event.preventDefault();
			// first vars
			var whichIssue = $(this).text();
			var currentIndex = $(this).parent().prevAll().length;
			// moving the elements
			if(settings.orientation == 'horizontal') {
				src.find(settings.issuesDiv).animate({'marginLeft':-widthIssue*currentIndex},{queue:false, duration:settings.issuesSpeed});
			} else if(settings.orientation == 'vertical') {
				src.find(settings.issuesDiv).animate({'marginTop':-heightIssue*currentIndex},{queue:false, duration:settings.issuesSpeed});
			}
			
			src.find(settings.issuesDiv+' li').animate({'opacity':settings.issuesTransparency},{queue:false, duration:settings.issuesSpeed}).removeClass(settings.issuesSelectedClass).eq(currentIndex).addClass(settings.issuesSelectedClass).fadeTo(settings.issuesTransparencySpeed,1);
			// prev/next buttons now disappears on first/last issue | bugfix from 0.9.51: lower than 1 issue hide the arrows | bugfixed: arrows not showing when jumping from first to last date
			if(howManyDates == 1) {
				src.find(settings.prevButton+','+settings.nextButton).fadeOut('fast');
			} else if(howManyDates == 2) {
				if(src.find(settings.issuesDiv+' li:first-child').hasClass(settings.issuesSelectedClass)) {
					src.find(settings.prevButton).fadeOut('fast');
				 	src.find(settings.nextButton).fadeIn('fast');
				} 
				else if(src.find(settings.issuesDiv+' li:last-child').hasClass(settings.issuesSelectedClass)) {
					src.find(settings.nextButton).fadeOut('fast');
					src.find(settings.prevButton).fadeIn('fast');
				}
			} else {
				if( src.find(settings.issuesDiv+' li:first-child').hasClass(settings.issuesSelectedClass) ) {
					src.find(settings.nextButton).fadeIn('fast');
					src.find(settings.prevButton).fadeOut('fast');
				} 
				else if( src.find(settings.issuesDiv+' li:last-child').hasClass(settings.issuesSelectedClass) ) {
					src.find(settings.prevButton).fadeIn('fast');
					src.find(settings.nextButton).fadeOut('fast');
				}
				else {
					src.find(settings.nextButton+','+settings.prevButton).fadeIn('slow');
				}	
			}
			// now moving the dates
			src.find(settings.datesDiv+' a').removeClass(settings.datesSelectedClass);
			$(this).addClass(settings.datesSelectedClass);
			if(settings.orientation == 'horizontal') {
				src.find(settings.datesDiv).animate({'marginLeft':defaultPositionDates-(widthDate*currentIndex)},{queue:false, duration:'settings.datesSpeed'});
			} else if(settings.orientation == 'vertical') {
				src.find(settings.datesDiv).animate({'marginTop':defaultPositionDates-(heightDate*currentIndex)},{queue:false, duration:'settings.datesSpeed'});
			}
		});

		src.find(settings.nextButton).bind('click', function(event){
			event.preventDefault();
			if(settings.orientation == 'horizontal') {
				var currentPositionIssues = parseInt(src.find(settings.issuesDiv).css('marginLeft').substring(0,src.find(settings.issuesDiv).css('marginLeft').indexOf('px')));
				var currentIssueIndex = currentPositionIssues/widthIssue;
				var currentPositionDates = parseInt(src.find(settings.datesDiv).css('marginLeft').substring(0,src.find(settings.datesDiv).css('marginLeft').indexOf('px')));
				var currentIssueDate = currentPositionDates-widthDate;
				if(currentPositionIssues <= -(widthIssue*howManyIssues-(widthIssue))) {
					src.find(settings.issuesDiv).stop();
					src.find(settings.datesDiv+' li:last-child a').click();
				} else {
					if (!src.find(settings.issuesDiv).is(':animated')) {
						src.find(settings.issuesDiv).animate({'marginLeft':currentPositionIssues-widthIssue},{queue:false, duration:settings.issuesSpeed});
						src.find(settings.issuesDiv+' li').animate({'opacity':settings.issuesTransparency},{queue:false, duration:settings.issuesSpeed});
						src.find(settings.issuesDiv+' li.'+settings.issuesSelectedClass).removeClass(settings.issuesSelectedClass).next().fadeTo(settings.issuesTransparencySpeed, 1).addClass(settings.issuesSelectedClass);
						src.find(settings.datesDiv).animate({'marginLeft':currentIssueDate},{queue:false, duration:'settings.datesSpeed'});
						src.find(settings.datesDiv+' a.'+settings.datesSelectedClass).removeClass(settings.datesSelectedClass).parent().next().children().addClass(settings.datesSelectedClass);
					}
				}
			} else if(settings.orientation == 'vertical') {
				var currentPositionIssues = parseInt(src.find(settings.issuesDiv).css('marginTop').substring(0,src.find(settings.issuesDiv).css('marginTop').indexOf('px')));
				var currentIssueIndex = currentPositionIssues/heightIssue;
				var currentPositionDates = parseInt(src.find(settings.datesDiv).css('marginTop').substring(0,src.find(settings.datesDiv).css('marginTop').indexOf('px')));
				var currentIssueDate = currentPositionDates-heightDate;
				if(currentPositionIssues <= -(heightIssue*howManyIssues-(heightIssue))) {
					src.find(settings.issuesDiv).stop();
					src.find(settings.datesDiv+' li:last-child a').click();
				} else {
					if (!src.find(settings.issuesDiv).is(':animated')) {
						src.find(settings.issuesDiv).animate({'marginTop':currentPositionIssues-heightIssue},{queue:false, duration:settings.issuesSpeed});
						src.find(settings.issuesDiv+' li').animate({'opacity':settings.issuesTransparency},{queue:false, duration:settings.issuesSpeed});
						src.find(settings.issuesDiv+' li.'+settings.issuesSelectedClass).removeClass(settings.issuesSelectedClass).next().fadeTo(settings.issuesTransparencySpeed, 1).addClass(settings.issuesSelectedClass);
						src.find(settings.datesDiv).animate({'marginTop':currentIssueDate},{queue:false, duration:'settings.datesSpeed'});
						src.find(settings.datesDiv+' a.'+settings.datesSelectedClass).removeClass(settings.datesSelectedClass).parent().next().children().addClass(settings.datesSelectedClass);
					}
				}
			}
			// prev/next buttons now disappears on first/last issue | bugfix from 0.9.51: lower than 1 issue hide the arrows
			if(howManyDates == 1) {
				src.find(settings.prevButton+','+settings.nextButton).fadeOut('fast');
			} else if(howManyDates == 2) {
				if(src.find(settings.issuesDiv+' li:first-child').hasClass(settings.issuesSelectedClass)) {
					src.find(settings.prevButton).fadeOut('fast');
				 	src.find(settings.nextButton).fadeIn('fast');
				} 
				else if(src.find(settings.issuesDiv+' li:last-child').hasClass(settings.issuesSelectedClass)) {
					src.find(settings.nextButton).fadeOut('fast');
					src.find(settings.prevButton).fadeIn('fast');
				}
			} else {
				if( src.find(settings.issuesDiv+' li:first-child').hasClass(settings.issuesSelectedClass) ) {
					src.find(settings.prevButton).fadeOut('fast');
				} 
				else if( src.find(settings.issuesDiv+' li:last-child').hasClass(settings.issuesSelectedClass) ) {
					src.find(settings.nextButton).fadeOut('fast');
				}
				else {
					src.find(settings.nextButton+','+settings.prevButton).fadeIn('slow');
				}	
			}
		});

		src.find(settings.prevButton).click(function(event){
			event.preventDefault();
			if(settings.orientation == 'horizontal') {
				var currentPositionIssues = parseInt(src.find(settings.issuesDiv).css('marginLeft').substring(0,src.find(settings.issuesDiv).css('marginLeft').indexOf('px')));
				var currentIssueIndex = currentPositionIssues/widthIssue;
				var currentPositionDates = parseInt(src.find(settings.datesDiv).css('marginLeft').substring(0,src.find(settings.datesDiv).css('marginLeft').indexOf('px')));
				var currentIssueDate = currentPositionDates+widthDate;
				if(currentPositionIssues >= 0) {
					src.find(settings.issuesDiv).stop();
					src.find(settings.datesDiv+' li:first-child a').click();
				} else {
					if (!src.find(settings.issuesDiv).is(':animated')) {
						src.find(settings.issuesDiv).animate({'marginLeft':currentPositionIssues+widthIssue},{queue:false, duration:settings.issuesSpeed});
						src.find(settings.issuesDiv+' li').animate({'opacity':settings.issuesTransparency},{queue:false, duration:settings.issuesSpeed});
						src.find(settings.issuesDiv+' li.'+settings.issuesSelectedClass).removeClass(settings.issuesSelectedClass).prev().fadeTo(settings.issuesTransparencySpeed, 1).addClass(settings.issuesSelectedClass);
						src.find(settings.datesDiv).animate({'marginLeft':currentIssueDate},{queue:false, duration:'settings.datesSpeed'});
						src.find(settings.datesDiv+' a.'+settings.datesSelectedClass).removeClass(settings.datesSelectedClass).parent().prev().children().addClass(settings.datesSelectedClass);
					}
				}
			} else if(settings.orientation == 'vertical') {
				var currentPositionIssues = parseInt(src.find(settings.issuesDiv).css('marginTop').substring(0,src.find(settings.issuesDiv).css('marginTop').indexOf('px')));
				var currentIssueIndex = currentPositionIssues/heightIssue;
				var currentPositionDates = parseInt(src.find(settings.datesDiv).css('marginTop').substring(0,src.find(settings.datesDiv).css('marginTop').indexOf('px')));
				var currentIssueDate = currentPositionDates+heightDate;
				if(currentPositionIssues >= 0) {
					src.find(settings.issuesDiv).stop();
					src.find(settings.datesDiv+' li:first-child a').click();
				} else {
					if (!src.find(settings.issuesDiv).is(':animated')) {
						src.find(settings.issuesDiv).animate({'marginTop':currentPositionIssues+heightIssue},{queue:false, duration:settings.issuesSpeed});
						src.find(settings.issuesDiv+' li').animate({'opacity':settings.issuesTransparency},{queue:false, duration:settings.issuesSpeed});
						src.find(settings.issuesDiv+' li.'+settings.issuesSelectedClass).removeClass(settings.issuesSelectedClass).prev().fadeTo(settings.issuesTransparencySpeed, 1).addClass(settings.issuesSelectedClass);
						src.find(settings.datesDiv).animate({'marginTop':currentIssueDate},{queue:false, duration:'settings.datesSpeed'},{queue:false, duration:settings.issuesSpeed});
						src.find(settings.datesDiv+' a.'+settings.datesSelectedClass).removeClass(settings.datesSelectedClass).parent().prev().children().addClass(settings.datesSelectedClass);
					}
				}
			}
			// prev/next buttons now disappears on first/last issue | bugfix from 0.9.51: lower than 1 issue hide the arrows
			if(howManyDates == 1) {
				src.find(settings.prevButton+','+settings.nextButton).fadeOut('fast');
			} else if(howManyDates == 2) {
				if(src.find(settings.issuesDiv+' li:first-child').hasClass(settings.issuesSelectedClass)) {
					src.find(settings.prevButton).fadeOut('fast');
				 	src.find(settings.nextButton).fadeIn('fast');
				} 
				else if(src.find(settings.issuesDiv+' li:last-child').hasClass(settings.issuesSelectedClass)) {
					src.find(settings.nextButton).fadeOut('fast');
					src.find(settings.prevButton).fadeIn('fast');
				}
			} else {
				if( src.find(settings.issuesDiv+' li:first-child').hasClass(settings.issuesSelectedClass) ) {
					src.find(settings.prevButton).fadeOut('fast');
				} 
				else if( src.find(settings.issuesDiv+' li:last-child').hasClass(settings.issuesSelectedClass) ) {
					src.find(settings.nextButton).fadeOut('fast');
				}
				else {
					src.find(settings.nextButton+','+settings.prevButton).fadeIn('slow');
				}	
			}
		});
		// keyboard navigation, added since 0.9.1
		if(settings.arrowKeys=='true') {
			if(settings.orientation=='horizontal') {
				$(document).keydown(function(event){
					if (event.keyCode == 39) { 
				       src.find(settings.nextButton).click();
				    }
					if (event.keyCode == 37) { 
				       src.find(settings.prevButton).click();
				    }
				});
			} else if(settings.orientation=='vertical') {
				$(document).keydown(function(event){
					if (event.keyCode == 40) { 
				       src.find(settings.nextButton).click();
				    }
					if (event.keyCode == 38) { 
				       src.find(settings.prevButton).click();
				    }
				});
			}
		}
		// default position startAt, added since 0.9.3
		src.find(settings.datesDiv+' li').eq(settings.startAt-1).find('a').trigger('click');
		// autoPlay, added since 0.9.4
		if(settings.autoPlay == 'true') { 
			setInterval("autoPlay()", settings.autoPlayPause);
		}
	});
};

// autoPlay, added since 0.9.4
function autoPlay(){
	var currentDate = src.find(settings.datesDiv).find('a.'+settings.datesSelectedClass);
	if(settings.autoPlayDirection == 'forward') {
		if(currentDate.parent().is('li:last-child')) {
			src.find(settings.datesDiv+' li:first-child').find('a').trigger('click');
		} else {
			currentDate.parent().next().find('a').trigger('click');
		}
	} else if(settings.autoPlayDirection == 'backward') {
		if(currentDate.parent().is('li:first-child')) {
			src.find(settings.datesDiv+' li:last-child').find('a').trigger('click');
		} else {
			currentDate.parent().prev().find('a').trigger('click');
		}
	}
}
