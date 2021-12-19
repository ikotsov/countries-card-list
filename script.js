"use strict";

class CountriesDOM {
  constructor() {
    this.utils = new CountriesUtils();
    this.api = new CountriesService();
  }

  async renderCountry(countryName) {
    const data = await this.api.fetch(countryName);

    const languageCode = this.utils.languageCode[countryName];

    const html = `
    <article class="country">
      <img class="country__img" src="${data.flags.svg}" />
      <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__info"><span>🧑‍🤝‍🧑</span>${this.utils.formatPopulation(
          data.population
        )}</p>
        <p class="country__info"><span>🗣️</span>${
          data.languages[languageCode]
        }</p>
        <p class="country__info"><span>🪙</span>${data.currencies.EUR.name}</p>
      </div>
    </article>`;

    this.selectors().countriesContainer.insertAdjacentHTML("beforeend", html);
  }

  selectors() {
    return {
      countriesContainer: document.querySelector(".countries"),
      fetchCountriesBtn: document.querySelector(".btn-country"),
    };
  }
}

class CountriesUtils {
  languageCode = {
    Portugal: "por",
    France: "fra",
    Germany: "deu",
    Spain: "spa",
  };

  formatPopulation(population) {
    if (typeof population !== "number") return;
    return `${(population / 1000000).toFixed(1)} M`;
  }
}

class CountriesService {
  mainUrl = "https://restcountries.com/v3.1/name";

  async fetch(country) {
    const response = await fetch(`${this.mainUrl}/${country}`);
    const [data] = await response.json();
    console.log(data);
    return data;
  }
}

const dom = new CountriesDOM();
dom.selectors().fetchCountriesBtn.addEventListener('click', () => {
  dom.renderCountry("Portugal");
  dom.renderCountry("Spain");
  dom.renderCountry("France");
  dom.renderCountry("Germany");
})
