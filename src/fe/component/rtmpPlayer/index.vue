<template>
  <div :class="$style.rtmpPlayer">
    <object v-if="cfg" width="100%" height="100%" :id="id" data="/flowplayer/flowplayer-3.2.7.swf" type="application/x-shockwave-flash">
    <param name="movie" value="/flowplayer/flowplayer-3.2.7.swf" />
    <param name="allowfullscreen" value="true" />
    <param name="wmode" value="opaque" />
    <param name="allowscriptaccess" value="always" />
    <param name="flashvars" :value="cfg"/>
    </object>
  </div>
</template>

<script>
  export default {
    name: "rtmpPlayer",
    props: {
      channel: String
    },
    data() {
      return {
        id: '',
        cfg: '',
        info: {
          '凤凰卫视中文台SD': { channel: '270DE943-3CDF-45E1-8445-9403F93E80C4', uid: '270DE943-3CDF-45E1-8445-9403F93E80C4', stream: 'pcc.stream_360p' },
          '凤凰卫视资讯台SD': { channel: '4AC51C17-9FBE-47F2-8EE0-8285A66EAFF5', uid: '4AC51C17-9FBE-47F2-8EE0-8285A66EAFF5', stream: 'pic.stream_360p' },
          '凤凰卫视中文台HD': { channel: '370DE943-3CDF-45E1-8445-9403F93E80C4', uid: '270DE943-3CDF-45E1-8445-9403F93E80C4', stream: 'pcc.stream_720p' },
          '凤凰卫视资讯台HD': { channel: '47C51C17-9FBE-47F2-8EE0-8285A66EAFF5', uid: '4AC51C17-9FBE-47F2-8EE0-8285A66EAFF5', stream: 'pcc.stream_720p' },
        },
        rtmp:'rtmp://hkss3.phoenixtv.com/live/mp4:',
        PLUGINS: {
          audio: {
            url: '/flowplayer/flowplayer.audio-3.2.2.swf'
          },
          rtmp: {
            url: '/flowplayer/flowplayer.rtmp-3.2.3.swf'
            //netConnectionUrl: 'rtmp://hkss1.phoenixtv.com/vod'
          },
          controls: {
            backgroundColor: '#000000',
            backgroundGradient: 'none'
          },
          captions: {
            url: '/flowplayer/flowplayer.captions-3.2.3.swf',
            captionTarget: 'content',
            button: null
          },
          content: {
            url: "/flowplayer/flowplayer.content-3.2.0.swf",
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
          backgroundColor: "#333333"
        },
      }
    },
    created() {
      const channelInfo = this.info[this.channel];
      if(!channelInfo) {
        return false;
      }

      this.cfg = this.getCfg(this.rtmp + channelInfo.stream);
    },
    methods: {
      getCfg(clip, cfg) {
        if (typeof clip === 'string') {
          const t = Object.assign({}, this.CLIP);
          t.url = clip;
          clip = t;
        } else if (!clip['url']) {
          return '';
        }

        if (!cfg) {
          cfg = { clip: clip, plugins: this.PLUGINS, canvas: this.CANVAS };
        }

        cfg = encodeURIComponent(JSON.stringify(cfg));

        return 'config=' + cfg;
      }
    }
  }
</script>

<style module>
  .rtmpPlayer{ height: 100%; width: 100%; }
</style>
