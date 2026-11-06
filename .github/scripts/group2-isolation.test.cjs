'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {sourceRepository} = require('./rewards-operations.cjs');
test('source is separate from state and malformed references are refused', () => {
  assert.equal(sourceRepository({REWARDS_SOURCE_REPO:'example/source', REWARDS_PRIVATE_REPO:'example/state'}),'example/source');
  assert.throws(()=>sourceRepository({REWARDS_SOURCE_REPO:'example/state', REWARDS_PRIVATE_REPO:'example/state'}));
  assert.throws(()=>sourceRepository({REWARDS_SOURCE_REPO:'https://invalid.example/source'}));
});
test('group 2 workflows have no automatic earning triggers or legacy state secret', () => {
  const dir = path.join(__dirname,'../workflows');
  for(const name of fs.readdirSync(dir).filter(n=>n.endsWith('.yml') && n!=='automation-checks.yml')) {
    const s = fs.readFileSync(path.join(dir,name),'utf8');
    assert.doesNotMatch(s,/^  (push|schedule):/m,name);
    assert.match(s,/vars.REWARDS_GROUP2_ENABLED == 'true'/,name);
    assert.doesNotMatch(s,/REWARDS_PRIVATE_REPO: \$\{\{ secrets.REWARDS_PRIVATE_REPO \}\}/,name);
    assert.doesNotMatch(s,/repository: \$\{\{ secrets.REWARDS_PRIVATE_REPO \}\}/,name);
  }
});
test('Telegram labels group 2 without exposing credentials', async () => {
  const {telegram} = require('./rewards-runner.cjs');
  let sent;
  await telegram('Synthetic report',{REWARDS_GROUP_LABEL:'group2',TELEGRAM_BOT_TOKEN:'fixture',TELEGRAM_CHAT_ID:'fixture'},async (_url,options)=>{
    sent=JSON.parse(options.body);return {ok:true,json:async()=>({ok:true})};
  });
  assert.equal(sent.text,'👥 <b>NHÓM 2</b>\nSynthetic report');
});

