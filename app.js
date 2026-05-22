/* ============================================================
   慢 MANDÀ — offline Mandarin study PWA
   Vanilla JS, localStorage, SM-2 spaced repetition.
   ============================================================ */
'use strict';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
const now=()=>Date.now();
const DAY=86400000;
const todayStr=()=>new Date().toISOString().slice(0,10);
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const sample=(a,n)=>shuffle(a).slice(0,n);

/* ---------- preset vocabulary (verbatim from source) ---------- */
const PRESET_UNITS = {
    hobbies: {
        name: 'Ch2 U3 – Hobbies',
        words: [
            { hanzi: '爱好', pinyin: 'ài hào', english: 'hobby' },
            { hanzi: '唱歌', pinyin: 'chàng gē', english: 'to sing/singing' },
            { hanzi: '跳舞', pinyin: 'tiào wǔ', english: 'to dance' },
            { hanzi: '弹', pinyin: 'tán', english: 'to play (guitar/piano)' },
            { hanzi: '吉他', pinyin: 'jí tā', english: 'guitar' },
            { hanzi: '钢琴', pinyin: 'gāng qín', english: 'piano' },
            { hanzi: '画画', pinyin: 'huà huà', english: 'to draw/drawing' },
            { hanzi: '看书', pinyin: 'kàn shū', english: 'to read/reading' },
            { hanzi: '看电视', pinyin: 'kàn diàn shì', english: 'to watch TV' },
            { hanzi: '看电影', pinyin: 'kàn diàn yǐng', english: 'to watch movies' },
            { hanzi: '玩电子游戏', pinyin: 'wán diàn zǐ yóu xì', english: 'to play video games' },
            { hanzi: '听音乐', pinyin: 'tīng yīn yuè', english: 'listen to music' },
            { hanzi: '会', pinyin: 'huì', english: 'can, be able to' },
            { hanzi: '有意思', pinyin: 'yǒu yì si', english: 'interesting' },
            { hanzi: '没意思', pinyin: 'méi yì si', english: 'not interesting/boring' },
            { hanzi: '无聊', pinyin: 'wú liáo', english: 'bored' },
            { hanzi: '一样', pinyin: 'yī yàng', english: 'the same' },
            { hanzi: '想', pinyin: 'xiǎng', english: 'to think, to miss, to want to' }
        ]
    },
    sports: {
        name: 'Ch2 U3 – Sports & Activities',
        words: [
            { hanzi: '喜欢', pinyin: 'xǐ huan', english: 'to like' },
            { hanzi: '运动', pinyin: 'yùn dòng', english: 'sports/exercise' },
            { hanzi: '打', pinyin: 'dǎ', english: 'to play, to hit' },
            { hanzi: '打球', pinyin: 'dǎ qiú', english: 'to play ball' },
            { hanzi: '篮球', pinyin: 'lán qiú', english: 'basketball' },
            { hanzi: '棒球', pinyin: 'bàng qiú', english: 'baseball' },
            { hanzi: '排球', pinyin: 'pái qiú', english: 'volleyball' },
            { hanzi: '网球', pinyin: 'wǎng qiú', english: 'tennis' },
            { hanzi: '美式足球', pinyin: 'měi shì zú qiú', english: 'American football' },
            { hanzi: '踢', pinyin: 'tī', english: 'to kick' },
            { hanzi: '足球', pinyin: 'zú qiú', english: 'soccer' },
            { hanzi: '游泳', pinyin: 'yóu yǒng', english: 'swimming' },
            { hanzi: '跑步', pinyin: 'pǎo bù', english: 'to run/running' },
            { hanzi: '只', pinyin: 'zhǐ', english: 'only' },
            { hanzi: '为什么', pinyin: 'wèi shén me', english: 'why' },
            { hanzi: '因为', pinyin: 'yīn wèi', english: 'because' },
            { hanzi: '好玩', pinyin: 'hǎo wán', english: 'fun' },
            { hanzi: '不好玩', pinyin: 'bù hǎo wán', english: 'not fun' },
            { hanzi: '难', pinyin: 'nán', english: 'difficult' }
        ]
    },
    places: {
        name: 'Ch2 U3 – Places',
        words: [
            { hanzi: '图书馆', pinyin: 'tú shū guǎn', english: 'library' },
            { hanzi: '餐厅', pinyin: 'cān tīng', english: 'restaurant/dining hall' },
            { hanzi: '教室', pinyin: 'jiào shì', english: 'classroom' },
            { hanzi: '体育馆', pinyin: 'tǐ yù guǎn', english: 'gym' },
            { hanzi: '公园', pinyin: 'gōng yuán', english: 'park' }
        ]
    },
    time: {
        name: 'Ch2 U3 – Time Expressions',
        words: [
            { hanzi: '早上', pinyin: 'zǎo shang', english: 'morning (6-9am)' },
            { hanzi: '上午', pinyin: 'shàng wǔ', english: 'morning (9-11:30am)' },
            { hanzi: '中午', pinyin: 'zhōng wǔ', english: 'noon (12-12:45pm)' },
            { hanzi: '下午', pinyin: 'xià wǔ', english: 'afternoon (1-5pm)' },
            { hanzi: '晚上', pinyin: 'wǎn shang', english: 'evening' },
            { hanzi: '半夜', pinyin: 'bàn yè', english: 'midnight' },
            { hanzi: '点', pinyin: 'diǎn', english: "o'clock" },
            { hanzi: '刻', pinyin: 'kè', english: 'quarter' },
            { hanzi: '分', pinyin: 'fēn', english: 'minute' },
            { hanzi: '半', pinyin: 'bàn', english: 'half' },
            { hanzi: '现在', pinyin: 'xiàn zài', english: 'now' },
            { hanzi: '以后', pinyin: 'yǐ hòu', english: 'later/after' }
        ]
    },
    weekend: {
        name: 'Ch2 U3 – Weekend & Frequency',
        words: [
            { hanzi: '周末', pinyin: 'zhōu mò', english: 'weekend' },
            { hanzi: '常常', pinyin: 'cháng cháng', english: 'often' },
            { hanzi: '有时候', pinyin: 'yǒu shí hòu', english: 'sometimes' },
            { hanzi: '天天', pinyin: 'tiān tiān', english: 'everyday' },
            { hanzi: '每天', pinyin: 'měi tiān', english: 'everyday' },
            { hanzi: '很少', pinyin: 'hěn shǎo', english: 'rarely, few' },
            { hanzi: '从来不', pinyin: 'cóng lái bù', english: 'never' },
            { hanzi: '做', pinyin: 'zuò', english: 'to do' },
            { hanzi: '功课', pinyin: 'gōng kè', english: 'homework' },
            { hanzi: '活动', pinyin: 'huó dòng', english: 'activity' },
            { hanzi: '忙', pinyin: 'máng', english: 'busy' },
            { hanzi: '有空', pinyin: 'yǒu kòng', english: 'free time' },
            { hanzi: '一起', pinyin: 'yì qǐ', english: 'together' },
            { hanzi: '今天', pinyin: 'jīn tiān', english: 'today' },
            { hanzi: '明天', pinyin: 'míng tiān', english: 'tomorrow' },
            { hanzi: '昨天', pinyin: 'zuó tiān', english: 'yesterday' }
        ]
    },
    dailyActivities: {
        name: 'Ch2 U3 – Daily Activities',
        words: [
            { hanzi: '吃', pinyin: 'chī', english: 'to eat' },
            { hanzi: '早饭', pinyin: 'zǎo fàn', english: 'breakfast' },
            { hanzi: '午饭', pinyin: 'wǔ fàn', english: 'lunch' },
            { hanzi: '晚饭', pinyin: 'wǎn fàn', english: 'dinner' },
            { hanzi: '起床', pinyin: 'qǐ chuáng', english: 'to wake/get up' },
            { hanzi: '上学', pinyin: 'shàng xué', english: 'to go to school' },
            { hanzi: '放学', pinyin: 'fàng xué', english: 'school end' },
            { hanzi: '上课', pinyin: 'shàng kè', english: 'attend class/class start' },
            { hanzi: '下课', pinyin: 'xià kè', english: 'class end' },
            { hanzi: '到学校', pinyin: 'dào xué xiào', english: 'arrive to school' },
            { hanzi: '回家', pinyin: 'huí jiā', english: 'go home' },
            { hanzi: '睡觉', pinyin: 'shuì jiào', english: 'sleep' }
        ]
    },
    westernFood: {
        name: 'Ch2 U4.1 – Western Food',
        words: [
            { hanzi: '吃', pinyin: 'chī', english: 'to eat' },
            { hanzi: '喝', pinyin: 'hē', english: 'to drink' },
            { hanzi: '好吃', pinyin: 'hǎo chī', english: 'tasty (food)' },
            { hanzi: '不好吃', pinyin: 'bù hǎo chī', english: 'nasty (food)' },
            { hanzi: '好喝', pinyin: 'hǎo hē', english: 'tasty (drinks)' },
            { hanzi: '食物', pinyin: 'shí wù', english: 'food' },
            { hanzi: '汉堡包', pinyin: 'hàn bǎo bāo', english: 'hamburger' },
            { hanzi: '三明治', pinyin: 'sān míng zhì', english: 'sandwich' },
            { hanzi: '热狗', pinyin: 'rè gǒu', english: 'hot dog' },
            { hanzi: '冰淇淋', pinyin: 'bīng qí lín', english: 'ice cream' },
            { hanzi: '意大利面', pinyin: 'yì dà lì miàn', english: 'pasta' },
            { hanzi: '炸鸡', pinyin: 'zhà jī', english: 'fried chicken' },
            { hanzi: '薯条', pinyin: 'shǔ tiáo', english: 'french fries' },
            { hanzi: '薯片', pinyin: 'shǔ piàn', english: 'potato chips' },
            { hanzi: '披萨', pinyin: 'pī sà', english: 'pizza' },
            { hanzi: '面包', pinyin: 'miàn bāo', english: 'bread' },
            { hanzi: '可乐', pinyin: 'kě lè', english: 'coke' },
            { hanzi: '牛奶', pinyin: 'niú nǎi', english: 'milk' },
            { hanzi: '咖啡', pinyin: 'kā fēi', english: 'coffee' },
            { hanzi: '水', pinyin: 'shuǐ', english: 'water' },
            { hanzi: '咸', pinyin: 'xián', english: 'salty' },
            { hanzi: '果汁', pinyin: 'guǒ zhī', english: 'fruit juice' },
            { hanzi: '身体', pinyin: 'shēn tǐ', english: 'body' },
            { hanzi: '想', pinyin: 'xiǎng', english: 'want to' },
            { hanzi: '还是', pinyin: 'hái shì', english: 'or (question word)' },
            { hanzi: '培根', pinyin: 'péi gēn', english: 'bacon' },
            { hanzi: '蛋糕', pinyin: 'dàn gāo', english: 'cake' },
            { hanzi: '蛋', pinyin: 'dàn', english: 'egg' },
            { hanzi: '吐司', pinyin: 'tǔ sī', english: 'toast' },
            { hanzi: '麦片', pinyin: 'mài piàn', english: 'oatmeal' },
            { hanzi: '贝果', pinyin: 'bèi guǒ', english: 'bagel' },
            { hanzi: '松饼', pinyin: 'sōng bǐng', english: 'waffle' },
            { hanzi: '果酱', pinyin: 'guǒ jiàng', english: 'jam' },
            { hanzi: '糖果', pinyin: 'táng guǒ', english: 'candy' },
            { hanzi: '饼干', pinyin: 'bǐng gān', english: 'cookie/biscuit' },
            { hanzi: '巧克力', pinyin: 'qiǎo kè lì', english: 'chocolate' },
            { hanzi: '酸奶', pinyin: 'suān nǎi', english: 'yogurt' },
            { hanzi: '汽水', pinyin: 'qì shuǐ', english: 'soda' },
            { hanzi: '沙拉', pinyin: 'shā lā', english: 'salad' }
        ]
    },
    chineseFood: {
        name: 'Ch2 U4.2 – Chinese Food',
        words: [
            { hanzi: '包子', pinyin: 'bāo zi', english: 'steamed bun' },
            { hanzi: '豆浆', pinyin: 'dòu jiāng', english: 'soy milk' },
            { hanzi: '饺子', pinyin: 'jiǎo zi', english: 'dumplings' },
            { hanzi: '炒饭', pinyin: 'chǎo fàn', english: 'fried rice' },
            { hanzi: '油条', pinyin: 'yóu tiáo', english: 'fried dough sticks' },
            { hanzi: '炒面', pinyin: 'chǎo miàn', english: 'fried noodles' },
            { hanzi: '虾子', pinyin: 'xiā zi', english: 'shrimp' },
            { hanzi: '红茶', pinyin: 'hóng chá', english: 'black tea' },
            { hanzi: '绿茶', pinyin: 'lǜ chá', english: 'green tea' },
            { hanzi: '珍珠奶茶', pinyin: 'zhēn zhū nǎi chá', english: 'boba/bubble tea' },
            { hanzi: '吃过', pinyin: 'chī guò', english: 'have eaten (before)' },
            { hanzi: '没吃过', pinyin: 'méi chī guò', english: 'never eaten (before)' },
            { hanzi: '喝过', pinyin: 'hē guò', english: 'have drunk (before)' },
            { hanzi: '还是', pinyin: 'hái shì', english: 'or' },
            { hanzi: '中餐', pinyin: 'zhōng cān', english: 'Chinese food' },
            { hanzi: '西餐', pinyin: 'xī cān', english: 'western food' },
            { hanzi: '中国城', pinyin: 'zhōng guó chéng', english: 'Chinatown' },
            { hanzi: '中国菜', pinyin: 'zhōng guó cài', english: 'Chinese cuisine' }
        ]
    },
    fruits: {
        name: 'Ch2 U4.3 – Fruits',
        words: [
            { hanzi: '水果', pinyin: 'shuǐ guǒ', english: 'fruits' },
            { hanzi: '苹果', pinyin: 'píng guǒ', english: 'apple' },
            { hanzi: '香蕉', pinyin: 'xiāng jiāo', english: 'banana' },
            { hanzi: '桃子', pinyin: 'táo zi', english: 'peach' },
            { hanzi: '菠萝', pinyin: 'bō luó', english: 'pineapple' },
            { hanzi: '草莓', pinyin: 'cǎo méi', english: 'strawberry' },
            { hanzi: '芒果', pinyin: 'máng guǒ', english: 'mango' },
            { hanzi: '西瓜', pinyin: 'xī guā', english: 'watermelon' },
            { hanzi: '葡萄', pinyin: 'pú táo', english: 'grape' },
            { hanzi: '健康', pinyin: 'jiàn kāng', english: 'healthy' },
            { hanzi: '营养', pinyin: 'yíng yǎng', english: 'nutrition' },
            { hanzi: '新鲜', pinyin: 'xīn xiān', english: 'fresh' },
            { hanzi: '酸', pinyin: 'suān', english: 'sour' },
            { hanzi: '甜', pinyin: 'tián', english: 'sweet' },
            { hanzi: '苦', pinyin: 'kǔ', english: 'bitter' },
            { hanzi: '辣', pinyin: 'là', english: 'spicy' },
            { hanzi: '咸', pinyin: 'xián', english: 'salty' },
            { hanzi: '一样', pinyin: 'yī yàng', english: 'the same' },
            { hanzi: '比', pinyin: 'bǐ', english: 'compare / than' },
            { hanzi: '蓝莓', pinyin: 'lán méi', english: 'blueberry' },
            { hanzi: '樱桃', pinyin: 'yīng táo', english: 'cherry' },
            { hanzi: '柠檬', pinyin: 'níng méng', english: 'lemon' },
            { hanzi: '柳橙', pinyin: 'liǔ chéng', english: 'orange (fruit)' },
            { hanzi: '猕猴桃', pinyin: 'mí hóu táo', english: 'kiwi' },
            { hanzi: '红色', pinyin: 'hóng sè', english: 'red' },
            { hanzi: '绿色', pinyin: 'lǜ sè', english: 'green' },
            { hanzi: '紫色', pinyin: 'zǐ sè', english: 'purple' },
            { hanzi: '黄色', pinyin: 'huáng sè', english: 'yellow' },
            { hanzi: '黑色', pinyin: 'hēi sè', english: 'black' },
            { hanzi: '白色', pinyin: 'bái sè', english: 'white' },
            { hanzi: '橘色', pinyin: 'jú sè', english: 'orange (color)' }
        ]
    },
    fourSeasons: {
        name: 'Ch2 U5.1 – Four Seasons',
        words: [
            { hanzi: '夏天', pinyin: 'xià tiān', english: 'summer' },
            { hanzi: '冬天', pinyin: 'dōng tiān', english: 'winter' },
            { hanzi: '秋天', pinyin: 'qiū tiān', english: 'fall/autumn' },
            { hanzi: '春天', pinyin: 'chūn tiān', english: 'spring' },
            { hanzi: '热', pinyin: 'rè', english: 'hot' },
            { hanzi: '冷', pinyin: 'lěng', english: 'cold' },
            { hanzi: '暖和', pinyin: 'nuǎn huo', english: 'warm' },
            { hanzi: '凉快', pinyin: 'liáng kuai', english: 'cool' },
            { hanzi: '非常', pinyin: 'fēi cháng', english: 'extremely' },
            { hanzi: '特别', pinyin: 'tè bié', english: 'very/especially' },
            { hanzi: '从来不', pinyin: 'cóng lái bù', english: 'never' },
            { hanzi: '时候', pinyin: 'shí hòu', english: 'during/while/moment' }
        ]
    },
    weather: {
        name: 'Ch2 U5.2 – Weather',
        words: [
            { hanzi: '天气', pinyin: 'tiān qì', english: 'weather' },
            { hanzi: '温度', pinyin: 'wēn dù', english: 'temperature' },
            { hanzi: '最高', pinyin: 'zuì gāo', english: 'highest' },
            { hanzi: '最低', pinyin: 'zuì dī', english: 'lowest' },
            { hanzi: '左右', pinyin: 'zuǒ yòu', english: 'about/around' },
            { hanzi: '度', pinyin: 'dù', english: 'degree' },
            { hanzi: '晴天', pinyin: 'qíng tiān', english: 'sunny day' },
            { hanzi: '阴天', pinyin: 'yīn tiān', english: 'cloudy/overcast day' },
            { hanzi: '多云', pinyin: 'duō yún', english: 'cloudy' },
            { hanzi: '少云', pinyin: 'shǎo yún', english: 'few clouds' },
            { hanzi: '下雨', pinyin: 'xià yǔ', english: 'rain' },
            { hanzi: '下雪', pinyin: 'xià xuě', english: 'snow' },
            { hanzi: '风很大', pinyin: 'fēng hěn dà', english: 'windy (adjective)' },
            { hanzi: '刮风', pinyin: 'guā fēng', english: 'windy (verb)' },
            { hanzi: '打雷', pinyin: 'dǎ léi', english: 'thunder' },
            { hanzi: '糟糕', pinyin: 'zāo gāo', english: 'terrible' },
            { hanzi: '奇怪', pinyin: 'qí guài', english: 'strange' },
            { hanzi: '零下', pinyin: 'líng xià', english: 'below zero' },
            { hanzi: '天气预报', pinyin: 'tiān qì yù bào', english: 'weather forecast' }
        ]
    }
};


