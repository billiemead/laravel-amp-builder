<script type="text/javascript"> 
  var _sldua = _sldua || {};
  _sldua.cookie_prefix = '<?php echo config('visitortracker.cookie_prefix') ?>';
  _sldua.trackingUrl = '<?php echo config('app.url') ?>/external_track';
  _sldua.storageUrl = '<?php echo config('app.url') ?>/local_storage';
  (function() {
  var sts_script = document.createElement('script');
  sts_script.type = 'text/javascript';
  sts_script.src = 
    ('https:' == document.location.protocol ? 'https://' : 'http://') + '<?php echo config('app.url'); ?>/public/assets/js/analytic.js?v=<?php echo STS_VERSION ?>';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(sts_script, s);
  }) ();
</script>
