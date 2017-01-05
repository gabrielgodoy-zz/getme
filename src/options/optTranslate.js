const key = 'trnsl.1.1.20170105T060308Z.f3f9bcb6f1acfc21.b8b98c7a8899c9532a26b8c0a665696bd9b6aa83';
const languageCode = 'pt';
const textToTranslate = 'o livro está na cadeira';

// FROM hyphen TO
const translateToLang = 'pt-en';

const listLangsPrefix = 'https://translate.yandex.net/api/v1.5/tr.json/getLangs';
const translatePrefix = 'https://translate.yandex.net/api/v1.5/tr.json/translate';

const apiEndpoint = {
  listSupportedLangs: `${listLangsPrefix}?key=${key}&ui=${languageCode}`,
  translate: `${translatePrefix}?key=${key}&text=${textToTranslate}&lang=${translateToLang}&options=1`,
};

function optTranslate() {
  console.log(apiEndpoint);
}

module.exports = optTranslate;
