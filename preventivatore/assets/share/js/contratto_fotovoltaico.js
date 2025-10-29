var player;

$(document).ready(function(){
	//initConnettivita(); 
    initAucocomplete();
	initPreventivatore();

    initContrattoSoggetto();
    initContrattoIva();
    //initSNC();
    initContrattoCopiaIndirizzo();
    initContrattoPotenzeLuce();
    initCopiaDatiPagamento();
    initContrattoDocuments();
    
    initStateOps();
    initKeyUps();
    
    initIvaEAcciseAgevolate();
    manageUploads();
    connectFormsSumbit();
    initEliminaGettoni();
    
    initFirmaDigitaleContratto();
    initLegenda();
	initFastAllegati();
	initFastCopy();

	initFuoriTaglia();
	initHideEmptyTables();
    if( $("#jumpto").length > 0 ){
    	if( $("#jumpto").val() == "offerte" ){
    		setTimeout(function(){
    			var tops = document.getElementById("deposit-anchor").offsetTop; //Getting Y of target element
    			window.scrollTo(0, tops-200);
    		}, 2000);
    		
    		
    	}
    }
    //initConsensi();
    $("#contratto_save_top").click(function(){
    	$("#contratto_fotovoltaico_form button[type=submit]").trigger("click");
    });
    
    if( $("input[name=cf]").siblings(".helper-text").length > 0 ){
    	M.toast({html: $($("input[name=cf]").siblings(".helper-text")[0]).text()});
    }

	if( $(".benefici-col").length > 0 ){
		var h = $(".benefici-col .kpi-1").first().outerHeight();
		$(".benefici-col .kpi-2").height(h*2 + 15);
	}

	
	/*	
		var wrapperOffsetTop = document.querySelector('.tofixtop').offsetTop;
		var wrapperOffsetBottom = document.querySelector('#contratto_fotovoltaico_form button[type=submit]').offsetTop - $('.tofixtop').height();
		console.log("wrapperOffsetBottom", wrapperOffsetBottom);
		window.addEventListener('scroll', function(){
			if( $(window).width() > 1024 && 0){
				//console.log("pageYOffset", window.pageYOffset);
				//console.log("wrapperOffsetTop", wrapperOffsetTop);

				if (window.pageYOffset >= wrapperOffsetTop ) {
					if( $(".benefici-col").attr("rel") == "" )
						$(".benefici-col").attr("rel", $(".benefici-col").width());

					$('.tofixtop').addClass('fixed');
					$('.tofixtop').width( $(".benefici-col").attr("rel"));

					wrapperOffsetBottom = document.querySelector('#contratto_fotovoltaico_form button[type=submit]').offsetTop - $('.tofixtop').height();
				} else {
					$('.tofixtop').removeClass('fixed');
				}
			}
		});
	*/

	//Tabs
	//$(".fv_tabs li a").removeClass("active");
	//$(".fv_tabs li a").first().addClass("active");
	setTimeout(function(){
		$('.fv_tabs ul li a').removeClass("active");
		console.log($("input[name=fk_stato_js").val());
		if( $("input[name=fk_stato_js").val() == 1 || $("input[name=fk_stato_js").val() == "" )
			$('.fv_tabs ul li').first().find("a").addClass("active");
		else if( $("input[name=fk_stato_js").val() == 2 && $("input[name=pod_second_part]").val() == "" )
			$('.fv_tabs ul li.tab.contrattuale').find("a").addClass("active");
		else if( $("input[name=fk_stato_js").val() == 2  )
			$('.fv_tabs ul li.tab.documenti-e-contratto').find("a").addClass("active");
		else
			$('.fv_tabs ul li.tab.documenti-e-contratto').find("a").addClass("active");
			//$('.fv_tabs ul li.tab.assistenza').first().find("a").addClass("active");
		$('.fv_tabs ul').tabs();
	}, 2000);
	
});//end ready


function initFuoriTaglia(){
	$("input[name=fuori_taglia]").change(function(){
		if( $(this).is(":checked") ){
			$("#fv_fuori_taglia_wrap").show();
		}
		else{
			$("#fv_fuori_taglia_wrap").hide();
		}
	});

	$("#genera_prodotti_fuori_taglia").click(function(){
		if( !confirm("Generare i prodotti dal preventivo fuori taglia?") )
			return false;
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "genera_prodotti_fuori_taglia");
		formData.append("e", "contratti_fotovoltaico");
		formData.append("id", $("#contratto_fotovoltaico_form input[name=id]").val());
		formData.append("prev_perc_commissioni", $("#contratto_fotovoltaico_form input[name=prev_perc_commissioni]").val());
		formData.append("prev_corrispettivo", $("#contratto_fotovoltaico_form input[name=prev_corrispettivo]").val());
		if( $("#contratto_fotovoltaico_form input[name=prev_riservato]").length > 0 )
			formData.append("prev_riservato", $("#contratto_fotovoltaico_form input[name=prev_riservato]").is(":checked") ? 1 : 0);
		else
			formData.append("prev_riservato", 0);

		$.ajax({
			type: "POST",
			data: formData,
			dataType: 'json',
			contentType: false,
			processData: false,
			url: ajax_url + "/fc-ajax.php?",
			//async: false,
			success: function (json) {
				if (json.error == 0) {
					fcalert(json.msg, "Operazione completata");
					$("#overlay").hide();
				}
				else {
					$("#overlay").hide();
					//$("#checkout_acquista").show();
					$("#modal1 h1").text("Attenzione");
					$("#modal1 .modal-content .modal-msg").html(json.msg);
					$("#modal1").modal("open");
				}
			}
		});

		return false;
	});
}

function initPreventivatore(){
	if( $("input[name=fk_stato_js]").val() == 1 ){
		$("input[name=prev_f1],input[name=prev_f2],input[name=prev_f3],input[name=prev_superficie],select[name=prev_esposizione],select[name=prev_costo_kwh]").change(function(){
			refreshPreventivo();
		});
		$("input[name=prev_piano_induzione],input[name=prev_pompa_di_calore],input[name=prev_condizionatori],input[name=prev_wallbox],select[name=fk_prodotto_fotovoltaico],select[name=fk_wallbox]").change(function(){
			refreshPreventivo();
		});
		$("input[name=comune_installazione_hidden").change(function(){
			refreshPreventivo();
		});
		/*
		$("input[name=fuori_taglia],textarea[name=fuori_taglia_descrizione]").change(function(){
			refreshPreventivo();
		});
		*/
	}

	$("#fk_listino_fotovoltaico").change(function(){
		$("#overlay").show();
			var formData = new FormData();
			formData.append("op", "get_tabelle_listino");
			formData.append("e", "contratti_fotovoltaico");
			formData.append("listino", $("#fk_listino_fotovoltaico").val());
			formData.append("fk_prodotto_fotovoltaico", $("#fk_prodotto_fotovoltaico").val());
			
			$.ajax({
				type: "POST",
					data: formData,
					dataType : 'json',			
		   	        contentType: false,
		        	processData: false, 
					url: ajax_url + "/fc-ajax.php?",
					//async: false,
					success: function(json){
						 if( json.error == 0 ){
							$("#fk_prodotto_fotovoltaico").empty();
							$(json.data.prodotti).each(function (index, element) {
								$("#fk_prodotto_fotovoltaico").append("<option value='"+element.id+"'>"+element.name+"</option>")
								$("#fk_prodotto_fotovoltaico option").first().attr("selected", "selected");
								$("#fk_prodotto_fotovoltaico").formSelect();
							});
							$("#fk_wallbox").empty();
							$(json.data.wallbox).each(function (index, element) {
								$("#fk_wallbox").append("<option value='"+element.id+"'>"+element.name+"</option>")
								$("#fk_wallbox option").first().attr("selected", "selected");
								$("#fk_wallbox").formSelect();
							});

							$(".prev_caratteristiche_fv").html("");
							$(".prev_caratteristiche_batteria").html("");
						 	$("#overlay").hide();		 	
						 }
						 else{
						 	$("#overlay").hide();
						 	//$("#checkout_acquista").show();
						 	$("#modal1 h1").text("Attenzione");
						 	$("#modal1 .modal-content .modal-msg").html(json.msg);
						 	$("#modal1").modal("open");
						 }
					}
				});
				
				return false;
	});
}

function refreshPreventivo(){
	$(".benefici-col,.scelta-prodotto").addClass("blur");
	if( $("input[name=comune_installazione_hidden]").val() != "" && $("input[name=prev_f1]").val() != "" && $("input[name=prev_f2]").val() != "" && $("input[name=prev_f3]").val() != "" && $("input[name=prev_superficie]").val() != "" && $("select[name=prev_esposizione]").val() != "" && $("select[name=prev_costo_kwh]").val() != "" ){
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "get_preventivo");
		
        //Serializing all For Input Values (not files!) in an Array Collection so that we can iterate this collection later.
		var params = $("#contratto_fotovoltaico_form").serializeArray();
        
		//Now Looping the parameters for all form input fields and assigning them as Name Value pairs. 
        $(params).each(function (index, element) {
			if( element.name != "op" )
        		formData.append(element.name, element.value);
		});
			
		$.ajax({
			type: "POST",
				data: formData,
				dataType : 'json',			
	   	        contentType: false,
	        	processData: false, 
				url: ajax_url + "/fc-ajax.php?",
				//async: false,
				success: function(json){
					 if( json.error == 0 ){
						$("#preventivo_errori ul").hide();
						
						$("#prev_totale_consumi").text(json.data["prev_totale_consumi"] + " Kwh");

						$("input[name=prev_con_impl_f1]").val(json.data["prev_con_impl_f1"]);
						$("input[name=prev_con_impl_f2]").val(json.data["prev_con_impl_f2"]);
						$("input[name=prev_con_impl_f3]").val(json.data["prev_con_impl_f3"]);
						$("span.prev_totale_consumi_con_impl").html( json.data["prev_totale_consumi_con_impl"] + " kwh");
						
						$("input[name=kwp_fv_necessari]").val(json.data["kwp_fv_necessari"]);
						$("input[name=kwp_fv_massimale]").val(json.data["kwp_fv_massimale"]);
						$("input[name=fv_taglia_min]").val(json.data["fv_taglia_min"]);
						$("input[name=batteria_taglia_min]").val(json.data["batteria_taglia_min"]);

						$("select[name=fk_prodotto_fotovoltaico]").val(json.data["fk_prodotto_fotovoltaico"]).formSelect();

						$(".prev_caratteristiche_fv ul").html(json.msg.specifiche["prev_caratteristiche_fv"]);
						$(".prev_caratteristiche_batteria ul").html(json.msg.specifiche["prev_caratteristiche_batteria"]);

						if( json.msg.warning != "" ){
							$("#warning_taglia").html(json.msg.warning);
							$("#warning_taglia").show();
						}
						else
							$("#warning_taglia").hide();	
							
						$("#prev_totale").html(formatEuroValue(json.data["prev_totale"]));
						$("#prev_detrazione_fiscale").html(formatEuroValue(json.data["detrazione_azienda"]));
						$("#prev_detrazione").html(formatEuroValue(json.data["prev_detrazione"]));
						$("#prev_netto").html(formatEuroValue(json.data["prev_netto"]));

						$("#prev_roi").html(json.data["prev_roi"]);

						$("#prev_risparmio_annuo_1_10").html(formatEuroValue(json.data["prev_risparmio_annuo_1_10"]));
						$("#prev_risparmio_totale_11_30").html(formatEuroValue(json.data["prev_risparmio_totale_11_30"]));
						$("#prev_risparmio_annuo_11_30").html(formatEuroValue(json.data["prev_risparmio_annuo_11_30"]));
						$("#prev_risparmio_totale_1_10").html(formatEuroValue(json.data["prev_risparmio_totale_1_10"]));

						$("#prev_totale_risparmio").html(formatEuroValue(json.data["prev_totale_risparmio"]));

						$("#prev_totale").html(formatEuroValue(json.data["prev_totale"]));

						$(".prev_caratteristiche_fv").html(json["msg"]["specifiche"]["prev_caratteristiche_fv"]);
						$(".prev_caratteristiche_batteria").html(json["msg"]["specifiche"]["prev_caratteristiche_batteria"]);
						
					 	M.toast({html: json.msg.msg});		
					 	$("#overlay").hide();
						$(".benefici-col,.scelta-prodotto").removeClass("blur");		 	
					 }
					 else{
					 	$("#overlay").hide();
						fcalert(json.msg);
						$("#preventivo_errori ul").html(json.msg).show();
					 	//$("#modal1 h1").text("Attenzione");
					 	//$("#modal1 .modal-content .modal-msg").html(json.msg);
					 	//$("#modal1").modal("open");
					 }
				}
		});
	} 
	else{
		M.toast({html: "Compilare tutti i campi per aggiornare il preventivo"});		
	}
}

function initFastCopy(){
	$("#contratto_fast_summary input[type=text").on("keyup", function(){
		var fast_name = $(this).attr("name");
		var name = fast_name.replace("fast_", "");
		console.log(fast_name + " " + $(this).attr("type") + " change ", $(this).val());
		if( $(this).attr("type") == "checkbox" ){
			if( $(this).is(":checked") )
				$("input[name="+name+"]").prop("checked", true);
			else
				$("input[name="+name+"]").prop("checked", false);
		}
		else if( $(this).attr("type") == "radio" ){
			var radio_val =  $(this).val();
			console.log("radio " + name + " value " + radio_val);
			$("input[name="+name+"][value="+radio_val+"]").trigger("click");
			console.log("input[name="+name+"][value="+radio_val+"] triggered click");
		}
		else{			
			$("input[name="+name+"]").val($(this).val());
			console.log(name + " updated ", $(this).val())
		}
		
	});
	$("#contratto_fast_summary input").on("change", function(){
		var fast_name = $(this).attr("name");
		var name = fast_name.replace("fast_", "");
		console.log(fast_name + " change ", $(this).val());
		if( $(this).attr("type") == "checkbox" ){
			if( $(this).is(":checked") ){
				if( !$("input[name="+name+"]").is(":checked") )
					$("input[name="+name+"]").trigger("click");
				$("input[name="+name+"]").prop("checked", true);
			}
			else{
				if( $("input[name="+name+"]").is(":checked") )
					$("input[name="+name+"]").trigger("click");
				$("input[name="+name+"]").prop("checked", false);
			}
		}
		else if( $(this).attr("type") == "radio" ){
			var radio_val =  $(this).val();
			console.log("radio " + name + " value " + radio_val);
			$("input[name="+name+"][value="+radio_val+"]").trigger("click");
			console.log("input[name="+name+"][value="+radio_val+"] triggered click");
		}
		else{			
			$("input[name="+name+"]").val($(this).val());
			console.log(name + " updated ", $(this).val())
		}
		
	});
	$("#contratto_fast_summary select").on("change", function(){
		var fast_name = $(this).attr("name");
		var name = fast_name.replace("fast_", "");
		$("select[name="+name+"]").val($(this).val()).formSelect();;
	});
}

function initHideEmptyTables(){
	setTimeout(function(){
	if($("#wallet_table td.dataTables_empty").length == 1 )
		$("#wallet_table").closest("section").hide();
	if($("#wallet_el_table td.dataTables_empty").length == 1 )
		$("#wallet_el_table").closest("section").hide();
	if($("#fatture_table td.dataTables_empty").length == 1 )
		$("#fatture_table").closest("section").hide();	
	}, 2000);
}

function initFastAllegati(){
	$(".fast-allegato a").click(function(){
		window.open(home_url +$(this).attr("href"), '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes')
		/*
		$("#modal_fast_check h4").text("");
		$("#modal_fast_check .modal-content .modal-msg").html('<iframe src="' +home_url +$(this).attr("href")+'" width="100%"  height="'+Math.round($(window).height()*0.8)+'px"></iframe>');
		$("#modal_fast_check").modal("open");
		$(".modal-overlay").hide();
		*/
		//fcalert('<iframe src="' +home_url +$(this).attr("href")+'" width="100%"  height="300px"></iframe>');
		return false;
	});
}

