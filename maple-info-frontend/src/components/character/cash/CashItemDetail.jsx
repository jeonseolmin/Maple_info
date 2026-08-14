import { useEffect, useState } from "react";

export default function CashItemDetail({
                                           item,
                                           onClose,
                                       }) {
    const [imageFailed, setImageFailed] =
        useState(false);

    useEffect(() => {
        setImageFailed(false);
    }, [item?.icon]);

    if (!item) {
        return (
            <div className="equipment-tooltip equipment-tooltip--empty">
                캐시 장비 또는 외형을 선택해 주세요.
            </div>
        );
    }

    const showImage =
        Boolean(item.icon) && !imageFailed;

    return (
        <article className="equipment-tooltip">
            <button
                type="button"
                className="equipment-tooltip__close"
                onClick={onClose}
                aria-label="상세정보 닫기"
            >
                ×
            </button>

            <header className="equipment-tooltip__header">
                <h3>{item.name}</h3>

                <div className="equipment-tooltip__summary">
                    {showImage ? (
                        <img
                            src={item.icon}
                            alt=""
                            onError={() =>
                                setImageFailed(true)
                            }
                        />
                    ) : (
                        <span className="equipment-tooltip__beauty-icon">
                            {item.slot}
                        </span>
                    )}

                    <div>
                        <span>
                            {item.part || item.slot}
                        </span>

                        {item.gender && (
                            <span>
                                성별: {item.gender}
                            </span>
                        )}

                        {item.label && (
                            <span className="cash-detail__label">
                                {item.label}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            {item.description && (
                <p className="equipment-tooltip__description">
                    {item.description}
                </p>
            )}

            {item.type === "beauty" ? (
                <BeautyDetail item={item} />
            ) : (
                <CashEquipmentDetail item={item} />
            )}
        </article>
    );
}

function BeautyDetail({ item }) {
    const isCustomized =
        item.baseColor ||
        item.mixColor ||
        item.mixRate != null ||
        item.colorStyle ||
        item.hue != null ||
        item.saturation != null ||
        item.brightness != null;

    return (
        <section className="equipment-tooltip__section">
            <h4>외형 정보</h4>

            {!isCustomized && (
                <p className="cash-detail__empty">
                    별도의 색상 조절 정보가 없습니다.
                </p>
            )}

            {item.baseColor && (
                <DetailRow
                    label="기본 색상"
                    value={item.baseColor}
                />
            )}

            {item.mixColor && (
                <DetailRow
                    label="믹스 색상"
                    value={item.mixColor}
                />
            )}

            {item.mixRate != null && (
                <DetailRow
                    label="믹스 비율"
                    value={`${item.mixRate}%`}
                />
            )}

            {item.colorStyle && (
                <DetailRow
                    label="색상 방식"
                    value={item.colorStyle}
                />
            )}

            {item.hue != null && (
                <DetailRow
                    label="색조"
                    value={item.hue}
                />
            )}

            {item.saturation != null && (
                <DetailRow
                    label="채도"
                    value={item.saturation}
                />
            )}

            {item.brightness != null && (
                <DetailRow
                    label="명도"
                    value={item.brightness}
                />
            )}
        </section>
    );
}

function CashEquipmentDetail({ item }) {
    return (
        <>
            {item.options?.length > 0 && (
                <section className="equipment-tooltip__section">
                    <h4>캐시 옵션</h4>

                    <div className="cash-option-list">
                        {item.options.map(
                            (option, index) => (
                                <DetailRow
                                    key={`${option.type}-${index}`}
                                    label={option.type}
                                    value={option.value}
                                />
                            )
                        )}
                    </div>
                </section>
            )}

            {item.coloringPrism && (
                <section className="equipment-tooltip__section">
                    <h4>컬러링 프리즘</h4>

                    <DetailRow
                        label="색상 범위"
                        value={
                            item.coloringPrism
                                .colorRange
                        }
                    />

                    <DetailRow
                        label="색조"
                        value={
                            item.coloringPrism.hue
                        }
                    />

                    <DetailRow
                        label="채도"
                        value={
                            item.coloringPrism
                                .saturation
                        }
                    />

                    <DetailRow
                        label="명도"
                        value={
                            item.coloringPrism.value
                        }
                    />
                </section>
            )}

            {(item.expireAt ||
                item.optionExpireAt) && (
                <section className="equipment-tooltip__section">
                    <h4>기간 정보</h4>

                    {item.expireAt && (
                        <DetailRow
                            label="아이템 만료"
                            value={formatDate(
                                item.expireAt
                            )}
                        />
                    )}

                    {item.optionExpireAt && (
                        <DetailRow
                            label="옵션 만료"
                            value={formatDate(
                                item.optionExpireAt
                            )}
                        />
                    )}
                </section>
            )}
        </>
    );
}

function DetailRow({ label, value }) {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    return (
        <p className="cash-detail__row">
            <span>{label}</span>
            <strong>{value}</strong>
        </p>
    );
}

function formatDate(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(
        "ko-KR",
        {
            dateStyle: "medium",
            timeStyle: "short",
        }
    ).format(date);
}