class Countries {
  url = "https://restcountries.com/v3.1/all";
  countries = [];

  async fetch() {
    const response = await fetch(this.url);
    const json = await response.json();
    this.countries = json;
    console.log(this.countries[0].name.common); // Should log `Kenya`
  }
}
const countries = new Countries();
countries.fetch();
