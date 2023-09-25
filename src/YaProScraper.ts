import axios from "axios";
import { ParkEntity } from "./models/ParkEntity";
import * as jsdom from "jsdom";

export class YaProScraper {
  constructor(private readonly _city: string) { }

  async load(): Promise<ParkEntity[]> {
    const URL =
      "https://pro.yandex.ru/ru-ru/" +
      this._city +
      "/knowledge-base/taxi/common/parks";

    const { data, status } = await axios.get(URL);

    if (status != 200) return [];

    const { JSDOM } = jsdom;
    const { document } = new JSDOM(data).window;
    const entries = this.getElements(document);

    console.log("Items: " + entries.length.toString());

    return entries.map((element) => {

      console.log(element);

      return {
        title: this.getTitle(element),
        schedule: this.getSchedule(element),
        phone: this.getPhone(element),
        address: this.getAddress(element),
      };
    });
  }

  private getTitle(elem: any) {
    return elem.name;
  }

  private getPhone(elem: any) {
    return elem.phone;
  }

  private getAddress(elem: any) {
    return elem.address;
  }

  private getSchedule(elem: any) {
    return elem.work_time;
  }

  private getElements(document: Document): Array<Object> {
    return JSON.parse(document.querySelector("#__NEXT_DATA__")?.innerHTML ?? "")
      .props.initialProps.pageProps.data.article.text_components[0].values.body
  }
}
