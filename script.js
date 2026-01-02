const cellLore = {
    0: "北宋范寬的神作《谿山行旅圖》，我們從山腳出發。",
    1: "范寬（十世紀），本名中正，性格溫厚大度。人稱「性緩為寬」。",
    2: "「與其師人，不若師諸造化」。范寬領悟到大自然才是最好的老師。",
    3: "他隱居在終南、太華山，每日「危坐終日，縱目四顧」以求山水真趣。",
    4: "【細節】在右側車隊後方樹蔭下，藏有「范寬」二字的極小簽名！",
    5: "【構圖】巨石、行旅、崇山「三段式」比例，讓大山顯得無比威嚴。",
    6: "【細節】路側馬隊雖然如蟻，卻增添了畫面如臨其境的動感。",
    7: "【細節】山凹處藏有蘭若（寺院），展現深山藏古寺的禪意。",
    8: "筆勢雄厚，寫出「山之真骨」。范寬的筆跡給人撲人眉宇的震撼。",
    9: "山腰間的雲氣升騰，拉開了空間感，成功創造出深遠的意境。",
    10: "舉止疏野、風儀峭古。范寬與李成、關仝並稱北宋三大家。",
    11: "此畫是范寬唯一真蹟，被公認為宋代山水畫的最高形象。",
    12: "【印記】董其昌題跋：「北宗范中立谿山行旅圖」。",
    13: "【印記】左下角蓋有「忠孝之家」印，紀錄其流傳歷史。",
    14: "【印記】曾收錄於乾隆皇帝《石渠寶笈》初編。",
    15: "行旅圓滿。您已領悟范寬師法自然的藝術哲學。"
};

const zoomMap = {
    4: { s: 4, x: "40%", y: "45%", n: "發現范寬簽名" },
    6: { s: 3, x: "-20%", y: "35%", n: "觀察行旅馬隊" },
    7: { s: 3, x: "35%", y: "-10%", n: "眺望深山蘭若" }
};
const sealTriggers = { 4: "seal-signature", 12: "seal-dong", 13: "seal-family", 14: "seal-palace" };

let current = 0;
let moving = false;

function log(msg) {
    const el = document.getElementById('gameLog');
    const li = document.createElement('li');
    li.innerHTML = `> ${msg}`;
    el.prepend(li);
}

function updateVisual(idx) {
    const art = document.getElementById('mainArt');
    const tag = document.getElementById('zoomTag');
    const config = zoomMap[idx];

    if (config) {
        art.style.transform = `scale(${config.s}) translate(${config.x}, ${config.y})`;
        tag.innerText = `🔍 ${config.n}`;
        tag.style.display = "block";
        log(`<span style="color:red">事件：${config.n}</span>`);
    } else {
        art.style.transform = "scale(1) translate(0, 0)";
        tag.style.display = "none";
    }

    if (sealTriggers[idx]) {
        const el = document.getElementById(sealTriggers[idx]);
        if (!el.classList.contains('collected')) {
            el.classList.add('collected');
            log(`<span style="color:red">收集：獲得「${el.innerText}」印章</span>`);
        }
    }
}

function showModal(title, body) {
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalBody').innerText = body;
    document.getElementById('infoModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('infoModal').style.display = 'none';
}

async function go(steps) {
    moving = true;
    document.getElementById('rollBtn').disabled = true;
    
    for (let i = 0; i < steps; i++) {
        const cells = document.querySelectorAll('.cell');
        cells[current].classList.remove('active');
        current = (current + 1) % 16;
        cells[current].classList.add('active');
        
        const name = cells[current].querySelector('div:nth-child(3)').innerText;
        document.getElementById('current-location').innerText = name;
        log(`行走：路過 ${name}`);
        await new Promise(r => setTimeout(r, 200));
    }

    moving = false;
    document.getElementById('rollBtn').disabled = false;
    const finalCell = document.querySelectorAll('.cell')[current];
    const finalName = finalCell.querySelector('div:nth-child(3)').innerText;
    
    log(`<b>停留：${finalName}</b>`);
    updateVisual(current);
    
    // 強制觸發彈窗
    showModal(finalName, cellLore[current]);
}

document.getElementById('rollBtn').onclick = () => {
    if (moving) return;
    const r = Math.floor(Math.random() * 6) + 1;
    document.getElementById('dice-result').innerText = `(${r})`;
    log(`<b>【擲骰】點數為 ${r}</b>`);
    go(r);
    document.getElementById('total-steps').innerText = parseInt(document.getElementById('total-steps').innerText) + 1;
};