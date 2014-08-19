/*global define $ requestAnimationFrame*/

define(function (require) {
	
	var App,
		Backbone = require('backbone'), 
		BgView = require('app/views/bg-view'),
		NotesView = require('pres/views/notes-view'),
		SlideBlurView = require('app/views/slide-blur-view'),
		SlideBasicView = require('app/views/slide-basic-view'),
		IframeView = require('app/views/iframe-view'),
		IframeFullView = require('app/views/iframe-full-view'),
        AppBase = require('pres/views/app-base');

    App = AppBase.extend({
		BASE_VIEW: SlideBasicView,
		
		SLIDEVIEW_LIST: [
			{cl: 'iframe-full', view: IframeFullView},
			{cl: 'iframe', view: IframeView}
		],
	
        initialize: function () {
            if (this.passTest() !== true) {
				return;
			}

            AppBase.prototype.initialize.call(this);

            this.notesView = new NotesView();

			this.bg = new BgView();
			this.render();
        },

		passTest: function () {	
			if (Modernizr.flexbox !== true) {
				return false;
			} else if (Modernizr.touch === true) {
				$('video').each(function () {
					$(this).attr({
						'src': $(this).data('src')
					});
				});
				return false;
			} else {
				return true;
			}
        },

        render: function () {
	
            AppBase.prototype.render.call(this);

			//TODO:: check if should be visible based on slide having position data
            if (this.bg) {
			    this.bg.render();
            }

        }
    });

	return new App();
});
