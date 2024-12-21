const CURRENT_PLAYER_KEY = "currentPlayer";
const ALL_PLAYERS_KEY = "players";

let players = [];

function loadPlayers() {
    const storedPlayers = localStorage.getItem(ALL_PLAYERS_KEY);
    players = storedPlayers ? JSON.parse(storedPlayers) : [];
}

function savePlayers() {
    localStorage.setItem(ALL_PLAYERS_KEY, JSON.stringify(players));
}

// --------------------------------------------------------------------------------------------------------------
// -------------------------------------------------- REGISTER --------------------------------------------------
// --------------------------------------------------------------------------------------------------------------

document.getElementById("user-register-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("user-register-name").value.trim();
    if (!name) {
        showMessage("Veuillez entrer un nom !");
        return;
    }

    const playerExists = players.some(player => player.name.toLowerCase() === name.toLowerCase());

    if (playerExists) {
        showMessage("Ce joueur existe déjà !");
    } else {
        const newPlayer = {
            id: players.length + 1,
            name: name,
            pokemons: []
        };

        players.push(newPlayer);
        savePlayers();

        showMessage("Inscription réussie !");
        document.getElementById("user-register-form").reset(); // Réinitialise le formulaire
    }
});

// --------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------- LOGIN ---------------------------------------------------
// --------------------------------------------------------------------------------------------------------------

document.getElementById("user-login-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("user-login-name").value.trim();
    if (!name) {
        showMessage("Veuillez entrer un nom !");
        return;
    }

    const player = players.find(player => player.name.toLowerCase() === name.toLowerCase());

    if (player) {
        localStorage.setItem(CURRENT_PLAYER_KEY, JSON.stringify(player));
        document.getElementById("user-logout-btn").style.display = "block";
        showMessage(`Bienvenue, ${player.name} !`);
        document.getElementById("user-login-form").reset();
    } else {
        showMessage("Joueur introuvable !");
    }
});

// --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------- LOGOUT ---------------------------------------------------
// --------------------------------------------------------------------------------------------------------------

document.getElementById("user-logout-btn").addEventListener("click", () => {
    localStorage.removeItem(CURRENT_PLAYER_KEY);
    document.getElementById("user-logout-btn").style.display = "none";
    showMessage("Déconnecté avec succès !");
});


// --------------------------------------------------------------------------------------------------------------
// ---------------------------------------------- EVENTS LISTENERS ----------------------------------------------
// --------------------------------------------------------------------------------------------------------------

window.addEventListener("load", () => {
    loadPlayers();

    //Check si y'a déjà un joueur de connecté au début
    const currentPlayer = localStorage.getItem(CURRENT_PLAYER_KEY);
    if (currentPlayer) {
        const player = JSON.parse(currentPlayer);
        showMessage(`Connecté en tant que ${player.name}`);
        document.getElementById("user-logout-btn").style.display = "block";
    }
});

// --------------------------------------------------------------------------------------------------------------
// ----------------------------------------------- OTHER FUNCTIONS ----------------------------------------------
// --------------------------------------------------------------------------------------------------------------


// Afficher un message d'état -> A delete à la fin, ou a insérer dans la page pour un retour utilisateur
function showMessage(message) {
    document.getElementById("user-status-message").textContent = message;
}