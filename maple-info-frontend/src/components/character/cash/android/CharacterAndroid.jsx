import { useEffect, useState } from "react";
import "./CharacterAndroid.css";

export default function CharacterAndroid({
                                             android,
                                         }) {
    if (!android?.equipped) {
        return (
            <section className="android-panel">
                <header className="android-panel__header">
                    <div>
                        <h2>안드로이드</h2>

                        <p>
                            장착 중인 안드로이드의 외형과
                            캐시 장비를 확인할 수 있습니다.
                        </p>
                    </div>
                </header>

                <p className="android-panel__empty">
                    장착 중인 안드로이드가 없습니다.
                </p>
            </section>
        );
    }

    return (
        <section className="android-panel">
            <header className="android-panel__header">
                <div>
                    <h2>안드로이드</h2>

                    <p>
                        장착 중인 안드로이드의 외형과
                        캐시 장비를 확인할 수 있습니다.
                    </p>
                </div>

                <span>
                    캐시 장비{" "}
                    {android.cashEquipment?.length ?? 0}개
                </span>
            </header>

            <div className="android-panel__body">
                <AndroidProfile
                    android={android}
                />

                <AndroidCashEquipment
                    equipment={
                        android.cashEquipment ?? []
                    }
                />
            </div>
        </section>
    );
}

function AndroidProfile({ android }) {
    const [imageFailed, setImageFailed] =
        useState(false);

    useEffect(() => {
        setImageFailed(false);
    }, [android.icon]);

    const showImage =
        Boolean(android.icon) &&
        !imageFailed;

    return (
        <article className="android-profile">
            <div className="android-profile__image-box">
                {showImage ? (
                    <img
                        src={android.icon}
                        alt={`${
                            android.nickname ||
                            android.name
                        } 안드로이드`}
                        className="android-profile__image"
                        onError={() =>
                            setImageFailed(true)
                        }
                    />
                ) : (
                    <span className="android-profile__image-empty">
                        이미지 없음
                    </span>
                )}
            </div>

            <div className="android-profile__info">
                <div className="android-profile__name">
                    <strong>
                        {android.nickname ||
                            android.name}
                    </strong>

                    {android.nickname &&
                        android.name &&
                        android.nickname !==
                        android.name && (
                            <span>
                                {android.name}
                            </span>
                        )}
                </div>

                <dl className="android-appearance">
                    {android.hair?.name && (
                        <div>
                            <dt>헤어</dt>

                            <dd>
                                {createBeautyText(
                                    android.hair
                                )}
                            </dd>
                        </div>
                    )}

                    {android.face?.name && (
                        <div>
                            <dt>성형</dt>

                            <dd>
                                {createBeautyText(
                                    android.face
                                )}
                            </dd>
                        </div>
                    )}

                    {android.skinName && (
                        <div>
                            <dt>피부</dt>

                            <dd>
                                {android.skinName}
                            </dd>
                        </div>
                    )}
                </dl>

                {android.description && (
                    <p className="android-profile__description">
                        {android.description}
                    </p>
                )}
            </div>
        </article>
    );
}

function AndroidCashEquipment({
                                  equipment,
                              }) {
    if (equipment.length === 0) {
        return (
            <div className="android-equipment">
                <h3>캐시 장비</h3>

                <p className="android-equipment__empty">
                    장착 중인 캐시 장비가 없습니다.
                </p>
            </div>
        );
    }

    return (
        <div className="android-equipment">
            <h3>캐시 장비</h3>

            <div className="android-equipment__grid">
                {equipment.map(
                    (item, index) => (
                        <AndroidEquipmentItem
                            key={`${
                                item.slot ||
                                item.name
                            }-${index}`}
                            item={item}
                        />
                    )
                )}
            </div>
        </div>
    );
}

function AndroidEquipmentItem({ item }) {
    const [imageFailed, setImageFailed] =
        useState(false);

    useEffect(() => {
        setImageFailed(false);
    }, [item.icon]);

    const showImage =
        Boolean(item.icon) &&
        !imageFailed;

    return (
        <article
            className="android-equipment-item"
            title={item.name}
        >
            <div className="android-equipment-item__image-box">
                {showImage ? (
                    <img
                        src={item.icon}
                        alt=""
                        onError={() =>
                            setImageFailed(true)
                        }
                    />
                ) : (
                    <span>이미지 없음</span>
                )}
            </div>

            <div className="android-equipment-item__info">
                <strong>{item.name}</strong>

                <span>
                    {item.slot || item.part}
                </span>

                {item.label && (
                    <small>{item.label}</small>
                )}
            </div>
        </article>
    );
}

function createBeautyText(beauty) {
    if (!beauty) {
        return "";
    }

    const colors = [
        beauty.baseColor,
        beauty.mixColor,
    ].filter(Boolean);

    const colorText =
        colors.length > 0
            ? ` · ${colors.join(" + ")}`
            : "";

    const mixRateText =
        beauty.mixRate
            ? ` ${beauty.mixRate}%`
            : "";

    return `${beauty.name}${colorText}${mixRateText}`;
}