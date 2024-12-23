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
    const pokemonList = document.getElementById("collection-pkm-list");

    // Trier les Pokémon par ID croissant
    currentPlayer.pokemons.sort((a, b) => a.id - b.id);

    pokemonList.innerHTML = "";

    currentPlayer.pokemons.forEach((pokemon) => {
        const card = document.createElement("div");
        card.classList.add("collection-pkm-card");
        if(pokemon.shiny) {
            card.classList.add("shiny");
        }
        card.innerHTML = `
            <p>Pokémon numéro ${pokemon.id}</p>
            <img src="${pokemon.sprite}" alt="Sprite du pokémon ${pokemon.name}" />
            ${pokemon.shiny ? '<p class="shiny">✨ ' + pokemon.name +' ✨</p>' : "<p>"+pokemon.name+"</p>"}
            <button class="collection-btn-favorite btn">${pokemon.favorite ? "Retirer des favoris" : "Ajouter en favoris"}</button>
        `;

        const button = card.querySelector(".collection-btn-favorite");
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


// function animateSprite() {
//     const sprites = document.querySelectorAll(".favorites-pkm-sprite");

//     sprites.forEach(sprite => {
//         const randomAction = Math.floor(Math.random() * 101);

//         sprite.classList.remove("jump-animation");
//         sprite.classList.remove("jump-animation-infinite");
//         sprite.classList.remove("transform-animation");
//         sprite.style.transform = "";

//         const currentX = parseFloat(sprite.dataset.x) || 0;
//         const currentY = parseFloat(sprite.dataset.y) || 0;

//         let newX = currentX;
//         let newY = currentY;

//         sprite.style.setProperty("--current-x", `${currentX}px`);
//         sprite.style.setProperty("--current-y", `${currentY}px`);
//         sprite.style.transform = `translate(${currentX}px, ${currentY}px)`;

//         if (randomAction <= 15) {

//             sprite.classList.add("transform-animation");
//             newX = currentX - 50;
//         } else if (randomAction <= 30) {
            
//             sprite.classList.add("transform-animation");
//             newX = currentX + 50;
//             // sprite.addEventListener("transitionend", function onFlipEnd() {
//             //     sprite.classList.add("transform-animation");
//             //     newX = currentX + 50;
//             //     sprite.removeEventListener("transitionend", onFlipEnd);
//             // });
//         } else if (randomAction <= 40) {
//             sprite.style.transform = "scaleX(-1)";
//         } else if (randomAction <= 90) { //joueur jump une seule fois
//             sprite.classList.add("jump-animation");
//             sprite.style.transform = `translate(${currentX}px, ${currentY}px)`;
//             sprite.addEventListener("animationend", function onJumpEnd() {
//                 sprite.classList.remove("jump-animation");
//                 sprite.removeEventListener("animationend", onJumpEnd);
//             });
//         }

//         if (randomAction <= 30) {
//             const maxX = window.innerWidth * 0.25; // Limite à 50vw centré
//             const maxY = window.innerHeight * 0.25; // Limite à 50vh centré
//             const minX = -maxX;
//             const minY = -maxY;


//             newX = Math.min(Math.max(newX, minX), maxX);
//             newY = Math.min(Math.max(newY, minY), maxY);

//             sprite.style.setProperty("--current-x", `${newX}px`);
//             sprite.style.setProperty("--current-y", `${newY}px`);
//             sprite.style.transform = `translate(${newX}px, ${newY}px)`;
//             sprite.dataset.x = newX;
//             sprite.dataset.y = newY;
//         }
//     });
// }

// function animateSprite() { 
//     const sprites = document.querySelectorAll(".favorites-pkm-sprite");

//         sprites.forEach(sprite => {
//             sprite.classList.add("jump-animation-infinite");
//         });
// }

document.addEventListener("DOMContentLoaded", () => {
    const pokemon = document.querySelector("#favorites-pkm-list");
  

    pokemons.forEach(pokemon => {
        container.appendChild(pokemon);
    });
});

// Fonction pour créer des Pokémon dynamiquement
function createPokemons(count) {
    const pokemons = [];
    for (let i = 0; i < count; i++) {
        const pokemon = document.createElement("div");
        pokemon.className = "favorites-pkm-card";
        pokemon.style.backgroundImage = `url('./src/images/pokemon${i + 1}.png')`; // Changez le chemin en fonction des images
        pokemons.push(pokemon);
    }
    return pokemons;
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
    const currentPath = window.location.pathname;

    if (currentPath.includes("favorites.html")) {
        displayFavPokemons();
        // animateSprite();
        setInterval(animateSprite, 5000);
    } else if (currentPath.includes("collection.html")) {
        displayAllPokemons();
    } else {
        console.log("Page non reconnue");
    }
});