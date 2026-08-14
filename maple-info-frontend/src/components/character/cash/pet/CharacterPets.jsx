import { useEffect, useState } from "react";
import "./CharacterPets.css";

export default function CharacterPets({
                                          pets = [],
                                      }) {
    if (pets.length === 0) {
        return (
            <section className="pet-panel">
                <header className="pet-panel__header">
                    <div>
                        <h2>펫 장비</h2>
                        <p>
                            현재 장착 중인 펫과 펫 장비를
                            확인할 수 있습니다.
                        </p>
                    </div>

                    <span>0마리</span>
                </header>

                <p className="pet-panel__empty">
                    장착 중인 펫이 없습니다.
                </p>
            </section>
        );
    }

    return (
        <section className="pet-panel">
            <header className="pet-panel__header">
                <div>
                    <h2>펫 </h2>
                    <p>
                        현재 장착 중인 펫과 펫 장비를
                        확인할 수 있습니다.
                    </p>
                </div>

                <span>{pets.length}마리</span>
            </header>

            <div className="pet-grid">
                {pets.map((pet) => (
                    <PetCard
                        key={pet.number}
                        pet={pet}
                    />
                ))}
            </div>
        </section>
    );
}

function PetCard({ pet }) {
    const [imageFailed, setImageFailed] =
        useState(false);

    const imageUrl =
        pet.appearanceIcon ||
        pet.icon;

    useEffect(() => {
        setImageFailed(false);
    }, [imageUrl]);

    const showImage =
        Boolean(imageUrl) && !imageFailed;

    return (
        <article className="pet-card">
            <div className="pet-card__top">
    <span className="pet-card__number">
    펫 {pet.number}
</span>

                {pet.dateExpire && (
                    <span className="pet-card__expire">
{formatExpireDate(
    pet.dateExpire
)}
</span>
                )}
            </div>

            <div className="pet-card__profile">
                <div className="pet-card__image-box">
                    {showImage ? (
                        <img
                            src={imageUrl}
                            alt={`${pet.nickname || pet.name} 펫`}
                            className="pet-card__image"
                            onError={() =>
                                setImageFailed(true)
                            }
                        />
                    ) : (
                        <span className="pet-card__image-empty">
이미지 없음
</span>
                    )}
                </div>

                <div className="pet-card__identity">
                    <strong>
                        {pet.nickname || pet.name}
                    </strong>

                    {pet.nickname &&
                        pet.name &&
                        pet.nickname !== pet.name && (
                            <span>
{pet.name}
</span>
                        )}

                    {pet.type && (
                        <span>{pet.type}</span>
                    )}
                </div>
            </div>

            {pet.equipment && (
                <section className="pet-card__section">
                    <h3>펫 장비</h3>

                    <div className="pet-equipment">
                        {pet.equipment.icon && (
                            <img
                                src={
                                    pet.equipment
                                        .itemShapeIcon ||
                                    pet.equipment.icon
                                }
                                alt=""
                            />
                        )}

                        <div>
                            <strong>
                                {pet.equipment.name}
                            </strong>

                            {pet.equipment
                                .scrollUpgrade != null && (
                                <span>
업그레이드{" "}
                                    {
                                        pet.equipment
                                            .scrollUpgrade
                                    }
                                    회
    </span>
                            )}
                        </div>
                    </div>

                    {pet.equipment.options?.length >
                        0 && (
                            <ul className="pet-option-list">
                                {pet.equipment.options.map(
                                    (option, index) => (
                                        <li
                                            key={`${option.type}-${index}`}
                                        >
<span>
{option.type}
</span>

                                            <strong>
                                                {option.value}
                                            </strong>
                                        </li>
                                    )
                                )}
                            </ul>
                        )}
                </section>
            )}

            {pet.autoSkills?.length > 0 && (
                <section className="pet-card__section">
                    <h3>자동 버프 스킬</h3>

                    <div className="pet-auto-skills">
                        {pet.autoSkills.map(
                            (skill) => (
                                <div
                                    key={skill.number}
                                    className="pet-auto-skill"
                                >
                                    {skill.icon && (
                                        <img
                                            src={skill.icon}
                                            alt=""
                                        />
                                    )}

                                    <span>
{skill.name}
</span>
                                </div>
                            )
                        )}
                    </div>
                </section>
            )}

            {pet.skills?.length > 0 && (
                <section className="pet-card__section">
                    <h3>보유 스킬</h3>

                    <div className="pet-skill-list">
                        {pet.skills.map(
                            (skill) => (
                                <span key={skill}>
                 {skill}
</span>
                            )
                        )}
                    </div>
                </section>
            )}
        </article>
    );
}

function formatExpireDate(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(
        "ko-KR",
        {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }
    ).format(date);
}