function initLegenda(){
	$("#stati-section span").click(function(){
		trs = $(".contratti-table thead tr");
		if( trs.length > 1 ){
			tr_second = trs[1];
			ths = $(tr_second).find("th");
			if( ths.length > 7 )
				if( $(ths[7]).find("input").length > 0 ){
					$(ths[7]).find("input").val($(this).text());
					$(ths[7]).find("input").trigger("change");
				}
		}
	});
}

function initDeposito(){
	$("#modalita_versamento_deposito").change(function(){
		if( $(this).val() == 4){//bonifico
			$("#deposito_bonifico_info").show();
			$("#versamento_carta_wrap,#payway_deposito_msg").hide();
			$("#versamento_wallet_wrap").hide();
		}
		else if( $(this).val() == 2){//wallet
			$("#deposito_bonifico_info").hide();
			$("#versamento_carta_wrap,#payway_deposito_msg").hide();
			$("#versamento_wallet_wrap").show();
		}
		else if( $(this).val() == 10){//carta payway
			$("#deposito_bonifico_info").hide();
			$("#versamento_wallet_wrap").hide();
			$("#versamento_carta_wrap,#payway_deposito_msg").show();
		}
	});
	
	$("#deposito_invia_istruzioni").click(function(){
		if( 1){
			//$(this).hide();
			$("#overlay").show();
			var formData = new FormData();
			formData.append("op", "invia_istruzioni_deposito");
			formData.append("e", $("#contratto_fotovoltaico_form input[name=e]").val());
			formData.append("cid", $("#contratto_fotovoltaico_form input[name=id]").val());
			
			$.ajax({
				type: "POST",
					data: formData,
					dataType : 'json',			
		   	        contentType: false,
		        	processData: false, 
					url: ajax_url + "/fc-ajax.php?",
					//async: false,
					success: function(json){
						 if( json.error == 0 ){
						 	M.toast({html: json.msg});		
						 	$("#overlay").hide();		 	
						 }
						 else{
						 	$("#overlay").hide();
						 	//$("#checkout_acquista").show();
						 	$("#modal1 h1").text("Attenzione");
						 	$("#modal1 .modal-content .modal-msg").html(json.msg);
						 	$("#modal1").modal("open");
						 }
					}
				});
				
				return false;
		}
	});
	
	$("input[name=deposito_scelta]").change(function(){
		
		if( $(this).val() == "con_deposito" ){
			//$("#paga_deposito").show();
			$("input[name=offerta_id]").val($("input[name=cte_con_deposito_id]").val());
			$("input[name=offerta_codice]").val($("input[name=cte_con_deposito_codice]").val());
			$("input[name=offerta_nome]").val($("input[name=cte_con_deposito_nome]").val());
			$("h3.title_cte").text("Condizioni Tecnico Economiche Offerta " + $("input[name=cte_con_deposito_nome]").val());
			$("a.url_cte").attr("href", $("input[name=cte_con_deposito_url]").val());
			$("iframe.cte").attr("src", $("input[name=cte_con_deposito_url]").val());
			$("#finalizza_contratto").show();
			$(".deposito-force-scelta-msg").hide();
			
			/*
			if( $("#in_rinnovo").length > 0 )
				$(".deposito-section").show();
				*/
		}	
		else{
			//$("#paga_deposito").hide();
			$("input[name=offerta_id]").val($("input[name=cte_senza_deposito_id]").val());
			$("input[name=offerta_codice]").val($("input[name=cte_senza_deposito_codice]").val());
			$("input[name=offerta_nome]").val($("input[name=cte_senza_deposito_nome]").val());
			$("h3.title_cte").text("Condizioni Tecnico Economiche Offerta " + $("input[name=cte_senza_deposito_nome]").val());
			$("a.url_cte").attr("href", $("input[name=cte_senza_deposito_url]").val());
			$("iframe.cte").attr("src", $("input[name=cte_senza_deposito_url]").val());
			$("#finalizza_contratto").show();
			$(".deposito-force-scelta-msg").hide();
			/*
			if( $("#in_rinnovo").length > 0 )
				$(".deposito-section").hide();*/
		}
	});
	
	$("#add-versamento-deposito").click(function(){
		
		$("#add-versamento-deposito").hide();
		$("#overlay").show();
		
		//Serializing all For Input Values (not files!) in an Array Collection so that we can iterate this collection later.
		var params = $(this).serializeArray();
		//Declaring new Form Data Instance  
        var formData = new FormData();
        formData.append("deposito_importo", $("input[name=deposito_importo]").val());
        formData.append("deposito_nota", $("input[name=deposito_nota]").val());
        formData.append("op", "registra_deposito");
        formData.append("e", $("#contratto_fotovoltaico_form input[name=e]").val());
        formData.append("id", $("#contratto_fotovoltaico_form input[name=id]").val());
        formData.append("modalita", 4);
        
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url + "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	M.toast({html: json.msg});
				 	setTimeout(function(){
				 		location.reload();
				 	}, 3000);
				 	
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#add-versamento-deposito").show();
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});
	
	$("#add-versamento-deposito-wallet").click(function(){
		
		$("#add-versamento-deposito-wallet").hide();
		$("#overlay").show();
		
		//Serializing all For Input Values (not files!) in an Array Collection so that we can iterate this collection later.
		var params = $(this).serializeArray();
		//Declaring new Form Data Instance  
        var formData = new FormData();
        formData.append("deposito_importo", $("input[name=deposito_importo_wallet]").val());
        //formData.append("deposito_nota", $("input[name=deposito_nota]").val());
        formData.append("op", "registra_deposito");
        formData.append("e", $("#contratto_fotovoltaico_form input[name=e]").val());
        formData.append("id", $("#contratto_fotovoltaico_form input[name=id]").val());
        formData.append("modalita", 2);
        
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url + "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	M.toast({html: json.msg});
				 	setTimeout(function(){
				 		location.reload();
				 	}, 3000);
				 	
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#add-versamento-deposito-wallet").show();
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});
	
	$("#add-versamento-deposito-carta").click(function(){
		
		$("#add-versamento-deposito-carta").hide();
		$("#overlay").show();
		
		//Serializing all For Input Values (not files!) in an Array Collection so that we can iterate this collection later.
		var params = $(this).serializeArray();
		//Declaring new Form Data Instance  
        var formData = new FormData();
        formData.append("deposito_importo", $("input[name=deposito_importo_wallet]").val());
        //formData.append("deposito_nota", $("input[name=deposito_nota]").val());
        formData.append("op", "registra_deposito");
        formData.append("e", $("#contratto_fotovoltaico_form input[name=e]").val());
        formData.append("id", $("#contratto_fotovoltaico_form input[name=id]").val());
        formData.append("modalita", 10);
        
        
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url + "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	console.log(json.data);
					window.location = json.data;
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#add-versamento-deposito-carta").show();
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});
	
	$("#save_scelta_rinnovo").click(function(){
		
		$("#save_scelta_rinnovo").hide();
		$("#overlay").show();
		
		//Serializing all For Input Values (not files!) in an Array Collection so that we can iterate this collection later.
		var params = $(this).serializeArray();
		//Declaring new Form Data Instance  
        var formData = new FormData();
        formData.append("op", "scelta_rinnovo");
        formData.append("e", $("#contratto_fotovoltaico_form input[name=e]").val());
        formData.append("id", $("#contratto_fotovoltaico_form input[name=id]").val());
        formData.append("deposito_scelta", $("input[name=deposito_scelta]:checked").val());        
        
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url + "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	$("#overlay").hide();
				 	fcalert(json.msg);
				 	if( $("input[name=deposito_scelta]:checked").val() == "con_deposito" ){
				 		$(".deposito-section").show();
				 		var tops = document.getElementById("versamento_deposito_anchor").offsetTop; //Getting Y of target element
    					window.scrollTo(0, tops-140);
				 	}				 	
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#save_scelta_rinnovo").show();
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});
	
}

function initConsensi(){
	$("input[name=email]").keyup(function(){
		if( $("#consenso_marketing_union_email, #consenso_marketing_gruppo_email").length > 0 )
			$("#consenso_marketing_union_email, #consenso_marketing_gruppo_email").text($(this).val());
	});	
	$("input[name=cellulare]").keyup(function(){
		if( $("#consenso_marketing_union_cell, #consenso_marketing_gruppo_cell").length > 0 )
			$("#consenso_marketing_union_cell, #consenso_marketing_gruppo_cell").text($(this).val());
	});	
}

function initFirmaDigitaleContratto(){
	$("#firma-otp-button").click(function(){
		if( confirm("Procedere con la firma digitale?") ){
			$(this).hide();
			$("#overlay").show();
			var formData = new FormData();
			formData.append("op", "firma_otp");
			formData.append("e", $(this).attr("rel"));
			formData.append("id", $("input[name=id]").val());
			/*if( $("input[name=deposito_scelta]").length > 0 )
				formData.append("deposito_scelta", $("input[name=deposito_scelta]:checked").val());
			formData.append("offerta_id", $("input[name=offerta_id]").val());
			formData.append("type", $(this).attr("rel"));*/
			console.log(formData);
			$.ajax({
				type: "POST",
				data: formData,
				dataType : 'json',			
	   	        contentType: false,
	        	processData: false, 
				url: ajax_url +  "/fc-ajax.php?",
				//async: false,
				success: function(json){
					 if( json.error == 0 ){
					 	M.toast({html: json.msg});
					 	setTimeout(function(){
					 		location.reload();
					 	}, 2000);	
					 }
					 else{
					 	$("#overlay").hide();
					 	$("#modal1 h1").text("Attenzione");
					 	$("#modal1 .modal-content .modal-msg").html(json.msg);
					 	$("#modal1").modal("open");
					 }
				}
			});
			
			return false;
		}	
	});
}

function initEliminaGettoni(){
	$("#elimina-gettoni-contratto").click(function(){
		if( confirm("Eliminare tutti i gettoni del contratto?") ){
			$(this).hide();
			$("#overlay").show();
			var formData = new FormData();
			formData.append("op", "elimina_gettoni");
			formData.append("e", "contratti");
			formData.append("id", $("input[name=id]").val());
			console.log(formData);
			$.ajax({
				type: "POST",
				data: formData,
				dataType : 'json',			
	   	        contentType: false,
	        	processData: false, 
				url: ajax_url +  "/fc-ajax.php?",
				//async: false,
				success: function(json){
					 if( json.error == 0 ){
					 	M.toast({html: json.msg});
					 	setTimeout(function(){
					 		location.reload();
					 	}, 2000);					 	
					 }
					 else{
					 	$("#overlay").hide();
					 	$("#elimina-gettoni-contratto").show();
					 	$("#modal1 h1").text("Attenzione");
					 	$("#modal1 .modal-content .modal-msg").html(json.msg);
					 	$("#modal1").modal("open");
					 }
				}
			});
			
			return false;
		}	
	});
}
function initConnettivita(){
	if( $("input[name=tipo]").val() == "connettivita" ){
		if( $("input[name=op]").val() == "new" ){
			$("#contratto_fotovoltaico_form section").hide();
			$("#contratto_fotovoltaico_form section.verifica-copertura").show();
		}
		
		$("select[name=prov_fornitura]").change(function(){
			$("#conn-cover").show();
			var params = $(this).serializeArray();
			var formData = new FormData();
			formData.append("p", $("select[name=prov_fornitura]").val());
			formData.append("op", "get_comuni");
		    
			$.ajax({
					type: "POST",
					data: formData,
					dataType : 'json',			
		   	        contentType: false,
		        	processData: false, 
					url: ajax_url + "/ajax-connettivita.php?",
					async: false,
					success: function(json){
						 $("#comune_fornitura").removeAttr("disabled").formSelect();
						 $("#comune_fornitura, #via_fornitura, #civico_fornitura").empty();
						 if( json.error == 0 ){
						 	$("select[name=comune_fornitura]").append("<option value=''></option>");
						 	json.data.sort();
						 	for(i=0; i<json.data.length; i++){
						 		$("select[name=comune_fornitura]").append("<option value='"+json.data[i]+"'>"+json.data[i]+"</option>");
						 	}				 	
						 }
						 	
						 $("#via_fornitura, #civico_fornitura, #get_offerte_connettivita").attr("disabled", "disabled");
						 $("#comune_fornitura, #via_fornitura, #civico_fornitura").formSelect();	
						 clearOfferteConnettivita();
						 $("#conn-cover").hide();	
					}
				});
		});
		
		$("select[name=comune_fornitura]").change(function(){
			$("#conn-cover").show();
			var params = $(this).serializeArray();
			var formData = new FormData();
			formData.append("p", $("select[name=comune_fornitura]").val());
			formData.append("op", "get_via");
		    
			$.ajax({
					type: "POST",
					data: formData,
					dataType : 'json',			
		   	        contentType: false,
		        	processData: false, 
					url: ajax_url + "/ajax-connettivita.php?",
					async: false,
					success: function(json){
						 $("#via_fornitura").removeAttr("disabled").formSelect();
						 $("#via_fornitura, #civico_fornitura").empty();
						 if( json.error == 0 ){
						 	$("select[name=via_fornitura]").append("<option value=''></option>");
						 	json.data.sort();
						 	for(i=0; i<json.data.length; i++){
						 		$("select[name=via_fornitura]").append("<option value='"+json.data[i]+"'>"+json.data[i]+"</option>");
						 	}				 	
						 }
						 	
						 $("#civico_fornitura, #get_offerte_connettivita").attr("disabled", "disabled");
						 $("#via_fornitura, #civico_fornitura").formSelect();	
						 clearOfferteConnettivita();
						 $("#conn-cover").hide();	
					}
				});
		});
		
		$("select[name=via_fornitura]").change(function(){
			$("#conn-cover").show();
			var params = $(this).serializeArray();
			var formData = new FormData();
			formData.append("c", $("select[name=comune_fornitura]").val());
			formData.append("v", $("select[name=via_fornitura]").val());
			formData.append("op", "get_civico");
		    
			$.ajax({
					type: "POST",
					data: formData,
					dataType : 'json',			
		   	        contentType: false,
		        	processData: false, 
					url: ajax_url + "/ajax-connettivita.php?",
					async: false,
					success: function(json){
						 $("#civico_fornitura").removeAttr("disabled").formSelect();
						 $("#civico_fornitura").empty();
						 if( json.error == 0 ){
						 	$("select[name=civico_fornitura]").append("<option value=''></option>");
						 	json.data.sort();
						 	for(i=0; i<json.data.length; i++){
						 		$("select[name=civico_fornitura]").append("<option value='"+json.data[i]+"'>"+json.data[i]+"</option>");
						 	}				 	
						 }
						 	
						 $("#get_offerte_connettivita").attr("disabled", "disabled");
						 clearOfferteConnettivita();
						 $("#civico_fornitura").formSelect();	
						 $("#conn-cover").hide();	
					}
				});
		});
		
		$("select[name=civico_fornitura]").change(function(){
			if( $("#prov_fornitura").val() != "" && $("#comune_fornitura").val() != "" && $("#viafornitura").val() != "" && $("#civico_fornitura").val() != "" ){
				$("#get_offerte_connettivita").removeAttr("disabled");
			}
			else
				clearOfferteConnettivita(); 			
		});
		
		$("#get_offerte_connettivita").click(function(){
			$("#conn-cover").show();
			var params = $(this).serializeArray();
			var formData = new FormData();
			formData.append("p", $("select[name=prov_fornitura]").val());
			formData.append("c", $("select[name=comune_fornitura]").val());
			formData.append("v", $("select[name=via_fornitura]").val());
			formData.append("nc", $("select[name=civico_fornitura]").val());
			formData.append("op", "get_offerte");
		    
			$.ajax({
					type: "POST",
					data: formData,
					dataType : 'json',			
		   	        contentType: false,
		        	processData: false, 
					url: ajax_url + "/ajax-connettivita.php?",
					async: false,
					success: function(json){
						 $("#offerta_connettivita").removeAttr("disabled").formSelect();
						 $("#offerta_connettivita").empty();
						 if( json.error == 0 ){
						 	$("select[name=offerta_connettivita]").append("<option value=''></option>");
						 	json.data.sort();
						 	for(i=0; i<json.data.length; i++){
						 		$("select[name=offerta_connettivita]").append("<option value='"+json.data[i].id+"'>"+json.data[i].text+"</option>");
						 	}				 	
						 }
						 	
						 $("div.offerta_connettivita").show();
						 $("#offerta_connettivita").formSelect();	
						 $("#conn-cover").hide();	
					}
				});
		});
	}
}

