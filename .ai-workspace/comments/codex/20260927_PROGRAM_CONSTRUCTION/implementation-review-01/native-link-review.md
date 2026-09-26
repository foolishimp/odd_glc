# Closed native dependency wiring review

Product Frame: the already reviewed T-043 Program and packages are unchanged. This checkpoint evaluates only the proposed caller environment correction after installed-04 `positive02` refused `/input` before Run admission. GLC's selected RC4 basis and the separate ABI owner basis remain unchanged; the closed package review retains its scope.

Result: **satisfied as a bounded proposed caller realization; no actionable boundary finding**. This is not acceptance of an executed linked environment. Findings triage is not applicable; Executive disposition remains separate.

The two inspected owners support this distinction:

- ABI `code/src/product/install_product.ts` checks exact lock membership, installs one archive into an empty caller-selected target using ordinary npm, and verifies the resulting Product payload. Its inventory includes the Product's own bundled `node_modules` and rejects symbolic links there. It does not construct a shared dependency environment for separately installed Products.
- ABI `code/src/product/installed_module.ts` verifies the selected Product's physical content, confines the selected entry module to that Product, then imports its file URL. It supplies no custom resolver for that module's bare imports. Those imports consequently use ordinary Node resolution.

The proposed `installed-04/products/node_modules/@abiogenesis/typescript-tenant` link targets the actually admitted `installed-04/products/core46/node_modules/@abiogenesis/typescript-tenant`. It is outside all three immutable Product payloads. On the inspected implementation, this is native caller dependency wiring, not a new Product, admission, package substitution, loader, or upstream ownership change. The evidence does not establish a missing upstream duty requiring a core repair at this checkpoint.

Direct readback of `positive02/graphExecution.json` shows `invalid_input`, null Run/admission, and equal entry/close prefix length `632426397` with digest `9a845bfd272da8c6972d52a8a1ac4b7ad7f5422bdab81d331824d0c2ace6084e`; its file SHA-256 is `ecbcac63243cf224dd0e30357e818fd9c3aa023f24a9006149bf4b0cf8fbcbf2`. The actual core install receipt is retained at `setup/receipts/04-install-0.json`, SHA-256 `a4cbc9d697e1853a9ab30d162ce0b1e1fd1ef90fd461cbac7ed0cf1397bf6125`. The reported old ancestor resolution and loader-only diagnostic are Root's diagnosis, not an independently rerun Reviewer experiment or installed qualification.

Reviewed owner source SHA-256: `install_product.ts` = `b6fd0be714f25c244ec358416bfd666e9abf7c9fd0cef3e1e23a98f607eeee80`; `installed_module.ts` = `03292ca447000174d07f0a64092f00a465e4e8c32df02d19242f557ed994745a`. Their emitted installed-04 modules match the selected core46 copies byte-for-byte (`772a8171c1d74cb43dfff250464a83edfdc4f729cee35c0fad849fe9ace5428d` and `132dcd5d21e09a6456b3e7c441265a51e52d3d04d5fc3a2b8d07cc45aa6e8e30`).

Remaining proof limit: retain the normal Node import's actual resolved core identity and unchanged Product payload checks, then use the genuine resource close and a fresh output for the authorized installed retry. A custom-loader success cannot replace that proof. The external link itself is not authenticated merely by the Product manifest's dependency membership, so this review grants no general dependency-isolation or portable-install claim. Historical authentication, installed execution and original-task/S06 closure remain separate. Reported launch-envelope size is separate proportionality debt and was not investigated here.

Reviewer created no link, changed no source/payload, and performed no setup, Run, native call, test, or history scan. This closed carrier is the sole write.
