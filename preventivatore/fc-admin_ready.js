$(document).ready(function(){
	initdp();
	colEquity($("#wrap nav"), $("#wrap #main"));
	initTab();
	
	/*
	const ugu = new UnionGlobalUtils();
    ugu.onReady();
	ugu.rewriteAutocomplete();
	ugu.initMaterializeCss();
	*/
	rewriteAutocomplete();
	initMaterializeCss();
	
	//rewriteAutocomplete();
	/*	
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
	*/
	initNoPaste();
	//initDelete();
	initRicercaAvanzata();
	//initBatch();
	initDataTables();
	initAssistenza();
	//initDataTableWallet();
	initPreleva();
	initScroll();
	initRichiesteConguaglio();
	initRichiesteGaranziaMdc();
	initVideoTutorial();
	initEmailConferma();
	initReview();
	initBannerAutolettura();
	initHideWallet();
	initNotifiche();
	initSbloccaUser();
	initInviaRichiestaRuoloRete();
	setTimeout(function(){
		console.log("$(window).height()", $(window).height());
		console.log("$('body').height()", $('body').height());
		if($(window).height() > $('body').height() && $(window).width() > 1024 && 0) {
			$('body').height($(window).height());
     		$('footer').addClass('shortContent').css("width", $("#wrap").width());
     	}
     	
     	if( $(window).width() > 1024){
     		$('#sidenav').addClass('sidenav-fixed');
     		//$(".sidenav-trigger").click(function(){$('.sidenav').sidenav('open');});
     		if( $(".widget.referral").length > 0 ){
     			if( $(".widget.totale-wallet-dashboard").outerHeight() > $(".widget.referral").outerHeight() )
     				$(".widget.referral").css( "height", $(".widget.totale-wallet-dashboard").outerHeight() );
     			else	
     				$(".widget.totale-wallet-dashboard").css( "height", $(".widget.referral").outerHeight() );
     		}
     			
     		
     		if( $(".widget.commissionitimelinesettimana").length > 0 )
     			$(".widget.commissionitimelinesettimana").css( "height", $(".widget.commissionitimelinemese").outerHeight() );
     		
     		if( $(".widget.contratti").length > 0 && $(".widget.iscritti").length > 0 )
     			$(".widget.iscritti").css( "height", $(".widget.contratti").outerHeight() );	
     		
     		if( $(".widget.pun").outerHeight() > $(".widget.pgas").outerHeight() )
     			$(".widget.pgas").css( "height", $(".widget.pun").outerHeight() );
     		else		
     			$(".widget.pun").css( "height", $(".widget.pgas").outerHeight() );
     			
     		if( $("#membro_bdv_section").length > 0 ){
     			if( $("#membro_bdv_section").outerHeight() > $("#membro_tesserino_section").outerHeight() )
     				$("#membro_tesserino_section").css( "height", $("#membro_bdv_section").outerHeight() );
     			else	
     				$("#membro_bdv_section").css( "height", $("#membro_tesserino_section").outerHeight() );
     		}

			const top_nav_width = $("#top_nav").outerWidth();
			li_total_width = 0;
			$("#top_nav li").each(function(){
				li_total_width += $(this).outerWidth();
			});

			top_nav_free_space = top_nav_width - li_total_width + $("#mega_search").outerWidth() - 35;
			$("#mega_search").css("width", top_nav_free_space);
     	}
     	
     	else{
     		$("nav.top-nav").css("max-width", $(window).width());
     	}
	}, 500);
	
	$('#mega_search').autocomplete({
        ajaxUrl: ajax_url +  "/fc_ajax_mega_search.php?par=no_add",		
		inputId: "mega_search",
		minLength: 3,
		onSelect: function( el ) {
			window.open(home_url + $(el).attr("rel"));
		}
    });
	$("li.mega-search i").click(function(){
		$("#mega_search").trigger("keyup");
	});
	
	$('.tooltipped').tooltip();
	//$(".material-tooltip").remove();
	$("#sidenav-resize").click(function(){
		$("body").toggleClass("sidenav-closed");
	});
	
	$(".email_copy").click(function(){
    	el = $(this).siblings("input[name=email]");
    	to_copy = $(el)[0];
    	to_copy.select();
    	to_copy.setSelectionRange(0, 99999); /* For mobile devices */
		/* Copy the text inside the text field */
  		navigator.clipboard.writeText(to_copy.value);
    	//document.execCommand("copy");
    	M.toast({html: "Email " + to_copy.value + " copiata negli appunti"});
    });

	initSideMenuSearch();
});

