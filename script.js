"use strict";

class CountriesDOM {
  constructor() {
    this.utils = new CountriesUtils();
    this.countryApi = new CountriesService();
  }

  async fetchAndRender(countryName) {
    try {
      const data = await this.countryApi.fetch(countryName);

      if (data?.status === 404) throw new Error(data.message);

      this.renderCountry(data);
    } catch (error) {
      this.renderError(error.message);
    }
  }

  async renderCountry(country) {
    const languageCode = this.utils.languageCode[country.name.common];

    const html = `
      <article class="country">
        <img class="country__img" src="${country.flags.svg}" />
        <div class="country__data">
          <h3 class="country__name">${country.name.common}</h3>
          <h4 class="country__region">${country.region}</h4>
          <p class="country__info"><span>🧑‍🤝‍🧑</span>${this.utils.formatPopulation(
            country.population
          )}</p>
          <p class="country__info"><span>🗣️</span>${
            country.languages[languageCode]
          }</p>
          <p class="country__info"><span>🪙</span>${
            country.currencies.EUR.name
          }</p>
        </div>
      </article>`;

    this.selectors().countriesContainer.insertAdjacentHTML("beforeend", html);
  }

  renderError(message) {
    const html = `<p class="error-text">${message}</p>`;

    this.selectors().countriesContainer.insertAdjacentHTML("beforeend", html);
  }

  selectors() {
    return {
      countriesContainer: document.querySelector(".countries"),
      fetchCountriesBtn: document.querySelector(".btn-country"),
      fetchCurrentCountryBtn: document.querySelector(".btn-whereami"),
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
    if (response.ok) {
      const [data] = await response.json();
      return data;
    }
    const data = await response.json();
    return data;
  }
}

class GeolocationService {
  mainUrl = "https://geocode.xyz";

  async fetch(lat, long) {
    const response = await fetch(`${this.mainUrl}/${lat},${long}?geoit=json`);
    if (response.ok) {
      const data = await response.json();
      return data.country;
    }
  }
}

const dom = new CountriesDOM();
dom.selectors().fetchCountriesBtn.addEventListener("click", () => {
  dom.fetchAndRender("Portugal");
  dom.fetchAndRender("Spain");
  dom.fetchAndRender("France");
  dom.fetchAndRender("Germany");
});

const LAT_OF_GREECE = 37.974851341029684;
const LONG_OF_GREECE = 23.777171879171647;
dom.selectors().fetchCurrentCountryBtn.addEventListener("click", async () => {
  const locationApi = new GeolocationService();
  const currentCountry = await locationApi.fetch(LAT_OF_GREECE, LONG_OF_GREECE);
  dom.fetchAndRender(currentCountry);
});
