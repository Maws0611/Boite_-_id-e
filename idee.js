window.addEventListener("load", (event) => {
	let api_url = "https://cqwxynafbehikxyanuyh.supabase.co/rest/v1/BoiteIdee"
	let api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzOTEzNTQ0NywiZXhwIjoxOTU0NzExNDQ3fQ.nc60zxRTPZ8Zd5Iy4mDSZYaTzYhnGbj9N0dxRt3puP0" 
/*------------------------------------------RECUPERATION DES DONNEES VIA API-------------------------------------*/
	fetch(api_url, {
		method: "GET",
		headers: {
		 apikey: api_key,
        }
	})
	.then((response) => response.json())
	.then((data) => {
	  for (let item in data) {
		  CreerUneCarte(data[item])
	   }
    })	
/*---------------------------------- RECUPERATIONS DES ELEMENTS DOM-------------------------------------------*/
let contenupage = document.getElementById('proposition')
const btnEnvoyer = document.getElementById("btnEnvoyer")
const inputTitre =document.querySelector("input#titre")
const inputSuggestion = document.querySelector("textarea#suggestion")
// Cette fonction permet de créer une carte et de l'inserrer dans le DOM
//création de nos ids
const CreerUneCarte = (donnee) => {
	const idButtonValider = "btn_valider-" + donnee.id
	const idButtonRefuser = "btn_refuser-" + donnee.id
	const idCardIdee = "numero_card-" + donnee.id
/*---------------------lien patch statut-------------------------------*/
	let ApiPacthUrl = `https://cqwxynafbehikxyanuyh.supabase.co/rest/v1/BoiteIdee?id=eq.${donnee.id}`
	contenupage.insertAdjacentHTML(
		"afterbegin", 
`<div class="card card-idea m-2 ${donnee.statut} "style="width: 18rem" id="${idCardIdee}">
    <div class="card-body flex-column d-flex justify-content-between">
        <div class="card-block-titre">
          <h5 class="card-title fw-bold">${donnee.titre}</h5>
          <h6 class="card-subtitle mb-2 text-gris">
              approuvée / réfusée
          </h6>
        </div>
        <p class="card-text">${donnee.suggestion}
        </p>
        <div class="d-flex justify-content-between">
            <i class="bi bi-check-circle text-success card-link btn"
                id="${idButtonValider}"
                style="font-size: 2rem">
			</i>
            <i class="bi bi-x-circle card-link btn"
                 id="${idButtonRefuser}"
                style="font-size: 2rem; color: #ce0033">
			</i>
        </div>
    </div>
</div> `)
/*----------------------------bouton accepter /rejetter-------------------------------------------------*/
const boutonRefuser = document.getElementById(idButtonRefuser)
boutonRefuser.addEventListener('click', ()=>{
	document.getElementById(idCardIdee).style.border = "1px solid red"
	boutonRefuser.style.visibility = "hidden"
	boutonValider.style.visibility = "visible"
	fetch(ApiPacthUrl, {
		method: "PATCH",
		headers: {
		  apikey: api_key,
		  "Content-Type": "application/json",
		  Prefer: "return=representation" ,
		  "Authorization": `Bearer ${api_key}`
		},
		body: JSON.stringify({statut:false}),
	})
})
const boutonValider = document.getElementById(idButtonValider)
boutonValider.addEventListener('click', ()=>{
   document.getElementById(idCardIdee).style.border = "1px solid green"
   boutonValider.style.visibility = "hidden"
   boutonRefuser.style.visibility = "visible"
   fetch(ApiPacthUrl, {
	method: "PATCH",
	headers: {
	  apikey: api_key,
	  "Content-Type": "application/json",
	  Prefer: "return=representation" ,
	  "Authorization": `Bearer ${api_key}`
	},
	body: JSON.stringify({statut:true}),
  })
})
} //fin fonction donnee(création de carte)
/*----------------------------------Recuper element formulaire----------------------*/
btnEnvoyer.addEventListener('click', (e)=>{
	e.preventDefault()
	let titreSaisi = inputTitre.value
	let suggestionSaisi = inputSuggestion.value

	const nouvelleIdee = {
	titre: titreSaisi,
	suggestion: suggestionSaisi,
	statut:null
	 } 
/*-------------------------------------------compter les mots------------------------------------------*/
inputSuggestion.addEventListener('input', event=>{
	const longueurSaisie = suggestionSaisi.lenght
const longeurMax = 130
const reste = longeurMax-longueurSaisie;
	
//actualiser le dom pour afficher le nombre
const paragraphCompteur = document.getElementById("limite-text")
const compteurText = document.getElementById("text-progress")
const restantText = document.getElementById("text-restant")
const btnSuggestion = document.getElementById("btnEnvoyer")
compteurText.textContent = longueurSaisie
restantText.textContent = " Il vous reste " + reste

//changer couleur

if (reste < 0) {
  paragraphCompteur.style.color = "#ce0033"
  btnSuggestion.disabled = true
} else if (reste <= 16) {
  paragraphCompteur.style.color = "yellow"
  btnSuggestion.disabled = false
} else {
  paragraphCompteur.style.color = "#00000"
  btnSuggestion.disabled = false
}

if (titreSaisi.trim().length < 5 || suggestionSaisi.trim().length < 10) {
	inputTitre.classList.add("invalid")
	inputSuggestion.classList.add("invalid")
	alert("Merci de saisir des informations correctes")
	return
  }

 })
/*-------------------------------Envoyer les données vers la base de données------------------------------*/
fetch(api_url, {
	method: "POST",
	headers: {
	  apikey: api_key,
	  "Content-Type": "application/json",
	},
	body: JSON.stringify(nouvelleIdee),
  })
})  //fin fonction Recuper element formulaire
})

