// ── Multi-Language Simulation Support ──
// Agents can post in multiple languages during social simulation

export type SimulationLanguage = "id" | "en" | "zh" | "ja" | "ko" | "th" | "vi";

interface LanguageConfig {
  code: SimulationLanguage;
  name: string;
  locale: string;
  postTemplates: Record<string, string[]>;
}

const LANGUAGES: Record<SimulationLanguage, LanguageConfig> = {
  id: {
    code: "id",
    name: "Bahasa Indonesia",
    locale: "id-ID",
    postTemplates: {
      positive: [
        "Perkembangan {topic} sangat menjanjikan! Masa depan cerah. 🚀",
        "Bagus sekali progres di bidang {topic}. Lanjutkan!",
        "Sektor {topic} sedang naik daun. Saatnya investasi! 📈",
      ],
      negative: [
        "Kecewa dengan arah {topic}. Butuh kepemimpinan yang lebih baik.",
        "Situasi {topic} memprihatinkan. Saatnya perubahan.",
        "Tidak percaya dengan kondisi {topic}. Kita layak lebih baik. 😤",
      ],
      neutral: [
        "Perkembangan menarik di {topic}. Mari kita lihat ke depannya.",
        "Mengikuti diskusi {topic} dengan seksama. Sinyal beragam.",
        "Ada baik buruknya di {topic}. Perlu perspektif seimbang.",
      ],
    },
  },
  en: {
    code: "en",
    name: "English",
    locale: "en-US",
    postTemplates: {
      positive: [
        "Great progress on {topic}! The future looks bright. 🚀",
        "Impressed by the latest developments in {topic}. Keep it up!",
        "{topic} is really taking off. Bullish! 📈",
      ],
      negative: [
        "Disappointed with the direction of {topic}. Need better leadership.",
        "{topic} situation is concerning. Time for change.",
        "Can't believe the state of {topic}. We deserve better. 😤",
      ],
      neutral: [
        "Interesting developments in {topic}. Let's see how this plays out.",
        "Following the {topic} conversation closely. Mixed signals.",
        "Some good, some bad in {topic}. Balanced perspective needed.",
      ],
    },
  },
  zh: {
    code: "zh",
    name: "中文",
    locale: "zh-CN",
    postTemplates: {
      positive: [
        "{topic}的进展非常令人鼓舞！前景光明。🚀",
        "对{topic}的最新发展印象深刻。继续保持！",
        "{topic}正在腾飞。看好！📈",
      ],
      negative: [
        "对{topic}的方向感到失望。需要更好的领导。",
        "{topic}的局势令人担忧。是时候改变了。",
        "无法相信{topic}的现状。我们值得更好。😤",
      ],
      neutral: [
        "{topic}的发展很有趣。让我们拭目以待。",
        "正在密切关注{topic}的讨论。信号不一。",
        "{topic}有好有坏。需要平衡的视角。",
      ],
    },
  },
  ja: {
    code: "ja",
    name: "日本語",
    locale: "ja-JP",
    postTemplates: {
      positive: ["{topic}の進展は素晴らしい！未来は明るい。🚀", "{topic}の最新動向に感銘。続けて！", "{topic}は急成長中。強気！📈"],
      negative: ["{topic}の方向性に失望。より良いリーダーシップが必要。", "{topic}の状況は懸念材料。変革の時。", "{topic}の現状は信じられない。😤"],
      neutral: ["{topic}の展開は興味深い。今後に注目。", "{topic}の議論を注視中。シグナルは混在。", "{topic}には良い面も悪い面も。バランスが必要。"],
    },
  },
  ko: {
    code: "ko",
    name: "한국어",
    locale: "ko-KR",
    postTemplates: {
      positive: ["{topic}의 진전이 놀랍습니다! 미래가 밝습니다. 🚀", "{topic}의 최신 발전에 감명받았습니다.", "{topic}이 급성장 중입니다. 강세! 📈"],
      negative: ["{topic}의 방향에 실망했습니다. 더 나은 리더십이 필요합니다.", "{topic} 상황이 우려됩니다. 변화의 시간입니다.", "{topic}의 현 상태를 믿을 수 없습니다. 😤"],
      neutral: ["{topic}의 발전이 흥미롭습니다. 앞으로를 지켜봅시다.", "{topic} 논의를 주시 중입니다. 혼재된 신호.", "{topic}에 좋은 점과 나쁜 점이 있습니다."],
    },
  },
  th: {
    code: "th",
    name: "ภาษาไทย",
    locale: "th-TH",
    postTemplates: {
      positive: ["ความก้าวหน้าของ{topic}ยอดเยี่ยมมาก! อนาคตสดใส 🚀", "ประทับใจกับการพัฒนาล่าสุดใน{topic}", "{topic}กำลังเติบโตอย่างมาก! 📈"],
      negative: ["ผิดหวังกับทิศทางของ{topic} ต้องการผู้นำที่ดีกว่า", "สถานการณ์{topic}น่ากังวล ถึงเวลาเปลี่ยนแปลง", "ไม่น่าเชื่อสภาพของ{topic} 😤"],
      neutral: ["การพัฒนาใน{topic}น่าสนใจ มาดูกันต่อไป", "ติดตามการสนทนา{topic}อย่างใกล้ชิด สัญญาณผสม", "มีทั้งดีและไม่ดีใน{topic}"],
    },
  },
  vi: {
    code: "vi",
    name: "Tiếng Việt",
    locale: "vi-VN",
    postTemplates: {
      positive: ["Tiến triển của {topic} thật tuyệt vời! Tương lai tươi sáng. 🚀", "Ấn tượng với phát triển mới nhất trong {topic}.", "{topic} đang phát triển mạnh mẽ! 📈"],
      negative: ["Thất vọng với hướng đi của {topic}. Cần lãnh đạo tốt hơn.", "Tình hình {topic} đáng lo ngại. Đã đến lúc thay đổi.", "Không thể tin tình trạng của {topic}. 😤"],
      neutral: ["Phát triển thú vị trong {topic}. Hãy xem diễn biến tiếp.", "Đang theo dõi cuộc thảo luận {topic}. Tín hiệu hỗn hợp.", "Có tốt có xấu trong {topic}."],
    },
  },
};

export function getLanguage(lang: SimulationLanguage): LanguageConfig {
  return LANGUAGES[lang] || LANGUAGES.en;
}

export function getDefaultLanguages(region?: string): SimulationLanguage[] {
  if (!region) return ["id", "en"];
  
  const lower = region.toLowerCase();
  if (lower.includes("jawa") || lower.includes("jakarta") || lower.includes("indonesia")) return ["id", "en"];
  if (lower.includes("china") || lower.includes("taiwan")) return ["zh", "en"];
  if (lower.includes("japan")) return ["ja", "en"];
  if (lower.includes("korea")) return ["ko", "en"];
  if (lower.includes("thailand") || lower.includes("thai")) return ["th", "en"];
  if (lower.includes("vietnam")) return ["vi", "en"];
  
  return ["id", "en"];
}

export function generateMultilingualPost(
  lang: SimulationLanguage,
  topic: string,
  sentiment: "positive" | "negative" | "neutral",
): string {
  const language = getLanguage(lang);
  const templates = language.postTemplates[sentiment];
  const template = templates[Math.floor(Math.random() * templates.length)];
  return template.replace(/{topic}/g, topic);
}

export function getAvailableLanguages(): { code: string; name: string }[] {
  return Object.values(LANGUAGES).map(l => ({ code: l.code, name: l.name }));
}