/* ============================================================
   STATE  (localStorage)
   ============================================================ */
const LS_KEY='manda';
let S=loadState();
function defaultState(){
  return {
    customUnits:{},          // userKey -> {name, words}
    srs:{},                  // cardId -> {ease,interval,reps,nextReview,lastReview,difficulty}
    mistakes:[],             // cardId[]
    favorites:[],            // cardId[]
    seen:{},                 // cardId -> times seen
    stats:{totalReviews:0, correct:0, byDay:{}, sessions:0},
    streak:{count:0, last:null},
    settings:{geminiKey:'', autoSpeak:true, showPinyin:true, voiceURI:''},
    daily:{date:todayStr(), reviews:0, goal:20}
  };
}
function loadState(){
  try{const raw=localStorage.getItem(LS_KEY);if(!raw)return defaultState();
    const s=JSON.parse(raw);const d=defaultState();
    return {...d,...s, settings:{...d.settings,...(s.settings||{})}, stats:{...d.stats,...(s.stats||{})},
      streak:{...d.streak,...(s.streak||{})}, daily:{...d.daily,...(s.daily||{})}};
  }catch(e){return defaultState();}
}
function save(){try{localStorage.setItem(LS_KEY,JSON.stringify(S));}catch(e){}}

/* all units = presets + custom */
function allUnits(){return {...PRESET_UNITS, ...S.customUnits};}
function unitWords(key){const u=allUnits()[key];return u?u.words:[];}
function cardId(w){return `${w.hanzi}-${w.pinyin}`;}
function wordsForKeys(keys){const u=allUnits();const out=[];keys.forEach(k=>{if(u[k])u[k].words.forEach(w=>out.push({...w,unit:k}));});return out;}
function allWords(){return wordsForKeys(Object.keys(allUnits()));}
function findWord(id){return allWords().find(w=>cardId(w)===id);}

