import { BaseFilter, Item } from "https://deno.land/x/ddc_vim@v3.9.0/types.ts";
import { FilterArguments } from "https://deno.land/x/ddc_vim@v3.9.0/base/filter.ts";
import * as u from "https://deno.land/x/unknownutil@v3.4.0/mod.ts";

type Params = Record<never, never>;

export class Filter extends BaseFilter<Params> {
  hostByClient: Record<string, string[]> = {};

  async filter({
    denops,
    items,
  }: FilterArguments<Params>): Promise<Item[]> {
    const retItems: Item[] = [];

    for (const item of items) {
      if (
        !u.isObjectOf({
          user_data: u.isObjectOf({
            clientId: u.isNumber,
            lspitem: u.isString,
          }),
        })(item)
      ) {
        retItems.push(item);
        continue;
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
        retItems.push(item);
        continue;
      }

      const clientId = item.user_data.clientId;
      if (this.hostByClient[clientId] == null) {
        const hosts = await (denops.call(
          "luaeval",
          `vim.lsp.get_client_by_id(${clientId}).config.init_options.suggest.imports.hosts`,
        ) as Promise<Record<string, boolean>>).catch(() => ({}));
        this.hostByClient[clientId] = Object.keys(hosts);
      }
      const hosts = this.hostByClient[clientId];

      const source = lspitem.data.tsc.source;
      if (hosts.every((host) => !source.startsWith(host))) {
        retItems.push(item);
      }
    }

    return retItems;
  }

  params(): Params {
    return {};
  }
}
