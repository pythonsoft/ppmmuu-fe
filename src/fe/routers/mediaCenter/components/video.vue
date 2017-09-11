<template>
  <div id="video" class="flowplayer fp-slim" data-rtmp="rtmp://hkss4.phoenixtv.com/u">
    <video height="247" width="439" controls autoplay :src="url">
      <source type="video/flash" :src="url">
      <!--<source type="video/mp4" :src="url">-->
    </video>
  </div>
</template>
<script>
  export default {
    name: 'mediacenterVideo',
    props: {
      // mp4:/2017/08/18/PMHDSSNEWSTIMES86_02AC4A21-6246-4EF1-BD73-3F702E92DD17.mp4
      url: { type: String, default: '' }
    },
    watch: {
      url(v) {
      //        console.log('url -->', v);
      //        const script = document.createElement('script');
      //        script.src = '/static/flowplayer/flowplayer.js';
      //        document.body.appendChild(script);
      //        flowplayer('video', { src: "/static/flowplayer/flowplayer.swf", width: 439, height: 247 }, {
      //          clip: {
      //            url: v,
      //            provider: 'rtmp'
      //          },
      //          plugins: {
      //            rtmp: {
      //              url: "/static/flowplayer/flowplayer.rtmp-3.2.13.swf",
      //              netConnectionUrl: 'rtmp://hkss4.phoenixtv.com/u/'
      //            }
      //          },
      //          canvas: {
      //            background: '#000000',
      //            backgroundGradient: 'none'
      //          },
      //          onError: function(err) {
      //            console.log(err);
      //          }
      //        });
      }
    },
    data() {
      return {};
    },
    methods: {

    },
    created() {
    }
  };
</script>