/* ============================================================
   SRS — SuperMemo SM-2  (Again / Hard / Good / Easy = 0..3)
   ============================================================ */
function initCard(id){
  if(!S.srs[id]) S.srs[id]={ease:2.5,interval:0,reps:0,nextReview:0,lastReview:0,difficulty:'new'};
  return S.srs[id];
}
function gradeCard(id,q){
  const c=initCard(id);
  c.reps++; c.lastReview=now();
  c.ease=Math.max(1.3, c.ease + (0.1 - (3-q)*(0.08 + (3-q)*0.02)));
  if(q<2){ c.interval=1; c.difficulty='learning'; if(!S.mistakes.includes(id))S.mistakes.push(id); }
  else{
    if(c.reps===1)c.interval=1; else if(c.reps===2)c.interval=6; else c.interval=Math.round(c.interval*c.ease);
    c.difficulty = c.interval>=21?'easy': c.interval>=7?'medium':'learning';
    // a correct answer clears it from the mistake queue
    const mi=S.mistakes.indexOf(id); if(mi>=0)S.mistakes.splice(mi,1);
  }
  c.nextReview = now() + c.interval*DAY;
  // stats
  S.stats.totalReviews++; if(q>=2)S.stats.correct++;
  const d=todayStr(); S.stats.byDay[d]=(S.stats.byDay[d]||0)+1;
  bumpDaily(); bumpStreak();
  save();
}
function previewInterval(id,q){ // for button labels — doesn't mutate
  const c=S.srs[id]||{ease:2.5,interval:0,reps:0};
  if(q<2)return '1d';
  let iv; const reps=c.reps+1;
  if(reps===1)iv=1; else if(reps===2)iv=6; else iv=Math.round((c.interval||1)*Math.max(1.3,c.ease+(0.1-(3-q)*(0.08+(3-q)*0.02))));
  if(iv>=30)return Math.round(iv/30)+'mo';
  return iv+'d';
}
function dueCards(words){ return words.filter(w=>{const c=S.srs[cardId(w)];return !c||c.nextReview<=now();}); }
function dueCount(){ return dueCards(allWords()).length; }
function newCount(){ return allWords().filter(w=>!S.srs[cardId(w)]).length; }

function bumpDaily(){ const t=todayStr(); if(S.daily.date!==t){S.daily.date=t;S.daily.reviews=0;} S.daily.reviews++; }
function bumpStreak(){
  const t=todayStr();
  if(S.streak.last===t)return;
  const y=new Date(Date.now()-DAY).toISOString().slice(0,10);
  if(S.streak.last===y)S.streak.count++; else S.streak.count=1;
  S.streak.last=t;
}
function maturityOf(id){const c=S.srs[id];if(!c||c.difficulty==='new')return 'new';return c.difficulty;}

/* ============================================================
   SPEECH  (TTS — offline if a zh voice is installed)
   ============================================================ */
let _voices=[];
function loadVoices(){ if('speechSynthesis'in window){_voices=speechSynthesis.getVoices();} }
if('speechSynthesis'in window){ loadVoices(); speechSynthesis.onvoiceschanged=loadVoices; }
function zhVoice(){
  if(!_voices.length)loadVoices();
  if(S.settings.voiceURI){const v=_voices.find(v=>v.voiceURI===S.settings.voiceURI);if(v)return v;}
  return _voices.find(v=>/zh|chinese|cmn|普通话|中文/i.test(v.lang+v.name)) || null;
}
function speak(text,rate){
  if(!('speechSynthesis'in window))return;
  try{
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    const v=zhVoice(); if(v){u.voice=v;u.lang=v.lang;} else u.lang='zh-CN';
    u.rate=rate||0.85; u.pitch=1;
    speechSynthesis.speak(u);
  }catch(e){}
}
function speechSupported(){ return 'speechSynthesis'in window && !!zhVoice(); }

/* ============================================================
   GEMINI  (optional — example sentences / explanations)
   ============================================================ */
