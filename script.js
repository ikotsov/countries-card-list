"use strict";

class CountriesDOM {
  constructor() {
    this.api = new CountriesAPI();
  }

  async add(countryName) {
    const data = await this.api.fetch(countryName);

    const languageCode = this.getLanguageCode(countryName);

    const html = `
    <article class="country">
      <img class="country__img" src="${data.flags.svg}" />
      <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__info"><span>🧑‍🤝‍🧑</span>${this.formatPopulation(
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

  formatPopulation(population) {
    return `${(population / 1000000).toFixed(1)} M`;
  }

  getLanguageCode(country) {
    if (typeof country !== "string") return;
    return country.toLowerCase().substring(0, 3);
  }

  selectors() {
    return {
      countriesContainer: document.querySelector(".countries"),
    };
  }
}
class CountriesAPI {
  mainUrl = "https://restcountries.com/v3.1/name";

  async fetch(country) {
    const response = await fetch(`${this.mainUrl}/${country}`);
    const [data] = await response.json();
    console.log(data);
    return data;
  }
}

const countries = new CountriesDOM();
countries.add("portugal");
countries.add("spain");
