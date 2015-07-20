var Scenes = (function() {
  var _scenes = {
    endHandler : null,
    currentScene : 1,
    scenes : [200, 'main-intro', 1500, 'main-intro-1', 500, 'header-one', 500, 'header-two', 1000, 'header-three', 0, 'main-intro-end'],    
    homeBackground : false,
    _bandwidthCalc : function(kbps, fileSizeInBytes) {
      var kbps = (kbps * 1000);
      var img = (8 * fileSizeInBytes);
      return Math.ceil((img / kbps) * 1000); //miliseconds
    },
    _getSceneNames : function() {
      var sc = this.scenes;
      var i = 0;
      var len = sc.length/2;
      var name = [];
      for(; i < len; i++) {
          name.push(sc[(i << 1) + 1]);
      }
      return name;
    },
    init : function(handler) {
      this.endHandler = handler;
      this.isBackgroundImageLoaded('intro-panel-top', this.loadScene.bind(this, this.currentScene));
      this.totalScenes = this.scenes.length;
    },
    isBackgroundImageLoaded : function(element, callback) {
      //set the initial short delay
      setTimeout(start, this._bandwidthCalc(25, 250));
      function start() {
        var img = new Image();
        var el = document.getElementById(element);
        var src = window.getComputedStyle(el,null).getPropertyValue("background-image");
        img.src = src.substr(4, src.length-5).replace(/"/g,'');
        img.onload = callback;
      };
    },
    length : function() {
      return (this.scenes.length/2) - 1;
    },    
    loadScene : function(sequence) {
      var seq = sequence || this.currentScene;
      var sceneName = this.scenes[seq];
      var delay = this.scenes[seq-1];
      document.body.classList.add(this.scenes[seq]);
       if(seq !== this.scenes.length-1) this.delayScene(delay);
    },
    nextScene : function(e) {
      var scene = this.currentScene;
      this.loadScene( (scene << 1) + 1 );
      if(scene < (this.scenes.length-1) >> 1 ) { //test for end
        this.currentScene = scene += 1;
        if(this.currentScene === this.length()) {
          document.body.addEventListener('transitionend', this.endHandler, false);
        }
      } 
    },
    delayScene : function(timeInMiliseconds) {
      var next = this.nextScene.bind(this);
      var id = setTimeout(next, timeInMiliseconds);
    },
    remove : function(elementId, cssClasses /*Additional CSS Classes*/) {
      DomUtils.remove(elementId);

      var names = this._getSceneNames();
      if(Array.isArray(cssClasses)) {
        names.unshift(cssClasses.slice(0));
      }
      names.forEach(function(item) {
        document.body.classList.remove(item);
      });
      document.body.classList.add('main');

    window.Scenes = null;
    }
  };

  return _scenes;
})();