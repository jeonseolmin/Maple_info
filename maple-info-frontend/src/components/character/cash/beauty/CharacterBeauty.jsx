import { useEffect, useState } from "react";
import { getCharacterBeauty } from "../../../../api/characterApi";
import "./CharacterBeauty.css";

export default function CharacterBeauty({ ocid }) {
    const [beauty, setBeauty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!ocid) {
            setBeauty(null);
            setLoading(false);
            setError("캐릭터 식별 정보를 찾을 수 없습니다.");
            return;
        }

        let cancelled = false;

        const fetchBeauty = async () => {
            setLoading(true);
            setError("");

            try {
                const data = await getCharacterBeauty(ocid);

                if (!cancelled) {
                    setBeauty(data);
                }
            } catch (error) {
                console.error("외형 정보 조회 실패:", error);

                if (!cancelled) {
                    setBeauty(null);
                    setError("외형 정보를 불러오지 못했습니다.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchBeauty();

        return () => {
            cancelled = true;
        };
    }, [ocid]);

    if (loading) {
        return (
            <p className="character-content__empty">
                외형 정보를 불러오는 중입니다.
            </p>
        );
    }

    if (error) {
        return (
            <p className="character-content__empty">
                {error}
            </p>
        );
    }

    if (!beauty) {
        return (
            <p className="character-content__empty">
                외형 정보가 없습니다.
            </p>
        );
    }

    return (
        <section className="beauty-panel">
            <header className="beauty-panel__header">
                <div>
                    <h2>장착 외형</h2>
                    <p>현재 적용된 헤어, 성형, 피부 정보입니다.</p>
                </div>

                {beauty.gender && (
                    <span>{beauty.gender}</span>
                )}
            </header>

            <div className="beauty-panel__grid">
                <BeautyCard
                    title="헤어"
                    name={beauty.hair?.name}
                    baseColor={beauty.hair?.baseColor}
                    mixColor={beauty.hair?.mixColor}
                    mixRate={beauty.hair?.mixRate}
                />

                <BeautyCard
                    title="성형"
                    name={beauty.face?.name}
                    baseColor={beauty.face?.baseColor}
                    mixColor={beauty.face?.mixColor}
                    mixRate={beauty.face?.mixRate}
                />

                <BeautyCard
                    title="피부"
                    name={beauty.skin?.name}
                    colorStyle={beauty.skin?.colorStyle}
                    hue={beauty.skin?.hue}
                    saturation={beauty.skin?.saturation}
                    brightness={beauty.skin?.brightness}
                />
            </div>

            <AdditionalBeauty beauty={beauty} />
        </section>
    );
}

function BeautySkinCard({ skin }) {
    return (
        <article className="beauty-card">
            <span className="beauty-card__label">
                피부
            </span>

            <h3>{skin?.name || "정보 없음"}</h3>

            {skin?.colorStyle && (
                <p>
                    색상 계열
                    <strong>{skin.colorStyle}</strong>
                </p>
            )}

            {skin?.hue != null && (
                <p>
                    색조
                    <strong>{skin.hue}</strong>
                </p>
            )}

            {skin?.saturation != null && (
                <p>
                    채도
                    <strong>{skin.saturation}</strong>
                </p>
            )}

            {skin?.brightness != null && (
                <p>
                    명도
                    <strong>{skin.brightness}</strong>
                </p>
            )}
        </article>
    );
}

function BeautyCard({
                        title,
                        name,
                        baseColor,
                        mixColor,
                        mixRate,
                    }) {
    return (
        <article className="beauty-card">
            <span className="beauty-card__label">
                {title}
            </span>

            <h3>{name || "정보 없음"}</h3>

            {baseColor && (
                <p>
                    기본 색상
                    <strong>{baseColor}</strong>
                </p>
            )}

            {mixColor && (
                <p>
                    믹스 색상
                    <strong>{mixColor}</strong>
                </p>
            )}

            {mixRate && (
                <p>
                    믹스 비율
                    <strong>{mixRate}%</strong>
                </p>
            )}
        </article>
    );
}

function AdditionalBeauty({ beauty }) {
    const hasAdditionalBeauty =
        beauty.additionalHair ||
        beauty.additionalFace ||
        beauty.additionalSkin;

    if (!hasAdditionalBeauty) {
        return null;
    }

    return (
        <section className="beauty-panel__additional">
            <h3>추가 외형</h3>

            <div className="beauty-panel__grid">
                <BeautyCard
                    title="추가 헤어"
                    name={beauty.additionalHair?.name}
                    baseColor={
                        beauty.additionalHair?.baseColor
                    }
                    mixColor={
                        beauty.additionalHair?.mixColor
                    }
                    mixRate={
                        beauty.additionalHair?.mixRate
                    }
                />

                <BeautyCard
                    title="추가 성형"
                    name={beauty.additionalFace?.name}
                    baseColor={
                        beauty.additionalFace?.baseColor
                    }
                    mixColor={
                        beauty.additionalFace?.mixColor
                    }
                    mixRate={
                        beauty.additionalFace?.mixRate
                    }
                />

                <BeautyCard
                    title="추가 피부"
                    name={beauty.additionalSkin?.name}
                />
            </div>
        </section>
    );
}