const MAX_FAVORITES = 5;
const CURRENT_PLAYER_KEY = "currentPlayer";
const ALL_PLAYERS_KEY = "players";

// Rediriger vers l'accueil si aucun joueur de co
let currentPlayer = JSON.parse(localStorage.getItem(CURRENT_PLAYER_KEY));
if (!currentPlayer) {
    alert("Connectez vous pour obtenir votre propre collection !");
    window.location.href = "./index.html";
}


// --------------------------------------------------------------------------------------------------------------
// ----------------------------------------------- DISPLAY CARDS ------------------------------------------------
// --------------------------------------------------------------------------------------------------------------

function displayAllPokemons() {
    const pokemonList = document.getElementById("selectPkm-pkm-list");

    // Trier les Pokémon par ID croissant
    currentPlayer.pokemons.sort((a, b) => a.id - b.id);

    pokemonList.innerHTML = "";

    currentPlayer.pokemons.forEach((pokemon) => {
        const card = document.createElement("div");
        card.classList.add("selectPkm-pkm-card");
        card.innerHTML = `
            <p>Pokémon numéro ${pokemon.id}</p>
            <img src="${pokemon.sprite}" alt="Sprite du pokémon ${pokemon.name}" />
            ${pokemon.shiny ? '<p class="shiny">✨ ' + pokemon.name +' ✨</p>' : "<p>"+pokemon.name+"</p>"}
            <button class="selectPkm-btn-favorite">${pokemon.favorite ? "Retirer des favoris" : "Ajouter en favoris"}</button>
        `;

        const button = card.querySelector(".selectPkm-btn-favorite");
        button.addEventListener("click", () => toggleFavorite(pokemon, button));

        pokemonList.appendChild(card);
    });
}

function displayFavPokemons() {
    const favoriteList = document.getElementById("favorites-pkm-list");

    const favoritePokemons = currentPlayer.pokemons.filter(pokemon => pokemon.favorite);

    if (favoritePokemons.length === 0) {
        favoriteList.innerHTML = "<p>Aucun Pokémon favori pour l'instant.</p>";
        return;
    }

    favoriteList.innerHTML = ""; 

    favoritePokemons.forEach(pokemon => {
        const card = document.createElement("div");
        card.classList.add("favorites-pkm-card");
        card.innerHTML = `
            <img class="favorites-pkm-sprite" src="${pokemon.sprite}" alt="Sprite du pokémon ${pokemon.name}" />
        `;
        favoriteList.appendChild(card);
    });
}


// --------------------------------------------------------------------------------------------------------------
// ------------------------------------------------- ANIMATION --------------------------------------------------
// --------------------------------------------------------------------------------------------------------------

function animateSprite() {
    // const sprites = document.querySelectorAll(".favorites-pkm-sprite");

    // sprites.forEach(sprite => {
    //     moveSprite(sprite);
    // });
}

// --------------------------------------------------------------------------------------------------------------
// ---------------------------------------------- OTHER FUNCTIONS -----------------------------------------------
// --------------------------------------------------------------------------------------------------------------

function toggleFavorite(pokemon, button) {
    const currentFavorites = currentPlayer.pokemons.filter((p) => p.favorite);

    if (!pokemon.favorite && currentFavorites.length >= MAX_FAVORITES) {
        alert(`Vous ne pouvez avoir que ${MAX_FAVORITES} favoris. Retirez-en un pour en ajouter un autre.`);
        return;
    }

    // Update fav state
    pokemon.favorite = !pokemon.favorite;
    button.textContent = pokemon.favorite ? "Retirer des favoris" : "Ajouter en favoris";

    // Save
    savePlayerData();
    displayAllPokemons();
}

function savePlayerData() {
    localStorage.setItem(CURRENT_PLAYER_KEY, JSON.stringify(currentPlayer));

    const players = JSON.parse(localStorage.getItem(ALL_PLAYERS_KEY));
    const updatedPlayers = players.map(player =>
        player.id === currentPlayer.id ? currentPlayer : player
    );
    localStorage.setItem(ALL_PLAYERS_KEY, JSON.stringify(updatedPlayers));
}

// --------------------------------------------------------------------------------------------------------------
// ---------------------------------------------- INITIALISATION ------------------------------------------------
// --------------------------------------------------------------------------------------------------------------
window.addEventListener("load", () => {
    const currentPath = window.location.pathname; // Chemin de la page

    if (currentPath.includes("favorites.html")) {
        displayFavPokemons();
        animateSprite();
    } else if (currentPath.includes("selectPokemon.html")) {
        displayAllPokemons();
    } else {
        console.log("Page non reconnue");
    }
});
