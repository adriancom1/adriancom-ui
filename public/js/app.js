//Main App JS

var toggleMenu = function() {
	this.addCss('#lines-menu-trigger > span', 'toggle');
	this.toggleHide('#nav-about');
	this.toggleHide('#nav-works');
	this.toggleHide('#nav-contact');
	this.toggleHide('#btn-logo');
	this.toggleHide('#bgvid', true);
	this.toggleHide('#grid-menu', true);
	this.toggleHide('#main-wrapper', true);
	setTimeout(function() {
		grid.doWave(1,1);
	}, 500);
};

var mainMenuHandler = function(element, apply) {
	 apply(element, 'toggle');
	 toggleMenu.call(this);
};

var mainMenuHandlerTarget = function(element, apply) {
	 apply('js-lines', 'toggle');
	 toggleMenu.call(this);
};

var cdnEndPoint = 'http://adriancom.s3-website-us-west-2.amazonaws.com';

DomUtils.onclick('js-lines', mainMenuHandler);
DomUtils.onclick('js-back', mainMenuHandlerTarget);
DomUtils.onclick('js-cta', mainMenuHandlerTarget);

//Initialize the News Links Hover Effect
DomUtils.setHoverFxChild('#news article > h3 a', 'fx', true);
DomUtils.link('js-email', 'mailto://adrian@adrian-s.com?subject=Hello Adrian&body=Hello');

//Initialize the Selected Works Hover Effect
DomUtils.setHoverFxChildren('#works figcaption',[0,1]);

DomUtils.keyboard(function() {
	console.log('Go to Main menu!!');
});


//Initialize the Scrolling Utilities
ScrollUtils.init('splash', 'bgvid', 'about', 'news', 'contact').setTopHeader('main-header');
ScrollUtils.topHeaderLock('splash', 'lock');
ScrollUtils.toggleVideo('splash', 'bgvid', 'novideo');


//Enable smart scroll animation trigger
ScrollUtils.scrolled('works', function(element) {
	var el = DomUtils.nthSibling(element, 2);
	el.classList.add('fx');
	el.nextElementSibling.classList.add('fx');

	//Project Links Animation Init
	var links = document.getElementsByClassName('project');
	links = Array.prototype.slice.call(links, 0);
	links.forEach(function(link, i) {
		setTimeout(function() {
			link.classList.add('fx');
		}, 100 * (i * 1.8));
	});
});

//Check for vertical scroll triggers
ScrollUtils.scrolled('contact', function(element) {
	DomUtils.nthSibling(element, 1).classList.add('fx');
});


ScrollUtils.scrolled('about-how', function(element) {
	var _el = DomUtils.nthChild(element, 1);
	DomUtils.slideUpAll(_el, 1.7);
});


//Register the Nav Links
ScrollUtils.link('nav-about','about');
ScrollUtils.link('nav-works','works');
ScrollUtils.link('nav-contact','contact');
ScrollUtils.link('btn-logo','top');

/* adrian:js */ //--> ID ONLY
var imageIdList = [
	'legacy-digital', 'fedex-hub', 'scrollmotion', 'office-depot', 'ad-creative', 'fox-ureport', 'adrian-com',
	'sap-wcms','fox-elections','fox-infrastructure', 'sap-widgets', 'sap-hero','hurricane-interactive',
	'fox-feature-creative', 'fox-blogs' , 'fox-legacy-works'
];
/* endinject */

//Initialize the Grid Navigation
var grid = Grid.generate({
	id:'grid-nav',
	type: 'square', 
	rows: 10,
	columns: 16,
	spacer: 10,
	effect: 'drawCubicWave',
	width : 500,
	height : 500,
	cellSize : 60,
	hotSpots : imageIdList.length,
	detailsPage : 'adrian.html'

});
grid.randomizeClicks();

grid.loadGridImages(cdnEndPoint + '/img/works', 'jpg', imageIdList);


//FireFox Override Styles
if(!~navigator.userAgent.toLowerCase().indexOf('firefox') == 0) {
	DomUtils.addRule('#works .project {padding:15px;}');
	DomUtils.addRule('.projects #works .project {padding:10px;}');
}
DomUtils.randomBg({
	selector : 'body.home .intro-text .intro-text-middle .bg',
	folder: cdnEndPoint + '/img/bg',
	images : ['boats.jpg', 'bulb.jpg', 'forest.jpg', 'jets.jpg', 'lights.jpg', 'ocean.jpg', 'snow.jpg']	
});

//Windows Webkit
if(~navigator.userAgent.toLowerCase().indexOf('windows') != 0 && ~navigator.userAgent.toLowerCase().indexOf('webkit') != 0) {
	//Custom Scrollbar for Webkit Windows
	DomUtils.addRule('::-webkit-scrollbar {width: 6px;}');
	DomUtils.addRule('::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.1); -webkit-border-radius: 10px; border-radius: 10px;}');
	DomUtils.addRule('::-webkit-scrollbar-thumb {-webkit-border-radius: 10px;border-radius: 10px;background: rgba(0,0,0,0.2); -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);}');
	DomUtils.addRule('::-webkit-scrollbar-thumb:window-inactive {background: rgba(0,0,0,0.4);}');
	
}