function clearOfferteConnettivita(){
	$("#offerta_connettivita").empty();
	$("div.offerta_connettivita").hide();
}

function initVideoRec(){
	isIOS = /iPad|iPhone|iPod/.test(navigator.platform);
	if( isIOS ){
		$(".video_row").addClass("mac");
		return false;
	}
	fluid = true;
    if( $(window).width() > 1280 )
    	fluid = false;
    	
    // check for support
	var pipEnabled = false;
	var pipStatusMsg;
	if (!('pictureInPictureEnabled' in document)) {
	    pipStatusMsg = 'The Picture-in-Picture API is not available.';
	} else if (!document.pictureInPictureEnabled) {
	    pipStatusMsg = 'The Picture-in-Picture API is disabled.';
	} else {
	    pipEnabled = true;
	}

                            player = videojs("video_rec", {
                                controls: true,
                                bigPlayButton: true,
                                controlBar: {
                                    // hide fullscreen and volume controls
                                    fullscreenToggle: true,
                                    volumePanel: true
                                },
                                width: 640,
                                height: 480,
                                fluid: fluid,
                                pip: pipEnabled,
                                plugins: {
                                    record: {
                                        audio: true,
                                        video: true,
                                        maxLength: 120,
                                        debug: true
                                    }
                                }
                            }, function(){
                                // print version information at startup
                                var msg = 'Using video.js ' + videojs.VERSION +
                                    ' with videojs-record ' + videojs.getPluginVersion('record') +
                                    ' and recordrtc ' + RecordRTC.version;
                                videojs.log(msg);
                            });
                            // error handling
                            player.on('deviceError', function() {
                                console.log('device error:', player.deviceErrorCode);
                            });
                            player.on('error', function(error) {
                                console.log('error:', error);
                            });
                            // user clicked the record button and started recording
                            player.on('startRecord', function() {
                                console.log('started recording!');
                            });
                            // user completed recording and stream is available
                            player.on('finishRecord', function() {
                                // the blob object contains the recorded data that
                                // can be downloaded by the user, stored on server etc.
                                console.log('finished recording: ', player.recordedData);
                                
                                $("#video_recording input").val(player.recordedData.video);
                                $("#video_recording p").show();
                                $(".manual-upload-video").hide();
                            });
                            
	$("#download_webcam").click(function(){
		player.record().saveAs({'video': 'registrazione-firma-contratto.webm'});
	});
	$("#delete_webcam").click(function(){
		$("#video_recording input").val("");
		$("#video_recording p").hide();
	});
}

function initIvaEAcciseAgevolate(){
	$("input[name=iva_agevolata]").change(function(){
		if( $("input[name=iva_agevolata]").is(":checked") )
			$(".doc_wrapper.iva_agevolata").show(500);
		else{
			$(".doc_wrapper.iva_agevolata").hide(500);
			$("#contratto_fotovoltaico_form input[name=fk_tipo_uso]").trigger("change");
		}	
	});
	
	$("input[name=iva_esente]").change(function(){
		if( $("input[name=iva_esente]").is(":checked") )
			$(".doc_wrapper.iva_esente, .iva_esente_campi").show(500);
		else{
			$(".doc_wrapper.iva_esente, .iva_esente_campi").hide(500);
			$("#contratto_fotovoltaico_form input[name=fk_tipo_uso]").trigger("change");
		}	
	});
	
	$("input[name=accise_agevolate]").change(function(){
		if( $("input[name=accise_agevolate]").is(":checked") )
			$(".doc_wrapper.accise_agevolate").show(500);
		else
			$(".doc_wrapper.accise_agevolate").hide(500);	
	});
}
function initDataTableContratti(){
	$('#contratti-table.contratti-table').DataTable({
			language: {
	            "sEmptyTable":     "Nessun dato presente nella tabella",
	    "sInfo":           "Vista da _START_ a _END_ di _TOTAL_ elementi",
	    "sInfoEmpty":      "Vista da 0 a 0 di 0 elementi",
	    "sInfoFiltered":   "(filtrati da _MAX_ elementi totali)",
	    "sInfoPostFix":    "",
	    "sInfoThousands":  ".",
	    "sLengthMenu":     "Visualizza _MENU_ elementi",
	    "sLoadingRecords": "Caricamento...",
	    "sProcessing":     "Elaborazione...",
	    "sSearch":         "Cerca:",
	    "processing": true,
	    "sZeroRecords":    "La ricerca non ha portato alcun risultato.",
	    "oPaginate": {
	        "sFirst":      "Inizio",
	        "sPrevious":   "Precedente",
	        "sNext":       "Successivo",
	        "sLast":       "Fine"
	    },
	    "oAria": {
	        "sSortAscending":  ": attiva per ordinare la colonna in ordine crescente",
	        "sSortDescending": ": attiva per ordinare la colonna in ordine decrescente"
	    }
	  },
	  	order: [[ 0, "desc" ]],
	  	"scrollX": true,
	  	dom: 'Blfrtip',
	    buttons: [
	        /*'colvis',*/
	        'excel',
	        'print'
	    ],
	  	"initComplete": function( settings ) {
			    console.log("datatable initComplete");
			 },
	  	"preDrawCallback": function( settings ) {
			    console.log("datatable preDrawCallback");
			    $("#contratti_overlay").hide();
				$('#contratti-table.contratti-table tbody').show();
			  }
		});
		
}

function initKeyUps(){
	$("#contratto_fotovoltaico_form input[name=data_nascita_d], #contratto_fotovoltaico_form input[name=data_nascita_m], #contratto_fotovoltaico_form input[name=doc_id_data_rilascio_d], #contratto_fotovoltaico_form input[name=doc_id_data_rilascio_m], #contratto_fotovoltaico_form input[name=doc_id_data_scadenza_d], #contratto_fotovoltaico_form input[name=doc_id_data_scadenza_m]").live("keyup", function(){
		if( $(this).val().length == 2 ){
			if( $(this).hasClass("giorno") )
				$(this).siblings("input.mese").trigger("focus");
			if( jQuery(this).hasClass("mese") )
				$(this).siblings("input.anno").trigger("focus");	
		}
	});
	$("#contratto_fotovoltaico_form input[name=pod_first_part]").live("keyup", function(){
		if( $(this).val().length == 3 )
			$(this).siblings("input[name=pod_second_part]").trigger("focus");
	});
	
	//Catasto
	$("#contratto_fotovoltaico_form input[name=cat_sez_urbana]").live("keyup", function(){
		if( $(this).val().length == 3 )
			$("#contratto_fotovoltaico_form input[name=cat_foglio]").trigger("focus");
	});
	
	$("#contratto_fotovoltaico_form input[name=cat_foglio]").live("keyup", function(){
		if( $(this).val().length == 5 )
			$(this).trigger("blur");
	});
	
	$("#contratto_fotovoltaico_form input[name=cat_subalterno]").live("keyup", function(){
		if( $(this).val().length == 4 )
			$("#contratto_fotovoltaico_form input[name=cat_particella]").trigger("focus");
	});
	
	$("#contratto_fotovoltaico_form input[name=cat_particella]").live("keyup", function(){
		if( $(this).val().length == 5 )
			$("#contratto_fotovoltaico_form input[name=cat_segue_particella]").trigger("focus");
	});
	
	$("#contratto_fotovoltaico_form input[name=cat_segue_particella]").live("keyup", function(){
		if( $(this).val().length == 5 )
			$(this).trigger("blur");
	});
}

function manageUploads(){
	$("input[name=file_doc_fattura]").change(function(){
		if( $(this).val() == "" )
			return false;
		var files = $(this)[0].files;
			console.log(files);
	        //Looping through uploaded files collection in case there is a Multi File Upload. This also works for single i.e simply remove MULTIPLE attribute from file control in HTML.  
	        for (var i = 0; i < files.length; i++) {
	        	//formData.append(files[i].name, files[i]); //original
	        	file_field = $(this).closest(".file-field");
	        	name = $(this).attr("name");
	        	
	        	clone = $(this).clone();
	        	clone.attr("name", name + "_" + Date.now() );
	        	file_field.append(clone);
	        	
	        	//file_field.append("<input type='file' name='_"+name+"[]' value='"+files[i]+"'>");
	        }	
	});
}

function connectFormsSumbit(){
	$("#contratto_fotovoltaico_form.contratto button[type=submit]").click(function(){
		$("#contratto_fotovoltaico_form.contratto").addClass("onsubmit");
		
		$("#wrap section.title").addClass("no-fix");
		
		selects = $("#contratto_fotovoltaico_form.contratto select");
		for(i=0; i<selects.length;i++){
			if( $(selects[i])[0].hasAttribute("required") ){
				if( $(selects[i]).val() == "" ){
					$(selects[i]).siblings(".select-dropdown").addClass("invalid");
				}
				else
					$(selects[i]).siblings(".select-dropdown").removeClass("invalid");	
			}
		}
		
		inputs = $("#contratto_fotovoltaico_form.contratto input");
		for(i=0; i<inputs.length;i++){
			if( $(inputs[i])[0].hasAttribute("required") ){
				if( $(inputs[i]).val() == "" || ($(inputs[i]).attr("type") == "checkbox" && !$(inputs[i]).is(":checked") ) ){
					$(inputs[i]).addClass("invalid");
				}
				else
					$(inputs[i]).removeClass("invalid");	
			}
		}
	});
	
	$("#contratto_fotovoltaico_form.contratto input.invalid").live("change", function(){
		if( $(this).val() != "" )
			$(this).removeClass("invalid");		
	});
	
	$("#contratto_fotovoltaico_form.contratto select").live("change", function(){
		if( $(this)[0].hasAttribute("required") && $(this).val() != "" )
			$(this).siblings(".select-dropdown").removeClass("invalid");	
	});
	
	$("#contratto_fotovoltaico_form.contratto").submit(function(ev){
		console.log("submit...");
		$("#overlay").show();
		$("#contratto_fotovoltaico_form.contratto").find("button[type=submit]").hide();
		ev.preventDefault();
		
		//Declaring new Form Data Instance  
        var formData = new FormData();
		//Getting Files Collection
		var input_files = $(this).find("input[type=file]");
		
		for(f=0;f<input_files.length;f++){
			var files = $(input_files[f])[0].files;
			console.log("file name", $(input_files[f]).attr("name"));
			
	        //Looping through uploaded files collection in case there is a Multi File Upload. This also works for single i.e simply remove MULTIPLE attribute from file control in HTML.  
	        for (var i = 0; i < files.length; i++) {
	        	//formData.append(files[i].name, files[i]); //original
	        	formData.append($(input_files[f]).attr("name") + "$" + i, files[i]);
	        	
	        	console.log("i", i);
	        }
	        
	        //Se sto analizzando l'input del videofirma aggiungo anche la registrazione della webcam se c'è
	        if( $("input[name=video_recording]").val() != "" && $(input_files[f]).attr("name") == "file_doc_video_firma" ){
	        	console.log("here", $("input[name=video_recording]").val());
	        	formData.append($(input_files[f]).attr("name") + "$" + i, player.recordedData.video);
	        	
	        	//Se non c'è nessun video caricato inserisco un valore nel file input così nel controller analizzerò i documenti allegati
	        	if( $("input[name=doc_video_firma]").val() == "" )
	        		$("input[name=doc_video_firma]").val("webcam_recording");
	        }	
		}
		
        //Serializing all For Input Values (not files!) in an Array Collection so that we can iterate this collection later.
		var params = $(this).serializeArray();
        //Now Looping the parameters for all form input fields and assigning them as Name Value pairs. 
        $(params).each(function (index, element) {
        	formData.append(element.name, element.value);
		});
		
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url +  "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	M.toast({html: json.msg});
				 	
				 	setTimeout(function(){
				 		if( json.data != "" && json.data != null){
				 			if( json.data.includes("-") ){
				 				arr = json.data.split("-");
								window.location.href = "/fv/contratto-fotovoltaico/"+arr[0] + "?ev=nuovocontratto&g="+arr[1] + "#deposit-anchor";
				 			}
				 			else{
								console.log("/fv/contratto-fotovoltaico/"+json.data + "?ev=nuovocontratto#accettazione_pre_fattibilita");
								window.location.href = "/fv/contratto-fotovoltaico/"+json.data + "?ev=nuovocontratto#accettazione_pre_fattibilita";
							}
				 				
				 		}
				 		else
				 			location.reload();
				 	}, 2000);				 	
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#contratto_fotovoltaico_form.contratto").find("button[type=submit]").show();
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 	
				 	if( json.data == 2 ){
				 		$(document).scrollTop( $("#privacy").offset().top - 90 );
				 		//$("#luce_collegato").parent().addClass("enfatizza");
				 	}
				 	if( json.data == 3 ){
				 		$(document).scrollTop( $("input[name=accettazione_contratto]").offset().top - 90 );
				 	}
				 	if( json.data == 4 ){
				 		$(document).scrollTop( $("#firma_contratto").offset().top - 90 );
				 	}
				 	if( json.data == 5 ){
				 		$(document).scrollTop( $("#luce_collegato").offset().top - 90 );
				 		$("#luce_collegato").parent().addClass("enfatizza");
				 	}

					 $("#wrap section.title").removeClass("no-fix");
				 }
			}
		});
		
		return false;
	});
}

