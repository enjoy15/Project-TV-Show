//You can edit ALL of the code here

let allShows = [];
let allEpisodes = [];
const cachedEpisodes = {}; // Cache episodes for each show

async function setup() {
  await fetchShows(); // Fetch and populate the show selector
  setupShowSelectorListener();
  setupSearchListener();
  setupEpisodeSelectorListener();
}

async function fetchShows() {
  try {
    const response = await fetch("https://api.tvmaze.com/shows");
    if (!response.ok) throw new Error("Failed to fetch shows.");
    const shows = await response.json();

    // Sort shows alphabetically (case-insensitive)
    allShows = shows.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );

    populateShowSelector(allShows); // Populate the dropdown
    displayShows(allShows);
  } catch (error) {
    console.error("Error fetching shows:", error);
  }
}

function populateShowSelector(showList) {
  const showSelector = document.getElementById("show-selector");
  showSelector.innerHTML = "<option value=''>Select a show...</option>"; // Reset options

  showList.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelector.appendChild(option);
  });
}

function displayShows(showList) {
  const showsContainer = document.getElementById("shows-container");
  showsContainer.innerHTML = ""; // Clear existing content

  showList.forEach((show) => {
    const showCard = document.createElement("div");
    showCard.className = "show-card";

    const showImage = document.createElement("img");
    showImage.src = show.image ? show.image.medium : "https://via.placeholder.com/300x170?text=No+Image";
    showImage.alt = show.name;

    const contentDiv = document.createElement("div");
    contentDiv.className = "content";

    const showTitle = document.createElement("h2");
    showTitle.textContent = show.name;
    showTitle.addEventListener("click", () => {
      fetchEpisodesForShow(show.id);
      toggleView("episodes");
    });

    const showSummary = document.createElement("p");
    showSummary.innerHTML = show.summary || "No summary available.";

    const showGenres = document.createElement("p");
    showGenres.className = "genres";
    showGenres.textContent = `Genres: ${show.genres.join(", ")}`;

    const showStatus = document.createElement("p");
    showStatus.className = "status";
    showStatus.textContent = `Status: ${show.status}`;

    const showRating = document.createElement("p");
    showRating.className = "rating";
    showRating.textContent = `Rating: ${show.rating.average || "N/A"}`;

    const showRuntime = document.createElement("p");
    showRuntime.className = "runtime";
    showRuntime.textContent = `Runtime: ${show.runtime || "N/A"} minutes`;

    contentDiv.appendChild(showTitle);
    contentDiv.appendChild(showSummary);
    contentDiv.appendChild(showGenres);
    contentDiv.appendChild(showStatus);
    contentDiv.appendChild(showRating);
    contentDiv.appendChild(showRuntime);

    showCard.appendChild(showImage);
    showCard.appendChild(contentDiv);

    showsContainer.appendChild(showCard);
  });
}

function toggleView(view) {
  const showsContainer = document.getElementById("shows-container");
  const episodesContainer = document.getElementById("episodes-container");
  const navigation = document.getElementById("navigation");
  const showSelectorContainer = document.getElementById("show-selector-container");
  const episodeSelectorContainer = document.getElementById("selector-container"); // Added reference

  if (view === "shows") {
    showsContainer.style.display = "flex"; // Ensure grid layout for shows
    episodesContainer.style.display = "none"; // Hide episodes
    navigation.style.display = "none";
    showSelectorContainer.style.display = "block"; // Show the show dropdown
    episodeSelectorContainer.style.display = "none"; // Hide the episode dropdown
  } else if (view === "episodes") {
    showsContainer.style.display = "none"; // Hide shows
    episodesContainer.style.display = "flex"; // Ensure grid layout for episodes
    navigation.style.display = "block";
    showSelectorContainer.style.display = "none"; // Hide the show dropdown
    episodeSelectorContainer.style.display = "block"; // Show the episode dropdown
  }
}

document.getElementById("back-to-shows").addEventListener("click", () => {
  toggleView("shows");
});

async function fetchEpisodesForShow(showId) {
  if (cachedEpisodes[showId]) {
    // Use cached episodes if available
    allEpisodes = cachedEpisodes[showId];
    makePageForEpisodes(allEpisodes);
    populateEpisodeSelector(allEpisodes);
    toggleView("episodes"); // Ensure view switches to episodes
    return;
  }

  try {
    const response = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
    if (!response.ok) throw new Error("Failed to fetch episodes.");
    const episodes = await response.json();

    // Cache the episodes for this show
    cachedEpisodes[showId] = episodes;
    allEpisodes = episodes;

    makePageForEpisodes(allEpisodes);
    populateEpisodeSelector(allEpisodes);
    toggleView("episodes"); // Ensure view switches to episodes
  } catch (error) {
    console.error("Error fetching episodes:", error);
  }
}

