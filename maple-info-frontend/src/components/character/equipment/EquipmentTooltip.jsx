const OPTION_LABELS = {
    str: "STR",
    dex: "DEX",
    intelligence: "INT",
    luk: "LUK",
    maxHp: "최대 HP",
    maxMp: "최대 MP",
    attackPower: "공격력",
    magicPower: "마력",
    armor: "방어력",
    speed: "이동속도",
    jump: "점프력",
    bossDamage: "보스 데미지",
    damage: "데미지",
    allStat: "올스탯",
    ignoreMonsterArmor: "방어율 무시",
};

function hasValue(value) {
    if (value === null || value === undefined || value === "") {
        return false;
    }

    return Number(value) !== 0;
}

function EquipmentOptions({ title, option }) {
    if (!option) {
        return null;
    }

    const entries = Object.entries(OPTION_LABELS)
        .map(([key, label]) => ({
            key,
            label,
            value: option[key],
        }))
        .filter(({ value }) => hasValue(value));

    if (entries.length === 0) {
        return null;
    }

    return (
        <section className="equipment-tooltip__section">
            <h4>{title}</h4>

            <div className="equipment-option-list">
                {entries.map(({ key, label, value }) => (
                    <div
                        key={key}
                        className="equipment-option-row"
                    >
                        <span>{label}</span>
                        <strong>+{value}</strong>
                    </div>
                ))}
            </div>
        </section>
    );
}

function PotentialOptions({ title, grade, options = [], type }) {
    if (!grade && options.length === 0) {
        return null;
    }

    return (
        <section
            className={`equipment-tooltip__section potential potential--${type}`}
        >
            <h4>
                {title}
                {grade && <span>{grade}</span>}
            </h4>

            {options.map((option, index) => (
                <p key={`${option}-${index}`}>{option}</p>
            ))}
        </section>
    );
}

export default function EquipmentTooltip({ item, onClose }) {
    if (!item) {
        return (
            <aside className="equipment-tooltip equipment-tooltip--empty">
                <p>장비를 선택하면 상세 옵션이 표시됩니다.</p>
            </aside>
        );
    }

    return (
        <aside className="equipment-tooltip">
            <button
                type="button"
                className="equipment-tooltip__close"
                onClick={onClose}
                aria-label="장비 상세 닫기"
            >
                ×
            </button>

            <header className="equipment-tooltip__header">
                {item.starforce > 0 && (
                    <div className="equipment-tooltip__starforce">
                        {"★".repeat(Math.min(item.starforce, 25))}
                        <span>{item.starforce}성</span>
                    </div>
                )}

                <h3>{item.name}</h3>

                <div className="equipment-tooltip__summary">
                    <img src={item.icon} alt={item.name} />

                    <div>
                        <span>{item.part}</span>
                        <span>{item.slot}</span>

                        {item.equipmentLevelIncrease > 0 && (
                            <span>
                                장비 레벨 증가 +{item.equipmentLevel}
                            </span>
                        )}
                    </div>
                </div>

                {item.description && (
                    <p className="equipment-tooltip__description">
                        {item.description}
                    </p>
                )}
            </header>

            <EquipmentOptions
                title="최종 옵션"
                option={item.totalOption}
            />

            <EquipmentOptions
                title="기본 옵션"
                option={item.baseOption}
            />

            <EquipmentOptions
                title="추가 옵션"
                option={item.addOption}
            />

            <EquipmentOptions
                title="주문서 강화"
                option={item.scrollOption}
            />

            <EquipmentOptions
                title="스타포스 강화"
                option={item.starforceOption}
            />

            <EquipmentOptions
                title={`익셉셔널 강화 ${
                    item.exceptionalOption?.exceptionalUpgrade
                        ? `${item.exceptionalOption.exceptionalUpgrade}회`
                        : ""
                }`}
                option={item.exceptionalOption}
            />

            <PotentialOptions
                title="잠재능력"
                grade={item.potentialGrade}
                options={item.potentialOptions}
                type="potential"
            />

            <PotentialOptions
                title="에디셔널 잠재능력"
                grade={item.additionalPotentialGrade}
                options={item.additionalPotentialOptions}
                type="additional"
            />

            <section className="equipment-tooltip__section equipment-tooltip__etc">
                {item.scrollUpgrade !== null && (
                    <p>업그레이드 횟수: {item.scrollUpgrade}</p>
                )}

                {item.scrollUpgradeableCount !== null && (
                    <p>
                        남은 업그레이드 가능 횟수:{" "}
                        {item.scrollUpgradeableCount}
                    </p>
                )}

                {item.cuttableCount !== null && (
                    <p>가위 사용 가능 횟수: {item.cuttableCount}</p>
                )}

                {item.goldenHammerFlag && (
                    <p>황금망치: {item.goldenHammerFlag}</p>
                )}

                {item.soulName && <p>소울: {item.soulName}</p>}
                {item.soulOption && <p>{item.soulOption}</p>}
            </section>
        </aside>
    );
}