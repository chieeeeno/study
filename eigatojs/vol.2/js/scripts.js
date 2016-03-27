;(function(){
  var winW = 0;
  var isAnimated = false;
  $(function(){
    winW = $(window).innerWidth();
  })
  
  
  
  $(window).on('load',function(){
    console.log('load');
    $('#et').velocity({
        translateX: '+='+ (winW+100) +'px'
    }, {
        // Option
        duration: 8000, // アニメーション時間
        easing: 'ease-in-out', // イージング : linear, swing, ease, ease-in, ease-out, ease-in-out, [200, 15]
        begin: function(){console.log('start');}, // or null
        progress: function(elements, complete, remaining, start, tweenValue) {
          if(complete > 0.5){
            if(!isAnimated){
              $('#logoBlock').addClass('fadeIn');
              isAnimated = true;
            }
          }
          
    },
        complete: function(){console.log('end');}, // or null
        loop: false, // 繰り返し : or false
        delay: 0, // 開始、ループ時に遅延させる Ex.1000
        display: 'none' // 表示・非表示 : false, 'none', 'block'
    });
  });
})();