const GEMINI_URL='https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
async function geminiCall(prompt){
  const key=S.settings.geminiKey;
  if(!key)throw new Error('no key');
  if(!navigator.onLine)throw new Error('network');
  const r=await fetch(`${GEMINI_URL}?key=${key}`,{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:0.6,maxOutputTokens:400}})
  });
  if(r.status===400||r.status===403)throw new Error('badkey');
  if(r.status===429)throw new Error('limit');
  if(!r.ok)throw new Error('network');
  const d=await r.json();
  return (d.candidates?.[0]?.content?.parts?.[0]?.text||'').trim();
}
function aiError(e){const m=(e&&e.message)||'';
  if(m==='no key')return 'Add your free Gemini key in Settings to use AI features.';
  if(m==='badkey')return 'That Gemini key looks invalid. Re-copy it from aistudio.google.com.';
  if(m==='limit')return 'Gemini free limit hit — try again shortly.';
  if(m==='network')return 'No connection to Gemini. Check your internet.';
  return 'AI unavailable right now. Try again shortly.';
}

/* ============================================================
   UI HELPERS
   ============================================================ */
function toast(msg,kind){const t=$('#toast');t.textContent=msg;t.className=(kind||'')+' show';clearTimeout(t._t);t._t=setTimeout(()=>t.className=t.className.replace('show','').trim(),2200);}
function modal(html){$('#modal').innerHTML=html;$('#modalWrap').classList.add('show');}
function closeModal(){$('#modalWrap').classList.remove('show');}
function vibrate(ms){if(navigator.vibrate)try{navigator.vibrate(ms);}catch(e){}}

/* ============================================================
   ROUTER + NAV
   ============================================================ */
let current='home';
let session=null; // active study session state
const NAV=[
  {id:'home',ic:'⌂',label:'Home'},
  {id:'study',ic:'⚏',label:'Study'},
  {id:'browse',ic:'☰',label:'Words'},
  {id:'stats',ic:'◔',label:'Stats'}
];
function renderNav(){
  const n=$('#nav');n.innerHTML='';
  NAV.forEach(t=>{
    const b=el('button',current===t.id?'on':'',`<span class="ni">${t.ic}</span>${t.label}`);
    b.onclick=()=>go(t.id);
    n.appendChild(b);
  });
}
function go(screen){
  if(session && screen!==current){ if(!confirmLeave())return; session=null; }
  current=screen; renderNav();
  if(screen==='home')renderHome();
  else if(screen==='study')renderStudyMenu();
  else if(screen==='browse')renderBrowse();
  else if(screen==='stats')renderStats();
}
function confirmLeave(){return true;} // sessions auto-save each card; safe to leave

/* ============================================================
   HOME
   ============================================================ */
function renderHome(){
  const due=dueCount(), fresh=newCount();
  const acc=S.stats.totalReviews?Math.round(S.stats.correct/S.stats.totalReviews*100):0;
  const dailyPct=Math.min(100,Math.round(S.daily.reviews/S.daily.goal*100));
  let h=`<div class="page">
    <div class="topbar">
      <div><div class="sub">Mandarin Study</div><h1>慢 Mandà</h1></div>
      <button class="iconbtn" onclick="openSettings()">⚙</button>
    </div>`;

  // daily goal ring + streak
  h+=`<div class="card">
    <div class="card-h"><div class="t">Today</div><span class="tag-pill" style="color:var(--gold)">🔥 ${S.streak.count} day streak</span></div>
    <div style="display:flex;align-items:center;gap:18px">
      <div style="position:relative;width:84px;height:84px;flex:0 0 auto">
        <svg width="84" height="84" viewBox="0 0 84 84">
          <circle cx="42" cy="42" r="36" fill="none" stroke="var(--bg3)" stroke-width="8"/>
          <circle cx="42" cy="42" r="36" fill="none" stroke="var(--jade)" stroke-width="8" stroke-linecap="round"
            stroke-dasharray="${2*Math.PI*36}" stroke-dashoffset="${2*Math.PI*36*(1-dailyPct/100)}"
            transform="rotate(-90 42 42)" style="transition:stroke-dashoffset .5s"/>
        </svg>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Oswald';font-weight:700;font-size:20px">${dailyPct}%</div>
      </div>
      <div style="flex:1">
        <div style="font-size:15px;font-weight:600">${S.daily.reviews} / ${S.daily.goal} reviews</div>
        <div class="small">${dailyPct>=100?'Daily goal smashed. 干得好!':'Keep going to hit your goal today.'}</div>
      </div>
    </div>
  </div>`;

  // due / review CTA
  if(due>0){
    h+=`<div class="card due" style="border-color:var(--jade)">
      <div style="font-family:'Oswald';font-weight:700;font-size:22px;text-transform:uppercase">${due} card${due>1?'s':''} due</div>
      <div class="small" style="margin:4px 0 14px">Spaced repetition keeps these in long-term memory. Review them now.</div>
      <button class="btn" onclick="startSRS()">Start Review</button>
    </div>`;
  } else {
    h+=`<div class="card center" style="padding:24px">
      <div style="font-size:30px">✓</div>
      <div style="font-family:'Oswald';font-weight:700;font-size:20px;text-transform:uppercase;margin-top:6px">All caught up</div>
      <div class="small" style="margin-top:4px">No reviews due. Learn new words or practice a mode below.</div>
    </div>`;
  }

  // quick stats
  h+=`<div class="stat-grid">
    <div class="stat"><div class="v">${fresh}</div><div class="l">New words</div></div>
    <div class="stat"><div class="v">${acc}<small>%</small></div><div class="l">Accuracy</div></div>
  </div>`;

  // jump into modes
  h+=`<div class="card-h" style="margin-top:6px"><div class="t">Practice</div><button class="small" style="color:var(--jade);font-weight:700" onclick="go('study')">All modes →</button></div>
  <div class="tiles">
    <button class="tile" onclick="quickStart('flash')"><span class="ic">🀄</span><span class="nm">Flashcards</span><span class="ds">Flip & grade</span></button>
    <button class="tile" onclick="quickStart('quiz')"><span class="ic">✎</span><span class="nm">Quiz</span><span class="ds">Multiple choice</span></button>
    <button class="tile" onclick="quickStart('listen')"><span class="ic">🔊</span><span class="nm">Listening</span><span class="ds">Hear → pick</span></button>
    <button class="tile" onclick="quickStart('build')"><span class="ic">⊞</span><span class="nm">Sentences</span><span class="ds">Build word order</span></button>
  </div>`;

  if(S.mistakes.length){
    h+=`<button class="tile wide" style="margin-top:12px;display:block;border-color:var(--verm)" onclick="startMistakes()">
      <span class="accentbar" style="background:var(--verm)"></span>
      <span class="ic">↻</span><span class="nm">Mistake Review</span>
      <span class="ds">${S.mistakes.length} word${S.mistakes.length>1?'s':''} you missed — clear them out</span></button>`;
  }

  h+=`</div>`;
  $('#screen').innerHTML=h;
}

/* ============================================================
   STUDY MENU + UNIT PICKER
   ============================================================ */
let selectedUnits=JSON.parse(localStorage.getItem('manda_sel')||'null')||Object.keys(PRESET_UNITS).slice(0,1);
function saveSel(){localStorage.setItem('manda_sel',JSON.stringify(selectedUnits));}

function renderStudyMenu(){
  let h=`<div class="page">
    <div class="topbar"><div><div class="sub">Choose a mode</div><h1>Study</h1></div></div>`;

  // unit selector summary
  const u=allUnits();
  const selCount=selectedUnits.filter(k=>u[k]).length;
  const wordCount=wordsForKeys(selectedUnits).length;
  h+=`<div class="card" onclick="renderUnitPicker()" style="cursor:pointer">
    <div class="card-h"><div class="t">Units</div><span class="small" style="color:var(--jade)">Change →</span></div>
    <div style="font-size:15px;font-weight:600">${selCount} unit${selCount!==1?'s':''} · ${wordCount} words selected</div>
    <div class="small" style="margin-top:3px">${selectedUnits.filter(k=>u[k]).map(k=>u[k].name).join(' · ')||'None — tap to choose'}</div>
  </div>`;

  h+=`<div class="tiles">
    <button class="tile" onclick="startMode('flash')"><span class="accentbar"></span><span class="ic">🀄</span><span class="nm">Flashcards</span><span class="ds">Flip cards, grade your recall (feeds spaced repetition)</span></button>
    <button class="tile" onclick="startMode('quiz')"><span class="accentbar"></span><span class="ic">✎</span><span class="nm">Quiz</span><span class="ds">Multiple choice — meaning & pinyin</span></button>
    <button class="tile" onclick="startMode('listen')"><span class="accentbar"></span><span class="ic">🔊</span><span class="nm">Listening</span><span class="ds">Hear the word, pick the meaning</span></button>
    <button class="tile" onclick="startMode('build')"><span class="accentbar"></span><span class="ic">⊞</span><span class="nm">Sentence Builder</span><span class="ds">Arrange words into correct order</span></button>
  </div>`;

  h+=`<button class="tile wide" style="margin-top:12px;display:block;border-color:var(--jade)" onclick="startSRS()">
    <span class="accentbar"></span><span class="ic">⟳</span><span class="nm">Spaced Repetition Review</span>
    <span class="ds">${dueCount()} due now · the smartest way to remember long-term</span></button>`;

  h+=`<div class="divider"></div>
  <button class="btn ghost" onclick="openImport()">+ Import / create a unit</button>`;

  h+=`</div>`;
  $('#screen').innerHTML=h;
}

