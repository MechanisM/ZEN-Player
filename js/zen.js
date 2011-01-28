

/*
 *
 * ZEN - HTML5-CSS3 Audio Player
 * Author: @simurai (simurai.com)
 *
 * Most of this code by: @maboa (happyworm.com)
 *
 */



$(document).ready(function(){    
		
  	var status = "stop";
	var dragging = false;
	var skip = 5;	// duration of record skipping
	
	
	// init
	
	var player = $("#zen .player");
		
	player.jPlayer({
			ready: function () {
      		$(this).jPlayer("setMedia", {
				mp3: "audio/song.mp3",
        		oga: "audio/song.ogg"
      		});
    	},
    	swfPath: "",
		supplied: "mp3, oga"         
  	});  

	
	// update, end
	
	player.bind($.jPlayer.event.timeupdate, function(event) { 
		var pc = event.jPlayer.status.currentPercentAbsolute;
		if (!dragging) { 
	    	displayProgress(pc);
		}
	});
	
	player.bind($.jPlayer.event.ended, function(event) {   
		$('#zen .circle').removeClass( "rotate" );
		$("#zen").removeClass( "play" );
		$('#zen .progress').css({rotate: '0deg'});
		status = "stop";
	});
	
	
	
	// play/pause
	
	$("#zen .button").bind('mousedown', function() {
		// not sure if this can be done in a simpler way.
		// when you click on the edge of the play button, but button scales down and doesn't drigger the click,
		// so mouseleave is added to still catch it.
		$(this).bind('mouseleave', function() {
			$(this).unbind('mouseleave');
			onClick();
		});
	});
	
	$("#zen .button").bind('mouseup', function() {
		$(this).unbind('mouseleave');
		onClick();
	});
	
	
	function onClick() {  		
                    
        if(status != "play") {
			status = "play";
			$("#zen").addClass( "play" );
			player.jPlayer("play");
		} else {
			$('#zen .circle').removeClass( "rotate" );
			$("#zen").removeClass( "play" );
			status = "pause";
			player.jPlayer("pause");
		}

		return false;
	};
	
	
	
	//mouseout, mouseup
	
	// draggin
	
	var clickControl = $('#zen .progress');
	
	function onMouseUp(event) {  		
        var pc = getArcPc(event);
		player.jPlayer("playHead", pc).jPlayer("play");
		$(document).unbind('mouseup', onMouseUp);
        dragging = false;
        
        $('#zen .circle').removeClass( "skip" ).addClass( "rotate" );
		$('#zen .button').css( "pointer-events", "auto" );

		return false;
	};

	clickControl.mousedown(function(event){
		if (event.preventDefault){
			event.preventDefault();
		}  

		$(document).bind('mouseup', onMouseUp);
		$('#zen .circle').removeClass( "rotate" ).addClass( "skip" );
		$('#zen .button').css( "pointer-events", "none" );
		

		return false;
	});  
	
	// Can't figure out how to pass event through to mousehold so I made it global  
	
	var moveEvent;
	
	clickControl.mousemove(function(event){
	   moveEvent = event;
	});
	
	
	
	var skipcount = 0;
	
	clickControl.mousehold(function(){  
		var pc = getArcPc(moveEvent);
		dragging = true;   
		
		if(skipcount > skip) {
			player.jPlayer("playHead", pc).jPlayer("play");  // This bit does the scrubbing
			skipcount = 0;
		} else {
			skipcount++;
		}
		displayProgress(pc);			
	});
	
		
	
	
	
	// functions
	
	function displayProgress(pc) {
		var degs = pc * 3.6+"deg"; 
		$('#zen .progress').css({rotate: degs}); 		
	}
	
	function getArcPc(event) { 
		var	self	= $('#zen'),
			offset	= self.offset(),
			x	= event.pageX - offset.left - self.width()/2,
			y	= event.pageY - offset.top - self.height()/2,
			a	= Math.atan2(y,x);  
			
			if (a > -1*Math.PI && a < -0.5*Math.PI) {
		   a = 2*Math.PI+a; 
		} 

		// a is now value between -0.5PI and 1.5PI 
		// ready to be normalized and applied   			
		var pc = (a + Math.PI/2) / 2*Math.PI * 10;   
		   
		return pc;
	}
	
	
});
