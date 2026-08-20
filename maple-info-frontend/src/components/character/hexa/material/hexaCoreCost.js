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

const COST_TABLES = {
    SKILL: SKILL_CORE_COSTS,
    MASTERY: MASTERY_CORE_COSTS,
    ENHANCEMENT:
    ENHANCEMENT_CORE_COSTS,
};

function cost(solErda, fragments) {
    return {
        solErda,
        fragments,
    };
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
        }
    );
}

function clampLevel(level) {
    const numberLevel =
        Number(level) || 0;

    return Math.min(
        MAX_CORE_LEVEL,
        Math.max(
            0,
            Math.floor(numberLevel)
        )
    );
}

function calculatePercent(
    used,
    total
) {
    if (total <= 0) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(
            0,
            (used / total) * 100
        )
    );
}

export function calculateHexaCoreCost(
    core
) {
    const currentLevel =
        clampLevel(core?.level);

    const costs =
        COST_TABLES[core?.type];

    /*
     * 공용 코어와 별도 비용 체계의 신규
     * 스킬 코어는 검증된 표를 추가한 뒤
     * 계산해야 합니다.
     */
    if (!costs) {
        return {
            supported: false,
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
            currentLevel
        )
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
     * 배열 인덱스가 현재 레벨과 같으므로
     * costs[12]는 12→13 비용입니다.
     */
    const next =
        currentLevel <
        MAX_CORE_LEVEL
            ? costs[currentLevel]
            : null;

    return {
        supported: true,

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
                MAX_CORE_LEVEL
            ),

        solErdaPercent:
            calculatePercent(
                used.solErda,
                total.solErda
            ),

        fragmentPercent:
            calculatePercent(
                used.fragments,
                total.fragments
            ),
    };
}

export function formatMaterialNumber(
    value
) {
    return Number(
        value ?? 0
    ).toLocaleString("ko-KR");
}