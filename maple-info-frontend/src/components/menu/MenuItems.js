import bossImg from '../../images/boss.png';
import cubeImg from '../../images/cube.png';
import equipImg from '../../images/equip.png';
import expCouponImg from '../../images/exp-coupon.png';
import expImg from '../../images/exp.png';
import hexaImg from '../../images/hexa.png';
import huntImg from '../../images/hunt.png';
import mesoImg from '../../images/meso.png';
import partybossImg from '../../images/partyboss.png';
import rankingImg from '../../images/ranking.png';
import starforceImg from '../../images/starforce.png';
import symbolImg from '../../images/symbol.png';
import treasureImg from '../../images/treasure.png';
import unionImg from '../../images/union.png';
import vipExpImg from '../../images/vipexp.png';
import solImg from '../../images/sol.png';
import boss100Img from '../../images/boss100.png';
import bosscutImg from '../../images/bosscut.png';
import itemrankImg from '../../images/itemrank.png';
import huntsetImg from '../../images/huntset.png';
import mapleImg from '../../images/maple.png';
import coordiImg from '../../images/coordi.png';
import mulungImg from '../../images/mulung.png';
import coordiaImg from '../../images/coordia.png';



// 바로가기와 폴더에서 같은 메뉴 객체를 재사용합니다.

export const bossCutMenu = {
    id: "boss-cut",
    type: "app",
    label: "보스컷",
    icon: bosscutImg,
    path: "/boss/cut",
    color: "#ef6461",
};

export const starforceMenu = {
    id: "starforce-efficiency",
    type: "app",
    label: "스타포스 효율",
    icon: starforceImg,
    path: "/starforce",
    color: "#f2b84b",
};

export const potentialMenu = {
    id: "potential-efficiency",
    type: "app",
    label: "잠재 효율",
    icon: cubeImg,
    path: "/cube",
    color: "#9b6de3",
};

export const growthOrderMenu = {
    id: "growth-order",
    type: "app",
    label: "스펙업 순서",
    icon: solImg,
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
        icon: bossImg,
        color: "#ef6461",
        children: [
            bossCutMenu,
            {
                id: "party-boss-cut",
                type: "app",
                label: "파티 보스컷",
                icon: partybossImg,
                path: "/boss/party-cut",
                color: "#ec7a76",
            },
            {
                id: "boss-setting",
                type: "app",
                label: "보스 세팅 최적화",
                icon: boss100Img,
                path: "/boss/setting",
                color: "#d95c59",
            },
            {
                id: "boss-scheduler",
                type: "app",
                label: "보스 수익 정산",
                icon: mesoImg,
                path: "/boss/scheduler",
                color: "#d95c59",
            },
        ],
    },
    {
        id: "hunting-folder",
        type: "folder",
        label: "사냥",
        icon: huntImg,
        color: "#43aa8b",
        children: [
            {
                id: "hunting-setting",
                type: "app",
                label: "사냥 세팅 최적화",
                icon: huntsetImg,
                path: "/hunting/setting",
                color: "#43aa8b",
            },
        ],
    },
    {
        id: "efficiency-folder",
        type: "folder",
        label: "성장 효율",
        icon: equipImg,
        color: "#8b6ce8",
        children: [
            starforceMenu,
            potentialMenu,
            {
                id: "symbol-efficiency",
                type: "app",
                label: "심볼 효율",
                icon: symbolImg,
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
        icon: expImg,
        color: "#41a7a5",
        children: [
            {
                id: "hunting-experience",
                type: "app",
                label: "사냥 경험치",
                icon: huntImg,
                path: "/experience/hunting",
                color: "#55b88b",
            },
            {
                id: "experience-calculator",
                type: "app",
                label: "상급 EXP 쿠폰 효율",
                icon: expCouponImg,
                path: "/experience/coupon",
                color: "#41a7a5",
            },
            {
                id: "afk-experience",
                type: "app",
                label: "잠수맵 경험치",
                icon: vipExpImg,
                path: "/experience/afk",
                color: "#6198d0",
            },
            {
                id: "treasure-hunter",
                type: "app",
                label: "트레저 헌터",
                icon: treasureImg,
                path: "/experience/treasure-hunter",
                color: "#d6a440",
            },
        ],
    },
    {
        id: "ranking-folder",
        type: "folder",
        label: "랭킹",
        icon: rankingImg,
        color: "#f29e4c",
        children: [
            {
                id: "hexa-ranking",
                type: "app",
                label: "헥사 환산",
                icon: hexaImg,
                path: "/ranking/hexa",
                color: "#ba68c8",
            },
            {
                id: "union-champion",
                type: "app",
                label: "유니온 챔피언",
                icon: unionImg,
                path: "/ranking/union-champion",
                color: "#5c8ed8",
            },
            {
                id: "item-ranking",
                type: "app",
                label: "아이템 랭킹",
                icon: itemrankImg,
                path: "/ranking/item",
                color: "#dc9450",
            },
        ],
    },
    {
        id: "information-folder",
        type: "folder",
        label: "게임 정보",
        icon: mapleImg,
        color: "#607d8b",
        children: [
            {
                id: "boss-information",
                type: "app",
                label: "보스 정보",
                icon: bossImg,
                path: "/information/boss",
                color: "#e26661",
            },
            {
                id: "dojo-information",
                type: "app",
                label: "무릉 정보",
                icon: mulungImg,
                path: "/information/dojo",
                color: "#78909c",
            },
        ],
    },
    {
        id: "coordination-folder",
        type: "folder",
        label: "코디",
        icon: coordiImg,
        color: "#ec77a8",
        children: [
            {
                id: "character-coordination",
                type: "app",
                label: "캐릭터 코디",
                icon: coordiaImg,
                path: "/coordination/character",
                color: "#ec77a8",
            },
        ],
    },
];