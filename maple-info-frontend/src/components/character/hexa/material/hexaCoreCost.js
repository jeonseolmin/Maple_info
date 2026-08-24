const MAX_CORE_LEVEL = 30;

/*
 * 배열 인덱스는 강화 전 레벨입니다.
 *
 * costs[0]  = 0 → 1 비용
 * costs[1]  = 1 → 2 비용
 * costs[29] = 29 → 30 비용
 */

const SKILL_CORE_COSTS = [
    cost(0, 0),
    cost(1, 30),
    cost(1, 35),
    cost(1, 40),
    cost(2, 45),
    cost(2, 50),
    cost(2, 55),
    cost(3, 60),
    cost(3, 65),
    cost(10, 200),

    cost(3, 80),
    cost(3, 90),
    cost(4, 100),
    cost(4, 110),
    cost(4, 120),
    cost(4, 130),
    cost(4, 140),
    cost(4, 150),
    cost(5, 160),
    cost(15, 350),

    cost(5, 170),
    cost(5, 180),
    cost(5, 190),
    cost(5, 200),
    cost(5, 210),
    cost(6, 220),
    cost(6, 230),
    cost(6, 240),
    cost(7, 250),
    cost(20, 500),
];

/*
 * 두 번째 스킬 코어
 *
 * 오리진 비용표와 동일하지만
 * 0 → 1 활성화 비용이 5 / 100입니다.
 */
const ASCENT_SKILL_CORE_COSTS = [
    cost(5, 100),
    cost(1, 30),
    cost(1, 35),
    cost(1, 40),
    cost(2, 45),
    cost(2, 50),
    cost(2, 55),
    cost(3, 60),
    cost(3, 65),
    cost(10, 200),

    cost(3, 80),
    cost(3, 90),
    cost(4, 100),
    cost(4, 110),
    cost(4, 120),
    cost(4, 130),
    cost(4, 140),
    cost(4, 150),
    cost(5, 160),
    cost(15, 350),

    cost(5, 170),
    cost(5, 180),
    cost(5, 190),
    cost(5, 200),
    cost(5, 210),
    cost(6, 220),
    cost(6, 230),
    cost(6, 240),
    cost(7, 250),
    cost(20, 500),
];

/*
 * 2026년 7월 추가된 세 번째 스킬 코어
 *
 * 총합:
 * 솔 에르다 117
 * 솔 에르다 조각 3,442
 */
const THIRD_SKILL_CORE_COSTS = [
    cost(7, 140),
    cost(1, 21),
    cost(1, 26),
    cost(1, 30),
    cost(1, 34),
    cost(2, 38),
    cost(2, 43),
    cost(2, 47),
    cost(2, 51),
    cost(8, 142),

    cost(2, 62),
    cost(2, 69),
    cost(3, 77),
    cost(3, 83),
    cost(3, 91),
    cost(3, 98),
    cost(3, 105),
    cost(3, 112),
    cost(3, 120),
    cost(12, 252),

    cost(4, 128),
    cost(4, 136),
    cost(4, 145),
    cost(4, 152),
    cost(4, 161),
    cost(4, 168),
    cost(5, 177),
    cost(5, 184),
    cost(5, 193),
    cost(14, 357),
];

const MASTERY_CORE_COSTS = [
    cost(3, 50),
    cost(1, 15),
    cost(1, 18),
    cost(1, 20),
    cost(1, 23),
    cost(1, 25),
    cost(1, 28),
    cost(1, 30),
    cost(2, 33),
    cost(5, 100),

    cost(2, 40),
    cost(2, 45),
    cost(2, 50),
    cost(2, 55),
    cost(2, 60),
    cost(2, 65),
    cost(2, 70),
    cost(2, 75),
    cost(2, 80),
    cost(8, 175),

    cost(3, 85),
    cost(3, 90),
    cost(3, 95),
    cost(3, 100),
    cost(3, 105),
    cost(3, 110),
    cost(3, 115),
    cost(3, 120),
    cost(3, 125),
    cost(10, 250),
];