function initSideMenuSearch() {
	if( $("#side-menu-search").length == 0 )
		return;

	let vociMenu = {};
	
	// Raccoglie dinamicamente i link dal menu
	$('#sidenav a').each(function() {
		let testo = $(this).clone().children().remove().end().text().trim(); // Strip tag
        let link = $(this).attr('href');
        vociMenu[testo] = link; // Materialize usa `{chiave: null}` per l'autocomplete
        //$(this).data('href', link); // Salviamo l'href nel data
	});

	console.log("vociMenu", vociMenu);

	// Inizializza l'autocomplete di Materialize
	$('#side-menu-search').autocomplete({
        data: vociMenu,
		inputId: "side-menu-search",
		minLength: 2,
		onSelect: function( el ) {
			//SE $(el).find("span").attr("rel") non inizia per http
			if( $(el).find("span").attr("rel").indexOf("https") == -1 )
				window.open(home_url + $(el).find("span").attr("rel"), '_blank');
			else
				window.open($(el).find("span").attr("rel"), '_blank');
		}
    });
}

// Aggiorna il dataset di ricerca all'inizio

function initVideoTutorial(){
	$("#modal_video").modal({
    	onCloseEnd: function() {$("#modal_video .video-container").html(""); } // Callback for Modal close
    });
            
    $(".video-tutorial-link").click(function(){
	    $("#modal_video h4").text( $(this).attr("vt-title") );
	    $("#modal_video .video-container").html('<iframe width="560" height="315" src="'+$(this).attr("vt-url")+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
	    $("#modal_video").modal("open");
    }); 	
}

function initNotifiche(){
	$("#notifiche_top a").click(function(){
		//$("#nr_notifiche").html("");
	});
	if( $("#nr_notifiche").length > 0 && $("#notifiche_banner").length > 0 ){
		setTimeout(function(){
			$("#notifiche_banner").addClass("active");
		}, 1500);	
	}
}
function initHideWallet(){
	$("#hide_wallet input").click(function(){
		if( $("#hide_wallet input:checked").length > 0 )
			$(".dashwall .totale-wallet-dashboard .row").removeClass("hide_wallet");
		else
			$(".dashwall .totale-wallet-dashboard .row").addClass("hide_wallet");
			
		var formData = new FormData();
		formData.append("op", "hide_wallet");
		formData.append("e", "networkers");
		formData.append("show_wallet", $("#hide_wallet input:checked").length);
		
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url +  "/fc-ajax.php?",
			//async: false,
			success: function(json){
				 	
			}
		});
	});

	$(".totale-wallet-dashboard input[name=condividi_gettone]").change(function(){
		
		$("#overlay").show();

		var formData = new FormData();
		formData.append("op", "condividi_gettone");
		formData.append("e", "networkers");
		formData.append("condividi_gettone", $(".totale-wallet-dashboard input[name=condividi_gettone]:checked").length);
		
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
					$("#modal1 h1").text("Attenzione");
					$("#modal1 .modal-content .modal-msg").html(json.msg);
					$("#modal1").modal("open");
				}
			}
		});
	});
}

function initBannerAutolettura(){
	if( $("#autolettura_gas_banner").length > 0 ){
		setTimeout(function(){
			$("#autolettura_gas_banner").addClass("active");
		}, 1500);	
	}
	
}

