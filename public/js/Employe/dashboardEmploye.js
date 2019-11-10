function moin(idCommande) {
    $("#details" + idCommande).hide(1000);
    $("#moin" + idCommande).replaceWith('<button id="plus' + idCommande + '" onclick="plus(' + idCommande + ')" style=" background: bottom; border: aliceblue;color: blue;">Détails</button>')
}

function plus(idCommande) {
    $("#details" + idCommande).show(1000);
    $("#plus" + idCommande).replaceWith('<button id="moin' + idCommande + '" onclick="moin(' + idCommande + ')" style=" background: bottom; border: aliceblue;color: blue;">Moin</button>')
} 