const ENHANCEMENT_CORE_COSTS = [
    cost(4, 75),
    cost(1, 23),
    cost(1, 27),
    cost(1, 30),
    cost(2, 34),
    cost(2, 38),
    cost(2, 42),
    cost(3, 45),
    cost(3, 49),
    cost(8, 150),

    cost(3, 60),
    cost(3, 68),
    cost(3, 75),
    cost(3, 83),
    cost(3, 90),
    cost(3, 98),
    cost(3, 105),
    cost(3, 113),
    cost(4, 120),
    cost(12, 263),

    cost(4, 128),
    cost(4, 135),
    cost(4, 143),
    cost(4, 150),
    cost(4, 158),
    cost(5, 165),
    cost(5, 173),
    cost(5, 180),
    cost(6, 188),
    cost(15, 375),
];

/*
 * 솔 야누스 / 솔 헤카테 공용 코어 비용표
 */
const COMMON_STANDARD_CORE_COSTS = [
    cost(7, 125),
    cost(2, 38),
    cost(2, 44),
    cost(2, 50),
    cost(3, 57),
    cost(3, 63),
    cost(3, 69),
    cost(5, 75),
    cost(5, 82),
    cost(14, 300),

    cost(5, 110),
    cost(5, 124),
    cost(6, 138),
    cost(6, 152),
    cost(6, 165),
    cost(6, 179),
    cost(6, 193),
    cost(6, 207),
    cost(7, 220),
    cost(17, 525),

    cost(7, 234),
    cost(7, 248),
    cost(7, 262),
    cost(7, 275),
    cost(7, 289),
    cost(9, 303),
    cost(9, 317),
    cost(9, 330),
    cost(10, 344),
    cost(20, 750),
];

/*
 * 5차 공용 스킬 강화 코어 비용표
 */
const COMMON_BOOST_CORE_COSTS = [
    cost(4, 90),
    cost(1, 25),
    cost(1, 30),
    cost(1, 35),
    cost(2, 40),
    cost(2, 45),
    cost(2, 50),
    cost(3, 55),
    cost(3, 60),
    cost(9, 180),

    cost(3, 73),
    cost(3, 81),
    cost(3, 90),
    cost(3, 98),
    cost(4, 107),
    cost(4, 115),
    cost(4, 124),
    cost(4, 132),
    cost(4, 141),
    cost(14, 315),

    cost(4, 151),
    cost(5, 160),
    cost(5, 170),
    cost(5, 179),
    cost(5, 189),
    cost(5, 198),
    cost(5, 208),
    cost(5, 217),
    cost(6, 227),
    cost(18, 450),
];

const COST_TYPE = {
    ORIGIN_SKILL: "ORIGIN_SKILL",
    ASCENT_SKILL: "ASCENT_SKILL",
    THIRD_SKILL: "THIRD_SKILL",
    MASTERY: "MASTERY",
    ENHANCEMENT: "ENHANCEMENT",
    COMMON_STANDARD: "COMMON_STANDARD",
    COMMON_BOOST: "COMMON_BOOST",
};

const COST_TABLES = {
    [COST_TYPE.ORIGIN_SKILL]:
    SKILL_CORE_COSTS,

    [COST_TYPE.ASCENT_SKILL]:
    ASCENT_SKILL_CORE_COSTS,

    [COST_TYPE.THIRD_SKILL]:
    THIRD_SKILL_CORE_COSTS,

    [COST_TYPE.MASTERY]:
    MASTERY_CORE_COSTS,

    [COST_TYPE.ENHANCEMENT]:
    ENHANCEMENT_CORE_COSTS,

    [COST_TYPE.COMMON_STANDARD]:
    COMMON_STANDARD_CORE_COSTS,

    [COST_TYPE.COMMON_BOOST]:
    COMMON_BOOST_CORE_COSTS,
};

function resolveCommonCostType(core) {
    const coreName = normalizeText(
        core?.name,
    );

    if (
        coreName.includes("솔야누스") ||
        coreName.includes("솔헤카테")
    ) {
        return COST_TYPE.COMMON_STANDARD;
    }

    return COST_TYPE.COMMON_BOOST;
}

/*
 * API 배열에서 SKILL 코어가 들어온 순서를 기준으로
 * 각각의 비용 체계를 지정합니다.
 */
