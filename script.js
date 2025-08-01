document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results');
    const blurBg = document.querySelector('.blur-bg');
    
    // História de pesquisas
    let searchHistory = JSON.parse(localStorage.getItem('wikiSearchHistory')) || [];
    
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        
        if (searchTerm) {
            await fetchWikipediaArticle(searchTerm);
            addToHistory(searchTerm);
        }
    });
    
    async function fetchWikipediaArticle(articleTitle) {
        // Feedback visual durante o carregamento
        resultsContainer.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Buscando "${articleTitle}" na Wikipedia...</p>
            </div>
        `;
        
        try {
            const url = `https://pt.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&exintro&explaintext&titles=${encodeURIComponent(articleTitle)}&format=json&origin=*&pithumbsize=500`;
            
            const response = await fetch(url);
            const data = await response.json();
            const pages = data.query.pages;
            const pageId = Object.keys(pages)[0];
            
            if (pageId === "-1") {
                showError("Artigo não encontrado. Tente outro termo.");
                resetBackground();
                return;
            }
            
            const page = pages[pageId];
            displayResults(page);
            
            // Atualiza o background se houver imagem
            if (page.thumbnail) {
                updateBackground(page.thumbnail.source);
            } else {
                resetBackground();
            }
            
        } catch (error) {
            console.error("Erro ao buscar o artigo:", error);
            showError("Ocorreu um erro na pesquisa. Tente novamente.");
            resetBackground();
        }
    }
    
    function displayResults(page) {
        const extract = page.extract || "Não há conteúdo disponível para este artigo.";
        const imageUrl = page.thumbnail ? page.thumbnail.source : null;
        
        let contentHtml = `
            <div class="article-card">
                <h2 class="article-title">${page.title}</h2>
                <p class="article-content">${extract}</p>
        `;
        
        if (imageUrl) {
            contentHtml += `
                <img src="${imageUrl}" alt="${page.title}" class="article-image" id="article-image">
            `;
        }
        
        contentHtml += `</div>`;
        
        resultsContainer.innerHTML = contentHtml;
        
        // Mostra a imagem após o carregamento
        if (imageUrl) {
            const imgElement = document.getElementById('article-image');
            imgElement.style.display = 'block';
        }
    }
    
    function updateBackground(imageUrl) {
        blurBg.style.backgroundImage = `url(${imageUrl})`;
        blurBg.style.opacity = '1';
    }
    
    function resetBackground() {
        blurBg.style.opacity = '0';
    }
    
    function showError(message) {
        resultsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
            </div>
        `;
    }
    
    function addToHistory(term) {
        // Limita o histórico aos 5 últimos termos
        searchHistory.unshift(term);
        searchHistory = [...new Set(searchHistory)].slice(0, 5);
        localStorage.setItem('wikiSearchHistory', JSON.stringify(searchHistory));
    }
    
    // Sugere termos do histórico quando o input recebe foco
    searchInput.addEventListener('focus', () => {
        if (searchHistory.length > 0) {
            // Implementar dropdown de sugestões aqui se desejar
        }
    });
});