function initReview(){
	setTimeout(function(){
		if( show_review ){
			$("#modal_review").modal("open");
		}	
	}, 2000);
	
	
	$("#review_left").click(function(){
		$("#modal_review").modal("close");
		var formData = new FormData();
		formData.append("op", "save_recensione");
		formData.append("e", "networkers");
		$.ajax({
			type: "POST",
			data: formData,
			dataType : 'json',			
   	        contentType: false,
        	processData: false, 
			url: ajax_url + "/fc-ajax.php?",
			//async: false,
			success: function(json){
			}
		});
		
		
	});
}
function initEmailConferma(){
	$("#resend-confirm-email").click(function(){
		if( !confirm("Inviare di nuovo la mail con il link di conferma?") )
			return false;
			
		//$(this).css("visibility", "hidden");
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "resend_conferma_mail");
		formData.append("e", "email");
		formData.append("email", $(this).attr("rel"));
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
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});
	
	
}

function initSbloccaUser(){
	$(".sblocca-user").click(function(){
		if( !confirm("Sbloccare l'account?") )
			return false;
		$(this).css("visibility", "hidden");
		$(this).parent().addClass("pending");
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "sblocca_login");
		formData.append("e", "networkers");
		formData.append("id", $(this).attr("rel"));
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
				 	$(".conguaglio-richiesta.pending").hide();
				 	$("#overlay").hide();
				 }
				 else{
				 	$("#overlay").hide();
				 	$(".conguaglio-richiesta.pending .sblocca-user").css("visibility", "visible");
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});
}

function initInviaRichiestaRuoloRete(){
	$(".richiedi-ruolo-rete").click(function(){
		if( !confirm("Inviare la canditatura per il ruolo rete disponibile?") )
			return false;
		$(this).css("visibility", "hidden");
		$(this).parent().addClass("pending");
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "richiesta_ruolo_rete");
		formData.append("e", "networkers");
		formData.append("ruolo", $(this).attr("rel"));
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
				 	$(".d-msg.pending").hide();
				 	$("#overlay").hide();
				 }
				 else{
				 	$("#overlay").hide();
				 	$(".d-msg.pending .richiedi-ruolo-rete").css("visibility", "visible");
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});
}

function initRichiesteConguaglio(){
	$(".approva-conguaglio-user").click(function(){
		if( !confirm("Approvare la richiesta?") )
			return false;
		$(this).css("visibility", "hidden");
		$(this).parent().addClass("pending");
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "approva_conguaglio_user");
		formData.append("e", "contratti");
		formData.append("id", $(this).attr("rel"));
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
				 	$(".conguaglio-richiesta.pending").hide();
				 	$("#overlay").hide();
				 }
				 else{
				 	$("#overlay").hide();
				 	$(".conguaglio-richiesta.pending .approva-conguaglio-user").css("visibility", "visible");
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});
	
	$(".rifiuta-conguaglio-user").click(function(){
		if( !confirm("Rifiutare la richiesta?") )
			return false;
		$(this).css("visibility", "hidden");
		$(this).parent().addClass("pending");
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "rifiuta_conguaglio_user");
		formData.append("e", "contratti");
		formData.append("id", $(this).attr("rel"));
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
				 	$(".conguaglio-richiesta.pending").hide();
				 	$("#overlay").hide();
				 }
				 else{
				 	$("#overlay").hide();
				 	$(".conguaglio-richiesta.pending .rifiuta-conguaglio-user").css("visibility", "visible");
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});
}

