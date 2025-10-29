
  function rewriteAutocomplete(){
        $.fn.autocomplete = function (options) {
            //console.log("autocomplete", options);
            
            var defaults = {
                inputId:null,
                ajaxUrl:false,  
                onSelect: function(el){}, 
                data: {}
              };
    
      options = $.extend(defaults, options);
      var $input = $("#"+options.inputId);
    
      if (options.ajaxUrl !== false)
      {
        var $autocomplete = $('<ul class="autocomplete-content dropdown-content active"></ul>'),   
            $inputDiv = $input.closest('.input-field'),
            //timeout,
            runningRequest = false,
            request;
    
        if ($inputDiv.length) {
          $inputDiv.append($autocomplete); // Set ul in body
        } else {      
          $input.after($autocomplete);
        }
        /*
        var highlight = function(string, $el) {
          var img = $el.find('img');
          var href = $el.find('a').attr("href");
          var matchStart = $el.text().toLowerCase().indexOf("" + string.toLowerCase() + ""),
              matchEnd = matchStart + string.length - 1,
              beforeMatch = $el.text().slice(0, matchStart),
              matchText = $el.text().slice(matchStart, matchEnd + 1),
              afterMatch = $el.text().slice(matchEnd + 1);
          //$el.html("<a href='#'>" + beforeMatch + "<span class='highlight'>" + matchText + "</span>" + afterMatch + "</a>");
          $el.html("<span>" + beforeMatch + "<em class='highlight'>" + matchText + "</em>" + afterMatch + "</span>");
          if (img.length) {
            $el.prepend(img);
          }
        };
        */
        var highlight = function(string, $el) {
          var img = $el.find('img'); // salva eventuale immagine
          var href = $el.find('a').attr("href") || "#";

          // Estrai solo il testo da evidenziare
          var textNode = $el.clone()     // clona per non modificare l'originale
                          .find('img').remove().end() // rimuove img se c'è
                          .find('a').remove().end()   // rimuove link se c'è
                          .text().trim();

          var index = textNode.toLowerCase().indexOf(string.toLowerCase());
          if (index >= 0 && string.length > 0) {
            var beforeMatch = textNode.slice(0, index);
            var matchText = textNode.slice(index, index + string.length);
            var afterMatch = textNode.slice(index + string.length);

            // Ricostruisci il contenuto evidenziato
            var resultHtml = "<span>" + beforeMatch + "<em class='highlight'>" + matchText + "</em>" + afterMatch + "</span>";

            $el.html(resultHtml);
            
            // Reinserisci immagine e link se presenti
            if (img.length) {
              $el.prepend(img);
            }/*
            if (href) {
              $el.wrapInner("<a href='" + href + "'></a>");
            }*/
          }
        };

        $autocomplete.on('click', 'li', function () {
          $input.val($(this).text().trim());
          $autocomplete.empty();
          
          options.onSelect($(this));
         
        });
    
        $input.on('keyup', function (e) {
        console.log("jeyup");
          //if(timeout){ clearTimeout(timeout);}
          if( !runningRequest && $input.val().toLowerCase().length > 2){
          if(runningRequest) request.abort();      
    
          if (e.which === 13) {
            $autocomplete.find('li').first().click();
            return;
          }
    
          var val = encodeURIComponent($input.val().toLowerCase());
          $autocomplete.empty();
    
          //timeout = setTimeout(function() {
    
            runningRequest=true;
            $input.siblings(".progress").show();
            request = $.ajax({
              type: 'POST', // your request type
              url: options.ajaxUrl,
              data: "term=" + val,    
              dataType: "json",
              success: function (data) {
                if (!$.isEmptyObject(data)) {
                  // Check if the input isn't empty
                  if (val !== '' || 1) {
                      for(i=0; i< data.length; i++){
                          //console.log(data[i]);
                        var autocompleteOption = $('<li rel="'+data[i].id+'"></li>');
                        if( data[i].id != 0 && $input.attr("id") == 'mega_search')
                            autocompleteOption = $('<li rel="'+data[i].id+'" class="'+data[i].tipo+'"></li>');
                          
                          image_set = false;
                          
                          //faccio highilt qui
                          var span = $('<span>'+ data[i].label +'</span>');
                          //highlight(val, span);
                          
                        if(data[i].img != undefined) {
                            if(data[i].img != ""){
                                  autocompleteOption.append('<img src="'+ data[i].img +'" class="left circle">'+'<span>'+ data[i].label +'</span>');
                                  image_set = true;
                              }
                        } 
                        if( !image_set )
                          autocompleteOption.append('<span>'+ data[i].label +'</span>');
                        
                        
                        //'<a href="' + data[i].extra + '">'+span+'</a>'
                        if( data[i].id != 0 && ($input.attr("id") == 'search_anagrafiche_contratti' || $input.attr("id") == 'search_faq' || $input.attr("id") == 'mega_search'))
                            highlight(val, autocompleteOption);
                        
                        //autocompleteOption = '<a href="' + data[i].extra + '">' + autocompleteOption + '</a>';
                        $autocomplete.append(autocompleteOption);
                      }
                  }
                } 
                $input.siblings(".progress").hide();                
              },
              complete:function(){
                runningRequest = false;
                $input.siblings(".progress").hide();
              }        
            });
          //},250);
          }
          else if( !runningRequest && $input.val().toLowerCase().length == 0){
             $autocomplete.empty();
             hidden_name = $input.attr("name") + "_hidden"; 
             if( $("input[name="+hidden_name+"]").length > 0 )
                 $("input[name="+hidden_name+"]").val("");		
          }
        });
      } else {
        console.log("json");
        // Gestisci il caso in cui options.data è un oggetto JSON
        var data = options.data;
        var $autocomplete = $('<ul class="autocomplete-content dropdown-content active"></ul>'),
            $inputDiv = $input.closest('.input-field');

        if ($inputDiv.length) {
            $inputDiv.append($autocomplete); // Set ul in body
        } else {
            $input.after($autocomplete);
        }

        var highlight = function (string, $el) {
            var img = $el.find('img');
            var href = $el.find('a').attr("href");
            var matchStart = $el.text().toLowerCase().indexOf("" + string.toLowerCase() + ""),
                matchEnd = matchStart + string.length - 1,
                beforeMatch = $el.text().slice(0, matchStart),
                matchText = $el.text().slice(matchStart, matchEnd + 1),
                afterMatch = $el.text().slice(matchEnd + 1);
            $el.html("<span>" + beforeMatch + "<em class='highlight'>" + matchText + "</em>" + afterMatch + "</span>");
            if (img.length) {
                $el.prepend(img);
            }
        };

        $autocomplete.on('click', 'li', function () {
            $input.val($(this).text().trim());
            $autocomplete.empty();

            options.onSelect($(this));
        });

        $input.on('keyup', function (e) {
           //console.log("jeyup");
            var val = $input.val().toLowerCase();
            $autocomplete.empty();

            if (val.length > 2) {
                for (var key in data) {
                    if (data.hasOwnProperty(key) && key.toLowerCase().indexOf(val) !== -1) {
                        var autocompleteOption = $('<li></li>');
                        autocompleteOption.append('<span rel="'+data[key]+'">' + key + '</span>');
                        $autocomplete.append(autocompleteOption);
                    }
                }
            }
        });
    }
      };
    }//rewriteAutocomplete

    function initMaterializeCss(){
        $('select.material-select').formSelect();
        $(".modal").modal();
        $('.tooltipped').tooltip({html: true});
        $('table .tooltipped').live("hover", function(){
            $('.tooltipped').tooltip({html: true});
        });
        $('.widget .tooltipped').on("hover", function(){
            $('.widget .tooltipped').tooltip({html: true});
        });
    
        $('.materialboxed').materialbox();
        
        $('.sidenav').sidenav();

        $("select.mobile_prefix").change(function(){
            var fake_input = $(this).closest(".select-wrapper").find("input.select-dropdown");
            var prefix = fake_input.val().split(' ')[0];
            console.log("prefix", prefix);
            fake_input.val(prefix);
        });
        $("select.mobile_prefix").trigger("change");
    }

    
    function requireLabel(label){
	text = $(label).text();
	last_char = text.substr((text.length-1), 1);
	if( last_char != "*")
		text += "*";
	$(label).text(text);	
}

