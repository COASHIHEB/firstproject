/************************pagination, serach **********************/
$(document).ready(function () {
  $('#tableAllStock').DataTable({
    responsive: true,
    "lengthMenu": [10, 25, 50, 75, 100],
  });

  $('#tableMedicamentBientotExpire').DataTable({
    responsive: true,
    "lengthMenu": [10, 25, 50, 75, 100],
  });
  $('#tableMedicamentBientotTermine').DataTable({
    responsive: true,
    "lengthMenu": [10, 25, 50, 75, 100],
  });
});
/************************fin pagination, serach **********************/

$(document).ready(function () {

  let firstOpenPage = true;
  getTableAllStock();
});

/************************fonction de recuperation de tous les achats **********************/
function getTableAllStock() {
  $.get("allStock", {},
    function (data, status) {
      let divAllStock;
      data.forEach(function (produit, index) {
        divAllStock = '<tr><td class="text-center">' + (index+1) + '</td><td contenteditable="true" class="text-center" id="nom' + produit.idProd + '">' + produit.nom + '</td><td contenteditable="true" class="text-center" id="description' + produit.idProd + '">' + produit.description + '</td><td contenteditable="true" class="text-center" id="quantiteReste' + produit.idProd + '">' + produit.quantiteReste + '</td><td contenteditable="true" class="text-center" id="dateExp' + produit.idProd + '">' + produit.dateExp + '</td><td contenteditable="true" class="text-center" id="minQuantite' + +produit.idProd + '">' + produit.minQuantite + '</td><td class="text-center"><button class=" btn btn-danger btn-xs" onclick="deleteProduit(' + produit.idProd + ')"><span class="fa fa-trash"></span></button>&nbsp;&nbsp;<button class=" btn btn-success btn-xs" onclick="updateEmploye(' + produit.idProd + ')"><span class="fa fa-edit"></span></button></td></tr>';
        var table = $('#tableAllStock').DataTable();
        table.row.add($(divAllStock)).draw();
      });
      $('#tableMedicamentBientotExpire').DataTable().clear().draw();
      getTableMedicamentBientotExpire();
      $('#tableMedicamentBientotTermine').DataTable().clear().draw();
      getTableMedicamentBientotTermine();

    });
}
/************************fin fonction de recuperation de tous les achats**********************/


/************************fonction de recuperation de tous les achats **********************/
function getTableMedicamentBientotExpire() {
  $.get("stockBientotExpire", {},
    function (data, status) {
      let divAllStock;
      data.forEach(function (produit, index) {
        divAllStock = '<tr><td class="text-center">' + index + '</td><td class="text-center" >' + produit.nom + '</td><td contenteditable="true" class="text-center" >' + produit.quantiteReste + '</td><td contenteditable="true" class="text-center" id="dateExp' + produit.idProd + '">' + produit.dateExp + '</td></tr>';
        var table = $('#tableMedicamentBientotExpire').DataTable();
        table.row.add($(divAllStock)).draw();
      });

    });
}
/************************fin fonction de recuperation de tous les achats**********************/

/************************fonction de recuperation de tous les achats **********************/
function getTableMedicamentBientotTermine() {
  $.get("stockMinimum", {},
    function (data, status) {
      let divAllStock;
      data.forEach(function (produit, index) {
        divAllStock = '<tr><td class="text-center">' + index + '</td><td class="text-center" >' + produit.nom + '</td><td contenteditable="true" class="text-center" >' + produit.quantiteReste + '</td><td contenteditable="true" class="text-center" id="dateExp' + produit.idProd + '">' + produit.dateExp + '</td></tr>';
        var table = $('#tableMedicamentBientotTermine').DataTable();
        table.row.add($(divAllStock)).draw();
      });

    });
}
/************************fin fonction de recuperation de tous les achats**********************/

/************************aler supprimer produit**********************/
function deleteProduit(id) {
  swal({
      title: "êtes vous sure ?",
      text: "vous voulez vraiment supprimer ce produit !",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        let idutilisateur = id;
        $.post("deleteStock", {
            idutilisateur
          },
          function (data, status) {
            if (data == 'done') {
              swal("Cet produit a été bien supprimé !", {
                icon: "success",
              });
              $('#tableAllStock').DataTable().clear().draw();
              getTableAllStock();
            } else {
              swal("Cet produit n'a été supprimé !", {
                icon: "error",
              });
            }
          });
      } else {
        swal("Cet produit n'a pas été supprimé");
      }
    });
}
/************************fin alert supprimer produit**********************/


/************************modifier produit**********************/
function updateEmploye(id) {
  nom = $('#nom' + id).text().toString().replace(/^\s+/g, '')
  description = $('#description' + id).text().toString().replace(/^\s+/g, '')
  quantiteReste = $('#quantiteReste' + id).text().toString().replace(/^\s+/g, '')
  dateExp = $('#dateExp' + id).text().toString().replace(/^\s+/g, '')
  minQuantite = $('#minQuantite' + id).text().toString().replace(/^\s+/g, '')
  console.log(dateExp)

  swal({
      title: "vous êtes sure?",
      text: "vous voulez vraiment modifier les informations de ce produit?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((modifier) => {
      if (modifier) {
        $.post("updateStock", {
            idProd: id,
            nom: nom,
            description: description,
            quantiteReste: quantiteReste,
            dateExp: dateExp,
            minQuantite: minQuantite,
          },

          function (data, status) {
            if (data == 'done') {
              swal("Les informations sont bien modifiées !", {
                icon: "success",
              });
              $('#tableAllStock').DataTable().clear().draw();
              getTableAllStock();
            } else {
              swal("Erreur, il y a un probleme !", {
                icon: "error",
              });
            }
          });

      }
    });
}
/************************fin modifier produit**********************/