(function() {
  /*
   * Copyright (C) 2001-2016 Phoenix Satellite Television Co. ltd
   *
   * This file is part of WebOS.
   *
   * WebOS is protected by copyright and/or other applicable law. You cannot redistribute it nor
   * modify it unless under proper license;
   */
  $ns('WebOS.Apps');
  var Panels = {};

  Panels.p2 = function (panel, settings) {
    settings = $.extend({ canScroll: 0, width: '#w', height: '#h', resizable: 0, area: 0, direction: 'y', split: '48, *-48', css: '' }, settings);
    var mainPanel = new UI.Panel(panel, settings);
    mainPanel.appendTo();
    mainPanel.update();
    return mainPanel;
  };

  var info ={
    '中文台SD': { channel: '270DE943-3CDF-45E1-8445-9403F93E80C4', uid: '270DE943-3CDF-45E1-8445-9403F93E80C4', css: 'app-splayer-icon-zw' },
    '资讯台SD': { channel: '4AC51C17-9FBE-47F2-8EE0-8285A66EAFF5', uid: '4AC51C17-9FBE-47F2-8EE0-8285A66EAFF5', css: 'app-splayer-icon-zx' },
    '中文台HD': { channel: '370DE943-3CDF-45E1-8445-9403F93E80C4', uid: '270DE943-3CDF-45E1-8445-9403F93E80C4', css: 'app-splayer-icon-zw' },
    '资讯台HD': { channel: '47C51C17-9FBE-47F2-8EE0-8285A66EAFF5', uid: '4AC51C17-9FBE-47F2-8EE0-8285A66EAFF5', css: 'app-splayer-icon-zx' },
    // '香港台': { channel: '2c942450-2165-4750-80de-7dff9c224153', uid: '2c942450-2165-4750-80de-7dff9c224153', css: 'app-splayer-icon-xg' },
    //'DEMO-I': { channel: 'd8942450-2165-4750-80de-7dff9c224153', uid: 'd8942450-2165-4750-80de-7dff9c224153', css: '' },
    //'DEMO-A': { channel: 'a9942450-2165-4750-80de-7dff9c224153', uid: 'a9942450-2165-4750-80de-7dff9c224153', css: '' }
  };

  var createPlayer = function(channel, uid, width, height) {
    var options={}, stream='';
    if(channel=='270DE943-3CDF-45E1-8445-9403F93E80C4'){
      stream='pcc.stream_360p';
    }else if(channel=='4AC51C17-9FBE-47F2-8EE0-8285A66EAFF5'){
      stream='pic.stream_360p';
    }else if(channel=='370DE943-3CDF-45E1-8445-9403F93E80C4'){
      stream='pcc.stream_720p';
    }else{
      stream='pic.stream_720p';
    }
    var player;
    if(channel=='d8942450-2165-4750-80de-7dff9c224153'){
      player=WebOS.MediaService.create('webos-live', 'rtmp://live.cloudifeng.com/live/xx?auth_key=1477825795-0-0-959b5efc53e6d7352f6c2da8fd30b73d');
    }else if (channel=='a9942450-2165-4750-80de-7dff9c224153'){
      player=WebOS.MediaService.create('webos-live', 'rtmp://live.cloudifeng.com/live/xxa?auth_key=1473045278-0-0-ffa284bff2711f8c080bec35b0eb40bd');
    }else{
      player=WebOS.MediaService.create('webos-live', 'rtmp://hkss3.phoenixtv.com/live/mp4:'+stream);
    }
    return '<div class="app-splayer-video-wrap" style="width:'+ width +'px;height:'+ height +'px">'+player+'</div>';
    return '<div class="app-splayer-video-wrap" style="width:'+ width +'px;height:'+ height +'px"><object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" width="'+ width +'" height="'+ height +'" id="SWF1"><param name="movie" value="http://v.ifeng.com/include/ifengLivePlayer_v5.0.42_p.swf"><param name="FlashVars" value="ChannelID='+ channel +'&amp;StreamUrl=http://ifenglive.soooner.com/?uuid=5B63686E5D445830303030303034327C3130303031397C7C7C7C72746D707C666C765B2F63686E5D5B74735D315B2F74735D5B7375735D315B2F7375735DVSDNSOOONERCOM00|js&amp;color=0xC2C2C2&amp;ADPlay=true&amp;ADURL=&amp;from=live&amp;adcpid=1210&amp;pageurl=http://v.ifeng.com/live/#'+ uid +'&amp;AutoPlay=true&amp;picUrl=http://vimg.ifeng.com/live/images/click.jpg&amp;AutoP2P=false&amp;picP2PUrl=http://vimg.ifeng.com/live/images/clickp2p.jpg&amp;picP2PLink=http://v.ifeng.com/live/phlive.shtml&amp;PlayerName=vLivePlayer&amp;DisableEPG=false&amp;subject=live&amp;uid=1388985132300_dh8ypy7834&amp;sid=&amp;locid="><param name="allowFullScreen" value="true"> <param name="wmode" value="transparent"> <param name="allowScriptAccess" value="always"><embed src="http://v.ifeng.com/include/ifengLivePlayer_v5.0.42_p.swf" width="'+ width +'" height="'+ height +'" name="SWF1" allowfullscreen="true" wmode="transparent" allowscriptaccess="always" flashvars="ChannelID='+ channel +'&amp;StreamUrl=http://ifenglive.soooner.com/?uuid=5B63686E5D445830303030303034327C3130303031397C7C7C7C72746D707C666C765B2F63686E5D5B74735D315B2F74735D5B7375735D315B2F7375735DVSDNSOOONERCOM00|js&amp;color=0xC2C2C2&amp;ADPlay=true&amp;ADURL=&amp;from=live&amp;adcpid=1210&amp;pageurl=http://v.ifeng.com/live/#'+ uid +'&amp;AutoPlay=true&amp;picUrl=http://vimg.ifeng.com/live/images/click.jpg&amp;AutoP2P=false&amp;picP2PUrl=http://vimg.ifeng.com/live/images/clickp2p.jpg&amp;picP2PLink=http://v.ifeng.com/live/phlive.shtml&amp;PlayerName=vLivePlayer&amp;DisableEPG=false&amp;subject=live&amp;uid=1388985132300_dh8ypy7834&amp;sid=&amp;locid=" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"></object></div>';
  };

  WebOS.Apps.SmoothStreamingPlayer = function () {
    this.win = null;
    this.contentJO = $('<div class="app-smooth-streaming-player">loading...</div>');
    this.rootPanel = null;
  };

  WebOS.Apps.SmoothStreamingPlayer.prototype = {
    run: function() {
      var _ = this;
      this.win = new UI.Window({
        type: 'lite',
        bg: 0,
        resizable: 1,
        taskbar: 1,
        title: '凤凰直播 2014',
        width: 900,
        height: -1,
        content: _.contentJO,
        minWidth: 200,
        minHeight: 112,
        properties: { path: _.__path + '/' },
        onClose: function() {
          return true;
        }
      });

      this.win.show();
      this.rootPanel = Panels.p2(this.win, { direction: 'x', split: '140, *-140', area: this.contentJO.empty() });

      this.navJO = $('<div class="app-splayer-nav"></div>');
      this.videoJO = $('<div class="app-splayer-video"></div>');

      this.rootPanel.append(0, this.navJO);
      this.rootPanel.append(1, this.videoJO);

      this.navView();

    },
    navView: function() {
      var me = this;
      var sheets = [];
      for(var k in info) {
        sheets.push('<div class="app-splayer-item" data-channel="'+ k +'"><div class="app-splayer-item-icon '+ info[k].css +'"></div><span>'+ k +'</span></div>');
      }

      this.navJO.append(sheets.join(''));

      var items = this.navJO.find('.app-splayer-item');
      var selectJO = null;
      items.click(function() {
        var thisJO = $(this),
          channel = thisJO.attr('data-channel');

        selectJO && selectJO.removeClass('selected');
        thisJO.addClass('selected');
        selectJO = thisJO;
        me.renderVideo(channel);
      });

      items.eq(0).click();
    },
    renderVideo: function(channel) {
      var c = info[channel];
      this.videoJO.html(createPlayer(c.channel, c.uid, 780, 439));
    }
  };
})();
