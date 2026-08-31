import re


JOB_NAMES = [
    "히어로",
    "팔라딘",
    "다크나이트",
    "비숍",
    "나이트로드",
    "섀도어",
    "듀얼블레이드",
    "바이퍼",
    "아델",
    "렌",
    "라라",
    "호영",
    "카인",
    "카데나",
    "아크",
    "제로",
]


BOSS_ALIASES = {
    "하스우": ("스우", "하드"),
    "하드스우": ("스우", "하드"),
    "하드 스우": ("스우", "하드"),

    "노스우": ("스우", "노멀"),
    "노말스우": ("스우", "노멀"),

    "하데미": ("데미안", "하드"),
    "하드데미안": ("데미안", "하드"),
}


def detect_job(text: str):
    for job in JOB_NAMES:
        if job in text:
            return job

    return None


def detect_boss(text: str):

    normalized = text.replace(" ", "")

    for alias, boss_info in BOSS_ALIASES.items():

        if (
            alias.replace(" ", "")
            in normalized
        ):
            return boss_info

    return None, None


def parse_combat_power(text: str):

    patterns = [
        r"전투력\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*억",
        r"전투력\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*만",
    ]

    billion_match = re.search(
        patterns[0],
        text
    )

    if billion_match:

        value = float(
            billion_match.group(1)
        )

        return int(
            value * 100_000_000
        )

    ten_thousand_match = re.search(
        patterns[1],
        text
    )

    if ten_thousand_match:

        value = float(
            ten_thousand_match.group(1)
        )

        return int(
            value * 10_000
        )

    return None


def parse_ratio(text: str):

    patterns = [
        r"배율\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*%",
        r"(\d+(?:\.\d+)?)\s*%\s*배율",
    ]

    for pattern in patterns:

        match = re.search(
            pattern,
            text
        )

        if match:

            return float(
                match.group(1)
            )

    return None


def parse_clear_time(text: str):

    minute_second = re.search(
        r"(\d+)\s*분\s*(\d+)\s*초",
        text
    )

    if minute_second:

        minute = int(
            minute_second.group(1)
        )

        second = int(
            minute_second.group(2)
        )

        return minute * 60 + second

    minute_only = re.search(
        r"(\d+(?:\.\d+)?)\s*분\s*컷",
        text
    )

    if minute_only:

        minute = float(
            minute_only.group(1)
        )

        return int(
            minute * 60
        )

    return None


def parse_result(text: str):

    if any(
        keyword in text
        for keyword in [
            "클리어",
            "격파",
            "솔격",
            "컷",
        ]
    ):
        return "CLEAR"

    if any(
        keyword in text
        for keyword in [
            "타임아웃",
            "시간초과",
            "시간 초과",
        ]
    ):
        return "TIME_OUT"

    if any(
        keyword in text
        for keyword in [
            "데카아웃",
            "데스카운트 아웃",
        ]
    ):
        return "DEATH_OUT"

    return None


def calculate_confidence(
        boss_name,
        job,
        combat_power,
        ratio,
        clear_time,
):

    score = 0.0

    if boss_name:
        score += 0.25

    if job:
        score += 0.25

    if combat_power:
        score += 0.15

    if ratio:
        score += 0.20

    if clear_time:
        score += 0.15

    return round(
        min(score, 1.0),
        4
    )


def parse_candidate(text: str):

    boss_name, difficulty = (
        detect_boss(text)
    )

    job = detect_job(text)

    combat_power = (
        parse_combat_power(text)
    )

    ratio = parse_ratio(text)

    clear_time = (
        parse_clear_time(text)
    )

    result = parse_result(text)

    confidence = calculate_confidence(
        boss_name,
        job,
        combat_power,
        ratio,
        clear_time,
    )

    return {
        "bossName": boss_name,
        "difficulty": difficulty,
        "characterClass": job,
        "combatPower": combat_power,
        "observedBossRatio": ratio,
        "clearTimeSeconds": clear_time,
        "attemptResult": result,
        "parserConfidence": confidence,
    }