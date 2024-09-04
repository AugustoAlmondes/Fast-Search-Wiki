let paragrafo = document.getElementById("extract");
let titulo = document.getElementById("titulo");
let imagem = document.getElementById("imagem");
imagem.style.display = 'none';

async function fetchWikipediaArticle() {

    // ZERANDO OS CAMPOS PARA NOVAS PESQUISAS
    console.log(imagem)
    if (paragrafo) {
        paragrafo.textContent = '';
        titulo.textContent = '';
        imagem.setAttribute('src', "#");
        imagem.style.display = 'none';
    }

    var articleTitle = document.getElementById("pesquisa").value;

    // CONECTANDO À API DA WIKIPEDIA
    const url = `https://pt.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&exintro&explaintext&titles=${articleTitle}&format=json&origin=*`;
    console.log(url);

    try {
        const response = await fetch(url);

        const data = await response.json();
        const page = data.query.pages;
        console.log(data);
        const pageId = Object.keys(page)[0];

        if (pageId === "-1") {
            console.log("Artigo não encontrado.");
            paragrafo.textContent = `Esse assunto não foi encontrado.
                                Tente um novo assunto.`;
            return;
        }

        let title = page[pageId].title;
        let imageUrl = page[pageId].thumbnail ? page[pageId].thumbnail.source : "none";
        let extract = page[pageId].extract.split('\n')[0]

        console.log("Titulo:", title);
        console.log("Conteudo:", extract);
        console.log(`URL da imagem: ${imageUrl}`);

        // AQUI TIVE QUE VERIFICAR SE POSSUIA CONTEUDO (SOMENTE NO PRIMEIRO PARÁGRAFO) PRA 
        // DEPOIS ADDICIONAR O SEGUNDO PARÁGRAFO, SE ESSE E O PRIMEIRO EXISTIREM.
        // EM RESUMO, GAMBIARRA.

        if (extract) {
            console.log("entrou fdp");
            
            titulo.textContent = title;
            extract = extract +  + '\n'
            + page[pageId].extract.split('\n')[1];
            paragrafo.textContent = extract;
        }
        else
        {
            paragrafo.textContent = `Esse assunto não foi encontrado.
            Tente um novo assunto.`;
        }


        // ADICIONANDO IMAGEM DE FUNDO NO BODY E FILTROS, SE EXISTIR ALGUMA IMAGEM RELACIONADA.
        if (imageUrl != "none") {
            imagem.style.display = "block";
            imageUrl = imageUrl.replace("50px", "500px");
            imagem.setAttribute('src', imageUrl);

            document.getElementsByTagName("body")[0].style.backgroundImage = `url(${imageUrl})`;
            // document.getElementsByTagName("body")[0].style.backdropFilter = "";
            document.getElementsByTagName("body")[0].style.backdropFilter = "brightness(50%) blur(50px)";
        }

    } catch (error) {
        console.error("Erro ao buscar o artigo:", error);
    }
}