function setupShowSelectorListener() {
  const showSelector = document.getElementById("show-selector");
  showSelector.addEventListener("change", (e) => {
    const selectedShowId = e.target.value;
    if (selectedShowId) {
      fetchEpisodesForShow(selectedShowId);
    } else {
      // Clear episodes if no show is selected
      document.getElementById("episodes-container").innerHTML = "";
      document.getElementById("episode-selector").innerHTML = "";
    }
  });
}

function setupSearchListener() {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter((episode) => {
      const name = episode.name.toLowerCase();
      const summary = episode.summary ? episode.summary.toLowerCase() : "";
      return name.includes(searchTerm) || summary.includes(searchTerm);
    });

    makePageForEpisodes(filteredEpisodes);
    updateSearchInfo(filteredEpisodes.length, allEpisodes.length);
  });
}

function setupEpisodeSelectorListener() {
  const episodeSelector = document.getElementById("episode-selector");
  episodeSelector.addEventListener("change", (e) => {
    const selectedEpisodeId = e.target.value;
    if (selectedEpisodeId) {
      const episodeElement = document.getElementById(selectedEpisodeId);
      if (episodeElement) {
        episodeElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("episodes-container");
  rootElem.innerHTML = ""; // Clear existing content

  episodeList.forEach((episode) => {
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card";
    episodeCard.id = `episode-${episode.id}`;

    const episodeImage = document.createElement("img");
    episodeImage.src = episode.image ? episode.image.medium : "https://via.placeholder.com/300x170?text=No+Image";
    episodeImage.alt = episode.name;

    const contentDiv = document.createElement("div");
    contentDiv.className = "content";

    const episodeTitle = document.createElement("h2");
    episodeTitle.textContent = episode.name;

    const episodeCode = document.createElement("p");
    episodeCode.className = "episode-code";
    episodeCode.textContent = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;

    const episodeSummary = document.createElement("p");
    episodeSummary.innerHTML = episode.summary || "No summary available.";

    contentDiv.appendChild(episodeTitle);
    contentDiv.appendChild(episodeCode);
    contentDiv.appendChild(episodeSummary);

    episodeCard.appendChild(episodeImage);
    episodeCard.appendChild(contentDiv);

    rootElem.appendChild(episodeCard);
  });

  updateSearchInfo(episodeList.length, allEpisodes.length);
}

function populateEpisodeSelector(episodes) {
  const episodeSelector = document.getElementById("episode-selector");
  episodeSelector.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select an episode...";
  episodeSelector.appendChild(defaultOption);

  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = `episode-${episode.id}`;
    option.textContent = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")} - ${episode.name}`;
    episodeSelector.appendChild(option);
  });
}

function updateSearchInfo(matchCount, totalCount) {
  const searchInfo = document.getElementById("search-info");
  searchInfo.textContent = `Displaying ${matchCount} of ${totalCount} episodes`;
}

document.addEventListener("DOMContentLoaded", () => {
  const showsContainer = document.getElementById("shows-container");
  const episodesContainer = document.getElementById("episodes-container");
  const backToShowsButton = document.getElementById("back-to-shows");
  const episodeSelector = document.getElementById("episode-selector");

  // Function to toggle views
  function toggleView(showEpisodes) {
    if (showEpisodes) {
      showsContainer.style.display = "none";
      episodesContainer.style.display = "flex";
    } else {
      showsContainer.style.display = "flex";
      episodesContainer.style.display = "none";
    }
  }

  // Function to fetch and display episodes for a show
  async function fetchEpisodesForShow(showId) {
    try {
      const response = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
      const episodes = await response.json();

      // Clear existing episodes
      episodesContainer.innerHTML = "";
      episodeSelector.innerHTML = '<option value="">Select an episode to jump to...</option>';

      // Populate episodes
      episodes.forEach((episode) => {
        const episodeCard = document.createElement("div");
        episodeCard.className = "episode-card";
        episodeCard.innerHTML = `
          <img src="${episode.image ? episode.image.medium : ''}" alt="${episode.name}">
          <div class="content">
            <h2>${episode.name}</h2>
            <p>${episode.summary || "No summary available."}</p>
            <p class="episode-code">S${episode.season}E${episode.number}</p>
          </div>
        `;
        episodesContainer.appendChild(episodeCard);

        // Add to episode selector
        const option = document.createElement("option");
        option.value = episode.id;
        option.textContent = `S${episode.season}E${episode.number} - ${episode.name}`;
        episodeSelector.appendChild(option);
      });
    } catch (error) {
      console.error("Failed to fetch episodes:", error);
    }
  }

  // Add event listener to show cards
  showsContainer.addEventListener("click", (event) => {
    const showCard = event.target.closest(".show-card");
    if (showCard) {
      const showId = showCard.dataset.showId; // Assuming data-show-id is set on each show card
      fetchEpisodesForShow(showId);
      toggleView(true); // Hide shows listing and display episodes
    }
  });

  // Add event listener to back-to-shows button
  backToShowsButton.addEventListener("click", (event) => {
    event.preventDefault();
    toggleView(false); // Show shows listing and hide episodes
  });

  // Initialize with shows listing view
  toggleView(false);
});

window.onload = setup;