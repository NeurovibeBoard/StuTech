function toggleTheme(){
document.body.classList.toggle("light");
}

// Save progress (basic system)
function saveProgress(subject){
localStorage.setItem(subject,"completed");
alert(subject + " marked as completed!");
}const result = document.getElementById("result");

/* MAIN SEARCH FUNCTION */
async function searchWiki(customQuery){

    let query = customQuery || document.getElementById("searchInput").value;

    if(!query) return;

    result.style.display = "block";
    result.innerHTML = "Loading...";

    try {

        // STEP 1: SEARCH WIKIPEDIA (IMPORTANT FIX)
        const searchRes = await fetch(
            `https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}&limit=1&namespace=0&format=json&origin=*`
        );

        const searchData = await searchRes.json();

        const title = searchData[1][0];

        if(!title){
            result.innerHTML = "<h3>No results found</h3>";
            return;
        }

        // STEP 2: GET FULL SUMMARY
        const summaryRes = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
        );

        const data = await summaryRes.json();

        result.innerHTML = `
            ${data.thumbnail ? `<img src="${data.thumbnail.source}">` : ""}
            <h2>${data.title}</h2>
            <p>${data.extract}</p>
            <a href="${data.content_urls.desktop.page}" target="_blank" style="color:#7c3aed;">
                Read Full Article
            </a>
        `;

        saveHistory(query);

    } catch (err) {
        result.innerHTML = "<h3>Something went wrong</h3>";
    }
}

/* RANDOM ARTICLE */
function randomArticle(){
    const topics = [
        "Artificial Intelligence",
        "Black Hole",
        "Quantum Physics",
        "Python",
        "Space",
        "India",
        "Internet",
        "Machine Learning"
    ];

    const random = topics[Math.floor(Math.random()*topics.length)];
    searchWiki(random);
}

/* HISTORY */
function saveHistory(item){

    let history = JSON.parse(localStorage.getItem("nw")) || [];

    if(!history.includes(item)){
        history.unshift(item);
    }

    history = history.slice(0,8);

    localStorage.setItem("nw", JSON.stringify(history));

    renderHistory();
}

function renderHistory(){

    let history = JSON.parse(localStorage.getItem("nw")) || [];

    document.getElementById("history").innerHTML =
    history.map(h =>
        `<span class="tag" onclick="searchWiki('${h}')">${h}</span>`
    ).join("");
}

/* ENTER KEY */
document.addEventListener("keydown", (e)=>{
    if(e.key === "Enter"){
        searchWiki();
    }
});

renderHistory();