function initRichiesteGaranziaMdc(){
	$(".approva-garanzia-user").click(function(){
		if( !confirm("Approvare la richiesta?") )
			return false;
		$(this).css("visibility", "hidden");
		$(this).parent().addClass("pending");
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "approva_garante");
		formData.append("e", "contratti");
		formData.append("id", $(this).attr("rel"));
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
				 	$(".garanzia-richiesta.pending").hide();
				 	$("#overlay").hide();
				 }
				 else{
				 	$("#overlay").hide();
				 	$(".garanzia-richiesta.pending .approva-conguaglio-user").css("visibility", "visible");
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});
	
	$(".rifiuta-garanzia-user").click(function(){
		if( !confirm("Rifiutare la richiesta?") )
			return false;
		$(this).css("visibility", "hidden");
		$(this).parent().addClass("pending");
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "rifiuta_garante");
		formData.append("e", "contratti");
		formData.append("id", $(this).attr("rel"));
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
				 	$(".garanzia-richiesta.pending").hide();
				 	$("#overlay").hide();
				 }
				 else{
				 	$("#overlay").hide();
				 	$(".garanzia-richiesta.pending .rifiuta-garanzia-user").css("visibility", "visible");
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});

	$(".elimina-garanzia-mdc").click(function(){
		if( !confirm("Elilminare la garanzia?") )
			return false;
		$(this).css("visibility", "hidden");
		$(this).addClass("pending");
		$("#overlay").show();
		var formData = new FormData();
		formData.append("op", "cancella_garante");
		formData.append("e", "contratti");
		formData.append("id", $(this).attr("rel"));
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
					}, 2000);	
				 }
				 else{
				 	$("#overlay").hide();
				 	$(".elimina-garanzia-mdc.pending").css("visibility", "visible");
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});
}

function initDataTableWallet(){
	if( $("#wallet_table").length > 0 ){
		$('#wallet_table').DataTable({
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
			  dom: 'Blfrtip',
			  buttons: [
			        'print', 'excel'
			    ]
		});
	}
}

function initPreleva(){
	if( $("input[name=fk_ruolo]").val() == 7 && ($("select[name=fk_regime_iva]").val() == 2 || $("select[name=fk_regime_iva]").val() == 3) ){
		$("#valore_prelievo").on("keyup", function(){
			if( $("select[name=fk_regime_iva]").val() == 2 ){
				//Metti in $("#preleva_form input[name=previdenza]") un terzo del 33,78% del 78% di $("#valore_prelievo").val() arrotondato a 2 cifre decimali
				$("#preleva_form input[name=previdenza]").val( Math.round( ( $("#valore_prelievo").val() * 0.78 * 0.3378) / 3 * 100 ) / 100 );
			}
			if( $("select[name=fk_regime_iva]").val() == 3 ){
				//Metti in $("#preleva_form input[name=previdenza]") il 23% del 78% di $("#valore_prelievo").val() arrotondato a 2 cifre decimali
				$("#preleva_form input[name=previdenza]").val( Math.round( ( $("#valore_prelievo").val() * 0.78 * 0.24) / 3 * 100 ) / 100 );
			}
		});
		$("#valore_prelievo").trigger("keyup");
		
	}
		$("#preleva").click(function(){
			$("#preleva_form").show(500);
			$("#preleva_form label").addClass("active");
			return false;
		});
		
		$("#annulla_prelievo").click(function(){
			$("#preleva_form").hide(500);
			$("#valore_prelievo").val(0);
		});
		
		$("#conferma_prelievo").click(function(){
			if( $("#valore_prelievo").val() == 0 ){
				$("#modal1 h1").text("Attenzione");
				$("#modal1 .modal-content .modal-msg").html("Inserire un importo da prelevare.");
				$("#modal1").modal("open");
				return false;
			}
			
			if( $("#valore_prelievo").val() < 150 && $("#preleva_form input[name=e]") == "e" ){
				$("#modal1 h1").text("Attenzione");
				$("#modal1 .modal-content .modal-msg").html("Inserire un importo maggiore o uguale a 150€.");
				$("#modal1").modal("open");
				return false;
			}
			
			var disclaimer_conguagli = "";
			if( $("input[name=fk_ruolo]").val() == 7 )
				disclaimer_conguagli = "";
			else
				disclaimer_conguagli = "Attenzione: prima di procedere con il prelievo, accertati sempre che sul tuo wallet disponibile rimanga la disponibilità necessaria per garantire il conguaglio delle tue prossime bollette.";

			if( confirm("Confermare il prelievo di " + $("#valore_prelievo").val() + "€?" + disclaimer_conguagli) ){
				$(this).hide();
				$("#overlay").show();
				var formData = new FormData();
				formData.append("op", "preleva");
				if( $("#preleva_form input[name=e]").length > 0 )
					formData.append("e", $("#preleva_form input[name=e]").val());
				else
					formData.append("e", "prelievi");
				
				formData.append("agente", $("#preleva_form input[name=agente]").val());
				formData.append("valore", $("#valore_prelievo").val());
				formData.append("nota", $("#nota_prelievo").val());
				
				if( $("#preleva_form input[name=importo_donazione_prelievo]").length > 0 )
					formData.append("importo_donazione", $("#preleva_form input[name=importo_donazione_prelievo]:checked").val());

				if( $("#preleva_form input[name=previdenza]").length > 0 )
					formData.append("previdenza", $("#previdenza").val());

				if( $("#preleva_form select[name=iban_prelievo_park]").length > 0 )
					formData.append("iban_prelievo_park", $("#preleva_form select[name=iban_prelievo_park]").val());

				if( $("#preleva_form input[name=iban_prelievo_park_altro]").length > 0 )
					formData.append("iban_prelievo_park_altro", $("#preleva_form input[name=iban_prelievo_park_altro]").val());

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
						 		if( json.review == 1 ){
						 			loc =  window.location.href;
						 			window.location.href = loc + "&r=1"; 
						 			location.reload();
						 		}
						 		else
						 			location.reload();
						 	}, 2000);						 	
						 }
						 else{
						 	if( json.data == "redirect_insoluti" ){
						 		window.location.href = "/insoluti?preleva="+$("#valore_prelievo").val() + "&nota=" + $("#nota_prelievo").val();
						 	}
						 	else{
						 		$("#overlay").hide();
							 	$("#conferma_prelievo").show();
							 	$("#modal1 h4").text("Attenzione");
							 	$("#modal1 .modal-content .modal-msg").html(json.msg);
							 	$("#modal1").modal("open");	
						 	}
						 	
						 }
					}
				});
				
				return false;
		}
		});
}