export function assignHexaCostTypes(
    cores = [],
) {
    let skillCoreIndex = 0;

    return cores.map((core) => {
        const coreType =
            resolveCoreType(core);

        let costType = null;

        if (coreType === "SKILL") {
            if (skillCoreIndex === 0) {
                costType =
                    COST_TYPE.ORIGIN_SKILL;
            } else if (
                skillCoreIndex === 1
            ) {
                costType =
                    COST_TYPE.ASCENT_SKILL;
            } else {
                costType =
                    COST_TYPE.THIRD_SKILL;
            }

            skillCoreIndex += 1;
        }

        if (coreType === "MASTERY") {
            costType =
                COST_TYPE.MASTERY;
        }

        if (
            coreType === "ENHANCEMENT"
        ) {
            costType =
                COST_TYPE.ENHANCEMENT;
        }

        if (coreType === "COMMON") {
            costType =
                resolveCommonCostType(core);
        }

        return {
            ...core,
            costType,
        };
    });
}
function cost(solErda, fragments) {
    return {
        solErda,
        fragments,
    };
}

function normalizeText(value) {
    return String(value ?? "")
        .replace(/\s+/g, "")
        .toUpperCase();
}

/*
 * 백엔드에서 UNKNOWN이 넘어오더라도
 * originalType을 이용해 다시 유형을 판단합니다.
 */
function resolveCoreType(core) {
    const type = normalizeText(core?.type);

    if (
        type === "SKILL" ||
        type === "MASTERY" ||
        type === "ENHANCEMENT" ||
        type === "COMMON"
    ) {
        return type;
    }

    const originalType = normalizeText(
        core?.originalType,
    );

    if (originalType.includes("마스터리")) {
        return "MASTERY";
    }

    if (originalType.includes("강화")) {
        return "ENHANCEMENT";
    }

    if (
        originalType.includes("공용") ||
        originalType.includes("공통")
    ) {
        return "COMMON";
    }

    if (
        originalType.includes("스킬") ||
        originalType.includes("오리진")
    ) {
        return "SKILL";
    }

    return "UNKNOWN";
}

function resolveCostTable(core) {
    return COST_TABLES[
        core?.costType
        ] ?? null;
}

function sumCosts(costs) {
    return costs.reduce(
        (total, current) => ({
            solErda:
                total.solErda +
                current.solErda,

            fragments:
                total.fragments +
                current.fragments,
        }),
        {
            solErda: 0,
            fragments: 0,
        },
    );
}

function clampLevel(level) {
    const numberLevel =
        Number(level) || 0;

    return Math.min(
        MAX_CORE_LEVEL,
        Math.max(
            0,
            Math.floor(numberLevel),
        ),
    );
}

function calculatePercent(
    used,
    total,
) {
    if (total <= 0) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(
            0,
            (used / total) * 100,
        ),
    );
}

export function calculateHexaCoreCost(
    core,
) {
    const currentLevel =
        clampLevel(core?.level);

    const coreType =
        resolveCoreType(core);

    const costs =
        resolveCostTable(core);

    if (!costs) {
        return {
            supported: false,
            coreType,
            coreName:
                core?.name ?? "",
            currentLevel,
            maxLevel:
            MAX_CORE_LEVEL,
        };
    }

    /*
     * 현재 레벨까지 사용한 비용입니다.
     *
     * Lv.12이면:
     * 0→1부터 11→12까지 합산합니다.
     */
    const used = sumCosts(
        costs.slice(
            0,
            currentLevel,
        ),
    );

    const total =
        sumCosts(costs);

    const remaining = {
        solErda:
            total.solErda -
            used.solErda,

        fragments:
            total.fragments -
            used.fragments,
    };

    /*
     * costs[현재 레벨]은
     * 현재 레벨에서 다음 레벨까지의 비용입니다.
     */
    const next =
        currentLevel <
        MAX_CORE_LEVEL
            ? costs[currentLevel]
            : null;

    return {
        supported: true,

        coreType,
        coreName:
            core?.name ?? "",

        currentLevel,
        maxLevel:
        MAX_CORE_LEVEL,

        used,
        total,
        remaining,
        next,

        levelPercent:
            calculatePercent(
                currentLevel,
                MAX_CORE_LEVEL,
            ),

        solErdaPercent:
            calculatePercent(
                used.solErda,
                total.solErda,
            ),

        fragmentPercent:
            calculatePercent(
                used.fragments,
                total.fragments,
            ),
    };
}

export function formatMaterialNumber(
    value,
) {
    return Number(
        value ?? 0,
    ).toLocaleString("ko-KR");
}