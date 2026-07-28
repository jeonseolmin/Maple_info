import "./CharacterDetailGrid.css";

function formatNumber(value) {
    return value == null ? null : value.toLocaleString();
}

function DetailItem({ label, value, emptyText = "정보 없음" }) {
    const hasValue = value !== null && value !== undefined;

    return (
        <div className="character-detail__item">
    <span className="character-detail__label">
{label}
</span>

            <strong
                className={
                    hasValue
                        ? "character-detail__value"
                        : "character-detail__value character-detail__value--empty"
                }
            >
                {hasValue ? value : emptyText}
            </strong>
        </div>
    );
}

export default function CharacterDetailGrid({ detail }) {
    return (
        <section className="character-detail">
            <DetailItem
                label="레벨"
                value={
                    detail.level != null
                        ? `Lv. ${detail.level}`
                        : null
                }
            />

            <DetailItem
                label="유니온 종합"
                value={formatNumber(detail.unionLevel)}
            />

            <DetailItem
                label="유니온 아티팩트"
                value={formatNumber(detail.unionArtifactLevel)}
            />

            <DetailItem
                label="인기도"
                value={formatNumber(detail.popularity)}
            />

            <DetailItem
                label="종합 순위"
                value={
                    detail.overallRanking != null
                        ? `${formatNumber(detail.overallRanking)}위`
                        : null
                }
            />

            <DetailItem
                label="서버 순위"
                value={
                    detail.worldRanking != null
                        ? `${formatNumber(detail.worldRanking)}위`
                        : null
                }
            />

            <DetailItem
                label="직업 랭킹"
                value={
                    detail.classRanking != null
                        ? `${formatNumber(detail.classRanking)}위`
                        : null
                }
            />

            <DetailItem
                label="무릉"
                value={
                    detail.dojangFloor != null
                        ? `${detail.dojangFloor}층`
                        : null
                }
            />
        </section>
    );
}