function initAucocomplete(){
	$('#comune_nascita').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_comune.php?par=no_add",		
		inputId: "comune_nascita",
		minLength: 2,
		onSelect: function( el ) {
			console.log($(el).attr("rel"));
			$('#comune_nascita_hidden').val( $(el).attr("rel") );	
		}
    });
    $('#comune_residenza').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_comune.php?par=no_add",		
		inputId: "comune_residenza",
		minLength: 2,
		onSelect: function( el ) {
			console.log($(el).attr("rel"));
			$('#comune_residenza_hidden').val( $(el).attr("rel") );	
		}
    });
	$('#comune_installazione').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_comune.php?par=no_add",		
		inputId: "comune_installazione",
		minLength: 2,
		onSelect: function( el ) {
			console.log($(el).attr("rel"));
			$('#comune_installazione_hidden').val( $(el).attr("rel") );	
		}
    });
    $('#top_residenza').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_toponimo.php?par=no_add",		
		inputId: "top_residenza",
		minLength: 1,
		onSelect: function( el ) {
			console.log($(el).attr("rel"));
			$('#top_residenza_hidden').val( $(el).attr("rel") );	
		}
    });
    $('#top_residenza, #top_residenza_hidden').change(function(){
    	console.log("change");
    	if( $('#top_residenza').val() == "" && $('#top_residenza_hidden').val() != "" ){
    		$('#top_residenza_hidden').val("");
    		console.log("here");
    	}
    	if( $('#top_residenza').val() != "" && $('#top_residenza_hidden').val() == "" ){
    		$('#top_residenza').val("");
    		console.log("there");
    	}	
    });
    $('#top_installazione').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_toponimo.php?par=no_add",		
		inputId: "top_installazione",
		minLength: 1,
		onSelect: function( el ) {
			console.log($(el).attr("rel"));
			$('#top_installazione_hidden').val( $(el).attr("rel") );	
		}
    });
    $('#top_installazione, #top_installazione_hidden').change(function(){
    	console.log("change");
    	if( $('#top_installazione').val() == "" && $('#top_installazione_hidden').val() != "" ){
    		$('#top_installazione_hidden').val("");
    		console.log("here");
    	}
    	if( $('#top_installazione').val() != "" && $('#top_installazione_hidden').val() == "" ){
    		$('#top_installazione').val("");
    		console.log("there");
    	}	
    });
    $('#comune_sede').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_comune.php?par=no_add",		
		inputId: "comune_sede",
		minLength: 2,
		onSelect: function( el ) {
			console.log($(el).attr("rel"));
			$('#comune_sede_hidden').val( $(el).attr("rel") );	
		}
    });
    $('#top_sede').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_toponimo.php?par=no_add",		
		inputId: "top_sede",
		minLength: 1,
		onSelect: function( el ) {
			console.log($(el).attr("rel"));
			$('#top_sede_hidden').val( $(el).attr("rel") );	
		}
    });
    $('#top_sede, #top_sede_hidden').change(function(){
    	if( $('#top_sede').val() == "" && $('#top_sede_hidden').val() != "" ){
    		$('#top_residenza_hidden').val("");
    	}
    	if( $('#top_sede').val() != "" && $('#top_residenza_hidden').val() == "" ){
    		$('#top_sede').val("");
    	}	
    });
    
    $('#fast_comune_sede').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_comune.php?par=no_add",		
		inputId: "fast_comune_sede",
		minLength: 2,
		onSelect: function( el ) {
			console.log($(el).attr("rel"));
			$('#fast_comune_sede_hidden').val( $(el).attr("rel") );	
			setTimeout(function(){
				$('#fast_comune_sede').trigger("change");
				$('#fast_comune_sede_hidden').trigger("change");
			}, 500);
		}
    });
    $('#fast_top_sede').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_toponimo.php?par=no_add",		
		inputId: "fast_top_sede",
		minLength: 1,
		onSelect: function( el ) {
			console.log($(el).attr("rel"));
			$('#fast_top_sede_hidden').val( $(el).attr("rel") );
			setTimeout(function(){
				$('#fast_top_sede').trigger("change");
				$('#fast_top_sede_hidden').trigger("change");
			}, 500);
		}
    });
    $('#fast_top_sede, #fast_top_sede_hidden').change(function(){
    	if( $('#fast_top_sede').val() == "" && $('#fast_top_sede_hidden').val() != "" ){
    		$('#fast_top_residenza_hidden').val("").trigger("change");
    	}
    	if( $('#fast_top_sede').val() != "" && $('#fast_top_residenza_hidden').val() == "" ){
    		$('#fast_top_sede').val("").trigger("change");
    	}	
    });

    $('#cat_comune_amministrativo').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_comune.php?par=no_add",		
		inputId: "cat_comune_amministrativo",
		minLength: 2,
		onSelect: function( el ) {
			console.log($(el).attr("rel"));
			$('#cat_comune_amministrativo_hidden').val( $(el).attr("rel") );	
		}
    });
    $('#cat_comune_catastale').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_comune.php?par=no_add",		
		inputId: "cat_comune_catastale",
		minLength: 2,
		onSelect: function( el ) {
			console.log($(el).attr("rel"));
			$('#cat_comune_catastale_hidden').val( $(el).attr("rel") );	
		}
    });
    $('#cat_comune_catastale').change(function(){
    	if( $('#cat_comune_catastale').val() == "" && $('#cat_comune_catastale_hidden').val() != "" ){
    		$('#cat_comune_catastale_hidden').val("");
    	}
    	if( $('#cat_comune_catastale').val() != "" && $('#cat_comune_catastale_hidden').val() == "" ){
    		$('#cat_comune_catastale').val("");
    	}	
    });
    $('#cat_comune_amministrativo').change(function(){
    	if( $('#cat_comune_amministrativo').val() == "" && $('#cat_comune_amministrativo_hidden').val() != "" ){
    		$('#cat_comune_amministrativo_hidden').val("");
    	}
    	if( $('#cat_comune_amministrativo').val() != "" && $('#cat_comune_amministrativo_hidden').val() == "" ){
    		$('#cat_comune_amministrativo').val("");
    	}	
    });
    
	var is_ramo_360 = 0;
	if( $("input[name=is_ramo_360]").length == 1 ){
		is_ramo_360 = $("input[name=is_ramo_360]").val();
	}

    $('#fk_agente').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_sponsor.php?par=no_add&smart=1&is_360="+is_ramo_360,		
		inputId: "fk_agente",
		minLength: 3,
		onSelect: function( el ) {
			console.log($(el).attr("rel"));
			$('#fk_agente_hidden').val( $(el).attr("rel") );	
		}
    });

	

	if( is_ramo_360 == 1 ){
		$('#fk_edp').autocomplete({
			ajaxUrl: ajax_url +  "/fc_ajax_sponsor.php?par=no_add&smart=1&is_360="+is_ramo_360,		
			inputId: "fk_edp",
			minLength: 3,
			onSelect: function( el ) {
				console.log($(el).attr("rel"));
				$('#fk_edp_hidden').val( $(el).attr("rel") );	
			}
		});
	}
	else{
		$('#fk_edp').autocomplete({
			ajaxUrl: ajax_url +  "/fc_ajax_edp.php?par=no_add&is_360="+is_ramo_360,		
			inputId: "fk_edp",
			minLength: 3,
			onSelect: function( el ) {
				console.log($(el).attr("rel"));
				$('#fk_edp_hidden').val( $(el).attr("rel") );	
			}
		});

		$('#fk_resp_edp').autocomplete({
			ajaxUrl: ajax_url +  "/fc_ajax_edp.php?par=no_add&resp=1&is_360="+is_ramo_360,		
			inputId: "fk_resp_edp",
			minLength: 3,
			onSelect: function( el ) {
				console.log($(el).attr("rel"));
				$('#fk_resp_edp_hidden').val( $(el).attr("rel") );	
			}
		});
	}

	$('#fk_area_manager').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_sponsor.php?par=no_add&area_manager=1&is_360="+is_ramo_360,		
		inputId: "fk_area_manager",
		minLength: 3,
		onSelect: function( el ) {
			console.log($(el).attr("rel"));
			$('#fk_area_manager_hidden').val( $(el).attr("rel") );	
		}
    });

	$('#fk_sales_manager').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_sponsor.php?par=no_add&sales_manager=1&is_360="+is_ramo_360,		
		inputId: "fk_sales_manager",
		minLength: 3,
		onSelect: function( el ) {
			console.log($(el).attr("rel"));
			$('#fk_sales_manager_hidden').val( $(el).attr("rel") );	
		}
    });

    $('#search_anagrafiche_contratti').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_search_anagrafiche_contratti.php?par=no_add",		
		inputId: "search_anagrafiche_contratti",
		minLength: 3,
		onSelect: function( el ) {
			if( confirm("Vuoi sovrascrivere i dati anagrafici del form con quelli del nominativo selezionato ("+$(el).text()+"?") ){
				if( $(el).attr("rel").startsWith("C") )
					recuperaDatiDaContratto($(el).attr("rel").substring(1));
				else
					recuperaDatiDaMembro($(el).attr("rel").substring(1));
			}
		}
    });
    $('#comune_fornitura').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_comune.php?par=no_add&onlyit=yes",		
		inputId: "comune_fornitura",
		minLength: 2,
		onSelect: function( el ) {
			console.log($(el).attr("rel"));
			$('#comune_fornitura_hidden').val( $(el).attr("rel") );	
			$('#comune_fornitura_hidden').trigger("change");
		}
    });
    $('#top_fornitura').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_toponimo.php?par=no_add",		
		inputId: "top_fornitura",
		minLength: 1,
		onSelect: function( el ) {
			console.log($(el).attr("rel"));
			$('#top_fornitura_hidden').val( $(el).attr("rel") );	
		}
    });
    $('#top_fornitura, #top_fornitura_hidden').change(function(){
    	if( $('#top_fornitura').val() == "" && $('#top_fornitura_hidden').val() != "" ){
    		$('#top_fornitura_hidden').val("");
    	}
    	if( $('#top_fornitura').val() != "" && $('#top_fornitura_hidden').val() == "" ){
    		$('#top_fornitura').val("");
    	}	
    });
	$('#fast_comune_fornitura').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_comune.php?par=no_add&onlyit=yes",		
		inputId: "fast_comune_fornitura",
		minLength: 2,
		onSelect: function( el ) {
			console.log($(el).attr("rel"));
			
			$('#fast_comune_fornitura_hidden').val( $(el).attr("rel") );	
			setTimeout(function(){
				$('#fast_comune_fornitura_hidden').trigger("change");
				$('#fast_comune_fornitura').trigger("change");
			}, 500);
		}
    });
    $('#fast_top_fornitura').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_toponimo.php?par=no_add",		
		inputId: "fast_top_fornitura",
		minLength: 1,
		onSelect: function( el ) {
			console.log($(el).attr("rel"));
			$('#fast_top_fornitura_hidden').val( $(el).attr("rel") );	
			setTimeout(function(){
				$('#fast_top_fornitura_hidden').trigger("change");
				$('#fast_top_fornitura').trigger("change");
			}, 500);
		}
    });
    $('#fast_top_fornitura, #fast_top_fornitura_hidden').change(function(){
    	if( $('#fast_top_fornitura').val() == "" && $('#fast_top_fornitura_hidden').val() != "" ){
    		$('#fast_top_fornitura_hidden').val("");
    	}
    	if( $('#fast_top_fornitura').val() != "" && $('#fast_top_fornitura_hidden').val() == "" ){
    		$('#fast_top_fornitura').val("");
    	}	
    });

    $('#codice_ateco').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_ateco.php?par=no_add",		
		inputId: "codice_ateco",
		minLength: 1,
		onSelect: function( el ) {
			console.log($(el).attr("rel"));
			$('input[name=codice_ateco_hidden]').val( $(el).attr("rel") );	
		}
    });
	$('#fast_codice_ateco').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_ateco.php?par=no_add",		
		inputId: "fast_codice_ateco",
		minLength: 1,
		onSelect: function( el ) {
			console.log($(el).attr("rel"));
			$('input[name=fast_codice_ateco_hidden]').val( $(el).attr("rel") );	
			setTimeout(function(){
				$('#fast_codice_ateco').trigger("change");
				$('input[name=fast_codice_ateco_hidden]').trigger("change");
			}, 500);
		}
    });

    $('#comune_spedizione').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_comune.php?par=no_add&onlyit=yes",		
		inputId: "comune_spedizione",
		minLength: 2,
		onSelect: function( el ) {
			console.log($(el).attr("rel"));
			$('#comune_spedizione_hidden').val( $(el).attr("rel") );	
		}
    });
    $('#top_spedizione').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_toponimo.php?par=no_add",		
		inputId: "top_spedizione",
		minLength: 1,
		onSelect: function( el ) {
			console.log($(el).attr("rel"));
			$('#top_spedizione_hidden').val( $(el).attr("rel") );	
		}
    });
    $('#top_spedizione, #top_spedizione_hidden').change(function(){
    	if( $('#top_spedizione').val() == "" && $('#top_spedizione_hidden').val() != "" ){
    		$('#top_spedizione_hidden').val("");
    	}
    	if( $('#top_spedizione').val() != "" && $('#top_spedizione_hidden').val() == "" ){
    		$('#top_spedizione').val("");
    	}	
    });
    
    $('#search_contratto').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_search_contratto.php?par=no_add",		
		inputId: "search_contratto",
		minLength: 3,
		onSelect: function( el ) {
			location.href = home_url + "/contratto?id=" + $(el).attr("rel");
			console.log($(el).attr("rel"));
		}
    });
    
    $('#search_contratto_sponsor').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_search_contratto.php?par=no_add&sponsor=yes",		
		inputId: "search_contratto_sponsor",
		minLength: 1,
		onSelect: function( el ) {
			location.href = home_url + "/contratti?agente=" + $(el).attr("rel");
			console.log($(el).attr("rel"));
		}
    });
    
    $('#fornitore_attuale').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_fornitore_gas.php?par=no_add",		
		inputId: "fornitore_attuale",
		minLength: 3,
		onSelect: function( el ) {
			console.log($(el).attr("rel"));
			$('#fornitore_attuale_hidden').val( $(el).attr("rel") );	
		}
    });
    $('#fornitore_attuale, #fornitore_attuale_hidden').change(function(){
    	if( $('#fornitore_attuale').val() == "" && $('#fornitore_attuale_hidden').val() != "" )
    		$('#fornitore_attuale_hidden').val("");
    	if( $('#fornitore_attuale').val() != "" && $('#fornitore_attuale_hidden').val() != "" )
    		$('#fornitore_attuale').val("");	
    });
    
    
    $('#distributore_gas').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_distributore_gas.php?par=no_add",		
		inputId: "distributore_gas",
		minLength: 3,
		onSelect: function( el ) {
			console.log($(el).attr("rel"));
			$('#distributore_gas_hidden').val( $(el).attr("rel") );	
		}
    });

    $('#distributore_gas, #distributore_gas_hidden').change(function(){
		var not_hidden = $('#distributore_gas').val();
		var hidden = $('#distributore_gas_hidden').val();
		console.log("distributore_gas not hidden", not_hidden);
		console.log("distributore_gas hidden", hidden);
    	if( not_hidden == "" && hidden != "" ){
			console.log("clear distributore_gas_hidden");
    		$('#distributore_gas_hidden').val("");
		}
    	if( not_hidden != "" && hidden == "" ){
			console.log("clear distributore_gas");
    		$('#distributore_gas').val("");	
		}
    });
    $('#fast_distributore_gas').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_distributore_gas.php?par=no_add",		
		inputId: "fast_distributore_gas",
		minLength: 3,
		onSelect: function( el ) {
			//console.log($(el).attr("rel"));
			$('#fast_distributore_gas_hidden').val( $(el).attr("rel") );	
			setTimeout(function(){
				$('#fast_distributore_gas_hidden').trigger("change");
				//$('#fast_distributore_gas').trigger("change");
			}, 1000);
		}
    });
    $('#fast_distributore_gas, #fast_distributore_gas_hidden').change(function(){
		var not_hidden = $('#fast_distributore_gas').val();
		var hidden = $('#fast_distributore_gas_hidden').val();
		console.log("fast_distributore_gas not hidden", not_hidden);
		console.log("fast_distributore_gas hidden", hidden);
    	if( not_hidden == "" && hidden != "" ){
			console.log("clear fast_distributore_gas_hidden");
    		$('#fast_distributore_gas_hidden').val("");
		}
		if( not_hidden != "" && hidden == "" ){
			console.log("clear fast_distributore_gas");
    		$('#fast_distributore_gas').val("");	
		}
    });

   
   $('#comune_fornitura_hidden').change(function(){
	   	var formData = new FormData();
			formData.append("c", $(this).val());
			$.ajax({
				type: "POST",
				data: formData,
				dataType : 'json',			
	   	        contentType: false,
	        	processData: false, 
				url: ajax_url +  "/fc_ajax_remi.php?",
				//async: false,
				success: function(json){
					 if( json.error == 0 ){
						//Da aprile 2023
						if( role == 1 || role == 3 )
							fcalert("Remi per il comune trovato: " . json.data);
						
						return;

					 	//$("input[name=remi]").val(json.data.cod_remi);
						$("input[name=distributore_gas]").val(json.data.player);
					 	$("input[name=distributore_gas_hidden]").val(json.data.ID);
					 	
					 	if( (role == 1 || role == 3) && json.data.ID == "da definire" )
					 		M.toast({html: "ATTENZIONE: il distributore gas non è valido per il FEP, è necessario selezionarlo dal menu a tendina."});
					 	if( json.data.cod_remi == "")
					 		$("input[name=remi],input[name=distributore_gas]").removeAttr("readonly");
					 	//M.toast({html: "REMI E DISTRIBUTORE SETTATI"});
					 }
					 else{
						if( role == 1 || role == 3 )
							fcalert("Remi per il comune non trovato nel db CRM: " . json.msg);
						
						return;

					 	$("input[name=remi],input[name=distributore_gas]").removeAttr("readonly");
					 	return; 
					 	$("#overlay").hide();
					 	$("#attiva-contratto").css("visibility", "visible");
					 	$("#modal1 h1").text("Attenzione");
					 	$("#modal1 .modal-content .modal-msg").html(json.msg);
					 	$("#modal1").modal("open");
					 	
					 	$("#comune_fornitura, #comune_fornitura_hidden").val("");
					 }
				}
			});
   });
   
   /*
    * Commentato il 14/2/2022
    */
   /*
   if( $("input[name=fk_stato_js]").val() == 1 || $("input[name=fk_stato_js]").val() == 2 )
       $('#comune_fornitura_hidden').trigger("change");
   */    
}
    
