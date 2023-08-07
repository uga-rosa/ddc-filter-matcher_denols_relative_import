import { BaseFilter, Item } from "https://deno.land/x/ddc_vim@v3.9.0/types.ts";
import { FilterArguments } from "https://deno.land/x/ddc_vim@v3.9.0/base/filter.ts";
import * as u from "https://deno.land/x/unknownutil@v3.4.0/mod.ts";

type Params = Record<never, never>;

export class Filter extends BaseFilter<Params> {
  filter({
    items,
  }: FilterArguments<Params>): Promise<Item[]> {
    return Promise.resolve(items.filter((item) => {
      if (
        !u.isObjectOf({
          user_data: u.isObjectOf({
            lspitem: u.isString,
          }),
        })(item)
      ) {
        return true;
      }
      const lspitem = JSON.parse(item.user_data.lspitem);
      if (
        !u.isObjectOf({
          data: u.isObjectOf({
            tsc: u.isObjectOf({
              source: u.isString,
            }),
          }),
        })(lspitem)
      ) {
        return true;
      }
      const source = lspitem.data.tsc.source;
      return !source.startsWith("https://deno.land");
    }));
  }

  params(): Params {
    return {};
  }
}
