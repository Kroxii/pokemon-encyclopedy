document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("search-form");
    const input = document.getElementById("search-input");
    const nameSpan = document.getElementById("pokemon-name");
    const idSpan = document.getElementById("pokemon-id");
    const typeSpan = document.getElementById("pokemon-type");
    const img = document.getElementById("pokemon-img");
    const resetBtn = document.getElementById("reset-button");
    const toggleBtn = document.getElementById('theme-toggle');
    const hpSpan = document.getElementById("pokemon-hp");
    const attackSpan = document.getElementById("pokemon-attack");
    const defenseSpan = document.getElementById("pokemon-defense");
    const spAtkSpan = document.getElementById("pokemon-special-attack");
    const spDefSpan = document.getElementById("pokemon-special-defense");
    const speedSpan = document.getElementById("pokemon-speed");
    const resistancesSpan = document.getElementById("pokemon-resistances");
    const weaknessesSpan = document.getElementById("pokemon-weaknesses");
    const evolutionSpan = document.getElementById("pokemon-evolution");
    const body = document.body;
    let isNight = false;

    function clearDisplay() {
        nameSpan.textContent = "";
        idSpan.textContent = "";
        typeSpan.textContent = "";
        img.src = "";
        img.alt = "Pokemon Image";
        img.hidden = true; // Cache l'image lors du reset
        hpSpan.textContent = "";
        attackSpan.textContent = "";
        defenseSpan.textContent = "";
        spAtkSpan.textContent = "";
        spDefSpan.textContent = "";
        speedSpan.textContent = "";
        resistancesSpan.textContent = "";
        weaknessesSpan.textContent = "";
        evolutionSpan.textContent = "";
    }

    async function fetchPokemon(query) {
        try {
            const res = await fetch("https://pokebuildapi.fr/api/v1/pokemon");
            const data = await res.json();
            const search = query.trim().toLowerCase();
            const found = data.find(p =>
                p.name.toLowerCase() === search ||
                p.id.toString() === search
            );
            if (found) {
                nameSpan.textContent = found.name;
                idSpan.textContent = `#${found.id}`;
                typeSpan.textContent = found.apiTypes.map(t => t.name).join(", ");
                img.src = found.image;
                img.alt = found.name;
                img.hidden = false; // Affiche l'image
                hpSpan.textContent = `HP : ${found.stats.HP}`;
                attackSpan.textContent = `Attaque : ${found.stats.attack}`;
                defenseSpan.textContent = `Défense : ${found.stats.defense}`;
                spAtkSpan.textContent = `Att. Spé. : ${found.stats.special_attack}`;
                spDefSpan.textContent = `Déf. Spé. : ${found.stats.special_defense}`;
                speedSpan.textContent = `Vitesse : ${found.stats.speed}`;

                // Résistances et faiblesses
                if (found.apiResistances && found.apiResistances.length > 0) {
                    resistancesSpan.textContent = "Résistances : " + found.apiResistances.map(r => r.name).join(", ");
                } else {
                    resistancesSpan.textContent = "";
                }
                if (found.apiResistances && found.apiResistances.length > 0) {
                    const weaknesses = found.apiResistances.filter(r => r.damage_multiplier > 1).map(r => r.name);
                    weaknessesSpan.textContent = weaknesses.length > 0 ? "Faiblesses : " + weaknesses.join(", ") : "";
                } else {
                    weaknessesSpan.textContent = "";
                }

                // Évolution
                if (found.apiEvolutions && found.apiEvolutions.length > 0) {
                    evolutionSpan.textContent = "Évolution : " + found.apiEvolutions.map(e => e.name).join(", ");
                } else {
                    evolutionSpan.textContent = "Évolution : aucune";
                }
            } else {
                clearDisplay();
                img.hidden = true; // Cache l'image si aucun Pokémon trouvé
                nameSpan.textContent = "No Pokémon found.";
            }
        } catch (e) {
            clearDisplay();
            nameSpan.textContent = "Error fetching data.";
        }
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        fetchPokemon(input.value);
    });

    resetBtn.addEventListener("click", () => {
        input.value = "";
        clearDisplay();
    });

    toggleBtn.addEventListener('click', () => {
        isNight = !isNight;
        body.classList.toggle('night-mode', isNight);
        toggleBtn.textContent = isNight ? 'Mode Jour' : 'Mode Nuit';
    });
});