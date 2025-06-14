<?php
require_once 'config.php';
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestion Location</title>
    <link rel="stylesheet" href="CSS/style.css">
    <link rel="stylesheet" href="CSS\@fortawesome\fontawesome-free\css\all.min.css">
    <link rel="stylesheet" href="JS\sweetalert2\dist\sweetalert2.min.css">
    <script defer src="JS\sweetalert2\dist\sweetalert2.all.min.js"></script>
    <script defer src="JS/agence.js"></script>
    <script defer src="JS/logement.js"></script>
    <script defer src="JS/locataire.js"></script>
    <script defer src="JS/app.js"></script>
</head>
<body>
    <main class="main">
        <div class="sidebar">
            <div class="logo">
                <h3>Gestion Logement</h3>
            </div>
            <div class="nav-bar">
                <a class="nav-items active" onclick="showSection(0)" href="#"><i class="fas fa-building"></i> Agences</a>
                <a class="nav-items" onclick="showSection(1)" href="#"><i class="fas fa-home"></i>Logements</a>
                <a class="nav-items" onclick="showSection(2)" href="#"><i class="fas fa-user-group"></i><i class="fas fa-credit-card"></i>Locataires et Paiement</a>
                <!-- <a class="nav-items" onclick="showSection(3)" href="#"><i class="fas fa-credit-card"></i>Paiement</a> -->
                <!-- <a class="nav-items" onclick="showSection(4)" href="#"><i class="fas fa-city"></i>Cité</a>
                <a class="nav-items" onclick="showSection(5)" href="#"><i class="fas fa-globe-africa"></i>Region</a> -->
                
            </div>
            <!-- <div class="disconnection-button">
                <a class="nav-items" href="#"><i class="fas fa-sign-out-alt"></i>Déconnexion</a>
            </div> -->
        </div>
        <div class="body" id="agence">
            <h1 class="body-title">Agences</h1>
            <div class="actions">
                <a class="action" onclick="ajouterAgence()" href="#" >Ajouter une agence</a>
            </div>
            <div class="list-container">
                <!-- <div class="list-actions">
                    <div class="filter-action">
                        <label for="filter">Trier par: </label>
                        <select name="filter" id="filter">
                            <option value="">--------</option>
                            <option value="">filtre 1</option>
                            <option value="">filtre 2</option>
                            <option value="">filtre 3</option>
                        </select>
                    </div> -->
                    <div class="search-action">
                        <i class="fas fa-search"></i>
                        <input class="search-input" type="text" name="search" id="search-agence" placeholder="Chercher une agence">
                    </div>
                </div>
                <table class="list" id="agence-list">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Libellé</th>
                            <th>Province</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="agence-body">
                    </tbody>
                </table>
            </div>
        </div>
        <div class="body" id="logement">
            <h1 class="body-title">Logements</h1>
            <div class="actions">
                <a class="action" onclick="ajouterLogement()" href="#">Ajouter une logement</a>
            </div>
            
            <div class="list-container">
                <div class="list-actions">
                    <div class="filter-action">
                        <label for="availability-filter">Disponibilité: </label>
                        <select name="availability-filter" id="availability-filter">
                            <option value="">Tous</option>
                            <option value="disponible">Disponible</option>
                            <option value="occupe">Occupé</option>
                        </select>
                        <label for="cite-filter">Cité: </label>
                        <select name="cite-filter" id="cite-filter">
                            <option value="">Toutes</option>
                        </select>
                    </div>
                    <div class="search-action">
                        <i class="fas fa-search"></i>
                        <input class="search-input" type="text" name="search" id="search-logement" placeholder="Chercher un logement">
                    </div>
                </div>
                <table class="list" id="agence-list">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Libellé</th>
                            <th>Prix</th>
                            <th>Localisation</th>
                            <th>Terrain</th>
                            <th>Etat</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="logement-body">
                    </tbody>
                </table>
            </div>
        </div>

        <div class="body" id="locataire">
            <h1 class="body-title">Paiements et Locataires</h1>
            <div class="actions">
                <a class="action" id="add-locataire-btn" href="#">Ajouter un Locataire</a>
            </div>
            <div class="list-container">
                <div class="list-actions">
                    <div class="filter-action">
                        <label for="locataire-filter">Trier par: </label>
                        <select name="filter" id="locataire-filter">
                            <option value="">Tous</option>
                            <option value="A jour">A jour</option>
                            <option value="En retard">En retard</option>
                        </select>
                    </div>
                    <div class="search-action">
                        <i class="fas fa-search"></i>
                        <input class="search-input" type="text" name="search" id="search-locataire" placeholder="Chercher un locataire">
                    </div>
                </div>
                <table class="list" id="locataire-list">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nom</th>
                            <th>Prénoms</th>
                            <th>Adresse</th>
                            <th>Logement</th>
                            <th>Loyer</th>
                            <th>État des paiements</th>
                        </tr>
                    </thead>
                    <tbody id="locataire-body">
                    </tbody>
                </table>
            </div>
        </div>



        <div class="body" style="display:none;" id="terrain">
            <h1 class="body-title">Terrain</h1>
            <div class="actions">
                <a class="action" onclick="ajouterTerrain()" href="#" >Ajouter un Terrain</a>
            </div>
            <div class="list-container">
                <div class="list-actions">
                    <div class="filter-action">
                        <label for="filter">Trier par: </label>
                        <select name="filter" id="filter">
                            <option value="">--------</option>
                            <option value="">filtre 1</option>
                            <option value="">filtre 2</option>
                            <option value="">filtre 3</option>
                        </select>
                    </div>
                    <div class="search-action">
                        <i class="fas fa-search"></i>
                        <input class="search-input" type="text" name="search" id="search-terrain" placeholder="Chercher un terrain">
                    </div>
                </div>
                <table class="list" id="terrain-list">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Libellé</th>
                            <th>Prix</th>
                            <th>Localisation</th>
                            <th>Terrain</th>
                            <th>Etat</th>
                        </tr>
                    </thead>
                    <tbody id="logement-body">
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</body>
</html>