function initNoPaste(){
	no_paste = $("input.no-paste");
	for(i=0; i<no_paste.length; i++){
		const pasteBox = $(no_paste[i])[0];
		pasteBox.onpaste = function(e) {
  			e.preventDefault();
  			return false;
	    };
	}
}

function initScroll(){
	$(window).scroll(function() {
		//console.log(this.oldScroll > this.scrollY);
  		this.oldScroll = this.scrollY;
		if( $(window).scrollTop() > 120){
			$("body").addClass("sticky");
		}
		else
			$("body").removeClass("sticky"); 	
	});
	
}

function initAssistenza(){
	$(".assistenza-trigger,.assistenza-trigger-top, .assistenza-trigger-footer,.assistenza-trigger-dashboard").click(function(){
		$(".assistenza-wrap").removeClass("faq-mode").addClass("ticket-mode");		
		$(".assistenza-subtitle.faq").hide();
		$(".assistenza-subtitle.ticket").show();
		$("#faq-wrap").hide();
		$(".assistenza-other-options h5").hide();
		$(".assistenza-other-options").show();
		$(".ao-rete").hide();
		clearAssistenzaPopUp();
		
		$(".assistenza-wrap").toggleClass("open");
		$(this).removeClass("pulse");
	});
	
	$(".faq-trigger-top").click(function(){
		$(".assistenza-wrap").removeClass("ticket-mode").addClass("faq-mode");
		$(".assistenza-subtitle.faq").show();
		$(".assistenza-subtitle.ticket").hide();
		$("#faq-wrap").show();
		$(".assistenza-other-options h5").show();
		$(".assistenza-other-options").hide();
		$(".ao-rete").show();
		
		clearAssistenzaPopUp();
		
		$(".assistenza-wrap").toggleClass("open");
		$(this).removeClass("pulse");
	});
	
	$(".close-assistenza").click(function(){
		$(".assistenza-wrap").removeClass("open");
	});
	
   $(window).scroll(function() {
   	   //console.log("calc(50% - " + $(".assistenza-trigger").width() + ")");
	   if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
	       $(".assistenza-trigger").css("right", "2%");
	       $(".assistenza-trigger").css("right", "calc(50% - " + $(".assistenza-trigger").width() + "px)");
	   }
	   else
	   	   $(".assistenza-trigger").show().css("right", "2%");;
	   	   $(".assistenza-trigger").css("right", "calc(50% - " + $(".assistenza-trigger").width() + "px)");
	});
}

