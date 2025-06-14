function editLog(logId, logName, logPrice, logCite, logTerrain, logDesc) {
    fetch('liste_cites.php')
        .then(response => response.json())
        .then(data => {
            const cites = data.cites;

            const citeOptions = cites.map(cite => `<option value="${cite.codeCite}">${cite.LibCite}</option>`).join('');

            Swal.fire({
                title: 'Modifier le logement',
                html: `
                <form id="editLogForm" enctype="multipart/form-data">
                    <label for="logName">Nom du Logement:</label>
                    <input type="text" id="logName" name="logName" class="swal2-input" value="${logName}" required minlength="3" maxlength="100">
                    
                    <label for="logPrice">Prix:</label>
                    <input type="number" id="logPrice" name="logPrice" step="0.01" value="${logPrice}" class="swal2-input" required min="0">
                    
                    <label for="logCite">Cité:</label>
                    <select id="logCite" name="logCite" class="swal2-input" required>
                        <option value="" disabled selected>Choisir une cité</option>
                        ${citeOptions}
                    </select>
                    
                    <label for="logTerrain">Superficie du Terrain (m²):</label>
                    <input type="number" id="logTerrain" name="logTerrain" step="0.01" value="${logTerrain}" class="swal2-input" required min="0">
                    
                    <label for="logDesc">Description:</label>
                    <textarea id="logDesc" name="logDesc" class="swal2-textarea" minlength="10" maxlength="1000" required>${logDesc !== "null" ? logDesc : ""}</textarea>

                    <label for="logImage">Image:</label>
                    <input type="file" id="logImage" name="logImage" class="swal2-input">
                </form>
                `,
                showCancelButton: true,
                confirmButtonText: 'Enregistrer',
                cancelButtonText: 'Annuler',
                didOpen: () => {
                    document.getElementById('logCite').value = logCite;
                    document.getElementById('logPrice').addEventListener('keypress', function (e) {
                        if (!/[\d.]/.test(e.key)) {
                            e.preventDefault();
                        }
                    });
                    document.getElementById('logTerrain').addEventListener('keypress', function (e) {
                        if (!/[\d.]/.test(e.key)) {
                            e.preventDefault();
                        }
                    });
                },
                preConfirm: () => {
                    const form = document.getElementById('editLogForm');
                    const formData = new FormData(form);
                    formData.append('logId', logId);

                    return fetch('modifyLog.php', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result.success) {
                            Swal.fire('Mis à jour !', result.message, 'success');
                            if (typeof getLogementList === 'function') {
                                getLogementList();
                            }
                        } else {
                            Swal.fire('Erreur !', result.message, 'error');
                        }
                    })
                    .catch(error => {
                        Swal.fire('Erreur !', 'Une erreur s\'est produite lors de la mise à jour du logement.', 'error');
                    });
                }
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des cités :', error);
            Swal.fire('Erreur !', 'Une erreur s\'est produite lors de la récupération des cités.', 'error');
        });
}



function getLogementList() {
    fetch('logementList.php')
        .then(response => response.json())
        .then(data => {
            const searchInput = document.getElementById('search-logement');
            const availabilityFilter = document.getElementById('availability-filter');
            const citeFilter = document.getElementById('cite-filter');

            // Écoute des événements pour les filtres
            searchInput.addEventListener('input', () => applyFilters(data));
            availabilityFilter.addEventListener('change', () => applyFilters(data));
            citeFilter.addEventListener('change', () => applyFilters(data));

            // Initialement afficher tous les logements
            applyFilters(data);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
        });
}


function applyFilters(data) {
    const searchQuery = document.getElementById('search-logement').value.toLowerCase();
    const availabilityFilter = document.getElementById('availability-filter').value;
    const citeFilter = document.getElementById('cite-filter').value;

    const filteredData = data.filter(logement => {
        const matchesSearch = logement.NomLog.toLowerCase().includes(searchQuery) ||
                              logement.LibCite.toLowerCase().includes(searchQuery) ||
                              logement.PrixLog.toString().includes(searchQuery) ||
                              logement.terrain.toString().includes(searchQuery) ||
                              (logement.Disponibilite.toLowerCase()).includes(searchQuery);

        const matchesAvailability = (availabilityFilter === '' ||
                                     (availabilityFilter === 'disponible' && logement.Disponibilite === 'Disponible') ||
                                     (availabilityFilter === 'occupe' && logement.Disponibilite.startsWith('Occupé par')));

        const matchesCite = (citeFilter === '' || logement.codeCite == citeFilter);

        return matchesSearch && matchesAvailability && matchesCite;
    });

    displayLogements(filteredData);
}


