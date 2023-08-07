# ddc-filter-matcher_denols_relative_import

For [ddc-source-nvim-lsp](https://github.com/Shougo/ddc-source-nvim-lsp).

The number of candidates for auto import returned by denols is very large,
because of including older versions of libraries. And It is also very
inconvenient because there is no way to distinguish between them. This filter
excludes all imports from `https: //deno.land` or other url
(`deno.suggest.imports.hosts`), leaving only relative imports from `deps.ts` or
other sources.