function clearAssistenzaPopUp(){
	
	$("#ticket_form input[name=fk_categoria_faq]").val("").formSelect();
	$("#ticket_form textarea").val("");
		
	$(".assistenza-wrap, .assistenza-wrap > div").css("height", $(window).height() - 100);
	$(".assistenza-content .secondo-livello, .assistenza-content .terzo-livello, .assistenza-other-options").hide("fade");
	$(".assistenza-content .terzo-livello").html("");
	$(".assistenza-content .secondo-livello .faq-cat-btn-wrap").html("");
	$(".primo-livello .faq-cat-btn").removeClass("active");
	$(".secondo-livello .faq-cat-btn").removeClass("active");
	$("#search_faq").val("");
	$(".assistenza-content .primo-livello").show("fade");
	$("#ticket_form div.fk_contratto select").val("").formSelect();
		$("#ticket_form div.fk_pdb select").val("").formSelect();
		$("#ticket_form div.luce_gas select").val("").formSelect();
		$("#ticket_form div.fk_categoria_faq select").val("").formSelect();
		$("#ticket_form div.fk_motivazione_ricevuta select").val("").formSelect();

		$("#ticket_form div.fk_contratto").hide();
		$("#ticket_form div.fk_pdb").hide();
		$("#ticket_form div.luce_gas").hide();
		$("#ticket_form div.fk_motivazione_ricevuta, .ricevuta-disclaimer").hide();
		$("#ticket_form div.fk_categoria_faq").hide();
	$(".faq_suggestions").hide();
	$("#ticket_form_wrap").hide();
	$("#ticket_form #do_apri_ticket").show();
}

