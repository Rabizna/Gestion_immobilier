const agenceSearchInput = document.getElementById('search-agence')

function ajouterAgence() {
    fetch('liste_provinces.php')
        .then(response => response.json())
        .then(data => {
            const provinces = data.provinces;

            const provinceOptions = provinces.map(province => `<option value="${province.LibPro}">${province.LibPro}</option>`).join('');

            Swal.fire({
                title: 'Ajouter une agence',
                html: `
                    <input type="text" id="newAgenceLib" placeholder="Libellé de l'agence" required>
                    <select id="newProvinceLib" required>
                        <option value="" disabled selected>Choisir une province</option>
                        ${provinceOptions}
                    </select>
                `,
                showCancelButton: true,
                confirmButtonText: 'Enregistrer',
                cancelButtonText: 'Annuler',
                preConfirm: () => {
                    const newAgenceLib = document.getElementById('newAgenceLib').value;
                    const newProvinceLib = document.getElementById('newProvinceLib').value;

                    const formData = new FormData();
                    formData.append('agenceLib', newAgenceLib);
                    formData.append('provinceLib', newProvinceLib);

                    return fetch('addAgence.php', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result && result.success) {
                            Swal.fire('Ajouté !', result.message, 'success');
                            getAgenceList();
                        } else {
                            Swal.fire('Erreur !', result ? result.message : 'Une erreur s\'est produite lors de l\'ajout de l\'agence.', 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Erreur lors de l\'ajout de l\'agence :', error);
                        Swal.fire('Erreur !', 'Une erreur s\'est produite lors de l\'ajout de l\'agence.', 'error');
                    });
                }
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des provinces :', error);
            Swal.fire('Erreur !', 'Une erreur s\'est produite lors de la récupération des provinces.', 'error');
        });
}


function rechercherAgence() {
    const searchTerm = agenceSearchInput.value.trim().toLowerCase();

    fetch(`rechercher_agence.php?searchTerm=${searchTerm}`)
        .then(response => response.json())
        .then(data => {
            const agences = data.agences;
            const agenceBody = document.getElementById('agence-body');
            agenceBody.innerHTML = '';

            agences.forEach(agence => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${agence.CodeAg}</td>
                    <td class="libelle">${agence.LibAg}</td>
                    <td class="province">${agence.LibPro}</td>
                    <td>
                        <div class="table-actions">
                            <button class="edit" onclick="editAgence(${agence.CodeAg}, '${agence.LibAg}', '${agence.LibPro}')"><i class="fas fa-edit"></i></button>
                            <button class="delete" onclick="deleteAgence(${agence.CodeAg})"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </td>
                `;
                agenceBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la recherche d\'agence:', error);
        });
}


agenceSearchInput.addEventListener('keyup', rechercherAgence)


function deleteAgence(agenceId) {
    Swal.fire({
        title: 'Êtes-vous sûr de vouloir supprimer cette agence ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
        showLoaderOnConfirm: true,
        preConfirm: () => {
            return fetch('deleteAgence.php', {
                method: 'POST',
                body: JSON.stringify({ agenceId: agenceId }),
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
                    getAgenceList();
                } else {
                    Swal.fire({
                        title: 'Erreur !',
                        text: result ? result.message : 'Une erreur s\'est produite lors de la suppression de l\'agence.',
                        icon: 'error',
                        timer: 2000
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    title: 'Erreur !',
                    text: 'Une erreur s\'est produite lors de la suppression de l\'agence : ' + error,
                    icon: 'error',
                    timer: 2000
                });
            });
        }
    });
}


function getAgenceList(){
    fetch('agenceList.php')
    .then(response => response.json())
    .then(data => {
        const agenceBody = document.getElementById('agence-body');
        agenceBody.innerHTML = ""
        data.forEach(agence => {
            const row = document.createElement('tr');
    
            // Ajouter les données dans les cellules
            row.innerHTML = `
                <td>${agence.CodeAg}</td>
                <td>${agence.LibAg}</td>
                <td>${agence.LibPro}</td>
                <td>
                    <div class="table-actions">
                        <button onclick="editAgence(${agence.CodeAg}, '${agence.LibAg}', '${agence.LibPro}')" class="edit"><i class="fas fa-edit"></i></button>
                        <button onclick="deleteAgence(${agence.CodeAg})" class="delete"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </td>
            `;
            
            // Ajouter la ligne au corps du tableau
            agenceBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des données:', error);
    });
}
function editAgence(agenceId, agenceLib, provinceLib) {
    fetch('liste_provinces.php')
        .then(response => response.json())
        .then(data => {
            const provinces = data.provinces;
            const form = `
                <form id="edit-form">
                    <label for="agenceLib">Libellé :</label>
                    <input type="text" id="agenceLib" name="agenceLib" value="${agenceLib}" required>
                    <label for="provinceLib">Province :</label>
                    <select id="provinceLib" name="provinceLib" required>
                        ${provinces.map(province => `<option value="${province.CodePro}">${province.LibPro}</option>`).join('')}
                    </select>
                </form>
            `;

            Swal.fire({
                title: 'Modifier l\'agence',
                html: form,
                showCancelButton: true,
                confirmButtonText: 'Enregistrer',
                cancelButtonText: 'Annuler',
                showLoaderOnConfirm: true,
                preConfirm: () => {
                    const newAgenceLib = document.getElementById('agenceLib').value;
                    const newProvinceCode = document.getElementById('provinceLib').value;

                    return fetch('modifyAgence.php', {
                        method: 'PUT',
                        body: JSON.stringify({ agenceId: agenceId, agenceLib: newAgenceLib, provinceLib: newProvinceCode }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erreur lors de la mise à jour des détails de l\'agence');
                        }
                        getAgenceList()
                        return response.json();
                        
                    })
                    .catch(error => {
                        Swal.showValidationMessage(
                            `Erreur : ${error}`
                        );
                    });
                }
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des provinces:', error);
        });
    
}


getAgenceList()