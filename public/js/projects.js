//Initialize the Scrolling Utilities
ScrollUtils.init('js-topbar-trigger').setTopHeader('main-header');
ScrollUtils.topHeaderLock('js-topbar-trigger', 'lock');

//Initialize the Selected Works Hover Effect
//DomUtils.setHoverFxChildren('#works figcaption',[0]);

//Register the Nav Links
DomUtils.link('btn-logo', 'index.html');

//Enable Grid Collage Animation, this is called from the Angular Controller
var animInit = function() {
	DomUtils.slideMulti('gridAnim', 'y', '+', 8);
	DomUtils.slideMulti('gridAnim1', 'y','+', 3);
	DomUtils.slideMulti('gridAnim2', 'x','+', 5);
	DomUtils.slideMulti('gridAnim3', 'x','-', 6);
	DomUtils.slideMulti('lastGrid', 'y','-', 8);
};

//FireFox 
if(!~navigator.userAgent.toLowerCase().indexOf('firefox') == 0) {
	DomUtils.addRule('.projects #works .project {padding:10px;}');
}

//Windows Webkit
if(~navigator.userAgent.toLowerCase().indexOf('windows') != 0 && ~navigator.userAgent.toLowerCase().indexOf('webkit') != 0) {
	//Custom Scrollbar for Webkit Windows
	DomUtils.addRule('::-webkit-scrollbar {width: 6px;}');
	DomUtils.addRule('::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.1); -webkit-border-radius: 10px; border-radius: 10px;}');
	DomUtils.addRule('::-webkit-scrollbar-thumb {-webkit-border-radius: 10px;border-radius: 10px;background: rgba(0,0,0,0.2); -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);}');
	DomUtils.addRule('::-webkit-scrollbar-thumb:window-inactive {background: rgba(0,0,0,0.4);}');
}