function recuperaDatiDaContratto(id_contratto){
		console.log("recuperaDatiDaContratto", id_contratto);
		$("#overlay").show();
		
		//Declaring new Form Data Instance  
        var formData = new FormData();
		formData.append("id_contratto", id_contratto);
		formData.append("op", "recupera_dati_contratto");
		formData.append("e", "contratti");
		
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url +  "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	
				 	$("select[name=fk_soggetto]").val( json.data.fk_soggetto ).formSelect().trigger("change");
				 					 	
				 	$("input[name=nome]").val( json.data.nome );
				 	$("input[name=cognome]").val( json.data.cognome );
				 	$("input[name=email]").val( json.data.email );
				 	$("input[name=email_confirm]").val( json.data.email );
				 	
				 	$("input[name=cf]").val( json.data.cf );
				 	$("select[name=sesso]").val( json.data.sesso ).formSelect();
				 	
				 	$("input[name=comune_nascita]").val( json.data.comune_nascita_text );
				 	$("input[name=comune_nascita_hidden]").val( json.data.comune_nascita );
				 	if( json.data.comune_nascita_soppresso == 1 )
						$("input[name=comune_nascita_soppresso]").attr( 'checked', 'checked');
						
				 	var d = new Date( json.data.data_nascita );
					var n = d.getFullYear();
					$("input[name=data_nascita_d]").val( d.getDate() );
					$("input[name=data_nascita_m]").val( d.getMonth() + 1 );
					$("input[name=data_nascita_y]").val( d.getFullYear() );
					
					$("input[name=comune_residenza]").val( json.data.comune_residenza_text );
				 	$("input[name=comune_residenza_hidden]").val( json.data.comune_residenza );
				 	$("input[name=top_residenza]").val( json.data.top_desc_residenza );
					$("input[name=top_residenza_hidden]").val( json.data.top_residenza );
					$("input[name=via_residenza]").val( json.data.via_residenza );
					$("input[name=civico_residenza]").val( json.data.civico_residenza );
					$("input[name=suffisso_residenza]").val( json.data.suffisso_residenza );
					$("input[name=cap_residenza]").val( json.data.cap_residenza );
					
					$("input[name=telefono]").val( json.data.telefono );
					$("input[name=cellulare]").val( json.data.cellulare );
					//$("input[name=doc_id_tipo]").val( json.data.doc_id_tipo );
					$("select[name=doc_id_tipo]").val( json.data.doc_id_tipo ).formSelect();

					$("input[name=doc_id_num]").val( json.data.doc_id_num );
					$("input[name=doc_id_rilasciato_da]").val( json.data.doc_id_rilasciato_da );
					
					if( json.data.doc_id_data_rilascio != null ){
						var d = new Date( json.data.doc_id_data_rilascio );
						var n = d.getFullYear();
						$("input[name=doc_id_data_rilascio_d]").val( d.getDate() );
						$("input[name=doc_id_data_rilascio_m]").val( d.getMonth() + 1 );
						$("input[name=doc_id_data_rilascio_y]").val( d.getFullYear() );
					}
					
					if( json.data.doc_id_data_scadenza != null ){
						var d = new Date( json.data.doc_id_data_scadenza );
						var n = d.getFullYear();
						$("input[name=doc_id_doc_id_data_scadenza_d]").val( d.getDate() );
						$("input[name=doc_id_doc_id_data_scadenza_m]").val( d.getMonth() + 1 );
						$("input[name=doc_id_doc_id_data_scadenza_y]").val( d.getFullYear() );
					}
					
					$("input[name=rag_sociale]").val( json.data.rag_sociale );
					$("input[name=piva]").val( json.data.piva );
					$("input[name=cf_sede]").val( json.data.cf_sede );
					$("input[name=pec]").val( json.data.pec );
					$("input[name=sdi]").val( json.data.sdi );
					
					$("input[name=comune_sede]").val( json.data.comune_sede_text );
				 	$("input[name=comune_sede_hidden]").val( json.data.comune_sede );
				 	$("input[name=top_sede]").val( json.data.top_desc_sede );
					$("input[name=top_sede_hidden]").val( json.data.top_sede );
					$("input[name=via_sede]").val( json.data.via_sede );
					$("input[name=civico_sede]").val( json.data.civico_sede );
					$("input[name=suffisso_sede]").val( json.data.suffisso_sede );
					$("input[name=cap_sede]").val( json.data.cap_sede );
					
					$("input[name=email_aziendale]").val( json.data.email_aziendale );
					
					$("input[name=titolare_conto_nome]").val( json.data.titolare_conto_nome );
					$("input[name=titolare_conto_cognome]").val( json.data.titolare_conto_cognome );
					$("input[name=cf_piva_conto]").val( json.data.cf_piva_conto );
					$("input[name=iban]").val( json.data.iban );
					$("input[name=soggetto_delegato_conto]").val( json.data.soggetto_delegato_conto );
					$("input[name=cf_delegato]").val( json.data.cf_delegato );
				 	M.toast({html: "Anagrafica recuperata"});
				 	$("#overlay").hide();	
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
				 
				 $("#search_anagrafiche_contratti").val("");
			}
		});
		
		return false;
}
    
function recuperaDatiDaMembro(id_membro){
		console.log("recuperaDatiDaMembro", id_membro);
		$("#overlay").show();
		
		//Declaring new Form Data Instance  
        var formData = new FormData();
		formData.append("id_membro", id_membro);
		formData.append("op", "recupera_dati_membro");
		formData.append("e", "networkers");
		
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url +  "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	
				 	//$("select[name=fk_soggetto]").val( json.data.fk_soggetto ).formSelect().trigger("change");
				 					 	
				 	$("input[name=nome]").val( json.data.nome );
				 	$("input[name=cognome]").val( json.data.cognome );
				 	$("input[name=email]").val( json.data.email );
				 	$("input[name=email_confirm]").val( json.data.email );
				 	
				 	$("input[name=cf]").val( json.data.cf );
				 	$("select[name=sesso]").val( json.data.sesso ).formSelect();
				 	
				 	$("input[name=comune_nascita]").val( json.data.comune_nascita_text );
				 	$("input[name=comune_nascita_hidden]").val( json.data.comune_nascita );
				 	if( json.data.comune_nascita_soppresso == 1 )
						$("input[name=comune_nascita_soppresso]").attr( 'checked', 'checked');
						
				 	var d = new Date( json.data.data_nascita );
					var n = d.getFullYear();
					$("input[name=data_nascita_d]").val( d.getDate() );
					$("input[name=data_nascita_m]").val( d.getMonth() + 1 );
					$("input[name=data_nascita_y]").val( d.getFullYear() );
					
					$("input[name=comune_residenza]").val( json.data.comune_residenza_text );
				 	$("input[name=comune_residenza_hidden]").val( json.data.comune_residenza );
				 	//$("input[name=top_residenza]").val( json.data.top_desc_residenza );
					//$("input[name=top_residenza_hidden]").val( json.data.top_residenza );
					$("input[name=via_residenza]").val( json.data.via_residenza );
					$("input[name=civico_residenza]").val( json.data.civico_residenza );
					//$("input[name=suffisso_residenza]").val( json.data.suffisso_residenza );
					$("input[name=cap_residenza]").val( json.data.cap_residenza );
					
					//$("input[name=telefono]").val( json.data.telefono );
					$("input[name=cellulare]").val( json.data.cellulare );
					//$("input[name=doc_id_tipo]").val( json.data.doc_id_tipo );
					$("select[name=doc_id_tipo]").val( json.data.doc_id_tipo ).formSelect();
					$("input[name=doc_id_num]").val( json.data.doc_id_num );
					$("input[name=doc_id_rilasciato_da]").val( json.data.doc_id_rilasciato_da );
					
					if( json.data.doc_id_data_rilascio != null ){
						var d = new Date( json.data.doc_id_data_rilascio );
						var n = d.getFullYear();
						$("input[name=doc_id_data_rilascio_d]").val( d.getDate() );
						$("input[name=doc_id_data_rilascio_m]").val( d.getMonth() + 1 );
						$("input[name=doc_id_data_rilascio_y]").val( d.getFullYear() );
					}
					
					if( json.data.doc_id_data_scadenza != null ){
						var d = new Date( json.data.doc_id_data_scadenza );
						var n = d.getFullYear();
						$("input[name=doc_id_doc_id_data_scadenza_d]").val( d.getDate() );
						$("input[name=doc_id_doc_id_data_scadenza_m]").val( d.getMonth() + 1 );
						$("input[name=doc_id_doc_id_data_scadenza_y]").val( d.getFullYear() );
					}
					

					//$("input[name=rag_sociale]").val( json.data.rag_sociale );
					$("input[name=piva]").val( json.data.piva );
					//$("input[name=cf_sede]").val( json.data.cf_sede );
					$("input[name=pec]").val( json.data.pec );
					$("input[name=sdi]").val( json.data.sdi );
					
					/*
					$("input[name=comune_sede]").val( json.data.comune_sede_text );
				 	$("input[name=comune_sede_hidden]").val( json.data.comune_sede );
				 	$("input[name=top_sede]").val( json.data.top_desc_sede );
					$("input[name=top_sede_hidden]").val( json.data.top_sede );
					$("input[name=via_sede]").val( json.data.via_sede );
					if( json.data.civico_sede == 99999 )
						$("input[name=snc_sede]").attr( 'checked', 'checked');
					else
						$("input[name=civico_sede]").val( json.data.civico_sede );
					$("input[name=suffisso_sede]").val( json.data.suffisso_sede );
					$("input[name=cap_sede]").val( json.data.cap_sede );
					
					$("input[name=email_aziendale]").val( json.data.email_aziendale );
					
					$("input[name=titolare_conto_nome]").val( json.data.titolare_conto_nome );
					$("input[name=titolare_conto_cognome]").val( json.data.titolare_conto_cognome );
					$("input[name=cf_piva_conto]").val( json.data.cf_piva_conto );
					$("input[name=iban]").val( json.data.iban );
					$("input[name=soggetto_delegato_conto]").val( json.data.soggetto_delegato_conto );
					$("input[name=cf_delegato]").val( json.data.cf_delegato );
					*/
				 	M.toast({html: "Anagrafica recuperata"});
				 	$("#overlay").hide();	
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
				 
				 $("#search_anagrafiche_contratti").val("");
			}
		});
		
		return false;
}
    
/*
 * Disabilita o abilita i campi di anagrafica aziendale in base al tipo di soggetto selezionato
 */
function initContrattoSoggetto(){
	$("#contratto_fotovoltaico_form #fk_soggetto_fotovoltaico").change(function(){
		abilitaDisabilitaPIvaFields();
    	RequireDatiPagamento();
    	//abilitaDisabilitaPianoCashback();
    	//abilitaDisabilitaOneriRidotti();
    	//abilitaDisabilitaEsenzioneIva();
    });
    abilitaDisabilitaPIvaFields();
    RequireDatiPagamento();
    //abilitaDisabilitaPianoCashback();
    //abilitaDisabilitaOneriRidotti();
    //abilitaDisabilitaEsenzioneIva();
    //$("#contratto_fotovoltaico_form #fk_soggetto").trigger("change");
}

function abilitaDisabilitaEsenzioneIva(){
	soggetto = $("#contratto_fotovoltaico_form #fk_soggetto").val();
	if( soggetto== 20 || soggetto == 21 || soggetto == 22 || soggetto == 23 )
		$("#iva_esente_wrap").show();
	else
		$("#iva_esente_wrap").hide();	
	
}

function abilitaDisabilitaOneriRidotti(){
	soggetto = $("#contratto_fotovoltaico_form #fk_soggetto").val();
	if( $("#piano-compensi-wrap-16").length > 0 ){
		if( soggetto== 1 || soggetto == 7 || soggetto == 22 )
			$("#piano-compensi-wrap-16").show();
		else
			$("#piano-compensi-wrap-16").hide();	
	}
}

function abilitaDisabilitaPianoCashback(){
	soggetto = $("#contratto_fotovoltaico_form #fk_soggetto").val();
	if( $("input[name=oneri_ridotti]").length > 0 ){
		if( soggetto== 1 || soggetto == 22 || soggetto == 17)
			$("input[name=oneri_ridotti]").parent().hide();
		else
			$("input[name=oneri_ridotti]").parent().show();	
	}
}
/*
 * Calcola l'IVA in base ai campi soggetto e tipo uso
 */
function initContrattoIva(){
	$("#contratto_fotovoltaico_form input[name=fk_tipo_uso]").change(function(){
		console.log("UpdateIva...");
		if( $("input[name=op]").val() == "new" )
			return false;
			
		soggetto = $("#contratto_fotovoltaico_form #fk_soggetto").val();
		domestico = false;
		altri_usi = false;
		luce = false;
		gas = false;
		if( $("input[name=fk_tipo_uso][value=1]").is(":checked") )
			domestico = true;
		if( $("input[name=fk_tipo_uso][value=2]").is(":checked") )
			altri_usi = true;
    	if( $("input[name=pod_first_part]").length > 0 )
    		luce = true;
    	else
    		gas = true;	
    		
    	console.log("soggetto", soggetto);
    	console.log("domestico", domestico);
    	console.log("altri_usi", altri_usi);
    	console.log("luce", luce);
    	console.log("gas", gas);
    	
    	//Uso l'array del CRM
    	for( i=0; i<aliquote_rules.arr.length; i++ ){
    		rule = aliquote_rules.arr[i];
    		if( rule.Codice_soggetto_share == soggetto ){
    			if( (domestico &&  rule.Flag_domestico == 1) || (altri_usi && rule.Flag_altri_usi == 1) ){
    				if( (luce &&  rule.Flag_luce == 1) || (gas && rule.Flag_gas == 1) ){
    					console.log("rule match", rule);
    					$("#contratto_fotovoltaico_form input[name=iva_contratto]").val(rule.Aliquota);
    					return;
    				}	
    			}
    		}
    	}
    	return;
    	
    	//Vecchio codice
    	//Prima i casi con scelta di tipo d'uso
    	if( (soggetto == 1 || soggetto == 7 || soggetto == 22) && domestico )
    		$("#contratto_fotovoltaico_form input[name=iva_contratto]").val(10);
    	if( (soggetto == 1 || soggetto == 7 || soggetto == 22) && altri_usi )
    		$("#contratto_fotovoltaico_form input[name=iva_contratto]").val(22);
    	
    	//Iva 22
    	if( soggetto == 2 || soggetto == 3 || soggetto == 13 || soggetto == 6 || soggetto == 24 || soggetto == 25 )
    		$("#contratto_fotovoltaico_form input[name=iva_contratto]").val(22);
    	
    	//Iva 10
    	if( soggetto == 14 || soggetto == 15 || soggetto == 16 || soggetto == 17 || soggetto == 18)
    		$("#contratto_fotovoltaico_form input[name=iva_contratto]").val(10);
    		
    	//Iva 0 
    	if( soggetto == 19 || soggetto == 20 || soggetto == 21 || soggetto == 22 || soggetto == 23)
    		$("#contratto_fotovoltaico_form input[name=iva_contratto]").val(0);
	});
}

