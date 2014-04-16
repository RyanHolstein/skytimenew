/*
 * @author Sonaryr <webmaster@sonaryr.be>
 * @copyright Copyright (c) 2012, Sonaryr
 * @version 1.1
 */
(function( $ ){
    var methods = {
        init : function( options ) {
            return this.each(function(){
                var $this = $(this),
                data = $this.data('airportify');
                $.fn.airportify.settings = $.extend({},$.fn.airportify.defaults,options);
                if(!data){
                    $this.data('airportify', {
                        target : $this,
                        originalContent : $.trim($this.html()),
                        gridDrawn:false
                    });
                }else
                    data.originalContent = $.trim($this.html());
                //only draw grid if autoResize is false
                if(!$.fn.airportify.settings.autoResize)
                    methods['drawGrid'].apply(this, arguments);
                
                //if autostart call flipText method with the content in this element    
                if($.fn.airportify.settings.autoStart)
                    methods['flipText'].apply(this,[$this.data('airportify').originalContent]);
            });
        },
        //draws an empty grid according to the settings of rows and cols
        drawGrid : function( ) {
            var $this = $(this),
            data = $this.data('airportify');
            if(data){
                var tmp = '<div class="airportifyContainer" style="margin-left:7px;">';
                for(var row=0;row<$.fn.airportify.settings.rows;row++){
                    tmp+='<div id="airportifyRow'+row+'" class="airportifyRow">';
                    var imgcontainerupfront='';
                    var imgcontainerdownfront='';
                    for(var col=0;col<$.fn.airportify.settings.cols;col++){
                        imgcontainerupfront+='<img class="airportifyImg upr'+row+'c'+col+'" src="'+$.fn.airportify.settings.imgLocation+'empty_01.png" alt="empty"/>';
                        imgcontainerdownfront+='<img class="airportifyImg downr'+row+'c'+col+'" src="'+$.fn.airportify.settings.imgLocation+'empty_02.png" alt="empty"/>';
                    }
                    tmp+='<div class="airportifyBackPart">';
                    tmp+='<div class="airportifyUpperPart">'+imgcontainerupfront+'</div>';
                    tmp+='<div class="airportifyLowerPart">'+imgcontainerdownfront+'</div>';
                    tmp+='</div>';
                    tmp+='<div class="airportifyFrontPart">';
                    tmp+='<div class="airportifyUpperPart">'+imgcontainerupfront+'</div>';
                    tmp+='<div class="airportifyLowerPart">'+imgcontainerdownfront+'</div>';
                    tmp+='</div>';
                    tmp+='</div>';
                }
                tmp += '</div>';
                    
                $(this).html(tmp);
                data.gridDrawn=true;
            } 
        },
        flipText : function(string) {    
            var $this = $(this),
            data = $this.data('airportify');
            
            if(data){
                if(typeof string == 'undefined' || string.length==0)
                    string = data.originalContent;
                var rows = [string];
                if($.fn.airportify.settings.seperator!='')
                    rows = string.split($.fn.airportify.settings.seperator);
                //redraw grid if required
                
                if($.fn.airportify.settings.autoResize || !data.gridDrawn){
                    resetGrid($this,rows);
                }
                for(var i=0;i<rows.length;i++)
                    testChar(addCorrectSpaces(rows[i]), 0, 0, i, 0);
            }
            //function to redraw the grid according to the given text rows
            function resetGrid(thisReference,rows){
                var maxLength=0;
                for(var i=0;i<rows.length;i++){
                    if(rows[i].length>maxLength)
                        maxLength = rows[i].length;
                }

                $.fn.airportify.settings.rows=rows.length;
                $.fn.airportify.settings.cols=maxLength;
                
                methods['drawGrid'].apply(thisReference, arguments);
            }
            //the magic function
            function testChar(stringToMatch,charIdToMatch,charSequenceId,locationRow,locationCol){
                if(charIdToMatch<stringToMatch.length){
                    if(locationCol>=$.fn.airportify.settings.cols){
                        locationCol=0;
                        locationRow++;
                    }
                    if(charSequenceId>$.fn.airportify.charsequence.length)
                        charSequenceId=0;
                    
                    var frontTop = $('.airportifyFrontPart .upr'+locationRow+'c'+locationCol);
                    
                    var frontBot = $('.airportifyFrontPart .downr'+locationRow+'c'+locationCol);
                    var backTop = $('.airportifyBackPart .upr'+locationRow+'c'+locationCol);
                    var backBot = $('.airportifyBackPart .downr'+locationRow+'c'+locationCol);
                    //if(frontTop.attr('alt')!=$.fn.airportify.charsequence[charSequenceId]){
                    //alert(frontTop.attr('alt'));
                    backTop.attr('alt', $.fn.airportify.charsequence[charSequenceId]);
                    backTop.attr('src',$.fn.airportify.settings.imgLocation+$.fn.airportify.charsequence[charSequenceId]+'_01.png');
                    frontBot.attr('alt',$.fn.airportify.charsequence[charSequenceId]);
                    frontBot.attr('src',$.fn.airportify.settings.imgLocation+$.fn.airportify.charsequence[charSequenceId]+'_02.png');
                    frontTop.animate({
                        height: 0
                    }, 
                    //make animation last half the the setting (other half is for bottom section
                    Math.round($.fn.airportify.settings.animationSpeed/2), 
                        //when animation is finished execute this function
                        function() {
                            frontBot.animate({
                                height: 13
                            }, 
                            //make animation last half the the setting (other half is for top section
                            Math.round($.fn.airportify.settings.animationSpeed/2), 
                                //when animation is finished execute this function
                                function() {
                                    frontTop.attr('alt', $.fn.airportify.charsequence[charSequenceId]);
                                    frontTop.attr('src',$.fn.airportify.settings.imgLocation+$.fn.airportify.charsequence[charSequenceId]+'_01.png');
                                    backBot.attr('alt',$.fn.airportify.charsequence[charSequenceId]);
                                    backBot.attr('src',$.fn.airportify.settings.imgLocation+$.fn.airportify.charsequence[charSequenceId]+'_02.png');
                                    frontBot.css('height', '0');
                                    frontTop.css('height', '13px');
                                    setTimeout(
                                        function(){
                                            //go to next character if the displayed char is equal to the char to display
                                            if((checkSpecialChars(stringToMatch[charIdToMatch],$.fn.airportify.charsequence[charSequenceId])|| stringToMatch[charIdToMatch].toUpperCase()==$.fn.airportify.charsequence[charSequenceId]) && charIdToMatch!=stringToMatch.length){
                                                testChar(stringToMatch, charIdToMatch+1, getCharSequenceId($('.airportifyFrontPart .upr'+locationRow+'c'+(locationCol+1)).attr('alt')), locationRow, locationCol+1);
                                            }
                                            //show the next character in the sequence if we are not on the last character of the string
                                            else if(charIdToMatch!=stringToMatch.length)
                                                testChar(stringToMatch, charIdToMatch, charSequenceId+1, locationRow, locationCol);
                
                                        },
                                        //wait set value before executing next run
                                        $.fn.airportify.settings.flickerSpeed);
                                });
                        });
                //}
                }
            }
			//'point','comma','double','dc','quest','excla','slash','bslash','plus','min','star','openh','closeh','lt','gt', 'apo','dapo','underscore'
			function checkSpecialChars(charToCheck, sequenceElementToMatch){
				var test = false;
				if(charToCheck.charCodeAt()==32 && sequenceElementToMatch=='empty')
					test=true;
				else if(charToCheck.charCodeAt()==33 && sequenceElementToMatch=='excla')
					test=true;
				else if(charToCheck.charCodeAt()==46 && sequenceElementToMatch=='point')
					test=true;
				else if(charToCheck.charCodeAt()==44 && sequenceElementToMatch=='comma')
					test=true;
				else if(charToCheck.charCodeAt()==58 && sequenceElementToMatch=='double')
					test=true;
				else if(charToCheck.charCodeAt()==59 && sequenceElementToMatch=='dc')
					test=true;
				else if(charToCheck.charCodeAt()==63 && sequenceElementToMatch=='quest')
					test=true;
				else if(charToCheck.charCodeAt()==47 && sequenceElementToMatch=='slash')
					test=true;
				else if(charToCheck.charCodeAt()==92 && sequenceElementToMatch=='bslash')
					test=true;
				else if(charToCheck.charCodeAt()==43 && sequenceElementToMatch=='plus')
					test=true;
				else if(charToCheck.charCodeAt()==45 && sequenceElementToMatch=='min')
					test=true;
				else if(charToCheck.charCodeAt()==42 && sequenceElementToMatch=='star')
					test=true;
				else if(charToCheck.charCodeAt()==40 && sequenceElementToMatch=='openh')
					test=true;
				else if(charToCheck.charCodeAt()==41 && sequenceElementToMatch=='closeh')
					test=true;
				else if(charToCheck.charCodeAt()==60 && sequenceElementToMatch=='lt')
					test=true;
				else if(charToCheck.charCodeAt()==62 && sequenceElementToMatch=='gt')
					test=true;
				else if(charToCheck.charCodeAt()==39 && sequenceElementToMatch=='apo')
					test=true;
				else if(charToCheck.charCodeAt()==34 && sequenceElementToMatch=='dapo')
					test=true;
				else if(charToCheck.charCodeAt()==95 && sequenceElementToMatch=='underscore')
					test=true;
				else if(charToCheck.charCodeAt()==61 && sequenceElementToMatch=='equals')
					test=true;
				return test;
			}
            //function to find the location of the given char in $.fn.airportify.charsequence
            function getCharSequenceId(charToFind){
                var id=0;
                if(typeof charToFind != 'undefined'){
                    id=$.inArray(charToFind.toUpperCase(),$.fn.airportify.charsequence);
                    if (id<0) id=0;
                }
                return id;
            }
            //function that adds spaces in front and after the given text depending on $.fn.airportify.settings.align 
            function addCorrectSpaces(text){
                text = replaceUnknownChars(text);
                var spaces = $.fn.airportify.settings.cols-text.length;
                if(spaces>0){
                    var spacesInFront='';
                    var spacesInBack=''; 
                    if($.fn.airportify.settings.align == 'left'){
                        for(var i=0;i<spaces;i++){
                            spacesInBack+=" ";
                        }
                    }else if($.fn.airportify.settings.align == 'right'){
                        for(var i=0;i<spaces;i++){
                            spacesInFront+=" ";
                        }
                    } else if($.fn.airportify.settings.align == 'center'){
                        for(var i=0;i<spaces;i++){
                            if(i%2!=0)
                                spacesInBack+=" ";
                            else
                                spacesInFront+=" ";
                        }
                    }
                    text = spacesInFront + text + spacesInBack;
                }
                return text;
            }
            //function that replaces all characters that are not in $.fn.airportify.charsequence with spaces
            function replaceUnknownChars(text){
				//replace < and > if they are in html format
				text = text.replace('&gt;','>').replace('&lt;','<');
                var newText='';
                for(var i=0;i<text.length;i++){
                    if($.inArray(text[i].toUpperCase(),$.fn.airportify.charsequence)<0 && $.inArray(text[i].charCodeAt(),$.fn.airportify.specialCharCode)<0)
                        newText+=" ";
                    else
                        newText+=text[i];
                }
                return newText;
            }
        },
        editOptions: function(options){
            $.fn.airportify.settings = $.extend({},$.fn.airportify.settings,options);
        }
    };

    $.fn.airportify = function( method ) {
    
        // Method calling logic
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.airportify' );
        }    
  
    };
    $.fn.airportify.defaults = {
        cols:20,
        rows:1,
        align:'left',
        seperator: '<br>',
        imgLocation: 'assets/img/',
        autoStart:false,
        autoResize:false,
        animationSpeed: 40,
        flickerSpeed:5
    };
    $.fn.airportify.settings={};
	$.fn.airportify.specialCharCode=[32,33,46,44,58,59,63,47,92,43,45,42,40,41,60,62,39,34,95,61];
    $.fn.airportify.charsequence=['empty','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9','point','comma','double','dc','quest','excla','slash','bslash','plus','min','star','equals','openh','closeh','lt','gt', 'apo','dapo','underscore'];

})( jQuery );