document.addEventListener('DOMContentLoaded', function() {
    fetchLocataires();

    document.getElementById('search-locataire').addEventListener('input', function() {
        fetchLocataires();
    });

    document.getElementById('locataire-filter').addEventListener('change', function() {
        fetchLocataires();
    });

    document.getElementById('add-locataire-btn').addEventListener('click', function() {
        ajouterLocataire();
    });
});

function fetchLocataires() {
    const searchQuery = document.getElementById('search-locataire').value.toLowerCase();
    const filter = document.getElementById('locataire-filter').value;

    fetch('get_locataires.php')
        .then(response => response.json())
        .then(data => {
            let filteredData = data.filter(locataire => {
                const matchesSearch = locataire.Nom.toLowerCase().includes(searchQuery) ||
                                      locataire.Prenoms.toLowerCase().includes(searchQuery) ||
                                      locataire.Adresse.toLowerCase().includes(searchQuery) ||
                                      locataire.NomLog.toLowerCase().includes(searchQuery);

                const matchesFilter = filter === '' || locataire.EtatPaiement === filter;

                return matchesSearch && matchesFilter;
            });

            const locataireBody = document.getElementById('locataire-body');
            locataireBody.innerHTML = '';

            filteredData.forEach(locataire => {
                const row = document.createElement('tr');
                const etatColor = locataire.EtatPaiement.startsWith('En retard') ? 'crimson' : 'green';
                row.innerHTML = `
                    <td>${locataire.NumCli}</td>
                    <td>${locataire.Nom}</td>
                    <td>${locataire.Prenoms}</td>
                    <td>${locataire.Adresse}</td>
                    <td>${locataire.NomLog}</td>
                    <td>${locataire.PrixLog} Ar/mois</td>
                    <td style="color:${etatColor}">${locataire.EtatPaiement}</td>

                    <td>
                    <div class="table-actions">
                        ${locataire.EtatPaiement.startsWith('En retard') ? `<button onclick="payerLoyer(${locataire.NumCli}, ${locataire.NumLog}, ${locataire.PrixLog})"><i class="fas fa-credit-card"></i></button>` : ''}
                        <button onclick="modifierLocataire(${locataire.NumCli}, '${locataire.Nom}', '${locataire.Prenoms}', '${locataire.Adresse}')" class="edit"><i class="fas fa-edit"></i></button>

                    </div>
                    
                    </td>

                `;
                locataireBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Erreur', 'Impossible de récupérer les locataires', 'error');
        });
}

function ajouterLocataire() {
    fetch('get_logements_disponibles.php')
        .then(response => response.json())
        .then(data => {
            const logementsOptions = data.map(logement => `<option value="${logement.NumLog}">${logement.NomLog}</option>`).join('');

            Swal.fire({
                title: 'Ajouter un Locataire',
                html: `
                    <input id="nom" class="swal2-input" placeholder="Nom">
                    <input id="prenom" class="swal2-input" placeholder="Prénom">
                    <input id="adresse" class="swal2-input" placeholder="Adresse">
                    <select id="logementID" class="swal2-input">
                        ${logementsOptions}
                    </select>
                `,
                showCancelButton: true,
                confirmButtonText: 'Ajouter',
                cancelButtonText: 'Annuler',
                preConfirm: () => {
                    const nom = document.getElementById('nom').value;
                    const prenom = document.getElementById('prenom').value;
                    const adresse = document.getElementById('adresse').value;
                    const logement = document.getElementById('logementID').value;

                    if (!nom || !prenom || !adresse || !logement) {
                        Swal.showValidationMessage('Veuillez remplir tous les champs');
                        return false;
                    }

                    return {
                        nom: nom,
                        prenom: prenom,
                        adresse: adresse,
                        logement: logement
                    };
                }
            }).then(result => {
                if (result.isConfirmed) {
                    const locataireData = result.value;

                    fetch('add_locataire.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(locataireData)
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire('Locataire ajouté avec succès !', '', 'success');
                            fetchLocataires();
                        } else {
                            Swal.fire('Erreur lors de l\'ajout du locataire', data.message, 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        Swal.fire('Erreur lors de l\'ajout du locataire', 'Une erreur est survenue. Veuillez réessayer.', 'error');
                    });
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Erreur', 'Impossible de récupérer les logements disponibles', 'error');
        });
}






function effectuerPaiement(numCli, numLog, montant) {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const paymentData = {
        NumCli: numCli,
        NumLog: numLog,
        MontantPay: montant,
        ModePay: 'Loyer',
        DatePay: formattedDate
    };

    fetch('effectuer_paiement.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Générer la facture
            fetch('generer_facture.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paymentData)
            })
            .then(response => response.json())
            .then(factureData => {
                if (factureData.success) {
                    Swal.fire({
                        title: 'Paiement effectué avec succès !',
                        html: `Télécharger la facture <a href="${factureData.facture}" target="_blank">ici</a>`,
                        icon: 'success'
                    });
                    fetchLocataires(); // Rafraîchir la liste des locataires après le paiement
                } else {
                    Swal.fire('Erreur lors de la génération de la facture', factureData.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Erreur lors de la génération de la facture', 'Une erreur est survenue. Veuillez réessayer.', 'error');
            });
        } else {
            Swal.fire('Erreur lors du paiement', data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Erreur lors du paiement', 'Une erreur est survenue. Veuillez réessayer.', 'error');
    });
}

function supprimerLocataire(numCli) {
    Swal.fire({
        title: 'Êtes-vous sûr de vouloir supprimer ce locataire ?',
        text: 'Cette action est irréversible',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui, supprimer'
    }).then((result) => {
        if (result.isConfirmed) {
            // Envoyer la demande de suppression au serveur
            fetch('supprimer_locataire.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ NumCli: numCli })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression du locataire');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    fetchLocataires(); // Rafraîchir la liste des locataires après la suppression
                    Swal.fire('Supprimé !', 'Le locataire a été supprimé.', 'success');
                } else {
                    throw new Error(data.message || 'Une erreur est survenue');
                }
            })
            .catch(error => {
                Swal.fire('Erreur', error.message, 'error');
            });
        }
    });
}


function modifierLocataire(numCli, nom, prenoms, adresse) {
    // Afficher un formulaire de modification avec les données existantes
    Swal.fire({
        title: 'Modifier le locataire',
        html: `
            <input id="nom" class="swal2-input" value="${nom}" placeholder="Nom">
            <input id="prenoms" class="swal2-input" value="${prenoms}" placeholder="Prénoms">
            <input id="adresse" class="swal2-input" value="${adresse}" placeholder="Adresse">
        `,
        showCancelButton: true,
        confirmButtonText: 'Enregistrer',
        cancelButtonText: 'Annuler',
        preConfirm: () => {
            const nom = document.getElementById('nom').value;
            const prenoms = document.getElementById('prenoms').value;
            const adresse = document.getElementById('adresse').value;

            if (!nom || !prenoms || !adresse) {
                Swal.showValidationMessage('Veuillez remplir tous les champs');
            }

            // Envoyer les données modifiées au serveur
            const data = {
                NumCli: numCli,
                NomCli: nom,
                PrenomCli: prenoms,
                AdresseCli: adresse
            };

            return fetch('modifier_locataire.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la modification du locataire');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    fetchLocataires(); // Rafraîchir la liste des locataires après la modification
                    return data;
                } else {
                    throw new Error(data.message || 'Une erreur est survenue');
                }
            })
            .catch(error => {
                Swal.showValidationMessage(`Erreur: ${error}`);
            });
        }
    });
}



function payerLoyer(numCli, numLog, montant) {
    Swal.fire({
        title: 'Confirmer le paiement',
        text: `Voulez-vous vraiment payer ${montant} Ar pour ce mois ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, payer',
        cancelButtonText: 'Non, annuler'
    }).then((result) => {
        if (result.isConfirmed) {
            effectuerPaiement(numCli, numLog, montant);
        }
    });
}
