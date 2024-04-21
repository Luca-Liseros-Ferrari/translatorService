document.addEventListener("DOMContentLoaded", (event) => {
  // select
  let selectLang = document.getElementById("selectLang");

  // options
  let languages = document.querySelectorAll(".languages");

  // handler
  selectLang.addEventListener("change", changeHandler);

  let allElements = document.querySelectorAll("p");


  console.log(allElements);

  // Funzione per salvare le traduzioni nel localStorage
function saveTranslationToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Funzione per caricare le traduzioni dal localStorage
function loadTranslationFromLocalStorage(key) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

  // Oggetto per memorizzare le traduzioni
  let translations = loadTranslationFromLocalStorage('translations') || {};

  async function changeHandler(e) {
    let targetLanguage;
    languages.forEach(function (item) {
      let selectedValue = e.target.value;
      if (selectedValue === "italiano") {
        targetLanguage = "it";
        return targetLanguage;
      }
      if (selectedValue === "english") {
        targetLanguage = "en";
        return targetLanguage;
      }
      if (selectedValue === "fr") {
        targetLanguage = "fr";
        return targetLanguage;
      }
      console.log(item);
    });

    async function translateText(textNode) {
      let text = textNode.nodeValue;
      let translationKey = `${text}_${targetLanguage}`;
      // Controlla se la traduzione è già memorizzata
      if (translations.hasOwnProperty(translationKey)) {
        textNode.nodeValue = translations[translationKey];
        return;
      }
      fetch(
        `http://localhost:3000/translate?text=${encodeURIComponent(
          textNode.nodeValue
        )}&target=${encodeURIComponent(targetLanguage)}`
      )
        .then((response) => response.json())
        .then((data) => {
          let translatedText = data.translation;
          textNode.nodeValue = translatedText;
          console.log(translatedText);
          // Memorizza la traduzione
          translations[translationKey] = translatedText;
        })
        .catch((error) => {
          console.error("Translation error:", error);
        });
    }

    async function traverseNodes(node) {
      node.childNodes.forEach(function (item) {
        if (
          item.nodeType === Node.TEXT_NODE &&
          item.textContent.trim() !== ""
        ) {
          translateText(item);
        }
      });
    }
    for (let i = 0; i < allElements.length; i++) {
      allElements[i].classList.add("translateClass");
      traverseNodes(allElements[i]);
    }

    /*
    const elementsWithText = document.querySelectorAll(".translateClass");
    elementsWithText.forEach((element) => {
      traverseNodes(element);
    });
    */
    // Salva le traduzioni nel localStorage dopo aver tradotto tutti gli elementi
    saveTranslationToLocalStorage('translations', translations);
  }

});
