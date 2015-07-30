//Initialize the Scrolling Utilities
ScrollUtils.init('js-topbar-trigger').setTopHeader('main-header');
ScrollUtils.topHeaderLock('js-topbar-trigger', 'lock');


//Initialize the Selected Works Hover Effect
DomUtils.setHoverFxChildren('#works figcaption',[0]);

//Register the Nav Links
DomUtils.link('btn-logo', 'index.html');

//Enable Grid Collage Animation
// This will be called once Angular completes the loading cycle
function enableGridAnim() {
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

