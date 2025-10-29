$(document).ready(function(){
	initNoteActions();
});

function initNoteActions(){
	
	$(".salva_nota").live("click", function(){
		
		$("#overlay").show();
		var salva_nota = $(this);
		var closest_section = $(this).closest("section.note");
		console.log(closest_section);
		$(this).hide();
		
		//Declaring new Form Data Instance  
        var formData = new FormData();
		//Getting Files Collection
		var input_files = $(".nota-reply").find("input[type=file]");
		for(f=0;f<input_files.length;f++){
			var files = $(input_files[f])[0].files;
			console.log(files);
	        //Looping through uploaded files collection in case there is a Multi File Upload. This also works for single i.e simply remove MULTIPLE attribute from file control in HTML.  
	        for (var i = 0; i < files.length; i++) {
	        	//formData.append(files[i].name, files[i]); //original
	        	formData.append($(input_files[f]).attr("name") + "$" + i, files[i]);
	        }	
		}
        
        formData.append("e", "note");
        formData.append("op", "new");
        formData.append("fk_record", $(closest_section).find("input[name=nota_record]").val());
		formData.append("entita", $(closest_section).find("input[name=nota_entita]").val());
        formData.append("immagine_nota_1", $(closest_section).find("input[name=immagine_nota_1]"));
        formData.append("immagine_nota_2", $(closest_section).find("input[name=immagine_nota_2]"));
        formData.append("immagine_nota_3", $(closest_section).find("input[name=immagine_nota_3]"));
        
        formData.append("nota", $(closest_section).find("textarea[name=nota_nota]").val());
        
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
					 refreshNote(closest_section)
				 }
				 else{
				 	$("#overlay").hide();
				 	$(salva_nota).show();
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});
	
	$(".delete-nota").live("click", function(){
		if( !confirm("Eliminare la nota?") )
			return false;

		$("#overlay").show();
		
		//Declaring new Form Data Instance  
        var formData = new FormData();
		
        formData.append("e", "note");
        formData.append("op", "delete");
		formData.append("id", $(this).attr("rel"));
		
		var closest_section = $(this).closest("section.note");

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
					 refreshNote(closest_section)
				 }
				 else{
				 	$("#overlay").hide();
				 	$("#salva_nota").show();
				 	$("#modal1 h1").text("Attenzione");
				 	$("#modal1 .modal-content .modal-msg").html(json.msg);
				 	$("#modal1").modal("open");
				 }
			}
		});
		
		return false;
	});

	$(".add_nota").live("click", function(){
		var closest_section = $(this).closest("section.note");
		$(closest_section).find(".add_nota").hide();
		$(closest_section).find(".add_nota_wrap").show();
	});
}

function refreshNote(closest_section){
	$("#overlay").show();

	//Declaring new Form Data Instance  
    var formData = new FormData();
		
    formData.append("e", "note");
    formData.append("op", "get_note");
	formData.append("fk_record", $(closest_section).find("input[name=nota_record]").val());
	formData.append("entita", $(closest_section).find("input[name=nota_entita]").val());
        
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
					$(closest_section).find(".note-wrapper").html(json.msg);	
					$(closest_section).find("input[name=nota_nota]").val("").text("");		
				}
				 
				 $("#overlay").hide();
			}
		});
		
	return false;
	
}