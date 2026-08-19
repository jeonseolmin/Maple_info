export function normalizeSkillName(name) {
    if (!name) return "";

    return name
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/vi/g, "")
        .replace(/hexa/g, "")
        .replace(/헥사/g, "")
        .replace(/마스터리코어/g, "")
        .replace(/강화코어/g, "")
        .replace(/스킬코어/g, "")
        .replace(/공용코어/g, "")
        .replace(/공통코어/g, "")
        .replace(/마스터리/g, "")
        .replace(/강화/g, "")
        .replace(/코어/g, "")
        .replace(/[:\-()[\]{}]/g, "")
        .trim();
}

export function mergeLinkedCores(cores = []) {
    const coreMap = new Map();

    for (const core of cores) {
        if (!core) continue;

        const key = `${core.type ?? "UNKNOWN"}::${core.name ?? "이름 없음"}`;
        const savedCore = coreMap.get(key);

        if (!savedCore) {
            coreMap.set(key, {
                ...core,
                linkedSkillIds: [...new Set(core.linkedSkillIds ?? [])],
            });
            continue;
        }

        coreMap.set(key, {
            ...savedCore,
            level: Math.max(savedCore.level ?? 0, core.level ?? 0),
            maxLevel: savedCore.maxLevel || core.maxLevel,
            linkedSkillIds: [
                ...new Set([
                    ...(savedCore.linkedSkillIds ?? []),
                    ...(core.linkedSkillIds ?? []),
                ]),
            ],
        });
    }

    return [...coreMap.values()];
}

export function resolveCoreSkills(core, skills = []) {
    if (!core) return [];

    const coreName = normalizeSkillName(core.name);
    const linkedNames = (core.linkedSkillIds ?? []).map(normalizeSkillName);

    return skills.filter((skill) => {
        const skillName = normalizeSkillName(skill.name);
        if (!skillName) return false;

        return (
            skillName === coreName ||
            coreName.includes(skillName) ||
            skillName.includes(coreName) ||
            linkedNames.includes(skillName)
        );
    });
}

export function findCoreIcon(core, skills = []) {
    return resolveCoreSkills(core, skills).find((skill) => skill.icon)?.icon ?? null;
}

export function groupHexaCores(cores = [], skills = []) {
    const mergedCores = mergeLinkedCores(cores).map((core) => ({
        ...core,
        icon: findCoreIcon(core, skills),
    }));

    return {
        MASTERY: mergedCores.filter((core) => core.type === "MASTERY"),
        ENHANCEMENT: mergedCores.filter((core) => core.type === "ENHANCEMENT"),
        SKILL: mergedCores.filter((core) => core.type === "SKILL"),
        COMMON: mergedCores.filter(
            (core) => core.type === "COMMON" || core.type === "UNKNOWN"
        ),
    };
}