function abilitaDisabilitaPIvaFields(){
	soggetto = $("#contratto_fotovoltaico_form #fk_soggetto_fotovoltaico").val();
	if( soggetto != "" && soggetto != 2 ){
		    if( $("#_r").val() == 2 )
		    	$("input[name=rag_sociale], input[name=comune_sede_hidden], input[name=top_sede], input[name=via_sede], input[name=cap_sede]").attr("required", "required");			
		    
    		requireLabel($("label[for=rag_sociale]"));
    		requireLabel($("label[for=piva]"));
    		requireLabel($("label[for=cf_sede]"));
    		requireLabel($("label[for=pec]"));
    		requireLabel($("label[for=sdi]"));
    		requireLabel($("label[for=comune_sede]"));
    		requireLabel($("label[for=via_sede]"));
    		requireLabel($("label[for=cap_sede]"));
    		
			/*
    		if( soggetto != 7 ){
    			$("input[name=codice_ateco]").attr("required", "required");
    			requireLabel($("label[for=codice_ateco]"));
    		}
    		else{
    			$("input[name=codice_ateco]").removeAttr("required");
    			notRequireLabel($("label[for=codice_ateco]"));
    		}
    		*/
    		$(".dati-societari").show();
			//$("input[name=detrazione_azienda]").parent().show();
			$(".input-field.detrazione_50_pf").hide();
    		/*
    		$("input[name=rag_sociale]").parent().show();
    		$("input[name=piva]").parent().show();
    		$("input[name=pec_sdi]").parent().show();
    		*/
    		
    	}
    	else{
    		$("input[name=rag_sociale], input[name=comune_sede_hidden], input[name=top_sede], input[name=via_sede], input[name=cap_sede], input[name=codice_ateco]").removeAttr("required");
    		notRequireLabel($("label[for=rag_sociale]"));
    		notRequireLabel($("label[for=piva]"));
    		notRequireLabel($("label[for=cf_sede]"));
    		notRequireLabel($("label[for=pec]"));
    		notRequireLabel($("label[for=sdi]"));
    		notRequireLabel($("label[for=comune_sede]"));
    		notRequireLabel($("label[for=via_sede]"));
    		notRequireLabel($("label[for=cap_sede]"));
    		//notRequireLabel($("label[for=codice_ateco]"));
    		$(".dati-societari").hide();
			//$("input[name=detrazione_azienda]").parent().hide();
			$(".input-field.detrazione_50_pf").show();
    		/*
    		$("input[name=rag_sociale]").parent().hide();
    		$("input[name=piva]").parent().hide();
    		$("input[name=pec_sdi]").parent().hide();
    		*/
    	}
}

function RequireDatiPagamento(){
	soggetto = $("#contratto_fotovoltaico_form #fk_soggetto").val();
	
	if( soggetto != 24 && soggetto != 25 ){
		if( $("input[name=fk_stato_js]").val() == "" || $("input[name=fk_stato_js]").val() == 1 || $("input[name=fk_stato_js]").val() == 2){
			$("input[name=titolare_conto_nome], input[name=titolare_conto_cognome], input[name=cf_piva_conto], input[name=iban], input[name=titolare_conto_email], input[name=titolare_conto_cellulare]").attr("required", "required");
	    	requireLabel($("label[for=titolare_conto_nome]"));
	    	requireLabel($("label[for=titolare_conto_cognome]"));
	    	requireLabel($("label[for=cf_piva_conto]"));
	    	requireLabel($("label[for=iban]"));
	    	requireLabel($("label[for=titolare_conto_email]"));		
	    	requireLabel($("label[for=titolare_conto_cellulare]"));	
		}	
	}
	else{
		$("input[name=titolare_conto_nome], input[name=titolare_conto_cognome], input[name=cf_piva_conto], input[name=iban], input[name=titolare_conto_email], input[name=titolare_conto_cellulare]").removeAttr("required");
    	notRequireLabel($("label[for=titolare_conto_nome]"));
    	notRequireLabel($("label[for=titolare_conto_cognome]"));
    	notRequireLabel($("label[for=cf_piva_conto]"));
    	notRequireLabel($("label[for=iban]"));	
    	notRequireLabel($("label[for=titolare_conto_email]"));		
    	notRequireLabel($("label[for=titolare_conto_cellulare]"));
	}
}

/*
 * Gestisce la coia degli indirizzi da residenza a fornitura
 * sia al click della checkbox
 * sia al change della residenza
 */
function initContrattoCopiaIndirizzo(){
	console.log("initContrattoCopiaIndirizzo", initContrattoCopiaIndirizzo);
		
	//Prima spunta
	$("#contratto_fotovoltaico_form input[name=copia_ind_res_in_ind_for]").click(function(){
		console.log("initContrattoCopiaIndirizzo click", initContrattoCopiaIndirizzo);
		if( $(this).is(":checked") ){
			CopiaIndirizzoResidenzaInFornitura();
		}
		else{
			$("#contratto_fotovoltaico_form input[name=comune_fornitura]").removeAttr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=via_fornitura]").removeAttr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=top_fornitura]").removeAttr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=civico_fornitura]").removeAttr("readonly", "readonly");
			//$("#contratto_fotovoltaico_form input[name=snc_fornitura]").removeAttr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=suffisso_fornitura]").removeAttr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=cap_fornitura]").removeAttr("readonly", "readonly");
		}
	});
	$("#contratto_fotovoltaico_form input[name=comune_residenza], #contratto_fotovoltaico_form input[name=via_residenza], #contratto_fotovoltaico_form input[name=top_residenza], #contratto_fotovoltaico_form input[name=civico_residenza], #contratto_fotovoltaico_form input[name=suffisso_residenza], #contratto_fotovoltaico_form input[name=cap_residenza]").change(function(){
		if( $("#contratto_fotovoltaico_form input[name=copia_ind_res_in_ind_for]").is(":checked") )
			CopiaIndirizzoResidenzaInFornitura();
	});
	
	//Seconda spunta
	$("#contratto_fotovoltaico_form input[name=copia_ind_for_in_ind_spe]").click(function(){
		console.log("initContrattoCopiaIndirizzo click", initContrattoCopiaIndirizzo);
		if( $(this).is(":checked") ){
			CopiaIndirizzoFornituraInSpedizione();
		}
		else{
			$("#contratto_fotovoltaico_form input[name=comune_spedizione]").removeAttr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=via_spedizione]").removeAttr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=top_spedizione]").removeAttr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=civico_spedizione]").removeAttr("readonly", "readonly");
			//$("#contratto_fotovoltaico_form input[name=snc_spedizione]").removeAttr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=suffisso_spedizione]").removeAttr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=cap_spedizione]").removeAttr("readonly", "readonly");
		}
	});
	$("#contratto_fotovoltaico_form input[name=comune_fornitura], #contratto_fotovoltaico_form input[name=via_fornitura], #contratto_fotovoltaico_form input[name=top_fornitura], #contratto_fotovoltaico_form input[name=civico_fornitura], #contratto_fotovoltaico_form input[name=suffisso_fornitura], #contratto_fotovoltaico_form input[name=cap_fornitura]").change(function(){
		if( $("#contratto_fotovoltaico_form input[name=copia_ind_for_in_ind_spe]").is(":checked") )
			CopiaIndirizzoFornituraInSpedizione();
	});
	
	//Residenza in spedizione
	$("#contratto_fotovoltaico_form input[name=copia_ind_res_in_ind_spe]").click(function(){
		console.log("initContrattoCopiaIndirizzo click", initContrattoCopiaIndirizzo);
		if( $(this).is(":checked") ){
			CopiaIndirizzoResidenzaInSpedizione();
		}
		else{
			$("#contratto_fotovoltaico_form input[name=comune_spedizione]").removeAttr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=via_spedizione]").removeAttr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=top_spedizione]").removeAttr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=civico_spedizione]").removeAttr("readonly", "readonly");
			//$("#contratto_fotovoltaico_form input[name=snc_spedizione]").removeAttr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=suffisso_spedizione]").removeAttr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=cap_spedizione]").removeAttr("readonly", "readonly");
		}
	});
	$("#contratto_fotovoltaico_form input[name=comune_residenza], #contratto_fotovoltaico_form input[name=via_residenza], #contratto_fotovoltaico_form input[name=top_residenza], #contratto_fotovoltaico_form input[name=civico_residenza], #contratto_fotovoltaico_form input[name=suffisso_residenza], #contratto_fotovoltaico_form input[name=cap_residenza]").change(function(){
		if( $("#contratto_fotovoltaico_form input[name=copia_ind_res_in_ind_spe]").is(":checked") )
			CopiaIndirizzoResidenzaInSpedizione();
	});
}

function CopiaIndirizzoResidenzaInFornitura(){
	$("#contratto_fotovoltaico_form input[name=comune_fornitura]").val( $("#contratto_fotovoltaico_form input[name=comune_residenza]").val() ).attr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=comune_fornitura_hidden]").val( $("#contratto_fotovoltaico_form input[name=comune_residenza_hidden]").val() ).trigger("change");
			$("#contratto_fotovoltaico_form input[name=via_fornitura]").val( $("#contratto_fotovoltaico_form input[name=via_residenza]").val() ).attr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=top_fornitura]").val( $("#contratto_fotovoltaico_form input[name=top_residenza]").val() ).attr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=top_fornitura_hidden]").val( $("#contratto_fotovoltaico_form input[name=top_residenza_hidden]").val() ).attr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=civico_fornitura]").val( $("#contratto_fotovoltaico_form input[name=civico_residenza]").val() ).attr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=suffisso_fornitura]").val( $("#contratto_fotovoltaico_form input[name=suffisso_residenza]").val() ).attr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=cap_fornitura]").val( $("#contratto_fotovoltaico_form input[name=cap_residenza]").val() ).attr("readonly", "readonly");
}

function CopiaIndirizzoFornituraInSpedizione(){
	$("#contratto_fotovoltaico_form input[name=comune_spedizione]").val( $("#contratto_fotovoltaico_form input[name=comune_fornitura]").val() ).attr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=comune_spedizione_hidden]").val( $("#contratto_fotovoltaico_form input[name=comune_fornitura_hidden]").val() );
			$("#contratto_fotovoltaico_form input[name=via_spedizione]").val( $("#contratto_fotovoltaico_form input[name=via_fornitura]").val() ).attr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=top_spedizione]").val( $("#contratto_fotovoltaico_form input[name=top_fornitura]").val() ).attr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=top_spedizione_hidden]").val( $("#contratto_fotovoltaico_form input[name=top_fornitura_hidden]").val() ).attr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=civico_spedizione]").val( $("#contratto_fotovoltaico_form input[name=civico_fornitura]").val() ).attr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=suffisso_spedizione]").val( $("#contratto_fotovoltaico_form input[name=suffisso_fornitura]").val() ).attr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=cap_spedizione]").val( $("#contratto_fotovoltaico_form input[name=cap_fornitura]").val() ).attr("readonly", "readonly");
}

function CopiaIndirizzoResidenzaInSpedizione(){
	$("#contratto_fotovoltaico_form input[name=comune_spedizione]").val( $("#contratto_fotovoltaico_form input[name=comune_residenza]").val() ).attr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=comune_spedizione_hidden]").val( $("#contratto_fotovoltaico_form input[name=comune_residenza_hidden]").val() );
			$("#contratto_fotovoltaico_form input[name=via_spedizione]").val( $("#contratto_fotovoltaico_form input[name=via_residenza]").val() ).attr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=top_spedizione]").val( $("#contratto_fotovoltaico_form input[name=top_residenza]").val() ).attr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=top_spedizione_hidden]").val( $("#contratto_fotovoltaico_form input[name=top_residenza_hidden]").val() ).attr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=civico_spedizione]").val( $("#contratto_fotovoltaico_form input[name=civico_residenza]").val() ).attr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=suffisso_spedizione]").val( $("#contratto_fotovoltaico_form input[name=suffisso_residenza]").val() ).attr("readonly", "readonly");
			$("#contratto_fotovoltaico_form input[name=cap_spedizione]").val( $("#contratto_fotovoltaico_form input[name=cap_residenza]").val() ).attr("readonly", "readonly");
}

function initSNC(){
	//init
	if( $("#contratto_fotovoltaico_form input[name=snc_residenza]").is(":checked") )
		$("#contratto_fotovoltaico_form input[name=civico_residenza]").val("").attr("readonly", "readonly").removeAttr("required");
	else
		$("#contratto_fotovoltaico_form input[name=civico_residenza]").removeAttr("readonly", "readonly").attr("required");
	
	if( $("#contratto_fotovoltaico_form input[name=snc_fornitura]").is(":checked") )
		$("#contratto_fotovoltaico_form input[name=civico_fornitura]").val("").attr("readonly", "readonly").removeAttr("required");
	else
		$("#contratto_fotovoltaico_form input[name=civico_fornitura]").removeAttr("readonly", "readonly").attr("required");
	
	if( $("#contratto_fotovoltaico_form input[name=fast_snc_fornitura]").is(":checked") )
		$("#contratto_fotovoltaico_form input[name=fast_civico_fornitura]").val("").attr("readonly", "readonly").removeAttr("required");
	else
		$("#contratto_fotovoltaico_form input[name=fast_civico_fornitura]").removeAttr("readonly", "readonly").attr("required");

	if( $("#contratto_fotovoltaico_form input[name=snc_spedizione]").is(":checked") )
		$("#contratto_fotovoltaico_form input[name=civico_spedizione]").val("").attr("readonly", "readonly").removeAttr("required");
	else
		$("#contratto_fotovoltaico_form input[name=civico_spedizione]").removeAttr("readonly", "readonly").attr("required");		
	
	if( $("#contratto_fotovoltaico_form input[name=snc_sede]").is(":checked") )
		$("#contratto_fotovoltaico_form input[name=civico_sede]").val("").attr("readonly", "readonly").removeAttr("required");
	else
		$("#contratto_fotovoltaico_form input[name=civico_sede]").removeAttr("readonly", "readonly").attr("required");	
			
	if( $("#contratto_fotovoltaico_form input[name=fast_snc_sede]").is(":checked") )
		$("#contratto_fotovoltaico_form input[name=fast_civico_sede]").val("").attr("readonly", "readonly").removeAttr("required");
	else
		$("#contratto_fotovoltaico_form input[name=fast_civico_sede]").removeAttr("readonly", "readonly").attr("required");
	//onclick
	$("#contratto_fotovoltaico_form input[name=snc_residenza]").click(function(){
		if( $("#contratto_fotovoltaico_form input[name=snc_residenza]").is(":checked") )
			$("#contratto_fotovoltaico_form input[name=civico_residenza]").val("").attr("readonly", "readonly").removeAttr("required");
		else
			$("#contratto_fotovoltaico_form input[name=civico_residenza]").removeAttr("readonly", "readonly").attr("required");
	});
	$("#contratto_fotovoltaico_form input[name=snc_fornitura]").click(function(){
		setTimeout(function(){
			if( $("#contratto_fotovoltaico_form input[name=snc_fornitura]").is(":checked") )
				$("#contratto_fotovoltaico_form input[name=civico_fornitura]").val("").attr("readonly", "readonly").removeAttr("required");
			else
				$("#contratto_fotovoltaico_form input[name=civico_fornitura]").removeAttr("readonly", "readonly").attr("required");
		}, 500);
		
	});	
	$("#contratto_fotovoltaico_form input[name=fast_snc_fornitura]").click(function(){
		if( $("#contratto_fotovoltaico_form input[name=fast_snc_fornitura]").is(":checked") )
			$("#contratto_fotovoltaico_form input[name=fast_civico_fornitura]").val("").attr("readonly", "readonly").removeAttr("required");
		else
			$("#contratto_fotovoltaico_form input[name=fast_civico_fornitura]").removeAttr("readonly", "readonly").attr("required");
	});	
	
	$("#contratto_fotovoltaico_form input[name=snc_spedizione]").click(function(){
		if( $("#contratto_fotovoltaico_form input[name=snc_spedizione]").is(":checked") )
			$("#contratto_fotovoltaico_form input[name=civico_spedizione]").val("").attr("readonly", "readonly").removeAttr("required");
		else
			$("#contratto_fotovoltaico_form input[name=civico_spedizione]").removeAttr("readonly", "readonly").attr("required");
	});		
	
	$("#contratto_fotovoltaico_form input[name=snc_sede]").click(function(){
		console.log("on click snc_Sede");
		setTimeout(function(){
			//console.log("on timeout snc_Sede", $(this).is(":checked"));
			if( $("#contratto_fotovoltaico_form input[name=snc_sede]").is(":checked") )
				$("#contratto_fotovoltaico_form input[name=civico_sede]").val("").attr("readonly", "readonly").removeAttr("required");
			else
				$("#contratto_fotovoltaico_form input[name=civico_sede]").removeAttr("readonly", "readonly").attr("required");
		}, 500);
	});	
	$("#contratto_fotovoltaico_form input[name=fast_snc_sede]").click(function(){
		if( $("#contratto_fotovoltaico_form input[name=fast_snc_sede]").is(":checked") )
			$("#contratto_fotovoltaico_form input[name=fast_civico_sede]").val("").attr("readonly", "readonly").removeAttr("required");
		else
			$("#contratto_fotovoltaico_form input[name=fast_civico_sede]").removeAttr("readonly", "readonly").attr("required");
	});	
}
/*
 * Copia nome, cognome e CF dall'anagrafica ai dati di pagamento se questi ultimi non sono già stati compilati
 */
