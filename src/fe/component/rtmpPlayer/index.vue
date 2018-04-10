<template>
  <div :class="$style.rtmpPlayer">

  </div>
</template>

<script>
  const mediaService = {
    PLUGINS: {
      audio: {
        url: '/flowplayer/flowplayer.audio-3.2.2.swf'
      },
      rtmp: {
        url: '/Content/flowplayer/flowplayer.rtmp-3.2.3.swf'
        //netConnectionUrl: 'rtmp://hkss1.phoenixtv.com/vod'
      },
      controls: {
        backgroundColor: '#000000',
        backgroundGradient: 'none'
      },
      captions: {
        url: '/Content/flowplayer/flowplayer.captions-3.2.3.swf',
        captionTarget: 'content',
        button: null
      },
      content: {
        url: "/Content/flowplayer/flowplayer.content-3.2.0.swf",
        bottom: 25,
        height:40,
        backgroundColor: 'transparent',
        backgroundGradient: 'none',
        border: 0,
        textDecoration: 'outline',
        style: {
          body: {
            fontSize: 14,
            fontFamily: 'Arial',
            textAlign: 'center',
            color: '#ffffff'
          }
        }
      }
    },
    CLIP: {
      scaling: 'fit',
      seekableOnBegin: true,
      autoPlay: true,
      image: '/Images/mediaplayer.png'
    },
    CONFIGURATION: {
      plugins: this.PLUGINS,
      clip: this.CLIP
    },
    CANVAS: {
      //backgroundColor: "#112233"
      backgroundColor: "#333333"
    },
    init: function() {

    },
    getDefaultConfig: function() {
      return $.extend(true, {}, { plugins: this.PLUGINS, canvas: this.CANVAS });
    },
    create: function(id, clip, cfg) {
      if (typeof clip == 'string') {
        var t = $.extend(this.CLIP, {});
        t.url = clip;
        clip = t;
      } else if (!clip['url']) {
        return '';
      }
      if (!cfg) {
        cfg = { clip: clip, plugins: this.PLUGINS, canvas: this.CANVAS };
      }
      cfg = encodeURIComponent(JSON.stringify(cfg)), apiId = id + '_api';
      var embed = '<object width="100%" height="100%" id="' + apiId + '" data="/Content/flowplayer/flowplayer-3.2.7.swf" type="application/x-shockwave-flash">' +
        '<param name="movie" value="/Content/flowplayer/flowplayer-3.2.7.swf" />' +
        '<param name="allowfullscreen" value="true" />' +
        '<param name="wmode" value="opaque" />' +
        '<param name="allowscriptaccess" value="always" />' +
        '<param name="flashvars" value="config=' + cfg + ' "/>' +
        '</object>';
      return embed;
    }
  };


  const info ={
    '中文台SD': { channel: '270DE943-3CDF-45E1-8445-9403F93E80C4', uid: '270DE943-3CDF-45E1-8445-9403F93E80C4', stream: 'pcc.stream_360p' },
    '资讯台SD': { channel: '4AC51C17-9FBE-47F2-8EE0-8285A66EAFF5', uid: '4AC51C17-9FBE-47F2-8EE0-8285A66EAFF5', stream: 'pic.stream_360p' },
    '中文台HD': { channel: '370DE943-3CDF-45E1-8445-9403F93E80C4', uid: '270DE943-3CDF-45E1-8445-9403F93E80C4', stream: 'pcc.stream_720p' },
    '资讯台HD': { channel: '47C51C17-9FBE-47F2-8EE0-8285A66EAFF5', uid: '4AC51C17-9FBE-47F2-8EE0-8285A66EAFF5', stream: 'pcc.stream_720p' },
  };

  export default {
    name: "rtmpPlayer",
    data() {

    },
    created() {

    },
    methods: {

    }
  }
</script>

<style scoped>
  .rtmpPlayer{ height: 100%; width: 100%; }
</style>