function notRequireLabel(label){
	text = $(label).text();
	last_char = text.substr((text.length-1), 1);
	if( last_char == "*")
		text = text.substr(0, (text.length-1));
	$(label).text(text);
}

function commaToDot(string){
	var stringy = string.toString().replace(/\,/g, '.');
	return stringy;	
}

function dotToComma(string){	
	var stringy = string.toString().replace(/\./g, ',');
	return stringy;
}
function removeDots(string){
	var stringy = string.toString().replace(/\./g, '');
	stringy = stringy.replace(/\-/g, '');
	stringy = stringy.replace(/\€/g, '');
	stringy = stringy.replace(/\%/g, '');
	return stringy;
}

function formatEuroValue(number) {
	// Convert number to string and round to 2 decimal places
	var formattedNumber = Number(number).toFixed(2);
  
	// Split the number into whole and decimal parts
	var parts = formattedNumber.split(".");
	var wholePart = parts[0];
	var decimalPart = parts[1];
  
	// Add dots as thousand separators to the whole part
	wholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
	// Concatenate the parts with the appropriate symbols
	var formattedValue = wholePart + "," + decimalPart + " €";
  
	return formattedValue;
  }

  function formatNumberValue(number) {
	// Convert number to string and round to 2 decimal places
	var formattedNumber = Number(number).toFixed(2);
  
	// Split the number into whole and decimal parts
	var parts = formattedNumber.split(".");
	var wholePart = parts[0];
	var decimalPart = parts[1];
  
	// Add dots as thousand separators to the whole part
	wholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
	// Concatenate the parts with the appropriate symbols
	var formattedValue = wholePart + "," + decimalPart;
  
	return formattedValue;
  }

  function dateFromItaToDb(date){
        str = date.split("/");
        return (str[2] + "-" + str[1] + "-" + str[0]);
    }

    function dateFromDbToIta(date){
        str = date.split("-");
        return (str[2]+'/'+str[1]+'/'+str[0]);
}

function jsonSyntaxHighlight(json) {
  if (typeof json !== "string") {
    json = JSON.stringify(json, null, 2);
  }
  json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return json.replace(/("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|\b\d+\.?\d*\b)/g, function (match) {
    let cls = "number"; // Default class
    if (/^"/.test(match)) {
      cls = /:$/.test(match) ? "key" : "string"; // Keys or strings
    } else if (/true|false/.test(match)) {
      cls = "boolean"; // Booleans
    } else if (/null/.test(match)) {
      cls = "null"; // Null values
    }
    return '<span class="' + cls + '">' + match + "</span>";
  });
}