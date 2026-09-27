# Declaration-resource consumer checkpoint

T-043 owns current execution and completion state. Each `execution-return.md`
distinguishes installed results, caller failures and pending original-task
conditions. Prior failed callers, Runs and host diagnostics remain unchanged.

`checkpoint-01-large-evidence.json` inventories the closed large records through
PC05-02. Its `archiveParts` are stored in order as
`checkpoint-01-large-evidence.tgz.part00` through `part02`. Concatenate them,
verify `archiveSha256`, then extract at the repository root. Every original
member was independently read back and verified against its recorded SHA-256.
The unsplit local archive and expanded package/install/cache trees are excluded
from Git. Scripts, compact returns and exact source manifests remain directly
readable. `checkpoint-02-large-evidence.json` adds the closed native/caller
records through PC05-04. Use its archive or ordered parts in the same way;
member hashes were verified independently. Later successors require their own
recorded outcomes.

The actual installed core47 archive and member inventory are checkpointed in
the matching ABIogenesis evidence directory. Historical source coordinates and
the original worksite remain explicit dependencies; a source-ready review or
archived receipt does not establish an unexecuted native outcome.
