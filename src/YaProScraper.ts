import axios from "axios";
import { ParkEntity } from "./models/ParkEntity";
import * as jsdom from "jsdom";

export class YaProScraper {
  constructor(private readonly _city: string) {}

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

    console.log("items: " + entries.length.toString());

    return entries.map((element) => {
      const children = element.querySelectorAll("span")!;

      console.log(children);

      return {
        title: this.getTitle(element),
        schedule: children.item(2).textContent ?? '',
        phone: children.item(4).textContent ?? '',
        address: children.item(6).textContent ?? '',
      };
    });
  }

  private getTitle(elem: Element): string {
    return (
      elem
        ?.querySelector(".accordion_titleWrapper__2ogdZ")
        ?.querySelector("span")?.textContent ?? ""
    );
  }

  private getElements(document: Document): Element[] {
    return Array.from(
      document?.querySelectorAll(".accordion_accordion__7KkXQ") ?? []
    );
  }
}
