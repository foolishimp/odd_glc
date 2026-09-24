#!/usr/bin/env python3
import sys,json,gzip,hashlib,importlib.util,time
from pathlib import Path
sys.dont_write_bytecode=True
repo=Path('/Users/jim/src/apps/odd_glc');root=Path(__file__).resolve().parent;out=root/'transport-01';sel=json.loads((root/'selection.json').read_text())
source=repo/'.ai-workspace/comments/codex/20260923_WIP_CHECKPOINT/successor-01/checkpoint_transport.py'
spec=importlib.util.spec_from_file_location('checkpoint_transport',source);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
out.mkdir(exist_ok=False);m.CHECKPOINT=out.relative_to(repo).as_posix();started=time.monotonic();m.prepare(repo,out,[],selected=[r['path']for r in sel['members']]);packed=time.monotonic();result=m.verify(out);finished=time.monotonic()
with gzip.open(out/'members.jsonl.gz','rt')as f:rows={r['path']:r for r in map(json.loads,f)}
assert len(rows)==len(sel['members'])
for path,e in sel['expectedFrozenMembers'].items():assert rows[path]['sha256']==e['sha256']and rows[path]['byteLength']==e['byteLength'],path
journal=repo/sel['journal']['path'];st=journal.stat();before=sel['journal']['preArchiveStat'];assert (st.st_size,st.st_dev,st.st_ino,st.st_mtime_ns)==(before['bytes'],before['device'],before['inode'],before['mtimeNs'])
result.update(originalJournalReadCount=1,originalJournalParsed=False,originalsHashComparedFromArchiveAgainstClosedReceipts=True,closedJournalSha256=rows[sel['journal']['path']]['sha256'],packSeconds=packed-started,archiveVerificationSeconds=finished-packed,mechanism=str(source),mechanismSha256=hashlib.sha256(source.read_bytes()).hexdigest())
m.write_json(out/'verification.json',result);m.write_json(root/'frozen-member-correspondence.json',{'status':'CLOSED exact selected frozen identities verified','selectedMembers':len(rows),'receiptBoundMembers':len(sel['expectedFrozenMembers']),'journalStatUnchanged':True,'journalSha256':rows[sel['journal']['path']]['sha256']})
print(json.dumps(result),flush=True)
