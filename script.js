//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("episodes-container");
  rootElem.innerHTML = ""; // Clear existing content

  episodeList.forEach((episode) => {
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card";

    const episodeImage = document.createElement("img");
    episodeImage.src = episode.image.medium;
    episodeImage.alt = episode.name;

    const contentDiv = document.createElement("div");
    contentDiv.className = "content";

    const episodeTitle = document.createElement("h2");
    episodeTitle.textContent = `${episode.name}`;

    const episodeCode = document.createElement("p");
    episodeCode.className = "episode-code";
    episodeCode.textContent = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;

    const episodeSummary = document.createElement("p");
    episodeSummary.innerHTML = episode.summary;

    contentDiv.appendChild(episodeTitle);
    contentDiv.appendChild(episodeCode);
    contentDiv.appendChild(episodeSummary);

    episodeCard.appendChild(episodeImage);
    episodeCard.appendChild(contentDiv);

    rootElem.appendChild(episodeCard);
  });
}

window.onload = setup;