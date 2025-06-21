let container = document.getElementById("qwen-box");
let button = document.getElementById("qwen-button");
function game_out(text) {
    container.innerHTML += "<p>" + text + "</p>";
}

// 角色设定
const protagonist = "小雅";
let age = 10;
const identity = "白天是普通小学生，晚上是秘密刺客";
const injuries = ["踝关节脱位", "脚踝骨折", "韧带撕裂"];
const emotions = ["坚强", "隐忍", "愤怒", "恐惧", "绝望"];

// 脚伤相关事件库
const injuryEvents = [
    "被同学推下楼梯导致脚踝骨折",
    "夜间执行任务时踩空摔落，脚踝严重扭伤",
    "学校体育课跳马失误，脚踝当场变形",
    "刺客训练中动作失误，落地不稳造成脱臼",
    "被恶霸围堵在厕所，脚踝被故意掰断",
    "躲避敌人追捕时从屋顶跃下，脚踝承受过大冲击",
    "复健过程中偷练高难度动作，导致旧伤复发"
];

// 生活影响分类
const lifeImpacts = {
    school: [
        "被同学嘲笑走路姿势",
        "体育课只能旁观",
        "被老师误解为懒惰",
        "被坏学生绊倒"
    ],
    training: [
        "刺客动作无法完成",
        "夜间潜行时发出声响",
        "被师傅责备进度缓慢",
        "被迫使用辅助工具练习"
    ],
    mission: [
        "在任务中被敌人发现",
        "目标逃脱，任务失败",
        "隐藏身份险些暴露",
        "不得不放弃重要刺杀机会"
    ],
    recovery: [
        "每天早晚做复健拉伸",
        "偷偷注射止痛剂继续训练",
        "夜里独自哭泣不敢出声",
        "梦见自己再也无法奔跑"
    ]
};

// 结局类型
const endings = {
    retired: `${protagonist}因多次重伤，身体已无法胜任刺客工作，被迫退役。`,
    exposed: `${protagonist}在一次任务中身份暴露，最终被捕或失踪。`,
    broken: `${protagonist}精神崩溃，选择了自我了结……`,
    survived: `${protagonist}虽然残废，但仍在暗影中坚持着自己的使命。`,
    forgotten: `${protagonist}被组织抛弃，成为无人知晓的过去。`
};

// 属性追踪
let stats = {
    health: 100,         // 健康值
    sanity: 100,         // 精神值
    trust: 80,           // 组织信任度
    recoveryProgress: 0, // 复健进度
    injured: false,
    stage: "childhood"   // 成长阶段：childhood, adolescence, youth
};

function applyInjury() {
    const injuryEvent = injuryEvents[Math.floor(Math.random() * injuryEvents.length)];
    game_out(`⚠️ 悲剧发生：${injuryEvent}`);

    stats.health -= Math.floor(Math.random() * 21) + 10;
    stats.sanity -= Math.floor(Math.random() * 16) + 5;

    if (injuryEvent.includes("骨折") || injuryEvent.includes("掰断")) {
        stats.health -= 10;
    }

    if (injuryEvent.includes("刺客") || injuryEvent.includes("屋顶")) {
        stats.trust -= 10;
    }

    stats.injured = true;
    game_out(`💔 当前健康值：${stats.health} | 精神值：${stats.sanity} | 信任度：${stats.trust}\n`);
}

function simulateDay(day) {
    game_out(`📅 第${day}天`);

    // 随机是否发生新的脚伤事件
    if (Math.random() < 0.2) {
        applyInjury();
    }

    // 学校部分
    const schoolEvent = lifeImpacts.school[Math.floor(Math.random() * lifeImpacts.school.length)];
    game_out(`在学校：${schoolEvent}`);

    // 复健部分
    const recoveryEvent = lifeImpacts.recovery[Math.floor(Math.random() * lifeImpacts.recovery.length)];
    game_out(`在家复健：${recoveryEvent}`);

    // 刺客训练
    const trainingEvent = lifeImpacts.training[Math.floor(Math.random() * lifeImpacts.training.length)];
    game_out(`刺客训练：${trainingEvent}`);

    // 是否执行任务
    if (Math.random() > 0.6) {
        const missionEvent = lifeImpacts.mission[Math.floor(Math.random() * lifeImpacts.mission.length)];
        game_out(`夜间任务：${missionEvent}`);
        if (missionEvent.includes("失败") || missionEvent.includes("暴露")) {
            stats.trust -= 10;
            game_out("⚠️ 任务失败，组织可能会重新评估她的能力……");
        }
    } else {
        game_out("今晚没有任务。");
    }

    // 心情总结
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    game_out(`【${protagonist}的心情】今天她感到：${emotion}`);

    // 随机事件（希望或打击）
    if (Math.random() < 0.3) {
        const hopeEvent = [
            "师傅悄悄送来了新的护踝装备",
            "她在梦中回忆起最初的信念",
            "一个匿名快递送来鼓励信",
            "医生说伤势有好转迹象"
        ][Math.floor(Math.random() * 4)];
        game_out(`✨ 希望之光：${hopeEvent}`);
    } else {
        const setbackEvent = [
            "旧伤复发，再次住院",
            "刺客身份差点被同学发现",
            "训练中再次扭伤另一只脚",
            "父母开始怀疑她夜间的异常"
        ][Math.floor(Math.random() * 4)];
        game_out(`⚠️ 打击事件：${setbackEvent}`);
    }
}

function checkEndings() {
    if (stats.health <= 0) return "retired";
    if (stats.sanity <= 0) return "broken";
    if (stats.trust <= 0) return "exposed";
    if (stats.recoveryProgress >= 100) return "survived";
    return null;
}

let day = 1;
let has_ended = false;
function qwen_main() {
    button.innerHTML = "继续冒险";
    if (has_ended) {
        day = 1;
        stats = {
            health: 100,
            sanity: 100,
            trust: 80,
            recoveryProgress: 0,
            injured: false,
            stage: "childhood"
        };
        has_ended = false;
        container.innerHTML = "";
    }
    simulateDay(day);
    container.innerHTML += "<br>";
    const ending = checkEndings();
    if (ending) {
        game_out("===命 运 的 终 章===");
        game_out(endings[ending]);
        has_ended = true;
        button.innerHTML = "重新开始冒险";
    }
    day += 1;
}
