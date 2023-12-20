;(function (win, $) {
  'use strict';
  win.COMMON = win.COMMON || {};

  win.COMMON.common = (function() {
	const defParams = {
	  isShowClass      : 'is-show',
	  btn              : '.btn',
	  btnOpenCategory  : 'btn--open-category',
	  dimmed           : '.dimmed',
	  layer            : '.layer',
	  layerCategory    : '#layer--category',
	};
	return {
	  init: function() {
		this.setElement();
		this.bindEvents();
	  },

	  setElement: function() {
		this.window = $(win);
		this.body = $('body');
		this.btn = $(defParams.btn);
		this.dimmed = $(defParams.dimmed);
		this.layer = $(defParams.layer);
		this.layerCategory = $(defParams.layerCategory);
	  },

	  bindEvents: function() {
		this.btn.on('click', $.proxy(this.clickBtn, this));
		this.window.on('load', $.proxy(this.onLoadFunc, this));
		this.window.on('resize', $.proxy(this.onResizeFunc, this));
	  },

	  scrollLock : function (state, typeLayer){
		if(state == 'open'){
		  $.scrollLock(true);
		  this.dimmed.stop().fadeIn();
		  this.body.addClass(defParams.isShowClass);
		  typeLayer.addClass(defParams.isShowClass);
		}else if(state == 'close'){
		  $.scrollLock(false);
		  this.body.removeClass(defParams.isShowClass);
		  this.layer.removeClass(defParams.isShowClass);
		  this.dimmed.stop().fadeOut();
		}
	  },

	  clickBtn: function(e) {
		let target = $(e.currentTarget);
		if(target.hasClass(defParams.btnOpenCategory)){
		  this.scrollLock('open', this.layerCategory)
		}
	  },

	  convertVH: function () {
		if(window.innerHeight < 560 && $('.layer--category').length) {
		  this.vh = document.documentElement.clientHeight * 0.01;
		  document.querySelector('.layer--category').style.setProperty('--vh', `${this.vh}px`);
		}else{
		  $('.layer--category').css('height', 'auto');
		}
	  },

	  onResizeFunc: function(e) {
		this.convertVH();
	  },

	  onLoadFunc : function() {
		this.convertVH();
	  },
	}

  })();
  if($('.page--product').length){
	COMMON.common.init()
  }
})(window, window.jQuery);
