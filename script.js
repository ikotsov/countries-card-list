"use strict";

class CountriesDOM {
  constructor() {
    this.utils = new CountriesUtils();
    this.countriesApi = new CountriesService();
  }

  async fetchAndRenderCountries() {
    try {
      const data = await this.countriesApi.fetchCountries({
        code1: "PT",
        code2: "ES",
        code3: "FR",
        code4: "DE",
      });

      data.map((c) => this.renderCountry(c));
    } catch (error) {
      this.renderError(error.message);
    } finally {
      this.selectors().countriesContainer.style.opacity = 1;
    }
  }

  async fetchAndRenderCountry(countryName) {
    try {
      const data = await this.countriesApi.fetchCountry(countryName);

      if (data?.status === 404) throw new Error(data.message);

      this.renderCountry(data);
    } catch (error) {
      this.renderError(error.message);
    } finally {
      this.selectors().countriesContainer.style.opacity = 1;
    }
  }

  renderCountry(country) {
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

  clearContent() {
    this.selectors().countriesContainer.innerHTML = "";
    this.selectors().countriesContainer.style.opacity = 0;
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
    Greece: "ell",
  };

  formatPopulation(population) {
    if (typeof population !== "number") return;
    return `${(population / 1000000).toFixed(1)} M`;
  }
}

class CountriesService {
  mainCountriesUrl = "https://restcountries.com/v3.1/alpha";
  mainCountryUrl = "https://restcountries.com/v3.1/name";

  async fetchCountries({ code1, code2, code3, code4 }) {
    const response = await fetch(
      `${this.mainCountriesUrl}/?codes=${code1},${code2},${code3},${code4}`
    );

    const data = await response.json();
    return data;
  }

  async fetchCountry(countryName) {
    const response = await fetch(`${this.mainCountryUrl}/${countryName}`);
    if (response.ok) {
      const [data] = await response.json();
      return data;
    }
    const data = await response.json();
    return data;
  }
}

class GeolocationService {
  constructor(domMutationApi) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const currentCountry = await this.fetch(
        position.coords.latitude,
        position.coords.longitude
      );
      domMutationApi.fetchAndRenderCountry(currentCountry);
    });
  }

  mainUrl = "https://geocode.xyz";

  async fetch(lat, long) {
    const response = await fetch(`${this.mainUrl}/${lat},${long}?geoit=json`);
    if (response.ok) {
      const data = await response.json();
      return data.country;
    }
  }
}

const domMutator = new CountriesDOM();
domMutator.selectors().fetchCountriesBtn.addEventListener("click", () => {
  domMutator.clearContent();
  domMutator.fetchAndRenderCountries();
});

domMutator.selectors().fetchCurrentCountryBtn.addEventListener("click", () => {
  domMutator.clearContent();
  new GeolocationService(domMutator);
});
