$(document).ready(function(){
	initCashWallet();
	initBonificoIstruzioni();
});

function initCashWallet(){
	
	$("#trigger_cash_wallet, .trigger_cash_wallet").click(function(){
		$("#cash_wallet, #ricarica_form").show();
		if( !$("#sidenav").hasClass("fixed") )
			$("#sidenav").sidenav("close");
		//$("#overlay_basic").show();
	});
	
	$("#overlay_basic,#chiudi_cash_wallet,#annulla_ricarica").click(function(){
		$("#cash_wallet").hide();
		$("#overlay_basic").hide();
	});
	
	$("#ricarica_wallet").click(function(){
		$("#ricarica_form").show();
		$(this).hide();
		$("#chiudi_cash_wallet").hide();
		$("#modalita_ricarica").trigger("change");
	});
	
	$("#valore_ricarica").keyup(function(){
		var val = $("#valore_ricarica").val();
		console.log("valore", val);
		console.log("isNaN", isNaN(val));
		
		if( isNaN(val) || val == ""){
			$("#conferma_ricarica").attr("disabled", "disabled");
		}
		else{
			//val = parseFloat(val).toFixed(2);
			//$("#valore_ricarica").val(val);
			
			if( $("#ricarica_form input[name=free_fee]").val() == 1 && val <= 100 ){
				$("#carta_fee").val(0);
				var totale_ricarica = val;
				//totale_ricarica = totale_ricarica.toFixed(2);
				var fee = 0;
			}
			else{
				var totale_ricarica = val / 0.99;
				totale_ricarica = totale_ricarica.toFixed(2);
				var fee = totale_ricarica*0.01;
				fee = fee.toFixed(2);
			}
			
			$("#valore_ricarica_totale").val(totale_ricarica);
			$("#carta_fee").val(fee);
			$("#conferma_ricarica").removeAttr("disabled");
			/*
			var fee = val*0.01;
			fee = fee.toFixed(2);
			$("#carta_fee").val(fee);
			var totale_ricarica = parseFloat(val) + parseFloat(fee);
			totale_ricarica = totale_ricarica.toFixed(2);
			console.log("totale", totale_ricarica );
			$("#valore_ricarica_totale").val(totale_ricarica);
			$("#conferma_ricarica").removeAttr("disabled");
			*/
		}
			
	});
	
	$("#annulla_ricarica").click(function(){
		//$("#ricarica_form").hide();
		$("#valore_ricarica").val(0);
		//$("#ricarica_wallet,#chiudi_cash_wallet").show();
	});
	
	$("#modalita_ricarica").change(function(){
		if( $(this).val() == 2 ){
			$("#ricarica_da_wallet_info").show();
		}
		else{
			$("#ricarica_da_wallet_info").hide();
		}

		if( $(this).val() == 4 ){
			$("#bonifico_info").show();
			$("#conferma_ricarica").hide();
		}
		else{
			$("#bonifico_info").hide();
			$("#conferma_ricarica").show();
		}
		
		if( $(this).val() == 11 ){
			$("#valore_ricarica").val($(this).find("option:selected").attr("rel"));
			$("#valore_ricarica").attr("readonly", "readonly");
		}
		else{
			$("#valore_ricarica").removeAttr("readonly");
			$("#valore_ricarica").val("");
		}
		if( $(this).val() == 3 ){
			$("#stripe_msg").show();
		}
		else if( $(this).val() == 5 ){
			$("#nexi_msg").show();
		}
		else if( $(this).val() == 6 ){
			$("#cbk_msg").show();
		}
		else if( $(this).val() == 10 ){
			$("#payway_msg, .payway-fee").show();
		}
		else{
			$("#stripe_msg").hide();
			$("#nexi_msg").hide();
			$("#cbk_msg").hide();
			$("#payway_msg,.payway-fee").hide();
		}
	});
	
	$("#modalita_ricarica").trigger("change");
	$("#conferma_ricarica").click(function(){
		$(this).hide();
		
		if( $("#valore_ricarica").val() == 0 ){
			$("#modal1 h1").text("Attenzione");
			$("#modal1 .modal-content .modal-msg").html("Inserire un valore da ricaricare.");
			$("#modal1").modal("open");
			$(this).show();
			return false;
		}
		
		if(  $("#modalita_ricarica").val() == 2 && parseFloat($("#valore_ricarica").val()) > parseFloat($("input[name=disponibile]").val()) ){
			$("#modal1 h1").text("Attenzione");
			$("#modal1 .modal-content .modal-msg").html("Hai inserito un valore superioro al tuo totale disponibile. Inserisci un valore minore o uguale a " + $("input[name=disponibile]").val() + "€ per ricaricare con il wallet disponibile.");
			$("#modal1").modal("open");
			$(this).show();
			return false;
		}
			
		/*	
		if( $("#valore_prelievo").val() < 150 ){
			$("#modal1 h1").text("Attenzione");
			$("#modal1 .modal-content .modal-msg").html("Inserire un importo maggiore o uguale a 150€.");
			$("#modal1").modal("open");
			return false;
		}
		*/
		if( 1 ){
			$(this).hide();
			$("#overlay").show();
			
			if( $("#modalita_ricarica").val() == 3 ){//Carta Stripe
				var formData = new FormData();
				formData.append("op", "get_stripe_session_id");
				formData.append("e", "wallet");
				formData.append("agente", $("#ricarica_form input[name=agente]").val());
				formData.append("valore", $("#valore_ricarica").val());
				formData.append("modalita", $("#modalita_ricarica").val());
					
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
							 	var stripe = Stripe(stripe_pk);	
							 	stripe.redirectToCheckout({
								    // Make the id field from the Checkout Session creation API response
								    // available to this file, so you can provide it as argument here
								    // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
								    sessionId: json.data
								}).then(function (result) {
									alert(result.error.messag);//TODO
								    // If `redirectToCheckout` fails due to a browser or network
								    // error, display the localized error message to your customer
								    // using `result.error.message`.
								});						 	
							 }
							 else{
							 	$("#overlay").hide();
							 	$("#conferma_ricarica").show();
							 	$("#modal1 h1").text("Attenzione");
							 	$("#modal1 .modal-content .modal-msg").html(json.msg);
							 	$("#modal1").modal("open");
							 }
							 
							 $("#ricarica_wallet").show();
						}
					});
			}//end if carta
			else if( $("#modalita_ricarica").val() == 5 ){//Carta Nexi
				var formData = new FormData();
				formData.append("op", "get_nexi_form");
				formData.append("e", "wallet");
				formData.append("agente", $("#ricarica_form input[name=agente]").val());
				formData.append("valore", $("#valore_ricarica").val());
				formData.append("modalita", $("#modalita_ricarica").val());
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
							 	$("#nexi_form_wrap").html(json.data);
							 	$("#nexi_form_wrap form").trigger("submit");
							 							 	
							 }
							 else{
							 	$("#overlay").hide();
							 	$("#conferma_ricarica").show();
							 	$("#modal1 h1").text("Attenzione");
							 	$("#modal1 .modal-content .modal-msg").html(json.msg);
							 	$("#modal1").modal("open");
							 }
							 
							 $("#ricarica_wallet").show();
						}
					});
			}//end if carta
			else if( $("#modalita_ricarica").val() == 6 ){//CBK
				var formData = new FormData();
				formData.append("op", "get_cbk_tau");
				formData.append("e", "wallet");
				formData.append("agente", $("#ricarica_form input[name=agente]").val());
				formData.append("valore", $("#valore_ricarica").val());
				formData.append("modalita", $("#modalita_ricarica").val());
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
							 	window.location.href = json.data;
							 							 	
							 }
							 else{
							 	$("#overlay").hide();
							 	$("#conferma_ricarica").show();
							 	$("#modal1 h1").text("Attenzione");
							 	$("#modal1 .modal-content .modal-msg").html(json.msg);
							 	$("#modal1").modal("open");
							 }
							 
							 $("#ricarica_wallet").show();
						}
					});
			}//end if carta
			else if( $("#modalita_ricarica").val() == 10 ){//Carta Payway
				var formData = new FormData();
				formData.append("op", "get_payway_init");
				formData.append("e", "wallet");
				formData.append("agente", $("#ricarica_form input[name=agente]").val());
				formData.append("valore", $("#valore_ricarica").val());
				formData.append("valore_totale", $("#valore_ricarica_totale").val());
				formData.append("modalita", $("#modalita_ricarica").val());
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
							 	$("#conferma_ricarica").show();
							 	$("#modal1 h1").text("Attenzione");
							 	$("#modal1 .modal-content .modal-msg").html(json.msg);
							 	$("#modal1").modal("open");
							 }
							 
							 $("#ricarica_wallet").show();
						}
					});
			}//end if carta
			else if( $("#modalita_ricarica").val() == 11 ){//Buono regalo
				var formData = new FormData();
				formData.append("op", "ricarica_buono_regalo");
				formData.append("e", "wallet");
				formData.append("agente", $("#ricarica_form input[name=agente]").val());
				formData.append("valore", $("#valore_ricarica").val());
				formData.append("modalita", $("#modalita_ricarica").val());
				formData.append("buono", $("#modalita_ricarica").find("option:selected").attr("data-buono"));

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
							 	$("#ricarica_form").hide();
								$("#valore_ricarica").val(0);
								$("#ricarica_wallet,#chiudi_cash_wallet,#conferma_ricarica").show();
								$("#overlay, #cash_wallet, #overlay_basic").hide();
							 	setTimeout(function(){
							 		location.reload();
							 	}, 2000);						 	
							 }
							 else{
							 	$("#overlay").hide();
							 	$("#conferma_ricarica").show();
							 	$("#modal1 h1").text("Attenzione");
							 	$("#modal1 .modal-content .modal-msg").html(json.msg);
							 	$("#modal1").modal("open");
							 }
							 
							 $("#ricarica_wallet").show();
						}
					});
			}//end if carta
			else{//Wallet
				var formData = new FormData();
				formData.append("op", "ricarica");
				formData.append("e", "wallet");
				formData.append("agente", $("#ricarica_form input[name=agente]").val());
				formData.append("valore", $("#valore_ricarica").val());
				formData.append("modalita", $("#modalita_ricarica").val());
				formData.append("importo_donazione", $("#ricarica_form input[name=importo_donazione]:checked").val());
				
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
							 	$("#ricarica_form").hide();
								$("#valore_ricarica").val(0);
								$("#ricarica_wallet,#chiudi_cash_wallet,#conferma_ricarica").show();
								$("#overlay, #cash_wallet, #overlay_basic").hide();
							 	setTimeout(function(){
							 		location.reload();
							 	}, 2000);						 	
							 }
							 else{
							 	$("#overlay").hide();
							 	$("#conferma_ricarica").show();
							 	$("#modal1 h1").text("Attenzione");
							 	$("#modal1 .modal-content .modal-msg").html(json.msg);
							 	$("#modal1").modal("open");
							 }
							 
							 $("#ricarica_wallet").show();
						}
					});
			}//end else wallet
			
				
				return false;
		}
		});
}

function initBonificoIstruzioni(){
	$("#invia_istruzioni").click(function(){
		if( 1){
			//$(this).hide();
			$("#overlay").show();
			var formData = new FormData();
			formData.append("op", "invia_istruzioni");
			formData.append("e", "store");
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
}