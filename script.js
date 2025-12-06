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

    populateShowSelector(allShows);
  } catch (error) {
    console.error("Error fetching shows:", error);
  }
}

function populateShowSelector(shows) {
  const showSelector = document.getElementById("show-selector");
  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelector.appendChild(option);
  });
}

async function fetchEpisodesForShow(showId) {
  if (cachedEpisodes[showId]) {
    // Use cached episodes if available
    allEpisodes = cachedEpisodes[showId];
    makePageForEpisodes(allEpisodes);
    populateEpisodeSelector(allEpisodes);
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

window.onload = setup;