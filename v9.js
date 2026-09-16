/* ==========================================================
   M&C：星痕公會 V9.1 — production flat-assets build
   GitHub-friendly: every asset folder stays under 90 files.
   ========================================================== */
(function(){
  const V9_ASSET={hero:'./v9_01_heroes',monster:'./v9_02_monsters',world:'./v9_03_world',gearA:'./v9_04_gear_a',gearB:'./v9_05_gear_b',fashion:'./v9_06_fashion'};
  const ZONE_BG=['forest','mine','village','mist','fortress','frost','desert','abyss'];
  const HERO_POOLS={warrior:['h01','h03','h04','h05','h06','h20','h21','h23'],mage:['h02','h07','h08','h09','h10','h11','h12','h22'],archer:['h13','h14','h15','h16','h17','h18'],rogue:['h19','h20','h21','h23','h24','h16']};
  const MONSTER_POOLS={1:['m01','m02','m03','m13'],2:['m04','m05','m07','m14'],3:['m06','m09','m13','m15'],4:['m02','m10','m11','m17'],5:['m05','m07','m15','m18'],6:['m10','m11','m20','m24'],7:['m03','m12','m14','m19'],8:['m06','m17','m23','m24']};
  const BOSS_POOLS={1:'m07',2:'m14',3:'m15',4:'m17',5:'m18',6:'m20',7:'m19',8:'m23'};
  const BUILDING_ART={guildhall:'b01',tavern:'b02',training:'b03',blacksmith:'b04',warehouse:'b05',arcane:'b06',portal:'b07',atelier:'b08'};
  const GEAR_POOLS={'主武器':[1,2,3,4,5,7,8,9,10,13,14,15,16,17,18,19,20],'副武器':[7,9,10,13,14,15,16,17,18,19,20],'頭盔':[21,22,23,24,25,26,27,30,31,32,33,34,35],'盔甲':[36,37,38,39,42,43,44,45,46,47,48,49,50],'手套':[51,52,53,54,55,56,57,58,59,60,61,62,63,64,65],'腰帶':[66,67,68,73,74,79],'鞋子':[69,70,75,76,77,78,80],'項鍊':[97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112]};
  const HERO_RATES=[['COMMON',.45],['UNCOMMON',.30],['RARE',.16],['EPIC',.06],['LEGENDARY',.024],['MYTHIC',.006]];
  const GEAR_RATES=[['COMMON',.42],['UNCOMMON',.30],['RARE',.18],['EPIC',.065],['LEGENDARY',.028],['MYTHIC',.007]];
  const FASHION_RATES=[['RARE',.55],['EPIC',.28],['LEGENDARY',.13],['MYTHIC',.04]];


  function v9Img(src,alt='',cls=''){
    const safeAlt=(typeof esc==='function'?esc(alt):String(alt).replace(/[<>&"']/g,''));
    return `<img ${cls?`class="${cls}"`:''} src="${src}" alt="${safeAlt}" loading="eager" onerror="console.error('[V9 asset 404]',this.src);this.classList.add('v9-img-error');this.alt='素材未載入：${safeAlt}'">`;
  }
  window.V9_ASSET=V9_ASSET;
  function hash(s){s=String(s||'');let x=0;for(let i=0;i<s.length;i++){x=((x<<5)-x)+s.charCodeAt(i);x|=0}return Math.abs(x)}
  function cls(v){const n=(typeof v4NormalizeClass==='function'?v4NormalizeClass(v||''):String(v||''));if(/法師|牧師/.test(n))return'mage';if(/弓箭|遊俠/.test(n))return'archer';if(/盜賊|刺客/.test(n))return'rogue';return'warrior'}
  function heroKey(a){const p=HERO_POOLS[cls(a?.class_name)]||HERO_POOLS.warrior;return p[hash(`${a?.name}|${a?.class_name}|${a?.rarity}`)%p.length]}
  function heroCard(a){return `${V9_ASSET.hero}/${heroKey(a)}.png`}
  function monsterKey(zone=1,kind=0,boss=false){if(boss)return BOSS_POOLS[zone]||'m23';const p=MONSTER_POOLS[zone]||MONSTER_POOLS[1];return p[(Number(kind)||0)%p.length]}
  function monsterCard(zone,kind,boss=false){return `${V9_ASSET.monster}/${monsterKey(zone,kind,boss)}.png`}
  function buildingCard(key){return `${V9_ASSET.world}/${BUILDING_ART[key]||'b01'}.png`}
  function slotName(s){return (typeof v41SlotName==='function'?v41SlotName(s):s)||'主武器'}
  function gearNum(g){const name=typeof v4GearName==='function'?v4GearName(g):'';if(name.includes('星蝕巨劍'))return 2;const pool=GEAR_POOLS[slotName(g?.slot)]||GEAR_POOLS['主武器'];return pool[hash(`${name}|${g?.id}|${g?.rarity}|${g?.item_level}`)%pool.length]}
  function gearCard(g){const n=gearNum(g),folder=n<=72?V9_ASSET.gearA:V9_ASSET.gearB;return `${folder}/g${String(n).padStart(3,'0')}.png`}
  function fashionCard(f){const n=1+(hash(`${f?.name}|${f?.fashion_type}|${f?.rarity}`)%32);return `${V9_ASSET.fashion}/f${String(n).padStart(2,'0')}.png`}
  function weighted(table){let r=Math.random(),a=0;for(const [k,p] of table){a+=p;if(r<=a)return k}return table[table.length-1][0]}
  function roster(){return typeof V4_ROSTER!=='undefined'?V4_ROSTER:(typeof IDLE_ROSTER!=='undefined'?IDLE_ROSTER:[])}
  function gearCatalog(){return typeof V4_GEAR_CATALOG!=='undefined'?V4_GEAR_CATALOG:[]}
  function fashionCatalog(){return typeof V4_FASHION_CATALOG!=='undefined'?V4_FASHION_CATALOG:[]}
  function rarityZh(r){return (typeof V4_RARITY_ZH!=='undefined'&&V4_RARITY_ZH[r])||r||'普通'}
  function rateHtml(table){return table.map(([r,p])=>`<div class="v9-rate"><b class="rar-${rarityZh(r)}">${rarityZh(r)}</b>${(p*100).toFixed(p<.01?1:0)}%</div>`).join('')}

  window.v4SvgHero=function(a,mode='card'){return v9Img(heroCard(a),a?.name||'冒險家',`v9-asset-${mode}`)};
  window.v4MobSvg=function(kind=0,boss=false,zone=1){return v9Img(monsterCard(zone,kind,boss),boss?'首領':'怪物','v9-asset-monster')};
  window.v4GearIcon=function(g){return v9Img(gearCard(g),typeof v4GearName==='function'?v4GearName(g):'裝備','v9-asset-gear')};
  window.v4BuildingSvg=function(key){return v9Img(buildingCard(key),key,'v9-asset-building')};

  function hpPct(now,max){return max?Math.max(0,Math.min(100,Number(now||0)/Number(max)*100)):0}
  function mobName(s,m,boss){if(boss)return s.boss;const arr=s.zone?.mobs||['異變怪物','森林獸','毒孢妖','腐化守衛'];return arr[(Number(m?.kind)||0)%arr.length]||'異變怪物'}

  function ensureBattleBoard(){
    const arena=document.getElementById('battleArena');if(!arena)return;
    arena.classList.add('v9-battlefield');
    if(arena.querySelector('.v9-battle-board'))return;
    arena.innerHTML=`<div id="v7BattleSkin" class="has-forest"></div><div id="v7BattleOverlay"></div><div class="v9-battle-board"><div id="v9EnemyRow" class="v9-enemy-row"></div><div class="v9-skill-zone"><span></span><div><div class="v9-skill-caption">✦ 自動技能循環</div><div id="v9SkillIcons" class="v9-skill-icons"></div></div><span></span><div id="v9SkillFx"></div></div><div id="v9HeroRow" class="v9-hero-row"></div></div><div id="damageLayer"></div><div id="lootBurst"></div>`;
  }

  window.renderBattle=function(){
    if(!gameMeta)return;ensureBattleBoard();const s=stageInfo();v4EnsureWave();
    stageName.textContent=`${s.zone.name} · ${s.label}`;stageSub.textContent=`${s.difficulty?.name||'普通'} · ${s.zone.subtitle} · ${v4BossMode?s.boss:'怪物波次'}`;stageBadge.textContent=`${s.difficulty?.name||'普通'} ${s.label}`;
    const skin=document.getElementById('v7BattleSkin');if(skin)skin.className=`has-${ZONE_BG[s.z-1]||'forest'}`;
    const kills=Number(gameMeta.stage_kills||0)+Number(v4KillBuffer||0),k=kills%50;
    battleKills.textContent=kills;battleGps.textContent=formatBig(stageGoldPerSec());battleDropRate.textContent=(dropChance()*100).toFixed(2)+'%';battleProgress.textContent=`${k} / 50`;bossTrackFill.style.width=(k/50*100)+'%';bossUnlockText.textContent=v4BossMode?'首領戰鬥中':'每 50 隻自動挑戰首領';bossBtn.disabled=true;bossBtn.style.display='none';
    const enemies=document.getElementById('v9EnemyRow');
    if(v4BossMode){const pct=hpPct(v4BossHp,v4BossMax);enemies.innerHTML=`<div id="v4boss" class="v9-combat-card enemy spawn" style="width:min(46%,320px);height:255px"><div class="v9-card-art"><img src="${monsterCard(s.z,0,true)}"></div><div class="v9-card-shade"></div><div class="v9-card-top"><b>${esc(s.boss)}</b><span>首領 · Lv.${s.n}</span></div><div class="v9-card-bottom"><div class="name"><b>${esc(s.boss)}</b><small>${s.zone.name}</small></div><div class="v9-hp"><i style="width:${pct}%"></i></div><div class="v9-hp-text">${Math.max(0,Math.ceil(v4BossHp)).toLocaleString()} / ${Math.ceil(v4BossMax).toLocaleString()}</div></div></div>`}
    else enemies.innerHTML=v4Wave.slice(0,3).map(m=>{const pct=hpPct(m.hp,m.max);return `<div id="${m.id}" class="v9-combat-card enemy ${Date.now()-Number(m.spawnAt||0)<600?'spawn':''}"><div class="v9-card-art"><img src="${monsterCard(s.z,m.kind,false)}"></div><div class="v9-card-shade"></div><div class="v9-card-top"><b>${esc(mobName(s,m,false))}</b><span>Lv.${s.n}</span></div><div class="v9-card-bottom"><div class="name"><b>${esc(mobName(s,m,false))}</b><small>${s.zone.name}</small></div><div class="v9-hp"><i style="width:${pct}%"></i></div><div class="v9-hp-text">${Math.max(0,Math.ceil(m.hp))} / ${Math.ceil(m.max)}</div></div></div>`}).join('');
    const heroes=document.getElementById('v9HeroRow'),p=party();
    heroes.innerHTML=p.slice(0,5).map(a=>{const max=v6HeroMaxHp(a),hp=v6HeroHp(a),pct=hpPct(hp,max),ko=a.knocked_out||hp<=0;return `<div id="bh${a.id}" class="v9-combat-card hero active ${ko?'v9-ko':''}"><div class="v9-card-art"><img src="${heroCard(a)}"></div><div class="v9-card-shade"></div><div class="v9-card-top"><b>${esc(a.name)}</b><span>Lv.${a.level}</span></div><div class="v9-card-bottom"><div class="name"><b>${esc(a.name)}</b><small>${v4JobName(a)}</small></div><div class="v9-hp"><i style="width:${pct}%"></i></div><div class="v9-hp-text">${ko?'倒地':`${Math.ceil(hp)} / ${max}`}</div></div></div>`}).join('');
    const first=p[0],skills=first?v4UnlockedSkills(first).slice(-4):[];document.getElementById('v9SkillIcons').innerHTML=skills.map((sk,i)=>`<div class="v9-skill-icon" title="${esc(sk.name)}">${['✦','⚔','➹','✧'][i%4]}</div>`).join('');
    battlePartyList.innerHTML=p.map(a=>`<div class="v9-party-mini"><img src="${heroCard(a)}"><div><b>${esc(a.name)} · ${v4JobName(a)}</b><small>Lv.${a.level} · ${rarityZh(a.rarity)}</small></div><strong>${formatBig(heroPower(a))}</strong></div>`).join('');
    battlePauseBtn.textContent=battleAnimOn?'暫停自動狩獵':'繼續自動狩獵';
    if(offlinePending){offlineDuration.textContent=formatDuration(offlinePending.seconds);offlineGold.textContent=Math.floor((offlinePending.gold||0)+(offlinePending.salvageGold||0)).toLocaleString();offlineLoot.textContent=`預估 ${offlinePending.materialized??0} 件`;claimOfflineBtn.disabled=false}else{offlineDuration.textContent='—';offlineGold.textContent='0';offlineLoot.textContent='—';claimOfflineBtn.disabled=true}
  };

  function fxFor(a,skill){const c=cls(a?.class_name);if(c==='mage')return V9_ASSET.world+'/magic_violet.png';if(c==='archer')return V9_ASSET.world+'/arrow_green.png';if(c==='rogue')return V9_ASSET.world+'/shadow_blue.png';return skill?V9_ASSET.world+'/slash_crimson.png':V9_ASSET.world+'/slash_violet.png'}
  function playFx(a,skill){const box=document.getElementById('v9SkillFx');if(!box)return;box.innerHTML=`<img src="${fxFor(a,skill)}">`;box.classList.remove('show');void box.offsetWidth;box.classList.add('show')}
  window.v4AnimateHero=function(a,skill=false){const el=document.getElementById('bh'+a.id);if(el){el.classList.add('attack');setTimeout(()=>el.classList.remove('attack'),300)}playFx(a,skill)};
  window.v4SpawnDamage=function(dmg,crit=false){const layer=document.getElementById('damageLayer');if(!layer)return;const d=document.createElement('div');d.className='v9-dmg'+(crit?' crit':'');d.textContent=Math.max(1,Math.round(dmg)).toLocaleString();layer.appendChild(d);setTimeout(()=>d.remove(),720)};
  const oldDamageParty=window.v6DamageParty;
  if(typeof oldDamageParty==='function')window.v6DamageParty=async function(){const target=document.querySelector('.v9-combat-card.hero:not(.v9-ko)');const mob=document.querySelector('.v9-combat-card.enemy');if(mob){mob.classList.add('attack');setTimeout(()=>mob.classList.remove('attack'),280)}if(target){target.classList.add('hit');setTimeout(()=>target.classList.remove('hit'),270)}return oldDamageParty.apply(this,arguments)};
  window.v4MobDefeated=async function(m){const el=document.getElementById(m.id);if(el)el.classList.add('dead');const s=stageInfo();v4GoldBuffer+=s.gold;v4KillBuffer++;const loot=document.getElementById('lootBurst');if(loot){loot.textContent=`+${s.gold.toLocaleString()} 金幣`;loot.classList.remove('show');void loot.offsetWidth;loot.classList.add('show')}await generateEquipmentDrop(1,false);await new Promise(r=>setTimeout(r,300));v4Wave=v4Wave.filter(x=>x!==m);setTimeout(v6RefillWave,110)};

  window.v81InstantRevive=async function(){if(!gameMeta)return;battleAnimOn=true;v4BossMode=false;v4BossHp=0;v4BossMax=0;v4Wave=[];v4KillBuffer=0;lastBattleTick=Date.now();const qs=[];for(const a of gameAdventurers){const max=v6HeroMaxHp(a);a.max_hp=max;a.current_hp=max;a.knocked_out=false;a.injury_until=null;qs.push(sb.from('game_adventurers').update({max_hp:max,current_hp:max,knocked_out:false,injury_until:null}).eq('id',a.id))}gameMeta.stage_kills=0;qs.push(sb.from('game_meta').update({stage_kills:0,paused:false,updated_at:new Date().toISOString()}).eq('room_id',roomId));await Promise.allSettled(qs);v4EnsureWave();gameToastMsg('全隊倒下：已立即復活，重新刷目前關卡。');renderBattle()};

  /* hero roster */
  window.renderHeroes=function(){let list=[...gameAdventurers].sort((a,b)=>heroPower(b)-heroPower(a));if(v5HeroFilter!=='全部')list=list.filter(a=>v4NormalizeClass(a.class_name)===v5HeroFilter);if(!v5SelectedHeroId||!gameAdventurers.some(a=>a.id===v5SelectedHeroId))v5SelectedHeroId=(list[0]||gameAdventurers[0])?.id||null;heroCountBadge.textContent=`${gameAdventurers.length} 名`;idleHeroGrid.innerHTML=list.length?list.map(a=>`<div class="v9-roster-card ${a.id===v5SelectedHeroId?'active':''}" onclick="v5SelectHero('${a.id}')"><img src="${heroCard(a)}"><div><b>${esc(a.name)}</b><small>${v4JobName(a)} · Lv.${a.level}</small><small class="rar-${rarityZh(a.rarity)}">${rarityZh(a.rarity)}</small><small>戰力 ${formatBig(heroPower(a))}</small></div></div>`).join(''):'<div class="heroMeta">目前沒有符合條件的冒險家。</div>';const box=document.getElementById('v5HeroDetail'),a=gameAdventurers.find(x=>x.id===v5SelectedHeroId);if(!box)return;if(!a){box.innerHTML='<div class="heroMeta">尚未擁有冒險家。</div>';return}const d=v4HeroDef(a),rar=rarityZh(a.rarity),next=v4NextJob(a),skills=v4UnlockedSkills(a),eq=v4EquippedGear(a);box.innerHTML=`<div class="sg-hero-showcase"><div class="v9-hero-detail-card"><img src="${heroCard(a)}"></div><div class="sg-hero-info"><h3>${esc(a.name)}</h3><p>${v4NormalizeClass(a.class_name)} · ${v4JobName(a)} · Lv.${a.level}</p><div class="sg-job-line">${next?`下一次轉職：Lv.${next[0]} → ${next[1]}`:'已達目前最高轉職階段'}</div><div class="sg-stat-grid"><div><small>戰力</small><b>${formatBig(heroPower(a))}</b></div><div><small>攻擊速度</small><b>${d.speed.toFixed(2)}</b></div><div><small>技能加成</small><b>${Math.round(v4SkillBonus(a)*100)}%</b></div><div><small>裝備攻擊</small><b>${formatBig(equippedAtk(a.id))}</b></div><div><small>時裝加成</small><b>${Math.round(v4FashionBonus(a)*100)}%</b></div><div><small>稀有度</small><b class="rar-${rar}">${rar}</b></div></div><div class="sg-subtitle">技能</div><div class="sg-skill-list">${skills.map(s=>{const lv=v4SkillLevel(a,s.key),cost=Math.round(4500*Math.pow(1.58,lv-1));return `<div class="sg-skill-row"><button onclick="v4UpgradeSkill('${a.id}','${s.key}')">升級</button><b>${s.name} Lv.${lv}</b><small>${s.kind} · ${s.desc}</small><small>需要 ● ${cost.toLocaleString()}</small></div>`}).join('')}</div><div class="sg-subtitle">八格裝備</div><div class="sg-equip-grid">${V4_SLOTS.map(slot=>{const g=eq.find(x=>slotName(x.slot)===slot);return `<div class="sg-equip-slot ${g?'on':''}">${g?`<img src="${gearCard(g)}" style="width:38px;height:38px;object-fit:cover;border-radius:6px">`:'◇'}<br>${slot}</div>`}).join('')}</div><button class="sg-btn primary full" onclick="levelHero('${a.id}')">升級角色 · ● ${heroLevelCost(a).toLocaleString()}</button></div></div>`};

  /* recruitment */
  window.V9_RECRUIT_TAB=window.V9_RECRUIT_TAB||'hero';
  function recruitMeta(tab){if(tab==='gear')return{title:'鍛造成熟的戰利品',desc:'裝備召喚與自然掉落分流；高階裝備主要來自 Boss、高難度與召喚。',rates:GEAR_RATES,b1:'裝備單抽 ◆100',b10:'裝備十連 ◆900'};if(tab==='fashion')return{title:'讓外觀成為冒險的一部分',desc:'時裝以外觀為主，搭配小幅效率加成。',rates:FASHION_RATES,b1:'時裝單抽 ◆750',b10:'時裝十連 ◆7500'};return{title:'回應星痕的羈絆',desc:'取消硬保底；高稀有角色能加速推圖，但仍需掛機、技能、裝備與基地養成。',rates:HERO_RATES,b1:'角色單抽 ◆150',b10:'角色十連 ◆1300'}}
  window.v9SwitchRecruit=tab=>{window.V9_RECRUIT_TAB=tab;renderRecruit()};window.v9Recruit=n=>window.V9_RECRUIT_TAB==='gear'?doEquipmentGacha(n):window.V9_RECRUIT_TAB==='fashion'?doFashionGacha(n):doRecruit(n);
  window.renderRecruit=function(){const m=recruitMeta(window.V9_RECRUIT_TAB);recruitCounter.textContent=`累積 ${Number(gameMeta?.recruit_count||0)} 抽 · 可用 ◆ ${premiumAvailable().toLocaleString()}`;const stage=document.querySelector('#ivRecruit .sg-summon-stage');if(stage)stage.innerHTML=`<div class="v9-recruit-tabs"><button class="${window.V9_RECRUIT_TAB==='hero'?'active':''}" onclick="v9SwitchRecruit('hero')">冒險家</button><button class="${window.V9_RECRUIT_TAB==='gear'?'active':''}" onclick="v9SwitchRecruit('gear')">裝備</button><button class="${window.V9_RECRUIT_TAB==='fashion'?'active':''}" onclick="v9SwitchRecruit('fashion')">時裝</button></div><div class="v9-recruit-copy"><span class="sg-kicker">星痕召喚</span><h3>${m.title}</h3><p>${m.desc}</p><div class="v9-rate-grid">${rateHtml(m.rates)}</div><div class="v9-recruit-actions"><button class="sg-btn primary" onclick="v9Recruit(1)">${m.b1}</button><button class="sg-btn primary" onclick="v9Recruit(10)">${m.b10}</button></div></div>`;const title=document.querySelector('#ivRecruit aside .sg-panel-title span'),small=document.querySelector('#ivRecruit aside .sg-panel-title small'),box=document.getElementById('recruitShowcase');if(!box)return;box.className='v9-showcase';if(window.V9_RECRUIT_TAB==='gear'){if(title)title.textContent='裝備圖鑑預覽';if(small)small.textContent='依部位展示';box.innerHTML=gearCatalog().slice(0,18).map(g=>{const x={...g,id:g.name,item_level:1,atk:g.base_atk||10};return `<div class="v9-show-card"><img src="${gearCard(x)}"><div class="v9-show-meta"><b>${g.name||v4GearName(x)}</b><span>${rarityZh(g.rarity)} · ${slotName(g.slot)}</span></div></div>`}).join('');return}if(window.V9_RECRUIT_TAB==='fashion'){if(title)title.textContent='時裝展櫃';if(small)small.textContent='翅膀 / 光環 / 武器外觀';box.innerHTML=fashionCatalog().slice(0,18).map(f=>`<div class="v9-show-card"><img src="${fashionCard(f)}"><div class="v9-show-meta"><b>${f.name}</b><span>${rarityZh(f.rarity)} · ${f.type||f.fashion_type}</span></div></div>`).join('');return}if(title)title.textContent='本期名單預覽';if(small)small.textContent=`${roster().length} 名冒險家`;box.innerHTML=roster().slice(0,18).map(h=>`<div class="v9-show-card"><img src="${heroCard({...h,id:h.name,level:1})}"><div class="v9-show-meta"><b>${h.name}</b><span>${h.rarity_zh||rarityZh(h.rarity)} · ${h.class_name}</span></div></div>`).join('')};

  function ensureSummonFx(){let fx=document.getElementById('v9SummonFx');if(fx)return fx;fx=document.createElement('div');fx.id='v9SummonFx';fx.innerHTML='<div class="v9-summon-orb"><div class="v9-summon-star">✦</div><div class="v9-summon-label">星痕共鳴中…</div></div>';document.body.appendChild(fx);return fx}
  async function summonFx(label){const fx=ensureSummonFx();fx.querySelector('.v9-summon-label').textContent=label;fx.classList.add('show');await new Promise(r=>setTimeout(r,1250));fx.classList.remove('show')}
  function resultCard(r,type){if(type==='gear')return `<div class="v81-result"><div class="v81-result-art"><img src="${gearCard(r)}"></div><b>${v4GearName(r)}</b><small class="rar-${rarityZh(r.rarity)}">${rarityZh(r.rarity)} · Lv.${r.item_level}</small></div>`;if(type==='fashion')return `<div class="v81-result"><div class="v81-result-art"><img src="${fashionCard(r)}"></div><b>${r.name}</b><small class="rar-${rarityZh(r.rarity)}">${rarityZh(r.rarity)}</small></div>`;return `<div class="v81-result"><div class="v81-result-art"><img src="${heroCard({...r,id:r.name,level:1})}"></div><b>${r.name}</b><small class="rar-${r.rarity_zh||rarityZh(r.rarity)}">${r.rarity_zh||rarityZh(r.rarity)}</small><small>${r.class_name}</small></div>`}
  window.showRecruitResults=function(results,type=window.V9_RECRUIT_TAB){const box=document.getElementById('recruitResults');if(!box)return;box.innerHTML=results.map(r=>resultCard(r,type)).join('');recruitOverlay.classList.add('show')};
  window.doRecruit=async function(n){const cost=n===10?1300:150;if(premiumAvailable()<cost)return gameToastMsg('星痕鑽石不足');const data=roster(),res=[];for(let i=0;i<n;i++){const rank=weighted(HERO_RATES),pool=data.filter(x=>x.rarity===rank),pick=pool.length?pool:data;res.push(pick[Math.floor(Math.random()*pick.length)])}const rows=res.map(h=>({room_id:roomId,name:h.name,class_name:h.class_name,rarity:h.rarity,level:1,xp:0,fatigue:0,traits:[]}));const ins=await sb.from('game_adventurers').insert(rows);if(ins.error)return alert(ins.error.message);const upd={premium_spent:Number(gameMeta.premium_spent||0)+cost,recruit_count:Number(gameMeta.recruit_count||0)+n,updated_at:new Date().toISOString()};await sb.from('game_meta').update(upd).eq('room_id',roomId);gameMeta={...gameMeta,...upd};await loadRoom();await summonFx('星痕正在回應新的羈絆…');showRecruitResults(res,'hero');render公會()};
  window.doEquipmentGacha=async function(n){const cost=n===10?900:100;if(premiumAvailable()<cost)return gameToastMsg('星痕鑽石不足');const rolled=[],rows=[];for(let i=0;i<n;i++){const g=v4GearRoll(false,'gacha');rolled.push(g);rows.push({room_id:roomId,slot:g.slot,rarity:g.rarity,item_level:g.item_level,atk:g.atk,atk_speed:g.atk_speed,crit:g.crit,gold_find:g.gold_find,equipped:false})}const ins=await sb.from('game_equipment').insert(rows);if(ins.error)return alert(ins.error.message);const upd={premium_spent:Number(gameMeta.premium_spent||0)+cost};await sb.from('game_meta').update(upd).eq('room_id',roomId);gameMeta={...gameMeta,...upd};await loadRoom();await summonFx('軍備庫正在鍛造共鳴…');showRecruitResults(rolled,'gear');render公會()};
  window.doFashionGacha=async function(n=1){const cost=750*n;if(premiumAvailable()<cost)return gameToastMsg('星痕鑽石不足');const cat=fashionCatalog(),rolled=[];for(let i=0;i<n;i++){const rank=weighted(FASHION_RATES),pool=cat.filter(x=>x.rarity===rank),pick=pool.length?pool:cat,src=pick[Math.floor(Math.random()*pick.length)];rolled.push({...src,power_bonus:Math.min(.06,Number(src.bonus||src.power_bonus||0))})}const rows=rolled.map(f=>({room_id:roomId,fashion_type:f.type||f.fashion_type,name:f.name,rarity:f.rarity,power_bonus:Math.min(.06,Number(f.bonus||f.power_bonus||0)),equipped:false}));const ins=await sb.from('game_fashion').insert(rows);if(ins.error)return alert(ins.error.message);const upd={premium_spent:Number(gameMeta.premium_spent||0)+cost};await sb.from('game_meta').update(upd).eq('room_id',roomId);gameMeta={...gameMeta,...upd};await loadRoom();await summonFx('星幕衣櫥正在展開…');showRecruitResults(rows,'fashion');render公會()};

  /* guild base */
  window.renderIdleGuild=function(){if(!gameMeta)return;const scene=document.getElementById('v4BuildingScene');if(scene&&typeof V4_BUILDINGS!=='undefined')scene.innerHTML=V4_BUILDINGS.map(b=>{const lv=buildingLv(b.key);return `<div class="v4BuildingNode" onclick="v5SelectBuilding('${b.key}')" style="left:${b.pos[0]}%;top:${b.pos[1]}%;transform:translate(-50%,-50%)"><div class="v4BuildingSprite"><img src="${buildingCard(b.key)}"></div><div class="v4BuildingTag">${b.name} · Lv.${lv}</div></div>`}).join('');const hub=document.getElementById('v4HubBattle');if(hub)hub.innerHTML='';idleBuildingList.innerHTML=V4_BUILDINGS.map(b=>{const lv=buildingLv(b.key),cost=v4BuildingCost(b.key,lv),next=b.abilities.find(x=>lv<x[0])||b.abilities[b.abilities.length-1];return `<div class="v9-building-list-card ${v5SelectedBuildingKey===b.key?'active':''}" onclick="v5SelectBuilding('${b.key}')"><img src="${buildingCard(b.key)}"><div><b>${b.name} · Lv.${lv}</b><small>下一能力：Lv.${next[0]} · ${next[1]}</small><small>升級 ● ${cost.toLocaleString()}</small></div></div>`}).join('');idleMasters.innerHTML=workers.slice(0,2).map((w,i)=>{const t=realWorkedTotals(realWorkedEntries().filter(e=>e.worker_id===w.id)),lv=masterLevelFromXp(Math.floor(t.hours*10));return `<div class="masterIdle"><b>${i===0?'✦':'✧'} ${esc(w.name)} · 公會長 Lv.${lv}</b><small>已簽到真實工時 ${t.hours.toFixed(1)} 小時</small></div>`}).join('');const b=V4_BUILDINGS.find(x=>x.key===v5SelectedBuildingKey)||V4_BUILDINGS[0],lv=buildingLv(b.key),cost=v4BuildingCost(b.key,lv),next=b.abilities.find(x=>lv<x[0])||b.abilities[b.abilities.length-1];v5BuildingDetail.innerHTML=`<div class="v9-building-detail-image"><img src="${buildingCard(b.key)}"></div><h3>${b.name}</h3><p>${b.desc}</p><div class="v9-building-grid"><div><small>目前等級</small><b>Lv.${lv}</b></div><div><small>下一級</small><b>Lv.${lv+1}</b></div><div><small>升級金幣</small><b>● ${cost.toLocaleString()}</b></div><div><small>下一能力</small><b>Lv.${next[0]}</b></div></div><div class="sg-building-next">${next[1]}</div><div class="sg-subtitle">能力里程碑</div>${b.abilities.map(x=>`<div class="sg-skill-row" style="margin-bottom:5px"><b>Lv.${x[0]} · ${x[1]}</b><small>${lv>=x[0]?'✓ 已解鎖':'尚未解鎖'}</small></div>`).join('')}<button class="sg-btn primary full" onclick="upgradeIdleBuilding('${b.key}')">升級建築</button>`};

  /* equipment */
  window.renderLoot=function(){const inv=document.getElementById('lootInventory'),detail=document.getElementById('v5GearDetail');if(!inv||!detail)return;if(v4LootMode==='fashion'){if(!v5SelectedGearId||!gameFashion.some(x=>x.id===v5SelectedGearId))v5SelectedGearId=gameFashion[0]?.id||null;inv.innerHTML=gameFashion.length?gameFashion.map(x=>`<div class="sg-item-card ${x.id===v5SelectedGearId?'active':''}" onclick="v5SelectedGearId='${x.id}';renderLoot()"><div class="sg-item-icon"><img src="${fashionCard(x)}"></div><b class="rar-${rarityZh(x.rarity)}">${x.name}</b><small>${rarityZh(x.rarity)} · ${x.fashion_type}</small></div>`).join(''):'<div class="heroMeta">尚未取得特殊時裝。</div>';const f=gameFashion.find(x=>x.id===v5SelectedGearId);detail.innerHTML=f?`<div class="sg-gear-art"><img src="${fashionCard(f)}"></div><h3>${f.name}</h3><p class="rar-${rarityZh(f.rarity)}">${rarityZh(f.rarity)} · ${f.fashion_type}</p><div class="sg-gear-stats"><div><small>戰力加成</small><b>${(Math.min(.06,Number(f.power_bonus||0))*100).toFixed(1)}%</b></div><div><small>狀態</small><b>${f.equipped?'已裝備':'未裝備'}</b></div></div><button class="sg-btn primary full" onclick="v4EquipFashion('${f.id}')">裝給主力角色</button>`:'<div class="heroMeta">選擇一件時裝。</div>';return}if(!v5SelectedGearId||!gameEquipment.some(x=>x.id===v5SelectedGearId))v5SelectedGearId=gameEquipment[0]?.id||null;inv.innerHTML=gameEquipment.length?gameEquipment.slice(0,220).map(x=>`<div class="sg-item-card ${x.id===v5SelectedGearId?'active':''}" onclick="v5SelectGear('${x.id}')"><div class="sg-item-icon"><img src="${gearCard(x)}"></div><b class="rar-${rarityZh(x.rarity)}">${v4GearName(x)}</b><small>${rarityZh(x.rarity)} · Lv.${x.item_level}</small><small>攻擊 +${x.atk}${x.equipped?' · 使用中':''}</small></div>`).join(''):'<div class="heroMeta">尚未取得裝備。</div>';const g=gameEquipment.find(x=>x.id===v5SelectedGearId);if(!g){detail.innerHTML='<div class="heroMeta">選擇裝備後查看詳情。</div>';return}detail.innerHTML=`<div class="sg-gear-art"><img src="${gearCard(g)}"></div><h3>${v4GearName(g)}</h3><p class="rar-${rarityZh(g.rarity)}">${rarityZh(g.rarity)} · ${slotName(g.slot)} · Lv.${g.item_level}</p><div class="sg-gear-stats"><div><small>攻擊</small><b>+${g.atk}</b></div><div><small>攻速</small><b>+${Number(g.atk_speed||0).toFixed(3)}</b></div><div><small>暴擊</small><b>+${(Number(g.crit||0)*100).toFixed(1)}%</b></div><div><small>金幣掉落</small><b>+${(Number(g.gold_find||0)*100).toFixed(1)}%</b></div><div><small>售價</small><b>● ${v4SellValue(g).toLocaleString()}</b></div><div><small>狀態</small><b>${g.equipped?'已裝備':'未裝備'}</b></div></div><select id="v5EquipHero" class="sg-equip-target">${gameAdventurers.map(a=>`<option value="${a.id}">${esc(a.name)} · ${v4JobName(a)}</option>`).join('')}</select><button class="sg-btn primary full" onclick="v5EquipSelectedGear()">裝備給指定冒險家</button>${g.equipped?'':`<button class="sg-btn ghost full" onclick="v4SellGear('${g.id}')">售出裝備</button>`}`};


  async function v9AssetPathCheck(){
    const probes=[
      `${V9_ASSET.hero}/h01.png`,`${V9_ASSET.monster}/m01.png`,`${V9_ASSET.world}/b01.png`,
      `${V9_ASSET.world}/slash_crimson.png`,`${V9_ASSET.gearA}/g001.png`,`${V9_ASSET.gearB}/g073.png`,`${V9_ASSET.fashion}/f01.png`
    ];
    const results=await Promise.all(probes.map(async p=>{try{const r=await fetch(p,{cache:'no-store'});return [p,r.ok]}catch(e){return [p,false]}}));
    const failed=results.filter(x=>!x[1]).map(x=>x[0]);
    if(failed.length)console.error('V9 asset path check failed:',failed); else console.info('V9 asset path check: OK');
  }

  function boot(){try{render公會()}catch(e){console.error('V9 render',e)}}
  document.addEventListener('DOMContentLoaded',()=>{setTimeout(boot,700);setTimeout(v9AssetPathCheck,900)});setTimeout(boot,1800);


  /* ==========================================================
     V9.3 主力隊伍選擇 + 即時復活
     ========================================================== */

  function v93PartySchemaReady(){
    const heroReady=!gameAdventurers.length || Object.prototype.hasOwnProperty.call(gameAdventurers[0],'party_slot');
    const metaReady=!!gameMeta && Object.prototype.hasOwnProperty.call(gameMeta,'party_manual');
    return heroReady && metaReady;
  }

  function v93StrongestFive(){
    return [...gameAdventurers].sort((a,b)=>heroPower(b)-heroPower(a)).slice(0,5);
  }

  function v93ManualParty(){
    return [...gameAdventurers]
      .filter(a=>Number(a.party_slot)>=1 && Number(a.party_slot)<=5)
      .sort((a,b)=>Number(a.party_slot)-Number(b.party_slot))
      .slice(0,5);
  }

  function v93CurrentParty(){
    if(gameMeta?.party_manual && v93PartySchemaReady()) return v93ManualParty();
    return v93StrongestFive();
  }

  // Override the original automatic "top 5 power" party function.
  window.party=v93CurrentParty;

  async function v93SaveWholeParty(ids){
    if(!v93PartySchemaReady()){
      alert('主力隊伍資料欄位尚未建立。請先在 Supabase SQL Editor 執行 V9_3_PARTY_MIGRATION.sql。');
      return false;
    }
    const clean=[...new Set(ids)].slice(0,5);
    const clear=await sb.from('game_adventurers').update({party_slot:null}).eq('room_id',roomId);
    if(clear.error){alert(clear.error.message);return false}
    const writes=clean.map((id,i)=>sb.from('game_adventurers').update({party_slot:i+1}).eq('id',id));
    const results=await Promise.all(writes);
    const bad=results.find(x=>x.error);
    if(bad){alert(bad.error.message);return false}
    const meta=await sb.from('game_meta').update({party_manual:true,updated_at:new Date().toISOString()}).eq('room_id',roomId);
    if(meta.error){alert(meta.error.message);return false}
    gameMeta.party_manual=true;
    for(const a of gameAdventurers)a.party_slot=null;
    clean.forEach((id,i)=>{const a=gameAdventurers.find(x=>x.id===id);if(a)a.party_slot=i+1});
    return true;
  }

  window.v93ToggleParty=async function(id){
    const target=gameAdventurers.find(a=>a.id===id);if(!target)return;
    if(!v93PartySchemaReady()){
      alert('請先執行 V9_3_PARTY_MIGRATION.sql，再使用手動編隊。');
      return;
    }

    // First manual edit: start from the current automatic strongest-five team.
    if(!gameMeta.party_manual){
      let ids=v93StrongestFive().map(a=>a.id);
      if(ids.includes(id)){
        ids=ids.filter(x=>x!==id);
      }else{
        if(ids.length>=5) ids=ids.slice(0,4);
        ids.push(id);
      }
      if(await v93SaveWholeParty(ids)){
        gameToastMsg(`已切換為手動編隊，目前 ${ids.length}/5 人上場。`);
        renderHeroes();renderBattle();
      }
      return;
    }

    const current=v93ManualParty();
    const isOn=current.some(a=>a.id===id);
    if(isOn){
      const r=await sb.from('game_adventurers').update({party_slot:null}).eq('id',id);
      if(r.error)return alert(r.error.message);
      target.party_slot=null;
      gameToastMsg(`${target.name} 已下場。`);
    }else{
      if(current.length>=5){
        alert('主力隊伍最多 5 人。請先讓一名冒險家下場。');
        return;
      }
      const used=new Set(current.map(a=>Number(a.party_slot)));
      let slot=1;while(used.has(slot)&&slot<=5)slot++;
      const r=await sb.from('game_adventurers').update({party_slot:slot}).eq('id',id);
      if(r.error)return alert(r.error.message);
      target.party_slot=slot;
      gameToastMsg(`${target.name} 已加入主力隊伍。`);
    }
    renderHeroes();renderBattle();
  };

  window.v93AutoParty=async function(){
    if(!v93PartySchemaReady()){
      alert('請先執行 V9_3_PARTY_MIGRATION.sql。');
      return;
    }
    const [a,b]=await Promise.all([
      sb.from('game_adventurers').update({party_slot:null}).eq('room_id',roomId),
      sb.from('game_meta').update({party_manual:false,updated_at:new Date().toISOString()}).eq('room_id',roomId)
    ]);
    if(a.error||b.error)return alert((a.error||b.error).message);
    gameMeta.party_manual=false;
    for(const h of gameAdventurers)h.party_slot=null;
    gameToastMsg('已恢復自動編隊：戰力最高的 5 名冒險家上場。');
    renderHeroes();renderBattle();
  };

  // Replace the hero list so users can choose who fights.
  window.renderHeroes=function(){
    let list=[...gameAdventurers].sort((a,b)=>heroPower(b)-heroPower(a));
    if(v5HeroFilter!=='全部')list=list.filter(a=>v4NormalizeClass(a.class_name)===v5HeroFilter);
    if(!v5SelectedHeroId||!gameAdventurers.some(a=>a.id===v5SelectedHeroId))v5SelectedHeroId=(list[0]||gameAdventurers[0])?.id||null;

    const active=v93CurrentParty();
    const activeIds=new Set(active.map(a=>a.id));
    heroCountBadge.textContent=`${gameAdventurers.length} 名 · 出戰 ${active.length}/5`;

    const toolbar=`<div class="v93-party-toolbar">
      <span>${gameMeta?.party_manual?'手動編隊':'自動編隊'} · <b>${active.length}/5</b> 人上場</span>
      <button onclick="v93AutoParty()">恢復最強五人自動編隊</button>
    </div>
    ${!v93PartySchemaReady()?'<div class="v93-party-warn">要使用手動上場功能，請先執行 V9_3_PARTY_MIGRATION.sql。</div>':''}`;

    idleHeroGrid.innerHTML=toolbar+(list.length?list.map(a=>{
      const on=activeIds.has(a.id);
      const slot=Number(a.party_slot||0);
      const label=on?(gameMeta?.party_manual?`上場 #${slot||'—'}`:'自動上場'):'待命';
      return `<div class="v9-roster-card ${a.id===v5SelectedHeroId?'active':''}" onclick="v5SelectHero('${a.id}')">
        <span class="v93-party-chip ${on?'on':''}">${label}</span>
        <img src="${heroCard(a)}">
        <div><b>${esc(a.name)}</b><small>${v4JobName(a)} · Lv.${a.level}</small><small class="rar-${rarityZh(a.rarity)}">${rarityZh(a.rarity)}</small><small>戰力 ${formatBig(heroPower(a))}</small></div>
      </div>`
    }).join(''):'<div class="heroMeta">目前沒有符合條件的冒險家。</div>');

    const box=document.getElementById('v5HeroDetail'),a=gameAdventurers.find(x=>x.id===v5SelectedHeroId);if(!box)return;
    if(!a){box.innerHTML='<div class="heroMeta">尚未擁有冒險家。</div>';return}
    const d=v4HeroDef(a),rar=rarityZh(a.rarity),next=v4NextJob(a),skills=v4UnlockedSkills(a),eq=v4EquippedGear(a),isOn=activeIds.has(a.id);
    box.innerHTML=`<div class="sg-hero-showcase">
      <div class="v9-hero-detail-card"><img src="${heroCard(a)}"></div>
      <div class="sg-hero-info">
        <h3>${esc(a.name)}</h3>
        <p>${v4NormalizeClass(a.class_name)} · ${v4JobName(a)} · Lv.${a.level}</p>
        <button class="v93-party-btn ${isOn?'off':''}" onclick="v93ToggleParty('${a.id}')">${isOn?'讓此冒險家下場':'加入主力隊伍'}</button>
        <div class="sg-job-line">${next?`下一次轉職：Lv.${next[0]} → ${next[1]}`:'已達目前最高轉職階段'}</div>
        <div class="sg-stat-grid">
          <div><small>戰力</small><b>${formatBig(heroPower(a))}</b></div>
          <div><small>攻擊速度</small><b>${d.speed.toFixed(2)}</b></div>
          <div><small>技能加成</small><b>${Math.round(v4SkillBonus(a)*100)}%</b></div>
          <div><small>裝備攻擊</small><b>${formatBig(equippedAtk(a.id))}</b></div>
          <div><small>時裝加成</small><b>${Math.round(v4FashionBonus(a)*100)}%</b></div>
          <div><small>稀有度</small><b class="rar-${rar}">${rar}</b></div>
        </div>
        <div class="sg-subtitle">技能</div>
        <div class="sg-skill-list">${skills.map(s=>{const lv=v4SkillLevel(a,s.key),cost=Math.round(4500*Math.pow(1.58,lv-1));return `<div class="sg-skill-row"><button onclick="v4UpgradeSkill('${a.id}','${s.key}')">升級</button><b>${s.name} Lv.${lv}</b><small>${s.kind} · ${s.desc}</small><small>需要 ● ${cost.toLocaleString()}</small></div>`}).join('')}</div>
        <div class="sg-subtitle">八格裝備</div>
        <div class="sg-equip-grid">${V4_SLOTS.map(slot=>{const g=eq.find(x=>slotName(x.slot)===slot);return `<div class="sg-equip-slot ${g?'on':''}">${g?`<img src="${gearCard(g)}" style="width:38px;height:38px;object-fit:cover;border-radius:6px">`:'◇'}<br>${slot}</div>`}).join('')}</div>
        <button class="sg-btn primary full" onclick="levelHero('${a.id}')">升級角色 · ● ${heroLevelCost(a).toLocaleString()}</button>
      </div>
    </div>`;
  };

  // A single knocked-out adventurer comes back automatically after ~3 seconds.
  const v93BaseDamageParty=window.v6DamageParty;
  if(typeof v93BaseDamageParty==='function'){
    window.v6DamageParty=async function(dt,boss=false){
      await v93BaseDamageParty(dt,boss);
      const now=Date.now();
      const writes=[];
      for(const a of v93CurrentParty()){
        if(a.knocked_out || v6HeroHp(a)<=0){
          const soon=new Date(now+3000).toISOString();
          a.injury_until=soon;
          writes.push(sb.from('game_adventurers').update({injury_until:soon}).eq('id',a.id));
        }
      }
      if(writes.length)await Promise.allSettled(writes);
    };
  }

  // Full party wipe = immediate full revive, same stage, 0/50 kills, keep farming.
  window.v93InstantPartyRevive=async function(){
    if(!gameMeta)return;
    battleAnimOn=true;
    v4BossMode=false;v4BossHp=0;v4BossMax=0;v4Wave=[];v4KillBuffer=0;lastBattleTick=Date.now();

    const selected=v93CurrentParty();
    const updates=[];
    for(const a of selected){
      const max=v6HeroMaxHp(a);
      a.max_hp=max;a.current_hp=max;a.knocked_out=false;a.injury_until=null;
      updates.push(sb.from('game_adventurers').update({
        max_hp:max,current_hp:max,knocked_out:false,injury_until:null
      }).eq('id',a.id));
    }
    gameMeta.stage_kills=0;
    updates.push(sb.from('game_meta').update({
      stage_kills:0,paused:false,updated_at:new Date().toISOString()
    }).eq('room_id',roomId));
    await Promise.allSettled(updates);
    v4EnsureWave();
    gameToastMsg('隊伍全滅：已立即滿血復活，重新刷目前同一關。');
    renderBattle();
  };
  window.v81InstantRevive=window.v93InstantPartyRevive;

  // Critical fix: V9.2 defined a revive function but never called it from battleTick.
  window.battleTick=async function(){
    if(!room||!gameMeta||!battleAnimOn||!document.getElementById('guildPage')?.classList.contains('active'))return;

    await v6RecoverParty();
    if(v6AllKo()){await v93InstantPartyRevive();return}

    const now=Date.now(),dt=Math.min(1,(now-lastBattleTick)/1000);lastBattleTick=now;
    const alive=v93CurrentParty().filter(a=>!a.knocked_out&&v6HeroHp(a)>0);
    if(!alive.length){await v93InstantPartyRevive();return}

    const attacker=alive[Math.floor(Math.random()*alive.length)],crit=Math.random()<.15,skill=Math.random()<.10;
    let dmg=partyDps()*dt*(skill?1.65:1)*(crit?1.5:1);
    v4AnimateHero(attacker,skill);v4SpawnDamage(dmg,crit);

    if(v4BossMode){
      v4BossHp-=dmg;
      await v6DamageParty(dt,true);
      if(v6AllKo()){await v93InstantPartyRevive();return}
      if(v4BossHp<=0)await v4BossDefeated();else renderBattle();
      return;
    }

    v4EnsureWave();
    const target=v4Wave[Math.floor(Math.random()*v4Wave.length)];
    if(!target){v6RefillWave();renderBattle();return}
    if(skill)for(const m of v4Wave)m.hp-=dmg*.38;else target.hp-=dmg;

    await v6DamageParty(dt,false);
    if(v6AllKo()){await v93InstantPartyRevive();return}

    for(const m of [...v4Wave])if(m.hp<=0)await v4MobDefeated(m);
    v6RefillWave();

    const totalKills=Number(gameMeta.stage_kills||0)+v4KillBuffer;
    if(totalKills>0&&totalKills%50===0){
      await v4FlushBattle();await challengeBoss();return;
    }
    renderBattle();
    if(now-v4LastFlush>10000)await v4FlushBattle();
  };

})();
