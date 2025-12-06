//You can edit ALL of the code here

let allEpisodes = [];

function setup() {
  allEpisodes = getAllEpisodes();
  populateEpisodeSelector(allEpisodes);
  makePageForEpisodes(allEpisodes);
  setupSearchListener();
  setupSelectorListener();
  updateSearchInfo(allEpisodes.length, allEpisodes.length);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("episodes-container");
  rootElem.innerHTML = ""; // Clear existing content

  episodeList.forEach((episode) => {
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card";
    episodeCard.id = `episode-${episode.season}-${episode.number}`;

    const episodeImage = document.createElement("img");
    episodeImage.src = episode.image ? episode.image.medium : "https://via.placeholder.com/300x170?text=No+Image";
    episodeImage.alt = episode.name;

    const contentDiv = document.createElement("div");
    contentDiv.className = "content";

    const episodeTitle = document.createElement("h2");
    episodeTitle.textContent = `${episode.name}`;

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
  const selector = document.getElementById("episode-selector");
  selector.innerHTML = "";

  // Provide a visible way to show all episodes again
  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = "Show all episodes";
  selector.appendChild(allOption);

  // Add a non-selectable placeholder for clarity (optional)
  const placeholder = document.createElement("option");
  placeholder.disabled = true;
  placeholder.textContent = "— Jump to an episode —";
  selector.appendChild(placeholder);

  episodes.forEach((episode) => {
    const option = document.createElement("option");
    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
    option.value = `episode-${episode.season}-${episode.number}`;
    option.textContent = `${episodeCode} - ${episode.name}`;
    selector.appendChild(option);
  });

  // Ensure the placeholder is selected by default
  selector.selectedIndex = 1;
}

function setupSearchListener() {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();

    if (searchTerm === "") {
      makePageForEpisodes(allEpisodes);
    } else {
      const filteredEpisodes = allEpisodes.filter((episode) => {
        const name = episode.name ? episode.name.toLowerCase() : "";
        const summary = episode.summary ? episode.summary.toLowerCase() : "";
        return name.includes(searchTerm) || summary.includes(searchTerm);
      });

      makePageForEpisodes(filteredEpisodes);
    }

    // When searching, reset selector to the "Show all episodes" placeholder so user can jump again easily
    const selector = document.getElementById("episode-selector");
    if (selector) selector.selectedIndex = 1;
  });
}

function updateSearchInfo(matchCount, totalCount) {
  const searchInfo = document.getElementById("search-info");
  if (searchInfo) {
    searchInfo.textContent = `Displaying ${matchCount} of ${totalCount} episodes`;
  }
}

function setupSelectorListener() {
  const selector = document.getElementById("episode-selector");
  selector.addEventListener("change", (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === "") {
      // Show all episodes again
      makePageForEpisodes(allEpisodes);
      // reset placeholder selection to the placeholder (index 1)
      selector.selectedIndex = 1;
      return;
    }

    // Find the selected episode and only show that one
    const [_, season, number] = selectedValue.match(/^episode-(\d+)-(\d+)$/) || [];
    if (season && number) {
      const episode = allEpisodes.find(
        (ep) => String(ep.season) === season && String(ep.number) === number
      );
      if (episode) {
        makePageForEpisodes([episode]);
        // keep the selected option so user sees which episode is shown
        // also scroll the single episode into view
        const el = document.getElementById(selectedValue);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });
}

window.onload = setup;