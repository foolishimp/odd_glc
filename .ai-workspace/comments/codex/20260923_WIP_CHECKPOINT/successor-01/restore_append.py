#!/usr/bin/env python3
"""Compose a banked prefix and verified new suffix into a NEW destination."""
import argparse,hashlib,json,os
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--record',type=Path,required=True);p.add_argument('--base-root',type=Path,required=True);p.add_argument('--delta-root',type=Path,required=True);p.add_argument('--destination',type=Path,required=True);a=p.parse_args()
r=json.loads(a.record.read_text());old=r['inheritedPrefix'];delta=r['suffix'];whole=r['currentWhole']
def safe(root,relative):
 path=Path(relative);assert not path.is_absolute()and'..'not in path.parts
 target=root.resolve()/path;assert not any(x.is_symlink()for x in [target,*target.parents]);return target
base=safe(a.base_root,r['logicalPath']);suffix=safe(a.delta_root,delta['path']);assert base.stat().st_size==old['byteLength'];assert suffix.stat().st_size==delta['byteLength'];assert delta['offset']==old['byteLength'];assert old['byteLength']+delta['byteLength']==whole['byteLength']
a.destination.mkdir(parents=True,exist_ok=False);target=safe(a.destination,r['logicalPath']);target.parent.mkdir(parents=True,exist_ok=True)
combined=hashlib.sha256();count=0
with target.open('xb')as output:
 for source,expected in [(base,old),(suffix,delta)]:
  digest=hashlib.sha256();length=0
  with source.open('rb')as f:
   for block in iter(lambda:f.read(1024*1024),b''):digest.update(block);combined.update(block);output.write(block);length+=len(block);count+=len(block)
  assert length==expected['byteLength']and digest.hexdigest()==expected['sha256'],'part identity mismatch'
assert count==whole['byteLength']and combined.hexdigest()==whole['sha256'],'actual owner whole-file identity mismatch'
target.chmod(old['mode']);print(json.dumps({'restored':str(target),'byteLength':count,'sha256':combined.hexdigest(),'prefixAndSuffixVerified':True,'originalsModified':False}))
