const TFT_DATA = {
    champions: [
        { id: "yi", name: "마스터 이", cost: 4, traits: ["우주 신", "브룰러"], img: "https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/MasterYi.png" },
        { id: "kaisa", name: "카이사", cost: 4, traits: ["우주 그루빈", "정찰대"], img: "https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/Kaisa.png" },
        { id: "urgot", name: "우르고트", cost: 3, traits: ["조정자", "난동꾼"], img: "https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/Urgot.png" },
        { id: "corki", name: "코르키", cost: 2, traits: ["미플", "포병대"], img: "https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/Corki.png" },
        { id: "lux", name: "럭스", cost: 1, traits: ["우주 신", "요술사"], img: "https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/Lux.png" },
        { id: "sett", name: "세트", cost: 5, traits: ["우주 신", "거상"], img: "https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/Sett.png" },
        { id: "ezreal", name: "이즈리얼", cost: 3, traits: ["우주 그루빈", "요술사"], img: "https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/Ezreal.png" },
        { id: "blitzcrank", name: "블리츠크랭크", cost: 1, traits: ["미플", "선봉대"], img: "https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/Blitzcrank.png" },
        { id: "leona", name: "레오나", cost: 3, traits: ["조정자", "수호자"], img: "https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/Leona.png" },
        { id: "jinx", name: "징크스", cost: 4, traits: ["미플", "정찰대"], img: "https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/Jinx.png" },
        { id: "yasuo", name: "야스오", cost: 5, traits: ["조정자", "학살자"], img: "https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/Yasuo.png" },
        { id: "nami", name: "나미", cost: 2, traits: ["우주 그루빈", "수호자"], img: "https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/Nami.png" }
    ],
    traits: {
        "우주 신": { levels: [3, 5, 7], desc: "우주 신의 축복을 받아 능력치가 상승합니다." },
        "우주 그루빈": { levels: [2, 4, 6], desc: "그루브 리듬에 맞춰 공격 속도가 증가합니다." },
        "조정자": { levels: [2, 4], desc: "전장의 흐름을 조정하여 피해량을 증폭시킵니다." },
        "미플": { levels: [3, 5, 7], desc: "작은 미플들이 함께 싸우며 추가 피해를 입힙니다." },
        "브룰러": { levels: [2, 4, 6], desc: "체력이 크게 증가합니다." },
        "정찰대": { levels: [2, 4], desc: "공격 시 일정 확률로 치명타가 발생합니다." },
        "요술사": { levels: [3, 5, 7], desc: "주문력이 증가하고 스킬을 두 번 사용합니다." },
        "난동꾼": { levels: [2, 4, 6], desc: "추가 체력을 얻습니다." },
        "포병대": { levels: [2, 4, 6], desc: "매 5번째 공격마다 폭발적인 피해를 입힙니다." },
        "거상": { levels: [1, 2], desc: "몸집이 커지며 받는 피해가 감소합니다." },
        "선봉대": { levels: [2, 4, 6], desc: "방어력이 증가합니다." },
        "수호자": { levels: [2, 4, 6], desc: "보호막을 생성합니다." },
        "학살자": { levels: [2, 4, 6], desc: "생명력 흡수를 얻고 체력이 낮은 적에게 추가 피해를 입힙니다." }
    },
    decks: [
        { 
            name: "6 우주 신 마스터 이", 
            tier: "S", 
            units: ["yi", "lux", "sett", "blitzcrank", "leona", "nami", "ezreal", "yasuo"],
            description: "마스터 이의 강력한 고정 피해와 우주 신의 축복을 활용하는 덱입니다." 
        },
        { 
            name: "4 조정자 야스오 캐리", 
            tier: "S", 
            units: ["yasuo", "leona", "urgot", "yi", "sett", "lux", "ezreal"],
            description: "야스오를 중심으로 조정자 시너지를 극대화하여 적을 섬멸합니다." 
        },
        { 
            name: "미플 정찰대 징크스", 
            tier: "A", 
            units: ["jinx", "corki", "blitzcrank", "kaisa", "nami", "ezreal"],
            description: "징크스와 코르키의 광역 피해로 적진을 붕괴시킵니다." 
        },
        { 
            name: "우주 그루빈 카이사", 
            tier: "S", 
            units: ["kaisa", "nami", "ezreal", "lux", "yi", "sett"],
            description: "카이사의 빠른 공격 속도와 유틸리티를 활용한 고밸류 덱입니다." 
        },
        { 
            name: "조정자 난동꾼 우르고트", 
            tier: "B", 
            units: ["urgot", "leona", "blitzcrank", "sett", "yi"],
            description: "우르고트의 탱킹력과 조정자의 보조 피해를 활용합니다." 
        }
    ]
};

export default TFT_DATA;