function renderUnitPicker(){
  const u=allUnits();
  let h=`<div class="page">
    <div class="topbar"><div><div class="sub">Select what to study</div><h1>Units</h1></div>
      <button class="iconbtn" onclick="renderStudyMenu()">✕</button></div>`;
  h+=`<div class="chips" style="margin-bottom:14px">
    <button class="chip" onclick="selectAllUnits(true)">Select all</button>
    <button class="chip" onclick="selectAllUnits(false)">Clear</button></div>`;
  Object.keys(u).forEach(k=>{
    const unit=u[k];const on=selectedUnits.includes(k);
    const words=unit.words;
    const learned=words.filter(w=>{const c=S.srs[cardId(w)];return c&&c.difficulty!=='new'&&c.difficulty!=='learning';}).length;
    const custom=!!S.customUnits[k];
    h+=`<div class="unit-row ${on?'on':''}" onclick="toggleUnit('${k}')">
      <div class="chk">${on?'✓':''}</div>
      <div class="info"><div class="nm">${unit.name}${custom?' <span class="tag-pill" style="color:var(--gold)">custom</span>':''}</div>
        <div class="ct">${words.length} words</div></div>
      <div class="prog">${learned}/${words.length}</div>
    </div>`;
  });
  h+=`<button class="btn" style="margin-top:8px" onclick="renderStudyMenu()">Done</button></div>`;
  $('#screen').innerHTML=h;
}
function toggleUnit(k){const i=selectedUnits.indexOf(k);if(i>=0)selectedUnits.splice(i,1);else selectedUnits.push(k);saveSel();renderUnitPicker();}
function selectAllUnits(all){selectedUnits=all?Object.keys(allUnits()):[];saveSel();renderUnitPicker();}

function quickStart(mode){ // from home — use current selection or default to all
  if(!wordsForKeys(selectedUnits).length)selectedUnits=Object.keys(PRESET_UNITS);
  saveSel(); startMode(mode);
}
function startMode(mode){
  const words=wordsForKeys(selectedUnits);
  if(words.length<1){toast('Pick at least one unit first','bad');renderUnitPicker();return;}
  if(mode==='quiz'&&words.length<4){toast('Need 4+ words for a quiz','bad');return;}
  if(mode==='listen'&&!speechSupported()){toast('No Chinese voice on this device for listening','bad');}
  session={mode, queue:shuffle(words), i:0, correct:0, wrong:0, answers:[], started:now(), srs:false};
  renderSession();
}
function startSRS(){
  const due=dueCards(allWords());
  if(!due.length){toast('Nothing due — great job!','good');return;}
  session={mode:'flash', queue:shuffle(due), i:0, correct:0, wrong:0, answers:[], started:now(), srs:true};
  renderSession();
}
function startMistakes(){
  const words=S.mistakes.map(findWord).filter(Boolean);
  if(!words.length){toast('No mistakes to review','good');return;}
  session={mode:'flash', queue:shuffle(words), i:0, correct:0, wrong:0, answers:[], started:now(), srs:true, mistakes:true};
  renderSession();
}

/* ============================================================
   SESSION ROUTER
   ============================================================ */
function renderSession(){
  if(!session)return;
  if(session.i>=session.queue.length)return renderResults();
  if(session.mode==='flash')renderFlashcard();
  else if(session.mode==='quiz')renderQuiz();
  else if(session.mode==='listen')renderListen();
  else if(session.mode==='build')renderBuild();
}
function sessionHeader(title){
  const total=session.queue.length, i=session.i+1;
  return `<div class="page">
    <div class="topbar"><div><div class="sub">${title}</div><h1 style="font-size:26px">${session.srs?(session.mistakes?'Mistakes':'Review'):MODE_NAME[session.mode]}</h1></div>
      <button class="iconbtn" onclick="quitSession()">✕</button></div>
    <div class="counter">${i} / ${total}</div>
    <div class="pbar"><i style="width:${session.i/total*100}%"></i></div>`;
}
const MODE_NAME={flash:'Flashcards',quiz:'Quiz',listen:'Listening',build:'Sentences'};
function quitSession(){ if(session && session.i>0){ modal(`<h3>End session?</h3><p class="small">You've done ${session.i} card${session.i>1?'s':''}. Progress on each is already saved.</p><button class="btn" style="margin-top:14px" onclick="closeModal();session=null;go('home')">End session</button><button class="btn ghost" style="margin-top:10px" onclick="closeModal()">Keep going</button>`);} else {session=null;go('home');} }

/* ============================================================
   FLASHCARD MODE
   ============================================================ */
let fcFlipped=false;
function renderFlashcard(){
  const w=session.queue[session.i];
  fcFlipped=false;
  const id=cardId(w);
  const fav=S.favorites.includes(id);
  let h=sessionHeader('Tap to flip');
  h+=`<div class="fc-wrap">
    <div class="flashcard" id="flashcard" onclick="flipCard()">
      <div class="fc-face front">
        <div class="fc-tag">${maturityLabel(id)}</div>
        <button class="fc-speak" onclick="event.stopPropagation();speak('${w.hanzi}')">🔊</button>
        <button class="fc-speak star ${fav?'on':''}" style="right:62px" onclick="event.stopPropagation();toggleFav('${id}',this)">★</button>
        <div class="fc-hanzi zh">${w.hanzi}</div>
        ${S.settings.showPinyin?`<div class="fc-pinyin">${w.pinyin}</div>`:`<div class="small">tap 🔊 or flip</div>`}
        <div class="fc-hint">tap card to reveal meaning</div>
      </div>
      <div class="fc-face back">
        <div class="fc-tag">${w.pinyin}</div>
        <div class="fc-eng">${w.english}</div>
        <div class="fc-pinyin zh" style="font-size:34px;margin-top:14px;color:var(--txt2)">${w.hanzi}</div>
        <div class="fc-hint">how well did you know it?</div>
      </div>
    </div>
  </div>`;
  // grade buttons (shown after flip)
  h+=`<div id="gradeArea" style="visibility:hidden">
    <div class="grade-row">
      <button class="grade again" onclick="answerCard(0)">Again<span class="iv">${previewInterval(id,0)}</span></button>
      <button class="grade hard" onclick="answerCard(1)">Hard<span class="iv">${previewInterval(id,1)}</span></button>
      <button class="grade good" onclick="answerCard(2)">Good<span class="iv">${previewInterval(id,2)}</span></button>
      <button class="grade easy" onclick="answerCard(3)">Easy<span class="iv">${previewInterval(id,3)}</span></button>
    </div>
  </div></div>`;
  $('#screen').innerHTML=h;
  if(S.settings.autoSpeak)setTimeout(()=>speak(w.hanzi),250);
}
function flipCard(){
  const c=$('#flashcard');if(!c)return;
  fcFlipped=!fcFlipped;
  c.classList.toggle('flip',fcFlipped);
  $('#gradeArea').style.visibility=fcFlipped?'visible':'hidden';
}
function answerCard(q){
  const w=session.queue[session.i];
  gradeCard(cardId(w),q);
  if(q>=2)session.correct++; else session.wrong++;
  session.answers.push({id:cardId(w),q});
  S.seen[cardId(w)]=(S.seen[cardId(w)]||0)+1;
  vibrate(q>=2?15:[10,40,10]);
  session.i++; save(); renderSession();
}
function maturityLabel(id){const m=maturityOf(id);return {new:'New',learning:'Learning',medium:'Review',easy:'Mature'}[m]||'New';}
function toggleFav(id,btn){const i=S.favorites.indexOf(id);if(i>=0){S.favorites.splice(i,1);btn&&btn.classList.remove('on');}else{S.favorites.push(id);btn&&btn.classList.add('on');}save();}

