// 바로가기와 폴더에서 같은 메뉴 객체를 재사용합니다.

export const bossCutMenu = {
    id: "boss-cut",
    type: "app",
    label: "보스컷",
    icon: "/images/menu/boss-cut.png",
    path: "/boss/cut",
    color: "#ef6461",
};

export const starforceMenu = {
    id: "starforce-efficiency",
    type: "app",
    label: "스타포스 효율",
    icon: "/images/menu/starforce.png",
    path: "/starforce",
    color: "#f2b84b",
};

export const potentialMenu = {
    id: "potential-efficiency",
    type: "app",
    label: "잠재 효율",
    icon: "/images/menu/potential.png",
    path: "/cube",
    color: "#9b6de3",
};

export const growthOrderMenu = {
    id: "growth-order",
    type: "app",
    label: "스펙업 순서",
    icon: "/images/menu/growth-order.png",
    path: "/efficiency/growth-order",
    color: "#5b8def",
};

// 앱 메뉴 첫 화면에 바로 보이는 4개
export const quickMenuItems = [
    bossCutMenu,
    starforceMenu,
    potentialMenu,
    growthOrderMenu,
];

// 폴더 메뉴
export const folderMenuItems = [
    {
        id: "boss-folder",
        type: "folder",
        label: "보스",
        icon: "/images/menu/folder-boss.png",
        color: "#ef6461",
        children: [
            bossCutMenu,
            {
                id: "party-boss-cut",
                type: "app",
                label: "파티 보스컷",
                icon: "/images/menu/party-boss.png",
                path: "/boss/party-cut",
                color: "#ec7a76",
            },
            {
                id: "boss-setting",
                type: "app",
                label: "보스 세팅 최적화",
                icon: "/images/menu/boss-setting.png",
                path: "/boss/setting",
                color: "#d95c59",
            },
        ],
    },
    {
        id: "hunting-folder",
        type: "folder",
        label: "사냥",
        icon: "/images/menu/folder-hunting.png",
        color: "#43aa8b",
        children: [
            {
                id: "hunting-setting",
                type: "app",
                label: "사냥 세팅 최적화",
                icon: "/images/menu/hunting-setting.png",
                path: "/hunting/setting",
                color: "#43aa8b",
            },
        ],
    },
    {
        id: "efficiency-folder",
        type: "folder",
        label: "성장 효율",
        icon: "/images/menu/folder-efficiency.png",
        color: "#8b6ce8",
        children: [
            starforceMenu,
            potentialMenu,
            {
                id: "symbol-efficiency",
                type: "app",
                label: "심볼 효율",
                icon: "/images/menu/symbol.png",
                path: "/efficiency/symbol",
                color: "#49a6e9",
            },
            growthOrderMenu,
        ],
    },
    {
        id: "experience-folder",
        type: "folder",
        label: "경험치",
        icon: "/images/menu/folder-experience.png",
        color: "#41a7a5",
        children: [
            {
                id: "experience-calculator",
                type: "app",
                label: "콘텐츠 경험치",
                icon: "/images/menu/experience-calculator.png",
                path: "/experience/calculator",
                color: "#41a7a5",
            },
            {
                id: "hunting-experience",
                type: "app",
                label: "사냥 경험치",
                icon: "/images/menu/hunting-experience.png",
                path: "/experience/hunting",
                color: "#55b88b",
            },
            {
                id: "afk-experience",
                type: "app",
                label: "잠수맵 경험치",
                icon: "/images/menu/afk-experience.png",
                path: "/experience/afk",
                color: "#6198d0",
            },
            {
                id: "treasure-hunter",
                type: "app",
                label: "트레저 헌터",
                icon: "/images/menu/treasure-hunter.png",
                path: "/experience/treasure-hunter",
                color: "#d6a440",
            },
        ],
    },
    {
        id: "ranking-folder",
        type: "folder",
        label: "랭킹",
        icon: "/images/menu/folder-ranking.png",
        color: "#f29e4c",
        children: [
            {
                id: "hexa-ranking",
                type: "app",
                label: "헥사 환산",
                icon: "/images/menu/hexa-ranking.png",
                path: "/ranking/hexa",
                color: "#ba68c8",
            },
            {
                id: "union-champion",
                type: "app",
                label: "유니온 챔피언",
                icon: "/images/menu/union-champion.png",
                path: "/ranking/union-champion",
                color: "#5c8ed8",
            },
            {
                id: "item-ranking",
                type: "app",
                label: "아이템 랭킹",
                icon: "/images/menu/item-ranking.png",
                path: "/ranking/item",
                color: "#dc9450",
            },
        ],
    },
    {
        id: "information-folder",
        type: "folder",
        label: "게임 정보",
        icon: "/images/menu/folder-information.png",
        color: "#607d8b",
        children: [
            {
                id: "boss-information",
                type: "app",
                label: "보스 정보",
                icon: "/images/menu/boss-information.png",
                path: "/information/boss",
                color: "#e26661",
            },
            {
                id: "dojo-information",
                type: "app",
                label: "무릉 정보",
                icon: "/images/menu/dojo-information.png",
                path: "/information/dojo",
                color: "#78909c",
            },
        ],
    },
    {
        id: "coordination-folder",
        type: "folder",
        label: "코디",
        icon: "/images/menu/folder-coordination.png",
        color: "#ec77a8",
        children: [
            {
                id: "character-coordination",
                type: "app",
                label: "캐릭터 코디",
                icon: "/images/menu/character-coordination.png",
                path: "/coordination/character",
                color: "#ec77a8",
            },
        ],
    },
];