function displayLogements(logements) {
    const logementBody = document.getElementById('logement-body');
    logementBody.innerHTML = "";
    logements.forEach(logement => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${logement.NumLog}</td>
            <td>${logement.NomLog}</td>
            <td>${logement.PrixLog} Ar/mois</td>
            <td>${logement.LibCite}</td>
            <td>${logement.terrain} m²</td>
            <td style="color:${logement.Disponibilite.startsWith('Occupé') ? "crimson" : "green"}">${logement.Disponibilite}</td>
            <td>
                <div class="table-actions">
                    <button onclick="afficherLogement(${logement.NumLog})" class="edit"><i class="fas fa-eye"></i></button>
                    <button onclick="editLog(${logement.NumLog}, '${logement.NomLog}', '${logement.PrixLog}', '${logement.LibCite}', '${logement.terrain}', '${logement.description}')" class="edit"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteLog(${logement.NumLog})" class="delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </td>
        `;
        logementBody.appendChild(row);
    });
}



function ajouterLogement() {
    fetch('liste_cites.php')
        .then(response => response.json())
        .then(data => {
            const cites = data.cites;

            const citeOptions = cites.map(cite => `<option value="${cite.codeCite}">${cite.LibCite}</option>`).join('');

            Swal.fire({
                title: 'Ajouter un logement',
                html: `
                    <form id="addLogementForm" enctype="multipart/form-data">
                        <label for="NomLog">Nom du Logement:</label>
                        <input type="text" id="NomLog" name="NomLog" class="swal2-input" required minlength="3" maxlength="100">
                        
                        <label for="PrixLog">Prix:</label>
                        <input type="number" id="PrixLog" name="PrixLog" step="0.01" class="swal2-input" required min="0">
                        
                        <label for="ImageLog">Image:</label>
                        <input type="file" id="ImageLog" name="ImageLog" class="swal2-input" accept="image/*">
                        
                        <label for="codeCite">Cité:</label>
                        <select id="codeCite" name="codeCite" class="swal2-input" required>
                            <option value="" disabled selected>Choisir une cité</option>
                            ${citeOptions}
                        </select>
                        
                        <label for="terrain">Superficie du Terrain (m²):</label>
                        <input type="number" id="terrain" name="terrain" step="0.01" class="swal2-input" required min="0">
                        
                        <label for="description">Description:</label>
                        <textarea id="description" name="description" class="swal2-textarea" minlength="10" maxlength="1000" required></textarea>
                    </form>
                `,
                showCancelButton: true,
                confirmButtonText: 'Enregistrer',
                cancelButtonText: 'Annuler',
                didOpen: () => {
                    // Ajout des événements pour empêcher les entrées non numériques
                    document.getElementById('PrixLog').addEventListener('keypress', function (e) {
                        if (!/[\d.]/.test(e.key)) {
                            e.preventDefault();
                        }
                    });
                    document.getElementById('terrain').addEventListener('keypress', function (e) {
                        if (!/[\d.]/.test(e.key)) {
                            e.preventDefault();
                        }
                    });
                },
                preConfirm: () => {
                    const form = document.getElementById('addLogementForm');

                    const formData = new FormData(form);

                    return fetch('addLogement.php', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result.success) {
                            Swal.fire('Ajouté !', result.message, 'success');
                            // Appeler une fonction pour rafraîchir la liste des logements, si elle existe
                            if (typeof getLogementList === 'function') {
                                getLogementList();
                            }
                        } else {
                            Swal.fire('Erreur !', result.message, 'error');
                        }
                    })
                    .catch(error => {
                        Swal.fire('Erreur !', 'Une erreur s\'est produite lors de l\'ajout du logement.', 'error');
                    });
                }
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des cités :', error);
            Swal.fire('Erreur !', 'Une erreur s\'est produite lors de la récupération des cités.', 'error');
        });
}




function deleteLog(logementId) {
    Swal.fire({
        title: 'Êtes-vous sûr de vouloir supprimer ce logement ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
        showLoaderOnConfirm: true,
        preConfirm: () => {
            return fetch('deleteLogement.php', {
                method: 'POST',
                body: JSON.stringify({ logementId: logementId }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(result => {
                if (result && result.success) {
                    Swal.fire({
                        title: 'Supprimé !',
                        text: result.message,
                        icon: 'success',
                        timer: 2000
                    });
                    getLogementList();
                } else {
                    Swal.fire({
                        title: 'Erreur !',
                        text: result ? result.message : 'Une erreur s\'est produite lors de la suppression du logement.',
                        icon: 'error',
                        timer: 2000
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    title: 'Erreur !',
                    text: 'Une erreur s\'est produite lors de la suppression du logement : ' + error,
                    icon: 'error',
                    timer: 2000
                });
            });
        }
    });
}

function getCiteList() {
    fetch('liste_cites.php')
        .then(response => response.json())
        .then(data => {
            const citeFilter = document.getElementById('cite-filter');
            citeFilter.innerHTML = '<option value="">Toutes</option>'; // Reset options
            data.cites.forEach(cite => {
                const option = document.createElement('option');
                option.value = cite.codeCite;
                option.textContent = cite.LibCite;
                citeFilter.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des cités:', error);
        });
}

function afficherLogement(logementId) {
    fetch(`getLogementDetails.php?NumLog=${logementId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const logement = data.logement;
                Swal.fire({
                    title: `Détails du Logement ${logement.NumLog}`,
                    html: `
                        ${logement.ImageLog ? `<img src="${logement.ImageLog}" alt="Image du Logement" style="border-radius:15px; max-width: 100%; height: auto;">` : ""}
                        <p><strong>Nom:</strong> ${logement.NomLog}</p>
                        <p><strong>Prix:</strong> ${logement.PrixLog} Ar/Mois</p>
                        <p><strong>Cité:</strong> ${logement.LibCite}</p>
                        <p><strong>Superficie:</strong> ${logement.Superficie} m²</p>
                        <p><strong>Disponibilité:</strong> ${logement.Disponibilite}</p>
                        <p><strong>Description:</strong> ${logement.description ? logement.description : "Aucune description"} </p>
                    `,
                    confirmButtonText: 'Fermer'
                });
            } else {
                Swal.fire({
                    title: 'Erreur !',
                    text: data.message,
                    icon: 'error',
                    confirmButtonText: 'Fermer'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                title: 'Erreur !',
                text: 'Une erreur s\'est produite lors de la récupération des détails du logement.',
                icon: 'error',
                confirmButtonText: 'Fermer'
            });
            console.error('Erreur:', error);
        });
}



getCiteList()
getLogementList()