function initCopiaDatiPagamento(){
	$("#copy-dati-to-conto").click(function(){
		$("#contratto_fotovoltaico_form input[name=titolare_conto_nome]").val( $("#contratto_fotovoltaico_form input[name=nome]").val());
		$("#contratto_fotovoltaico_form input[name=titolare_conto_cognome]").val( $("#contratto_fotovoltaico_form input[name=cognome]").val());
		$("#contratto_fotovoltaico_form input[name=cf_piva_conto]").val( $("#contratto_fotovoltaico_form input[name=cf]").val() );
		$("#contratto_fotovoltaico_form input[name=titolare_conto_email]").val( $("#contratto_fotovoltaico_form input[name=email]").val() );
		$("#contratto_fotovoltaico_form input[name=titolare_conto_cellulare]").val( $("#contratto_fotovoltaico_form input[name=cellulare]").val() );		
	});
}

/*
 * Gestisce la realzione tra i campi delle potenze
 * Attenzione: lato server viene rifatto un check usanto la tabella contratti_potenze _disponibili: eventuali modifiche alla taballa vanno riportate al codice di sotto
 */
function initContrattoPotenzeLuce(){
	
	//Formatto il numero al caricamento
	managePotenzaDisponibileCustom();
	//Mostro o nascondo il campo custom in base al valore della select
	if( $("#contratto_fotovoltaico_form #potenza_contatore").val() == -1 ){
		$("#potenza_contatore_custom").show();		
	}
	else
		$("#potenza_contatore_custom").hide();
	
	//Key up per rimuovere le virogle	
	$("#potenza_contatore_custom").keyup(function(){
		managePotenzaDisponibileCustom();
	});
	
	$("#contratto_fotovoltaico_form #potenza_contatore").change(function(){
		
		//Aggiunta dicembre 2019 per permettere valori custom
		if( $(this).val() == -1 ){
			$("#potenza_contatore_custom").show();
		}
		else	
			$("#potenza_contatore_custom").hide();
		//Fine aggiunta
		
			
		if( $(this).val() == 0 || $(this).val() == "" || $(this).val() == -1 ){
			$("#contratto_fotovoltaico_form input[name=potenza_contrattuale]").val("").removeAttr("readonly");
		}
		else{
			potenza_contrattuale = "";
			switch ( $(this).val() ) {
			  case "1.7":
			    potenza_contrattuale = "1,5";
			    $("#contratto_fotovoltaico_form input[name=potenza_contrattuale]").val(potenza_contrattuale).attr("readonly", "readonly");
			    break;
			  case "2.2":
			    potenza_contrattuale = "2";
			    $("#contratto_fotovoltaico_form input[name=potenza_contrattuale]").val(potenza_contrattuale).attr("readonly", "readonly");
			    break;  
			  case "3.3":
			    potenza_contrattuale = "3";
			    $("#contratto_fotovoltaico_form input[name=potenza_contrattuale]").val(potenza_contrattuale).attr("readonly", "readonly");
			    break;
			  case "5":
			    potenza_contrattuale = "4,5";
			    $("#contratto_fotovoltaico_form input[name=potenza_contrattuale]").val(potenza_contrattuale).attr("readonly", "readonly");
			    break;
			  case "6.6":
			    potenza_contrattuale = "6";
			    $("#contratto_fotovoltaico_form input[name=potenza_contrattuale]").val(potenza_contrattuale).attr("readonly", "readonly");
			    break;
			  default:
			    $("#contratto_fotovoltaico_form input[name=potenza_contrattuale]").val(potenza_contrattuale).removeAttr("readonly");
			    break;
			}
		}
	});
}

function managePotenzaDisponibileCustom(){
	if( $("#potenza_contatore_custom").length > 0 ){
		val = dotToComma( $("#potenza_contatore_custom").val() );
		$("#potenza_contatore_custom").val( val );
	}	
}

function initContrattoDocuments(){
	$("#contratto_fotovoltaico_form.contratto .doc-delete").click(function(){
		if( confirm("Eliminare l'allegato? L'operazione è irreversibile.") ){
			id_download = $(this).attr("rel");
			dom_download = $(this).parent();
			$("#overlay").show();
			$.ajax({
				type: "POST",
				data: "op=delete&type=contratti_fotovoltaico&id="+id_download,
				dataType : 'json',			
	   	        //contentType: false,
	        	//processData: false, 
				url: "/download",
				//async: false,
				success: function(json){
					 M.toast({html: json.msg});
					 if( json.error == 0 ){
					 	$(dom_download).remove();	
					 	$("#overlay").hide();				 	
					 }
					 else{
					 	$("#overlay").hide();
					 }
				}
			});
		}
	});

	$(".add-file-fields").click(function(){
		
		var doc_wrapper = $(this).closest(".doc_wrapper");
		var nr_allegato = $(doc_wrapper).find(".file-field").length + 1;
		var name_doc = $(doc_wrapper).attr("rel");
		if( nr_allegato > 1 )
			name_doc += "_" + (nr_allegato-1); 
		
		var html = '<div class="file-field col m6 s12 "><div class="btn"><span>Seleziona allegato ' + nr_allegato + '</span><i class="material-icons right">attach_file</i><input type="file" name="file_'+name_doc+'" single=""></div><div class="file-path-wrapper"><input class="file-path validate " type="text" name="'+name_doc+'" placeholder="" id="" value=""></div></div>';
		$(doc_wrapper).find(".dynamic-add-allegati-wrap").append(html);
		
		if( nr_allegato == 4 ){
			$(this).hide();
		}
	});
}