dt_export = 0;
function initDataTables(){
	order_col = 0;
		if( $('#contratti-table').length > 0 )
			order_col = 0;
			if( $('#fatture-table').length > 0 )
			order_col = 10;
	if( dt_export == 1 ){		
		$('#utenti-table, #fatture-table, #ripartizioni_table, .data-table-this').DataTable({
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
			  dom: 'Blfrtip',
			  order: [[ order_col, "desc" ]],
			  "deferRender": true,
			  "pageLength": 10,
			  buttons: [
			        'print', 'excel'
			   ],
			  "scrollX": true
		});
		/*
		$('#networkers-table').DataTable({
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
			  dom: 'Blfrtip',
			  order: [[ order_col, "desc" ]],
			  deferRender: true,
			  processing: true,
		      serverSide: true,
		      "columns": [
		            { "data": "codice_sponsor" },
		            { "data": "nome_membro" },
		            { "data": "email" },
		            { "data": "cellulare" },
		            { "data": "nome_stato" },
		            { "data": "nome_sponsor" },
		            { "data": "nome_comune" },
		            { "data": "provincia" },
		            { "data": "regione" },
		            { "data": "op" },
		        ],
		      ajax: "../fc-admin/fc-ajax-dt.php",
			  buttons: [
			        'print', 'excel'
			    ],
			  "scrollX": true
		});
		*/
	}
	else{
		
		$('#utenti-table, #fatture-table, #ripartizioni_table, .data-table-this').DataTable({
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
	    },
	    dom: 'lfrtip',
	    order: [[ order_col, "desc" ]]
	  },
	  	"scrollX": true
		});
	}
	
	if( $("table#blacklist").length	 > 0 ){
		
		blacklist_table = $('table#blacklist').DataTable({
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
			  dom: 'Blfrtip',
			  order: [[ 3, "desc" ]],
			  deferRender: true,
			  "pageLength": 10,
			  buttons: [
			        'print', 'excel'
			    ],
			  "scrollX": true
		});
		/*
	    var datatable = blacklist_table.DataTable();
                $('table#blacklist thead tr').clone(true).appendTo( 'table#blacklist thead' );
                 $('table#blacklist thead tr:eq(1) th').each( function (i) {
                    var title = $(this).text();
                    $(this).html( '<input type="text" placeholder="Cerca '+title+'" />' );
                         
                    $( 'input', this ).on( 'keyup change', function () {
                                    if ( datatable.column(i).search() !== this.value ) {
                                        datatable
                                            .column(i)
                                            .search( this.value )
                                            .draw();
                                    }
                                } );
                            } );
		*/
	}
	
}
function initRicercaAvanzata(){
	$("#switch-ricerca").click(function(){
		$("#ricerca-avanzata").slideToggle();	
		return false;
	});
	
	$(".chip i").click(function(){
		input_name = $(this).siblings("span").attr("rel");
		
		if( $(this).closest("form").find("input[name='"+input_name+"']").length > 0 ){
			$(this).closest("form").find("input[name='"+input_name+"']").val("");
		}
		else{
			$(this).closest("form").find("select[name="+input_name+"] option").removeAttr("selected");
			$(this).closest("form").find("select[name="+input_name+"] option:first").attr("selected", "selected");
		}
		location.href = $(this).closest("form").attr("rel");
		$(this).closest("form").submit();	
	});	
}



function getHeight(el){
	return $(el).outerHeight() + parseInt($(el).css("margin-top")) + parseInt($(el).css("margin-bottom")); 	
}


function ajaxDelete(op, id){
	response = "";
	$.ajax({
		type: "POST",
		data: "op="+op+"&id="+id,
		dataType : 'json',
		url: ajax_url + "/fc-ajax.php?op="+op+"&id="+id,
		async: false,
		success: function(json){
			response = json;
		}
	});
	return response;
}

function ajaxAsync(op, id){
	response = "";
	$.ajax({
		type: "POST",
		data: "op="+op+"&id="+id,
		dataType : 'json',
		url: ajax_url + "/fc-ajax.php?t="+Date.now(),
		async: false,
		success: function(json){
			response = json;
		}
	});
	return response;
}


function fcalert(msg, title="Attenzione"){
	$("#modal1 h4").text(title);
	$("#modal1 .modal-content .modal-msg").html(msg);
	$("#modal1").modal("open");
}

function showToast(html_to_toast){
	M.toast({html: html_to_toast});
}

function customRound(number){
	return Math.round(number*100)/100;
}
function commaToDot(string){
	var stringy = string.toString().replace(/\,/g, '.');
	return stringy;	
}

function dotToComma(string){	
	if( string != undefined ){
		var stringy = string.toString().replace(/\./g, ',');
		return stringy;	
	}
	
}
function removeDots(string){
	var stringy = string.toString().replace(/\./g, '');
	stringy = stringy.replace(/\-/g, '');
	stringy = stringy.replace(/\€/g, '');
	stringy = stringy.replace(/\%/g, '');
	return stringy;
}

function removeDotsAllowNegativa(string){
	var stringy = string.toString().replace(/\./g, '');
	//stringy = stringy.replace(/\-/g, '');
	stringy = stringy.replace(/\€/g, '');
	stringy = stringy.replace(/\%/g, '');
	return stringy;
}