/* ============================================================
   QUIZ MODE  (multiple choice: hanzi -> english)
   ============================================================ */
function renderQuiz(){
  const w=session.queue[session.i];
  const pool=allWords().filter(x=>cardId(x)!==cardId(w));
  const wrong=sample(pool,3).map(x=>x.english);
  const opts=shuffle([w.english,...wrong]);
  session._answer=w.english; session._locked=false;
  let h=sessionHeader('What does this mean?');
  h+=`<div class="qprompt">
    <button class="fc-speak" style="position:static;display:inline-flex;margin-bottom:14px" onclick="speak('${w.hanzi}')">🔊</button>
    <div class="big zh">${w.hanzi}</div>
    ${S.settings.showPinyin?`<div class="mid">${w.pinyin}</div>`:''}
  </div>`;
  const keys=['A','B','C','D'];
  opts.forEach((o,k)=>{ h+=`<button class="opt" data-val="${esc(o)}" onclick="answerQuiz(this,'${esc(o)}')"><span class="key">${keys[k]}</span><span>${o}</span></button>`; });
  h+=`</div>`;
  $('#screen').innerHTML=h;
  if(S.settings.autoSpeak)setTimeout(()=>speak(w.hanzi),250);
}
function answerQuiz(btn,val){
  if(session._locked)return; session._locked=true;
  const correct=val===session._answer;
  const w=session.queue[session.i];
  $$('.opt').forEach(b=>{
    if(b.dataset.val===esc(session._answer))b.classList.add('correct');
    else if(b===btn)b.classList.add('wrong');
  });
  gradeCard(cardId(w),correct?2:0);
  if(correct)session.correct++;else session.wrong++;
  session.answers.push({id:cardId(w),q:correct?2:0});
  vibrate(correct?15:[10,40,10]);
  session.i++; save();
  setTimeout(()=>renderSession(),correct?650:1100);
}

/* ============================================================
   LISTENING MODE  (hear hanzi -> pick english)
   ============================================================ */
function renderListen(){
  const w=session.queue[session.i];
  const pool=allWords().filter(x=>cardId(x)!==cardId(w));
  const opts=shuffle([w.english,...sample(pool,3).map(x=>x.english)]);
  session._answer=w.english; session._locked=false;
  let h=sessionHeader('Listen & choose');
  h+=`<div class="qprompt">
    <div class="lbl">tap to hear</div>
    <button onclick="speak('${w.hanzi}')" style="width:96px;height:96px;border-radius:50%;background:var(--jade);color:#062016;font-size:40px;border:none;margin:8px auto;display:block">🔊</button>
    <button class="small" style="color:var(--txt2);background:none;border:none;margin-top:8px" onclick="speak('${w.hanzi}',0.55)">slower ↓</button>
  </div>`;
  const keys=['A','B','C','D'];
  opts.forEach((o,k)=>{ h+=`<button class="opt" data-val="${esc(o)}" onclick="answerListen(this,'${esc(o)}')"><span class="key">${keys[k]}</span><span>${o}</span></button>`; });
  h+=`</div>`;
  $('#screen').innerHTML=h;
  setTimeout(()=>speak(w.hanzi),350);
}
function answerListen(btn,val){
  if(session._locked)return;session._locked=true;
  const correct=val===session._answer;const w=session.queue[session.i];
  $$('.opt').forEach(b=>{
    if(b.dataset.val===esc(session._answer))b.classList.add('correct');
    else if(b===btn)b.classList.add('wrong');
  });
  gradeCard(cardId(w),correct?2:0);
  if(correct)session.correct++;else session.wrong++;
  session.answers.push({id:cardId(w),q:correct?2:0});
  vibrate(correct?15:[10,40,10]);
  session.i++;save();
  setTimeout(()=>renderSession(),correct?700:1150);
}

function esc(s){return String(s).replace(/'/g,"\\'").replace(/"/g,'&quot;');}

/* ============================================================
   SENTENCE BUILDER  (generates SVO scenarios from your vocab)
   ============================================================ */
const SB_SUBJECTS=[
  {hanzi:'我',pinyin:'wǒ',english:'I'},{hanzi:'你',pinyin:'nǐ',english:'you'},
  {hanzi:'他',pinyin:'tā',english:'he'},{hanzi:'她',pinyin:'tā',english:'she'},
  {hanzi:'我们',pinyin:'wǒmen',english:'we'}
];
const SB_TIME=['今天','明天','昨天','现在','早上','上午','中午','下午','晚上','周末','常常','有时候','天天','每天'];
const SB_VERBHINT=['to ','eat','drink','play','watch','listen','read','draw','sing','dance','run','swim','do','want','like','go','kick','hit'];
const SB_ADJHINT=['interesting','boring','fun','difficult','easy','tasty','nasty','busy','free','healthy','hot','cold','warm','cool','sweet','sour','spicy','salty','bitter','fresh','terrible','strange','same'];
function sbType(w){
  if(SB_TIME.some(t=>w.hanzi.includes(t)))return 'time';
  const e=w.english.toLowerCase();
  if(e.startsWith('to ')||SB_VERBHINT.some(v=>e.includes(v)))return 'verb';
  if(SB_ADJHINT.some(a=>e.includes(a)))return 'adj';
  return 'noun';
}
function buildScenarios(words){
  const verbs=words.filter(w=>sbType(w)==='verb');
  const nouns=words.filter(w=>sbType(w)==='noun');
  const adjs=words.filter(w=>sbType(w)==='adj');
  const times=words.filter(w=>sbType(w)==='time');
  const out=[];
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  // SVO
  for(let n=0;n<verbs.length&&out.length<30;n++){
    if(!nouns.length)break;
    const s=pick(SB_SUBJECTS),v=verbs[n],o=pick(nouns);
    out.push({english:`${s.english} ${v.english.replace(/^to /,'')} ${o.english}`,
      answer:`${s.hanzi}${v.hanzi}${o.hanzi}`, pattern:'Subject + Verb + Object',
      tiles:[s,v,o]});
  }
  // S + time + V + O
  for(let n=0;n<verbs.length&&out.length<30;n++){
    if(!nouns.length||!times.length)break;
    const s=pick(SB_SUBJECTS),t=times[n%times.length],v=verbs[n],o=pick(nouns);
    out.push({english:`${s.english} ${v.english.replace(/^to /,'')} ${o.english} (${t.english})`,
      answer:`${s.hanzi}${t.hanzi}${v.hanzi}${o.hanzi}`, pattern:'Subject + Time + Verb + Object',
      tiles:[s,t,v,o]});
  }
  // S + 很 + Adj
  const hen={hanzi:'很',pinyin:'hěn',english:'very'};
  for(let n=0;n<adjs.length&&out.length<30;n++){
    const s=pick(SB_SUBJECTS),a=adjs[n];
    out.push({english:`${s.english} ${a.english}`, answer:`${s.hanzi}很${a.hanzi}`,
      pattern:'Subject + 很 (hěn) + Adjective', tiles:[s,hen,a]});
  }
  return shuffle(out);
}
function renderBuild(){
  if(!session.scenarios){
    session.scenarios=buildScenarios(session.queue);
    session.sIndex=0; session.placed=[]; session._locked=false;
  }
  if(!session.scenarios.length){
    $('#screen').innerHTML=`<div class="page">${sessionHeader('Sentence Builder')}
      <div class="empty"><div class="ic">⊞</div><p>These units don't have enough verbs/objects to build sentences. Try adding more units (Hobbies, Sports, Food work well).</p>
      <button class="btn ghost" style="margin-top:14px;width:auto;margin-inline:auto" onclick="session=null;go('study')">Back</button></div></div>`;
    return;
  }
  if(session.sIndex>=session.scenarios.length)return renderResults();
  const sc=session.scenarios[session.sIndex];
  const total=session.scenarios.length,i=session.sIndex+1;
  // shuffled bank of the needed tiles plus a couple distractors
  if(!session._bank){
    const distract=shuffle(session.queue).slice(0,2);
    session._bank=shuffle([...sc.tiles,...distract.filter(d=>!sc.tiles.includes(d))]);
  }
  let h=`<div class="page">
    <div class="topbar"><div><div class="sub">Sentence Builder</div><h1 style="font-size:26px">Sentences</h1></div>
      <button class="iconbtn" onclick="quitSession()">✕</button></div>
    <div class="counter">${i} / ${total}</div><div class="pbar"><i style="width:${session.sIndex/total*100}%"></i></div>`;
  h+=`<div class="sb-prompt"><div class="small" style="margin-bottom:4px">Translate to Chinese</div>
    <div style="font-size:20px;font-weight:700">${sc.english}</div></div>`;
  h+=`<div class="sb-answer" id="sbAnswer">`;
  session.placed.forEach((t,k)=>{h+=`<button class="sb-tile hanzi" onclick="sbUnplace(${k})">${t.hanzi}</button>`;});
  h+=`</div>`;
  h+=`<div class="small" style="margin-bottom:8px">Tap words in order:</div><div class="sb-bank">`;
  session._bank.forEach((t,k)=>{
    const used=session.placed.includes(t);
    h+=`<button class="sb-tile hanzi" ${used?'style="opacity:.3" disabled':''} onclick="sbPlace(${k})">${t.hanzi}<div style="font-size:11px;font-weight:400;opacity:.7">${t.pinyin}</div></button>`;
  });
  h+=`</div>`;
  if(session._locked){
    const correct=session.placed.map(t=>t.hanzi).join('')===sc.answer.replace(/\s/g,'');
    h+=`<div class="card" style="margin-top:16px;border-color:${correct?'var(--jade)':'var(--verm)'}">
      <div style="font-weight:800;color:${correct?'var(--jade)':'var(--verm)'}">${correct?'✓ Correct!':'Not quite'}</div>
      <div class="hanzi" style="font-size:24px;margin:8px 0">${sc.answer}</div>
      <div class="small">Pattern: ${sc.pattern}</div>
      <button class="spk-btn" style="margin-top:10px" onclick="speak('${sc.answer.replace(/\s/g,'')}')">🔊 Hear it</button></div>
      <button class="btn" style="margin-top:14px" onclick="sbNext()">${i<total?'Next sentence':'Finish'}</button>`;
  } else {
    h+=`<button class="btn" style="margin-top:18px" onclick="sbCheck()" ${session.placed.length?'':'disabled'}>Check</button>
      <button class="btn ghost" style="margin-top:10px" onclick="sbReset()">Clear</button>`;
  }
  h+=`</div>`;
  $('#screen').innerHTML=h;
}
function sbPlace(k){const t=session._bank[k];if(session.placed.includes(t))return;session.placed.push(t);renderBuild();}
function sbUnplace(k){if(session._locked)return;session.placed.splice(k,1);renderBuild();}
function sbReset(){session.placed=[];renderBuild();}
function sbCheck(){
  const sc=session.scenarios[session.sIndex];
  const correct=session.placed.map(t=>t.hanzi).join('')===sc.answer.replace(/\s/g,'');
  session._locked=true;
  if(correct)session.correct++;else session.wrong++;
  // grade the content words in the sentence
  sc.tiles.forEach(t=>{const w=findWord(t.hanzi);if(w)gradeCard(cardId(w),correct?2:1);});
  vibrate(correct?15:[10,40,10]);save();renderBuild();
}
function sbNext(){session.sIndex++;session.placed=[];session._locked=false;session._bank=null;
  if(session.sIndex>=session.scenarios.length){session.i=session.queue.length;renderResults();}else renderBuild();}