function initStateOps(){
	$("#approva_pre_fattibilita").click(function(){
		if( !confirm("Validare la pre fattibilità del contratto?") )
			return false;
		$(this).css("visibility", "hidden");
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "accetta_pre_fattibilita");
		formData.append("e", "contratti_fotovoltaico");
		formData.append("id", $("input[name=id]").val());
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url +  "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	M.toast({html: json.msg});
				 	setTimeout(function(){
				 		window.location.href = "/fv/contratto-fotovoltaico/" + $("input[name=id]").val() +"#checkup_pre_contrattuale";	
						location.reload();
				 	}, 3000);				 	
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#approva_pre_fattibilita").css("visibility", "visible");
					fcalert(json.msg);
				 }
			}
		});
		
		return false;
	});

	$("#back-to-pre-fattibilita").click(function(){
		$("#back-to-pre-fattibilita-msg").toggle();		
	});
	
	$("#back-to-pre-fattibilita-send").click(function(){
		$(this).hide();
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "back_to_pre_fattibilita");
		formData.append("e", "contratti_fotovoltaico");
		formData.append("id", $("input[name=id]").val());
		formData.append("motivazione", $("#back-to-pre-fattibilita-msg textarea").val());
		//Questa valutare se metterla, solo x backoffice
		if( $("input[name=incompleto_togli_accettazione]").is(":checked") )
			formData.append("riaccetta", "yes");
		else
			formData.append("riaccetta", "no");

		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url +  "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	M.toast({html: json.msg});
				 	setTimeout(function(){
				 		location.reload();
				 	}, 2000);
				 	
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#back-to-pre-fattibilita-send").show();
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});

	$("#back-to-checkup-contrattuale-from-corrispettivo").click(function(){
		$("#back-to-checkup-contrattuale-from-corrispettivo-msg").toggle();		
	});
	
	$("#back-to-checkup-contrattuale-from-corrispettivo-send").click(function(){
		$(this).hide();
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "back_to_checkup_contrattuale_from_corrispettivo");
		formData.append("e", "contratti_fotovoltaico");
		formData.append("id", $("input[name=id]").val());
		formData.append("motivazione", $("#back-to-checkup-contrattuale-from-corrispettivo-msg textarea").val());
		

		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url +  "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	M.toast({html: json.msg});
				 	setTimeout(function(){
				 		location.reload();
				 	}, 2000);
				 	
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#back-to-checkup-contrattuale-from-corrispettivo-send").show();
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});

	$("#contratto_fotovoltaico_form.contratto #attiva-contratto").click(function(){
		$("#attiva-contratto-msg").toggle();		
	});

	$("#contratto_fotovoltaico_form.contratto #ok-tecnico-con-spese-send, #contratto_fotovoltaico_form.contratto #ok-tecnico-senza-spese-send").click(function(){
		if( !confirm("Dare l'OK TECNICO al contratto? L'operazione non è reversibile.") )
			return false;
		$(this).css("visibility", "hidden");
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "ok_tecnico");
		formData.append("e", "contratti_fotovoltaico");
		formData.append("id", $("input[name=id]").val());
		if( $(this).attr("id") == "ok-tecnico-con-spese-send" ) 
			formData.append("ok_con_spese", 1);
		else
			formData.append("ok_con_spese", 0);
		formData.append("totale_spese", $("input[name=spese_extra_verifica_tecnica_totale]").val());
		formData.append("dicitura_spese", $("input[name=spese_extra_verifica_tecnica_dicitura]").val());
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url +  "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	M.toast({html: json.msg});
				 	setTimeout(function(){
						location.reload();
				 	}, 3000);
				 	
				 }
				 else{
				 	$("#overlay").hide();
					$("#contratto_fotovoltaico_form.contratto #ok-tecnico-con-spese-send, #contratto_fotovoltaico_form.contratto #ok-tecnico-senza-spese-send").css("visibility", "visible");
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});

	$("#contratto_fotovoltaico_form.contratto #rifiuta-attivazione").click(function(){
		$("#rifiuta-attivazione-msg").toggle();		
	});
	
	$("#contratto_fotovoltaico_form.contratto #rifiuta-attivazione-send").click(function(){
		$(this).hide();
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "ko_tecnico");
		formData.append("e", "contratti_fotovoltaico");
		formData.append("id", $("input[name=id]").val());
		formData.append("motivazione", $("#rifiuta-attivazione-msg textarea").val());
		if( $("input[name=rifiuta_come_da_sbloccare]").is(":checked") )
			formData.append("rifiuta_come_da_sbloccare", "yes");
		else
			formData.append("rifiuta_come_da_sbloccare", "no");
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url +  "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	M.toast({html: json.msg});
				 	setTimeout(function(){
						location.reload();
				 	}, 2000);
				 	
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#rifiuta-attivazione-send").show();
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});

	$("#contratto_fotovoltaico_form.contratto #attiva-ok-autorizzativo").click(function(){
		$("#attiva-ok-autorizzativo-msg").toggle();		
	});

	$("#contratto_fotovoltaico_form.contratto #ok-autorizzativo-con-spese-send, #contratto_fotovoltaico_form.contratto #ok-autorizzativo-senza-spese-send").click(function(){
		if( !confirm("Dare l'OK ENTI ESTERNI al contratto? L'operazione non è reversibile.") )
			return false;
		$(this).css("visibility", "hidden");
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "ok_autorizzativo");
		formData.append("e", "contratti_fotovoltaico");
		formData.append("id", $("input[name=id]").val());
		if( $(this).attr("id") == "ok-autorizzativo-con-spese-send" ) 
			formData.append("ok_con_spese", 1);
		else
			formData.append("ok_con_spese", 0);
		formData.append("totale_spese", $("input[name=spese_vincoli_autorizzativi_totale]").val());
		formData.append("dicitura_spese", $("input[name=spese_vincoli_autorizzativi_dicitura]").val());
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url +  "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	M.toast({html: json.msg});
				 	setTimeout(function(){
						location.reload();
				 	}, 3000);
				 	
				 }
				 else{
				 	$("#overlay").hide();
					$("#contratto_fotovoltaico_form.contratto #ok-autorizzativo-con-spese-send, #contratto_fotovoltaico_form.contratto #ok-autorizzativo-senza-spese-send").css("visibility", "visible");
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});

	$("#contratto_fotovoltaico_form.contratto #autorizza_ok_finanziario").click(function(){
		if( !confirm("Dare l'OK Finanziario al contratto la cui finanziaria non prevede l'acconto? L'operazione non è reversibile.") )
			return false;
		$(this).css("visibility", "hidden");
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "ok_finanziario");
		formData.append("e", "contratti_fotovoltaico");
		formData.append("id", $("input[name=id]").val());
		
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url +  "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	M.toast({html: json.msg});
				 	setTimeout(function(){
						location.reload();
				 	}, 3000);
				 	
				 }
				 else{
				 	$("#overlay").hide();
					$("#contratto_fotovoltaico_form.contratto #ok_finanziario").css("visibility", "visible");
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});

	
	$("#contratto_fotovoltaico_form.contratto #rifiuta-ok-autorizzativo").click(function(){
		$("#rifiuta-ok-autorizzativo-msg").toggle();		
	});
	
	$("#contratto_fotovoltaico_form.contratto #rifiuta-ok-autorizzativo-send").click(function(){
		$(this).hide();
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "ko_autorizzativo");
		formData.append("e", "contratti_fotovoltaico");
		formData.append("id", $("input[name=id]").val());
		formData.append("motivazione", $("#rifiuta-ok-autorizzativo-msg textarea").val());
		
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url +  "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	M.toast({html: json.msg});
				 	setTimeout(function(){
						location.reload();
				 	}, 2000);
				 	
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#rifiuta-ok-autorizzativo-send").show();
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});

	$("#ko_spese_extra").click(function(){
		if( !confirm("Mandare il contratto in KO ed emettere nota credito per fattura corrispettivo?") )
			return false;
		$(this).css("visibility", "hidden");
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "ko_spese_extra");
		formData.append("e", "contratti_fotovoltaico");
		formData.append("id", $("input[name=id]").val());
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url +  "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	M.toast({html: json.msg});
				 	setTimeout(function(){
				 		window.location.href = "/fv/contratto-fotovoltaico/" + $("input[name=id]").val();	
				 	}, 3000);				 	
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#ko_spese_extra").css("visibility", "visible");
					fcalert(json.msg);
				 }
			}
		});
		
		return false;
	});
	
	$("#vai_in_progettazione_esecutiva").click(function(){
		if( !confirm("Andare in progettazione esecutiva?") )
			return false;
		$(this).css("visibility", "hidden");
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "vai_in_progettazione_esecutiva");
		formData.append("e", "contratti_fotovoltaico");
		formData.append("id", $("input[name=id]").val());
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url +  "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	M.toast({html: json.msg});
				 	setTimeout(function(){
				 		window.location.href = "/fv/contratto-fotovoltaico/" + $("input[name=id]").val();	
				 	}, 3000);				 	
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#vai_in_progettazione_esecutiva").css("visibility", "visible");
					fcalert(json.msg);
				 }
			}
		});
		
		return false;
	});

	$("#vai_in_installazione").click(function(){
		if( !confirm("Procedere con l'installazione e avvisare il cliente?") )
			return false;
		$(this).css("visibility", "hidden");
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "vai_in_installazione");
		formData.append("e", "contratti_fotovoltaico");
		formData.append("id", $("input[name=id]").val());
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url +  "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	M.toast({html: json.msg});
				 	setTimeout(function(){
				 		window.location.href = "/fv/contratto-fotovoltaico/" + $("input[name=id]").val();	
				 	}, 3000);				 	
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#vai_in_installazione").css("visibility", "visible");
					fcalert(json.msg);
				 }
			}
		});
		
		return false;
	});

	$("#emetti_fattura_saldo_finale").click(function(){
		if( !confirm("Richiedere il saldo al cliente e attendere l'ok finanziario per procedere con l'installazione?") )
			return false;
		$(this).css("visibility", "hidden");
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "emetti_fattura_saldo_finale");
		formData.append("e", "contratti_fotovoltaico");
		formData.append("id", $("input[name=id]").val());
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url +  "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	M.toast({html: json.msg});
				 	setTimeout(function(){
				 		window.location.href = "/fv/contratto-fotovoltaico/" + $("input[name=id]").val();	
				 	}, 3000);				 	
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#emetti_fattura_saldo_finale").css("visibility", "visible");
					fcalert(json.msg);
				 }
			}
		});
		
		return false;
	});

	$("#collaudato").click(function(){
		if( !confirm("Informare i cliente del collado effettuato?") )
			return false;
		$(this).css("visibility", "hidden");
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "collaudato");
		formData.append("e", "contratti_fotovoltaico");
		formData.append("id", $("input[name=id]").val());
		formData.append("data_collaudo_on_collaudo", $("input[name=data_collaudo_on_collaudo]").val());
		formData.append("imponibile_progettazione", $("input[name=imponibile_progettazione]").val());
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url +  "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	M.toast({html: json.msg});
				 	setTimeout(function(){
				 		window.location.href = "/fv/contratto-fotovoltaico/" + $("input[name=id]").val();	
				 	}, 3000);				 	
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#collaudato").css("visibility", "visible");
					fcalert(json.msg);
				 }
			}
		});
		
		return false;
	});

	$("#pratica_gse_in_corso").click(function(){
		if( !confirm("Informare i cliente che la pratica GSE è in corso?") )
			return false;
		$(this).css("visibility", "hidden");
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "pratica_gse_in_corso");
		formData.append("e", "contratti_fotovoltaico");
		formData.append("id", $("input[name=id]").val());
		formData.append("data_connessione_in_rete_on_collaudo", $("input[name=data_connessione_in_rete_on_collaudo]").val());
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url +  "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	M.toast({html: json.msg});
				 	setTimeout(function(){
				 		window.location.href = "/fv/contratto-fotovoltaico/" + $("input[name=id]").val();	
				 	}, 3000);				 	
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#pratica_gse_in_corso").css("visibility", "visible");
					fcalert(json.msg);
				 }
			}
		});
		
		return false;
	});

	$("#impianto_attivo").click(function(){
		if( !confirm("Informare i cliente che l'impianto è attivo?") )
			return false;
		$(this).css("visibility", "hidden");
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "impianto_attivo");
		formData.append("e", "contratti_fotovoltaico");
		formData.append("id", $("input[name=id]").val());
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url +  "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	M.toast({html: json.msg});
				 	setTimeout(function(){
				 		window.location.href = "/fv/contratto-fotovoltaico/" + $("input[name=id]").val();	
				 	}, 3000);				 	
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#impianto_attivo").css("visibility", "visible");
					fcalert(json.msg);
				 }
			}
		});
		
		return false;
	});

	$("#contratto_fotovoltaico_form.contratto #incompleto-contratto").click(function(){
		$("#incompleto-msg").toggle();		
	});
	
	$("#contratto_fotovoltaico_form.contratto #incompleto-send").click(function(){
		$(this).hide();
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "back_to_checkup_contrattuale");
		formData.append("e", "contratti_fotovoltaico");
		formData.append("id", $("input[name=id]").val());
		formData.append("motivazione", $("#incompleto-msg textarea").val());
		if( $("input[name=incompleto_togli_accettazione]").is(":checked") )
			formData.append("riaccetta", "yes");
		else
			formData.append("riaccetta", "no");
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url +  "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	M.toast({html: json.msg});
				 	setTimeout(function(){
						location.reload();
				 	}, 2000);
				 	
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#incompleto-send").show();
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});

	$("#contratto_fotovoltaico_form.contratto #ko-tombale").click(function(){
		$("#ko-tombale-msg").toggle();		
	});
	
	$("#contratto_fotovoltaico_form.contratto #ko-tombale-send").click(function(){
		$(this).hide();
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "ko_tombale");
		formData.append("e", "contratti_fotovoltaico");
		formData.append("id", $("input[name=id]").val());
		formData.append("motivazione", $("#ko-tombale-msg textarea").val());
		
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url +  "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	M.toast({html: json.msg});
				 	setTimeout(function(){
						location.reload();
				 	}, 2000);
				 	
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#ko-tombale-send").show();
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});

	//Old contratti
	$("#contratto_fotovoltaico_form.contratto #annulla-verifica-contratto").click(function(){
		if( !confirm("Riportare il contratto allo stato DA VERIFICARE? Attenzione: le commissioni erogate verranno eliminate, il CRM potrebbe aver già importato il contratto e il cliente non sarà notificato.") )
			return false;
		$(this).css("visibility", "hidden");
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "annulla_verifica_contratto");
		formData.append("e", "contratti");
		formData.append("id", $("input[name=id]").val());
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url +  "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	M.toast({html: json.msg});
				 	setTimeout(function(){
				 		location.reload();	
				 	}, 2000);
				 	
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#annulla-rifiuta-contratto").css("visibility", "visible");
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});
	
	$("#contratto_fotovoltaico_form.contratto #annulla-rifiuta-contratto").click(function(){
		if( !confirm("Riportare il contratto allo stato DA VERIFICARE?") )
			return false;
		$(this).css("visibility", "hidden");
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "annulla_rifiuta_contratto");
		formData.append("e", "contratti");
		formData.append("id", $("input[name=id]").val());
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url +  "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	M.toast({html: json.msg});
				 	setTimeout(function(){
				 		location.reload();	
				 	}, 2000);
				 	
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#annulla-rifiuta-contratto").css("visibility", "visible");
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});
	
	
	
	$("#contratto_fotovoltaico_form.contratto #duplica-contratto").click(function(){
		if( !confirm("Duplicare il contratto allo stato INSERITO?.") )
			return false;
		$(this).css("visibility", "hidden");
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "duplica_contratto");
		formData.append("e", "contratti");
		formData.append("id", $("input[name=id]").val());
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url +  "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	M.toast({html: json.msg});
				 	setTimeout(function(){
				 		location.reload();	
				 	}, 2000);
				 	
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#duplica-contratto").css("visibility", "visible");
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});
	
	
	
	
	
	$("#ko-contratto").click(function(){
		$("#ko-msg").toggle();		
	});
	
	$("#ko-send").click(function(){
		$(this).hide();
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "ko");
		formData.append("e", "contratti");
		formData.append("id", $("input[name=id]").val());
		formData.append("motivazione", $("#ko-msg textarea").val());
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url +  "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 if( json.error == 0 ){
				 	M.toast({html: json.msg});
				 	setTimeout(function(){
				 		window.location.href = "/contratti";	
				 	}, 2000);
				 	
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#ko-send").show();
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});
	
	$("#in-fornitura-contratto").click(function(){
		if( confirm("Mandare in fornitura il contratto?") ){
			$(this).hide();
			$("#overlay").show();
			var formData = new FormData();
			formData.append("op", "in-fornitura");
			formData.append("e", "contratti");
			formData.append("id", $("input[name=id]").val());
			formData.append("motivazione", $("#ko-msg textarea").val());
			$.ajax({
				type: "POST",
				data: formData,
				dataType : 'json',			
	   	        contentType: false,
	        	processData: false, 
				url: ajax_url +  "/fc-ajax.php?",
				//async: false,
				success: function(json){
					 if( json.error == 0 ){
					 	M.toast({html: json.msg});
					 	setTimeout(function(){
					 		window.location.href = "/contratti";	
					 	}, 2000);
					 	
					 }
					 else{
					 	$("#overlay").hide();
					 	$("#in-fornitura-contratto").show();
					 	$("#modal1 h1").text("Attenzione");
					 	$("#modal1 .modal-content .modal-msg").html(json.msg);
					 	$("#modal1").modal("open");
					 }
				}
			});
			
			return false;
		}	
	});
	
	$("#elimina-contratto").click(function(){
		if( confirm("Eliminare il contratto e tutte le commissioni generate da esso?") ){
			$(this).hide();
			$("#overlay").show();
			var formData = new FormData();
			formData.append("op", "delete");
			formData.append("e", "contratti_fotovoltaico");
			formData.append("id", $("input[name=id]").val());
			$.ajax({
				type: "POST",
				data: formData,
				dataType : 'json',			
	   	        contentType: false,
	        	processData: false, 
				url: ajax_url +  "/fc-ajax.php?",
				//async: false,
				success: function(json){
					 if( json.error == 0 ){
					 	M.toast({html: json.msg});
					 	setTimeout(function(){
					 		window.location.href = "/contratti-fotovoltaico";	
					 	}, 2000);					 	
					 }
					 else{
					 	$("#overlay").hide();
					 	$("#elimina-contratto").show();
					 	$("#modal1 h1").text("Attenzione");
					 	$("#modal1 .modal-content .modal-msg").html(json.msg);
					 	$("#modal1").modal("open");
					 }
				}
			});
			
			return false;
		}	
	});
	
	$("#rigenera-commissioni").click(function(){
		if( confirm("(Ri)generare le commissioni del contratto?") ){
			$(this).hide();
			$("#overlay").show();
			var formData = new FormData();
			formData.append("op", "rigenera_commissioni");
			formData.append("e", "contratti_fotovoltaico");
			formData.append("id", $("input[name=id]").val());
			$.ajax({
				type: "POST",
				data: formData,
				dataType : 'json',			
	   	        contentType: false,
	        	processData: false, 
				url: ajax_url +  "/fc-ajax.php?",
				//async: false,
				success: function(json){
					 if( json.error == 0 ){
					 	M.toast({html: json.msg});	
					 	setTimeout(function(){
							location.reload();
						}, 2000);			
					 }
					 else{
					 	$("#overlay").hide();
					 	$("#elimina-contratto").show();
					 	$("#modal1 h1").text("Attenzione");
					 	$("#modal1 .modal-content .modal-msg").html(json.msg);
					 	$("#modal1").modal("open");
					 }
				}
			});
			
			return false;
		}	
	});
	
	$("#annulla-firma-otp-contratto").click(function(){
		if( confirm("Annullare la firma digitale di tutti i documenti?") ){
			$(this).hide();
			$("#overlay").show();
			var formData = new FormData();
			formData.append("op", "annulla_otp");
			formData.append("e", "contratti_fotovoltaico");
			formData.append("id", $("input[name=id]").val());
			$.ajax({
				type: "POST",
				data: formData,
				dataType : 'json',			
	   	        contentType: false,
	        	processData: false, 
				url: ajax_url +  "/fc-ajax.php?",
				//async: false,
				success: function(json){
					 if( json.error == 0 ){
					 	M.toast({html: json.msg});	
					 	setTimeout(function(){
					 		location.reload();	
					 	}, 2000);		 	
					 }
					 else{
					 	$("#overlay").hide();
					 	$("#annulla-firma-otp-contratto").show();
					 	$("#modal1 h1").text("Attenzione");
					 	$("#modal1 .modal-content .modal-msg").html(json.msg);
					 	$("#modal1").modal("open");
					 }
				}
			});
			
			return false;
		}
	});	
	
	$("#check_da_verificare_contratto").click(function(){
		if( confirm("Eseguire il controllo?") ){
			$(this).hide();
			$("#overlay").show();
			var formData = new FormData();
			formData.append("op", "check_da_verificare");
			formData.append("e", "contratti_fotovoltaico");
			formData.append("id", $("input[name=id]").val());
			$.ajax({
				type: "POST",
				data: formData,
				dataType : 'json',			
	   	        contentType: false,
	        	processData: false, 
				url: ajax_url +  "/fc-ajax.php?",
				//async: false,
				success: function(json){
					 if( json.error == 0 ){
					 	M.toast({html: json.msg});	
					 	$("#overlay").hide(); 	
					 }
					 else{
					 	$("#overlay").hide();
					 	$("#check_da_verificare_contratto").show();
					 	$("#modal1 h1").text("Attenzione");
					 	$("#modal1 .modal-content .modal-msg").html(json.msg);
					 	$("#modal1").modal("open");
					 }
				}
			});
			
			return false;
		}
	});	

	$("#check_in_verifica_tecnica").click(function(){
		if( confirm("Eseguire il controllo?") ){
			$(this).hide();
			$("#overlay").show();
			var formData = new FormData();
			formData.append("op", "check_in_verifica_tecnica");
			formData.append("e", "contratti_fotovoltaico");
			formData.append("id", $("input[name=id]").val());
			$.ajax({
				type: "POST",
				data: formData,
				dataType : 'json',			
	   	        contentType: false,
	        	processData: false, 
				url: ajax_url +  "/fc-ajax.php?",
				//async: false,
				success: function(json){
					 if( json.error == 0 ){
					 	M.toast({html: json.msg});	
					 	$("#overlay").hide(); 	
					 }
					 else{
					 	$("#overlay").hide();
					 	$("#check_in_verifica_tecnica").show();
					 	$("#modal1 h1").text("Attenzione");
					 	$("#modal1 .modal-content .modal-msg").html(json.msg);
					 	$("#modal1").modal("open");
					 }
				}
			});
			
			return false;
		}
	});	

	$("#save_alert_usmart").click(function(){
		if( confirm("Aggiornare le informazioni sull'alert?") ){
			$(this).hide();
			$("#overlay").show();
			var formData = new FormData();
			formData.append("op", "save_alert_union_smart");
			formData.append("e", "contratti_fotovoltaico");
			formData.append("id", $("input[name=id]").val());
			formData.append("alert_motivazione", $("textarea[name=alert_motivazione]").val());
			if( $("input[name=alert_gestito]").is(":checked") )
				formData.append("alert_gestito", 1);
			$.ajax({
				type: "POST",
				data: formData,
				dataType : 'json',			
	   	        contentType: false,
	        	processData: false, 
				url: ajax_url +  "/fc-ajax.php?",
				//async: false,
				success: function(json){
					 if( json.error == 0 ){
					 	M.toast({html: json.msg});	
					 	$("#overlay").hide(); 	
						$("#save_alert_usmart").show();
					 }
					 else{
					 	$("#overlay").hide();
					 	$("#save_alert_usmart").show();
					 	$("#modal1 h1").text("Attenzione");
					 	$("#modal1 .modal-content .modal-msg").html(json.msg);
					 	$("#modal1").modal("open");
					 }
				}
			});
			
			return false;
		}
	});	
}