function initdp(){
	anni = [];
	for(i=1940; i<2003; i++){
		anni.push(i);
	}
    $('.datepicker').datepicker({
    		i18n: {
                months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
                monthsShort: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
                weekdays: ["Domenica","Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
                weekdaysShort: ["Dom","Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
                weekdaysAbbrev: ["D","L", "M", "M", "G", "V", "S"],
                cancel: 'Annulla',
                clear: 'Pulisci'
           },
            format: 'd/m/yyyy',
            minDate: new Date('1940/01/01'),
            maxDate: new Date('2002/12/31'),
            yearRange: [1940, 2002],
    		autoClose: true,
    		onSelect: function(el){
    			console.log("onSelect", el);
    			console.log("this", $(this));
    		}
    });
    
    $(".filter-data").click(function(){
    	$(this).siblings(".datepicker").trigger("click");	
    });
    if( $(".filter-data-dal").attr("rel") != "" ){
    	$(".filter-data-dal").datepicker('setDate', new Date( $(".filter-data-dal").attr("rel") ));
    }
    
    if( $(".filter-data-al").attr("rel") != "" ){
    	$(".filter-data-al").datepicker('setDate', new Date( $(".filter-data-al").attr("rel") ));
    }
    
     if( $(".batch-data-dal").attr("rel") != "" ){
    	$(".batch-data-dal").datepicker('setDate', new Date( $(".batch-data-dal").attr("rel") ));
    }
    $('#cur_date').datepicker('setDate', new Date( $('#cur_date').attr("rel") ));
    
    if( $("input[name=data_nascita]").length > 0 ){
    	if( $("input[name=data_nascita]").val() != "" && $("input[name=data_nascita]").attr("type") == "text" ){
			str = $("input[name=data_nascita]").val().split("-");
			d = str[2]+"/"+str[1]+"/"+str[0];
			$("input[name=data_nascita]").val( d ).datepicker('setDate', new Date( ymd ));
		}	
    }
    
    $('.timepicker').timepicker({
    		twelveHour: false,
    		step: '15',
    		i18n: {
			        cancel: 'Annulla',
                	clear: 'Pulisci',
                	ok: "Ok",
                	done: "Ok"
            }
    });
  
}

function initTab(){
	 //$('.voltura_tabs .tabs').tabs();
	 /*
	 $(".tabs").tabs("select", "tab_fb");
	 $("#tab_fb button.refresh").click(function(){
	 	refreshGpsData();
	 });
	 $("#tab_disposizioni button.refresh").click(function(){
	 	searchDisposizioni();
	 });
	 */
}

function colEquity(cols){
/* 	pareggia l'altezza di due o pi� elementi nel DOM 
	Es. colEquity('.colonna1','.colonna2','.colonna3');
*/
var maxh = 0;
thish = new Array();

for (var i = 0; i < arguments.length; i++)
  { 

	thish[i] = $(arguments[i]).outerHeight() + parseInt( $(arguments[i]).css('marginTop') ) + parseInt( $(arguments[i]).css('marginBottom') ) + parseInt( $(arguments[i]).css('paddingTop') ) + parseInt( $(arguments[i]).css('paddingBottom') ); 
	
	if ( thish[i] > maxh ){	  
		maxh = thish[i]; 
	} else {
		
	}
  }

for (var i = 0; i < arguments.length; i++)
  { 
	  if ( thish[i] < maxh ) {
		 var thath = maxh - parseInt( $(arguments[i]).css('marginTop') ) - parseInt( $(arguments[i]).css('marginBottom') ) - parseInt( $(arguments[i]).css('paddingTop') ) - parseInt( $(arguments[i]).css('paddingBottom') ); 
		 $(arguments[i]).css('minHeight',thath); 
	  }
  }
};/**/

function getCheckTableChecked(){
	// Get all checkboxes with the specified class
	const checkboxes = document.querySelectorAll('.check-table');

	// Initialize an empty array to store the values
	const valuesArray = [];

	// Loop through each checkbox
	checkboxes.forEach(checkbox => {
	// Check if the checkbox is checked
	if (checkbox.checked) {
		// Get the value of the 'rel' attribute and add it to the array
		const relValue = checkbox.getAttribute('rel');
		valuesArray.push(relValue);
	}
	});

	return valuesArray;
}