/* ============================================================
   RESULTS
   ============================================================ */
function renderResults(){
  const total=(session.correct||0)+(session.wrong||0);
  const pct=total?Math.round(session.correct/total*100):0;
  S.stats.sessions++;save();
  const msg=pct>=90?'Outstanding. 太棒了!':pct>=70?'Solid work. Keep it up!':pct>=50?'Good effort — review the misses.':'Tough round. Repetition is how it sticks.';
  let h=`<div class="page"><div class="topbar"><div><div class="sub">Session complete</div><h1>结果 Results</h1></div></div>
    <div class="card center" style="padding:28px">
      <div style="font-family:'Oswald';font-weight:700;font-size:56px;line-height:1;color:${pct>=70?'var(--jade)':pct>=50?'var(--gold)':'var(--verm)'}">${pct}%</div>
      <div class="small" style="margin-top:8px">${msg}</div>
    </div>
    <div class="stat-grid">
      <div class="stat"><div class="v" style="color:var(--jade)">${session.correct||0}</div><div class="l">Correct</div></div>
      <div class="stat"><div class="v" style="color:var(--verm)">${session.wrong||0}</div><div class="l">Missed</div></div>
    </div>`;
  if(session.wrong>0){
    h+=`<button class="btn" onclick="retryMistakesFromSession()">Review the ${session.wrong} I missed</button>
        <button class="btn ghost" style="margin-top:10px" onclick="session=null;go('home')">Back home</button>`;
  } else {
    h+=`<button class="btn" onclick="session=null;go('home')">Back home</button>`;
  }
  h+=`</div>`;
  $('#screen').innerHTML=h;
  session=null;
}
function retryMistakesFromSession(){go('home');startMistakes();}

/* ============================================================
   DICTIONARY / BROWSE
   ============================================================ */
let browseFilter='all';
function renderBrowse(){
  let h=`<div class="page"><div class="topbar"><div><div class="sub">Vocabulary</div><h1>词典 Words</h1></div></div>`;
  h+=`<input class="search" id="dictSearch" placeholder="Search hanzi, pinyin, or English…" oninput="renderDictList()" value="${dictQuery||''}">`;
  h+=`<div class="chips" style="margin-bottom:14px">
    <button class="chip ${browseFilter==='all'?'on':''}" onclick="browseFilter='all';renderBrowse()">All</button>
    <button class="chip ${browseFilter==='fav'?'on':''}" onclick="browseFilter='fav';renderBrowse()">★ Favorites</button>
    <button class="chip ${browseFilter==='learning'?'on':''}" onclick="browseFilter='learning';renderBrowse()">Learning</button>
    <button class="chip ${browseFilter==='easy'?'on':''}" onclick="browseFilter='easy';renderBrowse()">Mastered</button>
  </div>`;
  h+=`<div id="dictList"></div></div>`;
  $('#screen').innerHTML=h;
  renderDictList();
}
let dictQuery='';
function renderDictList(){
  const inp=$('#dictSearch');if(inp)dictQuery=inp.value.trim().toLowerCase();
  let words=allWords();
  if(browseFilter==='fav')words=words.filter(w=>S.favorites.includes(cardId(w)));
  else if(browseFilter==='learning')words=words.filter(w=>{const d=S.srs[cardId(w)];return d&&(d.difficulty==='learning'||d.difficulty==='new');});
  else if(browseFilter==='easy')words=words.filter(w=>{const d=S.srs[cardId(w)];return d&&d.difficulty==='easy';});
  if(dictQuery)words=words.filter(w=>w.hanzi.includes(dictQuery)||w.pinyin.toLowerCase().includes(dictQuery)||w.english.toLowerCase().includes(dictQuery));
  const el=$('#dictList');if(!el)return;
  if(!words.length){el.innerHTML=`<div class="empty"><div class="ic">⛁</div><p>No words${dictQuery?' match that search':browseFilter==='fav'?' favorited yet — tap ☆ on a flashcard':''}.</p></div>`;return;}
  let h='';
  words.forEach(w=>{
    const id=cardId(w);const fav=S.favorites.includes(id);const d=S.srs[id];
    const tag=d?d.difficulty:'new';
    h+=`<div class="dict-item">
      <div class="h">${w.hanzi}</div>
      <div class="m"><div class="p">${w.pinyin}</div><div class="e">${w.english}</div>
        <span class="tag ${tag}" style="margin-top:4px">${tag}</span></div>
      <button class="dict-item-fav" style="font-size:20px;background:none;border:none;color:${fav?'var(--gold)':'var(--txt3)'}" onclick="toggleFavById('${id}')">${fav?'★':'☆'}</button>
      <button class="spk" onclick="speak('${w.hanzi}')">🔊</button>
    </div>`;
  });
  el.innerHTML=h;
}
function toggleFavById(id){
  const i=S.favorites.indexOf(id);
  if(i>=0)S.favorites.splice(i,1);else S.favorites.push(id);
  save();renderDictList();
}

/* ============================================================
   STATS
   ============================================================ */
