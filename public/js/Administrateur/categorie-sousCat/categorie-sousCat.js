let x = 0;

/*******************Ajouter ligne***********************/
$(document).ready(function() {
  
  let wrapper   		= $("#tab_logic2"); //Fields wrapper
  let add_button      = $("#add_row2"); //Add button ID
  let toDelet = $("#toDelet2");
	
	$(add_button).click(function(e){ //on add input button click
    e.preventDefault();
			x++; //text box increment
      $(wrapper).after('<div class="row"><label for="nom" class="col-sm-3 col-form-label">Nom sous catégorie</label><div class="col-sm-7"><input type="text" name="nomSC" class="form-control" id="nomSC'+x+'" placeholder="Veuillez saisir le nom " required></div><div class="col-sm-0.5 align-middle" id='+x+'><a id="delete_row2" > <label class="badge badge-danger" style="margin-top: 7px;"><span class="fa fa-minus"></label></a>&nbsp;</div></div>')
	});
	
  $(toDelet).on("click","#delete_row2", function(e){ //user click on remove text
    e.preventDefault();
    $(this).parent('div').parent('div').remove(); 
    x--;
	})
});

/*******************Fin ajouter ligne***********************/
$(document).ready(function() {
    $("#submit").click(function(){
      let sousCat = [];
      for( let i=0; i <= x; i++){
        let ligneSC = {
        code : $('#nomSC'+i).val(),
        };
        sousCat.push(ligneSC);
      }
    
        $.post("addCategorie",  {
          sousCat: sousCat,
          categ : $('#nomCat').val(),
        },

        //     function(data, status){
        //     if(data.data == "done"){
        //         var x = document.getElementById("snackbar");
        //         x.className = "show";
        //         setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);  
        //         //setTimeout(function(){ window.location.reload();}, 2000)
        //         afficherBL(data.id);
        //     }
        //     else{
        //         var x = document.getElementById("snackbarError2");
        //         x.className = "show";
        //     setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);  
        //     }
        // }
        )
    })
})