#!/usr/bin/env python3
"""Read only newly appended bytes; no runtime acquisition or event parsing."""
import hashlib,json,os
from pathlib import Path
repo=Path('/Users/jim/src/apps/odd_glc');out=repo/'.ai-workspace/comments/codex/20260923_WIP_CHECKPOINT/successor-01'
classification=json.loads((out/'classification.json').read_text());assert len(classification['changedArchiveOriginals'])==1
row=classification['changedArchiveOriginals'][0];source=repo/row['path'];old=row['basis'];handoffPath=repo/'.ai-workspace/comments/codex/20260923_GENERIC_DATA_MAPPER_CONTINUATION/correction-acquisition-03/current-handoff.json';h=json.loads(handoffPath.read_text());p=h['prefix']
lock=Path('/var/folders/rz/r6wxvr0n15d906k2s0jw8j2h0000gn/T/abiogenesis-event-store-locks-v5/16777230-455703821.lock');assert not lock.exists()
staging=out/'append-staging';staging.mkdir(exist_ok=False);suffix=staging/'runtime.events.jsonl.suffix';digest=hashlib.sha256();length=0
with source.open('rb')as f,suffix.open('xb')as target:
 before=os.fstat(f.fileno());assert before.st_dev==p['storeIdentity']['device']and before.st_ino==p['storeIdentity']['inode']and before.st_size==p['prefixLength'];assert before.st_size>old['byteLength']
 f.seek(old['byteLength'])
 for block in iter(lambda:f.read(1024*1024),b''):target.write(block);digest.update(block);length+=len(block)
 after=os.fstat(f.fileno());assert (before.st_size,before.st_mtime_ns,before.st_ino)==(after.st_size,after.st_mtime_ns,after.st_ino)
assert length==p['prefixLength']-old['byteLength'];assert not lock.exists()
record={'kind':'lossless_append_checkpoint','logicalPath':row['path'],'inheritedPrefix':old,'currentWhole':{'byteLength':p['prefixLength'],'sha256':p['prefixDigest'].removeprefix('sha256:'),'coordinateDigest':p['coordinateDigest'],'authority':'accepted genuine Public close, not independently rehashed by this Writer','handoffPath':str(handoffPath.relative_to(repo)),'handoffFileSha256':hashlib.sha256(handoffPath.read_bytes()).hexdigest()},'suffix':{'path':str(suffix.relative_to(repo)),'offset':old['byteLength'],'byteLength':length,'sha256':digest.hexdigest()},'physicalSource':{'device':before.st_dev,'inode':before.st_ino,'mtimeNs':before.st_mtime_ns,'unchangedThroughRead':True,'lockAbsentAtCapture':True},'proof':'Banked prefix restoration proof reused. Only new suffix bytes were read and hashed. New suffix receives exact archive/restore comparison. Whole current digest is inherited from actual Public close; a fresh-clone composition command verifies it after restoring prefix+suffix. No old payload or original prefix rehash.'}
(out/'append-record.json').write_text(json.dumps(record,indent=2)+'\n');(out/'append-paths.nul').write_bytes(os.fsencode(str(suffix.relative_to(repo)))+b'\0');print(json.dumps({'suffixBytes':length,'suffixSha256':digest.hexdigest(),'unchangedOriginal':True}))
