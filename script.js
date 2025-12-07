    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn'); 
    const searchResults =document.getElementById('searchResults');
     //API for fetching game data
    const API_KEY = '7a18d8ab5ede47f0b0ab0450cbeaa6c0';
    const API_BASE = 'https://api.rawg.io/api'

    //load wishlist from local storage
    //JSON.parse converts stored string back into array
    let wishlist=JSON.parse(localStorage.getItem('gameWishlist')) || [];

    /**
     * displays search results as game cards in a grid
     * @param {Array} games 
     */
    function displayGames(games) {
        //checks if no games were found
    if (games.length === 0) {
        searchResults.innerHTML = '<p>No games found. Try a different search!</p>';
        return;
    }
    
    let html = '';
    
    //loop through each game and create HTML card
    games.forEach(game => {
        html += `
            <div class="game-card">
                <img src="${game.background_image}" alt="${game.name}">
                <h3>${game.name}</h3>
                <p>Rating: ${game.rating}</p>
                <p>Released: ${game.released}</p>
                <button class="wishlist-btn" onclick="addToWishlist(${game.id}, '${game.name.replace(/'/g, "\\'")}', '${game.background_image}', ${game.rating}, '${game.released}')">
                    Add to Wishlist
            </div>
        `;
    });
    
    searchResults.innerHTML = html;
    }

    //wishlist management

    /**
     * Adds a game to the wishlist with full game data
     * @param {number} gameId - Game identifier   
     * @param {string} gameName - Name of the game
     * @param {string} gameImage - Game cover image URL
     * @param {number} gameRating - Game rating
     * @param {string} gameReleased - Release date
 */
    function addToWishlist(gameId, gameName, gameImage, gameRating, gameReleased) {
        // Check if game already exists in wishlist 
        const existingGame = wishlist.find(game => game.id === gameId);
        
        // If game exists, tell user and exit function
        if (existingGame) {
            alert('This game is already in your wishlist!');
            return;
        }
        
    // Add full game object to wishlist array
    wishlist.push({
        id: gameId,
        name: gameName,
        background_image: gameImage,
        rating: gameRating,
        released: gameReleased
    });
    
        // Save updated wishlist to localStorage
        localStorage.setItem('gameWishlist', JSON.stringify(wishlist));

        // Show success message after adding to wishlist
        alert(`${gameName} added to wishlist!`);
        console.log('Current wishlist:', wishlist);

        // Update wishlist counter display
        updateWishlistCount();
    }
    /**
     * Displays all games in the wishlist with full information
     */
    function displayWishlist() {
        const wishlistResults = document.getElementById('wishlistResults');

        // If wishlist is empty show message
        if (wishlist.length === 0) {
            wishlistResults.innerHTML = '<p>Your wishlist is empty. Search for games to add them!</p>';
            return;
        }
        
        let html = '';

        // Loop through wishlist and create full game cards with images
        wishlist.forEach(game => {
            html += `
                <div class="game-card">
                    <img src="${game.background_image}" alt="${game.name}" onerror="this.src='https://via.placeholder.com/250x200?text=No+Image'">
                    <h3>${game.name}</h3>
                    <p>Rating: ${game.rating}</p>
                    <p>Released: ${game.released}</p>
                    <button class="wishlist-btn" onclick="removeFromWishlist(${game.id})">
                        Remove from Wishlist
                    </button>
                </div>
            `;
        });

        // Display wishlist cards
        wishlistResults.innerHTML = html;
    }
    
    //updates wishlist counter in the navigation
    function updateWishlistCount() {
        wishlistCount.textContent = wishlist.length;
    }

    //removes a game from the wishlist
    function removeFromWishlist(gameId) {
        wishlist = wishlist.filter(game => game.id !== gameId);
        localStorage.setItem('gameWishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        displayWishlist();
    }
    
    //Navigation and tab switching
    //references to navigation elements
    const searchTab = document.getElementById('searchTab');
    const wishlistTab = document.getElementById('wishlistTab');
    const searchSection = document.getElementById('searchSection');
    const wishlistSection = document.getElementById('wishlistSection');
    const wishlistCount = document.getElementById('wishlistCount');
        //search tab on click
        searchTab.addEventListener('click', function() {
            //make search tab active
            searchTab.classList.add('active');
            wishlistTab.classList.remove('active');
            searchSection.classList.add('active');
            wishlistSection.classList.remove('active');
        });
        //wishlist tab is clicked
        wishlistTab.addEventListener('click', function() {
            //wishlist tab is active
            wishlistTab.classList.add('active');
            searchTab.classList.remove('active');
            wishlistSection.classList.add('active');
            searchSection.classList.remove('active');
            displayWishlist();
        });

    searchBtn.addEventListener('click', async function(){
    const searchTerm = searchInput.value;


        //check if search box is empty
        if (!searchTerm) {
            searchResults.innerHTML = '<p>Please enter a search term!</p>';
            return;
        }
        //show loading message while fetching 
        searchResults.innerHTML = '<p>Loading games...</p>';
        //API url with search query
        const url = `${API_BASE}/games?key=${API_KEY}&search=${searchTerm}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        console.log(data);
        //display game results
        displayGames(data.results);
    });
    //enter key now triggers search
    searchInput.addEventListener('keypress', function(e) {

        if (e.key === 'Enter'){
            searchBtn.click();
        }
    });
    //update wishlist counter on page load
    updateWishlistCount();

    //references for theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);

    themeToggle.addEventListener('click', function() {
        //get current theme
        const currentTheme = html.getAttribute('data-theme');
        //toggle between light and dark mode
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme);
    });


    /**
     * Updates the theme toggle button text
     * @param {string} theme - Current theme light or dark mode
     */
    function updateThemeButton(theme) {
        if (theme === 'dark') {
            themeToggle.textContent = 'Light Mode';
        } else {
            themeToggle.textContent = 'Dark Mode';
        }
    }