function renderStats(){
  const acc=S.stats.totalReviews?Math.round(S.stats.correct/S.stats.totalReviews*100):0;
  const words=allWords();
  const counts={new:0,learning:0,medium:0,easy:0};
  words.forEach(w=>{const d=S.srs[cardId(w)];counts[d?d.difficulty:'new']++;});
  const mastered=counts.easy, learning=counts.learning+counts.medium;
  // last 14 days bar chart
  const days=[];for(let i=13;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push(d.toISOString().slice(0,10));}
  const max=Math.max(1,...days.map(d=>S.stats.byDay[d]||0));
  let h=`<div class="page"><div class="topbar"><div><div class="sub">Your progress</div><h1>统计 Stats</h1></div></div>`;
  h+=`<div class="stat-grid">
    <div class="stat"><div class="v" style="color:var(--gold)">${S.streak.count}<small>d</small></div><div class="l">Streak</div></div>
    <div class="stat"><div class="v">${S.stats.totalReviews}</div><div class="l">Total reviews</div></div>
    <div class="stat"><div class="v">${acc}<small>%</small></div><div class="l">Accuracy</div></div>
    <div class="stat"><div class="v" style="color:var(--jade)">${mastered}</div><div class="l">Mastered</div></div>
  </div>`;
  // word maturity breakdown
  h+=`<div class="card"><div class="card-h"><div class="t">Word maturity</div><span class="small">${words.length} total</span></div>`;
  const segs=[['easy','Mastered','var(--jade)'],['medium','Maturing','var(--gold)'],['learning','Learning','var(--verm)'],['new','New','var(--txt3)']];
  const tot=words.length||1;
  h+=`<div style="display:flex;height:14px;border-radius:8px;overflow:hidden;margin-bottom:12px">`;
  segs.forEach(([k,,c])=>{if(counts[k])h+=`<div style="width:${counts[k]/tot*100}%;background:${c}"></div>`;});
  h+=`</div>`;
  segs.forEach(([k,label,c])=>{h+=`<div style="display:flex;justify-content:space-between;font-size:13px;padding:3px 0"><span style="color:var(--txt2)"><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${c};margin-right:7px"></span>${label}</span><b>${counts[k]}</b></div>`;});
  h+=`</div>`;
  // activity chart
  h+=`<div class="card"><div class="card-h"><div class="t">Last 14 days</div></div>
    <div style="display:flex;align-items:flex-end;gap:4px;height:90px">`;
  days.forEach(d=>{const v=S.stats.byDay[d]||0;const hh=Math.round(v/max*80);
    h+=`<div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;height:100%">
      <div style="width:100%;background:${v?'var(--jade)':'var(--bg3)'};height:${Math.max(3,hh)}px;border-radius:3px"></div></div>`;});
  h+=`</div><div class="small center" style="margin-top:8px">reviews per day</div></div>`;
  h+=`</div>`;
  $('#screen').innerHTML=h;
}

/* ============================================================
   SETTINGS
   ============================================================ */
function openSettings(){
  const voices=(typeof _voices!=='undefined'?_voices:[]).filter(v=>/zh|cmn|chinese/i.test(v.lang+v.name));
  modal(`<div class="grip"></div><h3>Settings</h3>
    <div class="field"><label>Daily review goal</label>
      <div class="chips">${[10,20,30,50].map(n=>`<button class="chip ${S.daily.goal===n?'on':''}" onclick="setGoal(${n})">${n}</button>`).join('')}</div></div>
    <div class="field"><label>Pronunciation voice</label>
      ${voices.length?`<select class="inp" onchange="S.settings.voiceURI=this.value;save();speak('你好')">
        <option value="">Auto (best Chinese voice)</option>
        ${voices.map(v=>`<option value="${v.voiceURI}" ${S.settings.voiceURI===v.voiceURI?'selected':''}>${v.name}</option>`).join('')}
      </select>`:`<p class="small">No Chinese voice found on this device. Listening still works if your system adds one later.</p>`}
      <button class="spk-btn" style="margin-top:10px" onclick="speak('你好,我喜欢学中文')">🔊 Test voice</button></div>
    <div class="field"><label>Auto-speak flashcards</label>
      <button class="chip ${S.settings.autoSpeak?'on':''}" onclick="S.settings.autoSpeak=!S.settings.autoSpeak;save();openSettings()">${S.settings.autoSpeak?'On':'Off'}</button></div>
    <div class="divider"></div>
    <div class="field"><label>Gemini API key (optional — example sentences & explanations)</label>
      <input class="inp" id="setKey" value="${S.settings.geminiKey||''}" placeholder="Paste free key from aistudio.google.com">
      <p class="small" style="margin-top:6px">Stored only on this device. Everything else works fully offline without it.</p></div>
    <button class="btn" onclick="saveSettings()">Save</button>
    <button class="btn ghost" style="margin-top:10px" onclick="exportData()">Export my progress</button>
    <button class="btn verm" style="margin-top:10px;background:var(--vermdim);color:var(--verm)" onclick="resetProgress()">Reset all progress</button>
    <p class="small center" style="margin-top:16px">普通话 Study · all data stored locally</p>`);
}
function setGoal(n){S.daily.goal=n;save();openSettings();}
function saveSettings(){const k=$('#setKey');if(k)S.settings.geminiKey=k.value.trim();save();closeModal();toast('Saved','good');}
function exportData(){
  const blob=new Blob([JSON.stringify(S,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='mandarin-progress.json';a.click();
  toast('Progress exported','good');
}
function resetProgress(){
  modal(`<div class="grip"></div><h3>Reset everything?</h3><p class="small">This wipes all SRS progress, streak, favorites and stats. Cannot be undone.</p>
    <button class="btn verm" style="margin-top:16px" onclick="localStorage.removeItem('manda');S=defaultState();save();closeModal();go('home');toast('Reset done','good')">Yes, reset</button>
    <button class="btn ghost" style="margin-top:10px" onclick="openSettings()">Cancel</button>`);
}

/* ============================================================
   IMPORT / CREATE CUSTOM UNIT
   ============================================================ */
function openImport(){
  modal(`<div class="grip"></div><h3>Create a unit</h3>
    <p class="small" style="margin-bottom:14px">Add your own vocabulary. One word per line, in this format:<br>
      <b style="color:var(--jade)">hanzi, pinyin, english</b></p>
    <div class="field"><label>Unit name</label>
      <input class="inp" id="impName" placeholder="e.g. Chapter 6 – Travel"></div>
    <div class="field"><label>Words</label>
      <textarea class="inp" id="impWords" rows="8" placeholder="你好, nǐ hǎo, hello&#10;谢谢, xiè xie, thank you&#10;再见, zài jiàn, goodbye" style="resize:vertical;font-family:'Noto Sans SC',monospace"></textarea></div>
    <button class="btn" onclick="saveImport()">Create unit</button>
    <button class="btn ghost" style="margin-top:10px" onclick="closeModal()">Cancel</button>`);
}
function saveImport(){
  const name=($('#impName').value||'').trim()||'My Unit';
  const raw=($('#impWords').value||'').trim();
  if(!raw){toast('Add some words first','bad');return;}
  const words=[];
  raw.split('\n').forEach(line=>{
    const parts=line.split(/[,，\t]/).map(s=>s.trim()).filter(Boolean);
    if(parts.length>=3)words.push({hanzi:parts[0],pinyin:parts[1],english:parts.slice(2).join(', ')});
    else if(parts.length===2)words.push({hanzi:parts[0],pinyin:'',english:parts[1]});
  });
  if(!words.length){toast('Couldn\'t read any words — check the format','bad');return;}
  const key='custom_'+Date.now();
  S.customUnits[key]={name,words};save();
  if(!selectedUnits.includes(key)){selectedUnits.push(key);saveSel();}
  closeModal();toast(`Added "${name}" — ${words.length} words`,'good');
  renderStudyMenu();
}
function deleteUnit(key){
  modal(`<div class="grip"></div><h3>Delete this unit?</h3><p class="small">Removes your custom words. SRS progress for them is also cleared.</p>
    <button class="btn verm" style="margin-top:14px" onclick="confirmDeleteUnit('${key}')">Delete</button>
    <button class="btn ghost" style="margin-top:10px" onclick="renderUnitPicker()">Cancel</button>`);
}
function confirmDeleteUnit(key){
  delete S.customUnits[key];
  selectedUnits=selectedUnits.filter(k=>k!==key);saveSel();save();
  closeModal();renderUnitPicker();toast('Unit deleted');
}

/* ============================================================
   BOOT
   ============================================================ */
function init(){
  renderNav();
  go('home');
  // register service worker for offline use
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
