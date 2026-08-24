// src/components/menu/MenuItems.js

import bossCutImg from "../../assets/menu/quick/boss-cut.png";
import starforceImg from "../../assets/menu/quick/starforce.png";
import potentialImg from "../../assets/menu/quick/potential.png";
import upgradeOrderImg from "../../assets/menu/quick/upgrade-order.png";

import bossImg from "../../assets/menu/category/boss.png";
import huntingImg from "../../assets/menu/category/hunting.png";
import growthImg from "../../assets/menu/category/growth.png";
import experienceImg from "../../assets/menu/category/experience.png";
import rankingImg from "../../assets/menu/category/ranking.png";
import gameInfoImg from "../../assets/menu/category/game-info.png";
import coordinationImg from "../../assets/menu/category/coordination.png";

/*
 * 바로가기 메뉴
 *
 * 폴더 내부에서도 같은 메뉴 객체를 재사용합니다.
 */

export const bossCutMenu = {
    id: "boss-cut",
    type: "app",
    label: "보스컷",
    icon: bossCutImg,
    path: "/boss/cut",
};

export const starforceMenu = {
    id: "starforce-efficiency",
    type: "app",
    label: "스타포스 효율",
    icon: starforceImg,
    path: "/starforce",
};

export const potentialMenu = {
    id: "potential-efficiency",
    type: "app",
    label: "잠재 효율",
    icon: potentialImg,
    path: "/cube",
};

export const growthOrderMenu = {
    id: "growth-order",
    type: "app",
    label: "스펙업 순서",
    icon: upgradeOrderImg,
    path: "/efficiency/growth-order",
};

/*
 * 전체 메뉴를 열었을 때 상단에 표시되는 4개 메뉴
 */

export const quickMenuItems = [
    bossCutMenu,
    starforceMenu,
    potentialMenu,
    growthOrderMenu,
];

/*
 * 전체 기능 폴더
 *
 * 각 폴더를 선택하면 children에 들어 있는 기능이 출력됩니다.
 * 별도의 이미지를 추가하지 않고 폴더 이미지를 재사용합니다.
 */

export const folderMenuItems = [
    {
        id: "boss-folder",
        type: "folder",
        label: "보스",
        description: "보스 컷과 파티 보스 정보를 확인합니다.",
        icon: bossImg,
        children: [
            bossCutMenu,
            {
                id: "party-boss-cut",
                type: "app",
                label: "파티 보스컷",
                icon: bossImg,
                path: "/boss/party-cut",
            },
            {
                id: "boss-setting",
                type: "app",
                label: "보스 세팅 최적화",
                icon: bossImg,
                path: "/boss/setting",
            },
            {
                id: "boss-scheduler",
                type: "app",
                label: "보스 수익 정산",
                icon: bossImg,
                path: "/boss/scheduler",
            },
        ],
    },
    {
        id: "hunting-folder",
        type: "folder",
        label: "사냥",
        description: "사냥 세팅과 효율 정보를 확인합니다.",
        icon: huntingImg,
        children: [
            {
                id: "hunting-setting",
                type: "app",
                label: "사냥 세팅 최적화",
                icon: huntingImg,
                path: "/hunting/setting",
            },
        ],
    },
    {
        id: "efficiency-folder",
        type: "folder",
        label: "성장 효율",
        description: "캐릭터 성장에 필요한 효율을 계산합니다.",
        icon: growthImg,
        path: "/growth/starforce",
        children: [
            {
                ...starforceMenu,
                path: "/growth/starforce",
            },
            {
                ...potentialMenu,
                path: "/growth/potential",
            },
            {
                id: "symbol-efficiency",
                type: "app",
                label: "심볼 계산",
                icon: growthImg,
                path: "/growth/symbol",
            },
            {
                ...growthOrderMenu,
                path: "/growth/order",
            },
        ],
    },
    {
        id: "experience-folder",
        type: "folder",
        label: "경험치",
        description: "경험치 획득량과 성장 시간을 계산합니다.",
        icon: experienceImg,
        children: [
            {
                id: "hunting-experience",
                type: "app",
                label: "사냥 경험치",
                icon: experienceImg,
                path: "/experience/hunting",
            },
            {
                id: "experience-calculator",
                type: "app",
                label: "상급 EXP 쿠폰 효율",
                icon: experienceImg,
                path: "/experience/coupon",
            },
            {
                id: "afk-experience",
                type: "app",
                label: "잠수맵 경험치",
                icon: experienceImg,
                path: "/experience/afk",
            },
            {
                id: "treasure-hunter",
                type: "app",
                label: "트레저 헌터",
                icon: experienceImg,
                path: "/experience/treasure-hunter",
            },
        ],
    },
    {
        id: "ranking-folder",
        type: "folder",
        label: "랭킹",
        description: "캐릭터와 장비 랭킹을 확인합니다.",
        icon: rankingImg,
        children: [
            {
                id: "hexa-ranking",
                type: "app",
                label: "헥사 환산",
                icon: rankingImg,
                path: "/ranking/hexa",
            },
            {
                id: "union-champion",
                type: "app",
                label: "유니온 챔피언",
                icon: rankingImg,
                path: "/champion",
            },
            {
                id: "item-ranking",
                type: "app",
                label: "아이템 랭킹",
                icon: rankingImg,
                path: "/ranking/item",
            },
        ],
    },
    {
        id: "information-folder",
        type: "folder",
        label: "게임 정보",
        description: "보스와 무릉 관련 정보를 확인합니다.",
        icon: gameInfoImg,
        children: [
            {
                id: "boss-information",
                type: "app",
                label: "보스 정보",
                icon: gameInfoImg,
                path: "/gameinfo/boss",
            },
            {
                id: "dojo-information",
                type: "app",
                label: "무릉 정보",
                icon: gameInfoImg,
                path: "/information/dojo",
            },
        ],
    },
    {
        id: "coordination-folder",
        type: "folder",
        label: "코디",
        description: "캐릭터 코디 정보를 확인합니다.",
        icon: coordinationImg,
        children: [
            {
                id: "character-coordination",
                type: "app",
                label: "캐릭터 코디",
                icon: coordinationImg,
                path: "/coordination/character",
            },
        ],
    },
];