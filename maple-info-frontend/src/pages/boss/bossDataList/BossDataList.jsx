import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    deleteBossAttempt,
    getBossAttempts,
    updateBossAttempt,
} from "../../../api/bossAttemptApi";

import "./BossDataList.css";

const RESULT_LABEL = {
    CLEAR: "클리어",
    TIME_OUT: "시간 초과",
    DEATH_OUT: "데스카운트 아웃",
    UNKNOWN: "결과 불명",
};

const SOURCE_LABEL = {
    YOUTUBE: "YouTube",
    INVEN: "메이플 인벤",
    MAPLE_COMMUNITY: "공식 커뮤니티",
    MAPLE_SCOUTER: "환산주스탯",
    USER_SUBMISSION: "사용자 제보",
    OTHER: "기타",
};

const SOURCE_TYPES = [
    ["YOUTUBE", "YouTube"],
    ["INVEN", "메이플 인벤"],
    ["MAPLE_COMMUNITY", "메이플 공식 커뮤니티"],
    ["MAPLE_SCOUTER", "환산주스탯"],
    ["USER_SUBMISSION", "사용자 제보"],
    ["OTHER", "기타"],
];

const CONFIDENCE_GRADES = [
    "S",
    "A",
    "B",
    "C",
    "D",
];

const PLAYER_SKILL_LEVELS = [
    ["UNKNOWN", "확인 불가"],
    ["BEGINNER", "초보"],
    ["NORMAL", "일반"],
    ["EXPERIENCED", "숙련"],
];

export default function BossDataList() {

    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [bossFilter, setBossFilter] = useState("");
    const [classFilter, setClassFilter] = useState("");
    const [resultFilter, setResultFilter] = useState("");
    const [confidenceFilter, setConfidenceFilter] = useState("");

    const [
        selectedAttempt,
        setSelectedAttempt
    ] = useState(null);

    useEffect(() => {
        fetchAttempts();
    }, []);

    const fetchAttempts = async () => {

        setLoading(true);

        try {

            const data = await getBossAttempts();

            setAttempts(data || []);

        } catch (error) {

            console.error(
                "보스컷 데이터 조회 실패:",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    const bossOptions = useMemo(() => {

        const values = new Map();

        attempts.forEach(attempt => {

            const key =
                `${attempt.bossId}`;

            values.set(
                key,
                {
                    bossId: attempt.bossId,
                    label:
                        `${attempt.bossName} · ${attempt.difficulty}`,
                }
            );
        });

        return [
            ...values.values()
        ];

    }, [attempts]);

    const classOptions = useMemo(() => {

        return [
            ...new Set(
                attempts
                    .map(
                        item =>
                            item.characterClass
                    )
                    .filter(Boolean)
            ),
        ].sort(
            (a, b) =>
                a.localeCompare(
                    b,
                    "ko"
                )
        );

    }, [attempts]);

    const filteredAttempts = useMemo(() => {

        return attempts.filter(item => {

            const bossMatched =
                !bossFilter ||
                String(item.bossId) ===
                String(bossFilter);

            const classMatched =
                !classFilter ||
                item.characterClass ===
                classFilter;

            const resultMatched =
                !resultFilter ||
                item.result ===
                resultFilter;

            const confidenceMatched =
                !confidenceFilter ||
                item.sources?.some(
                    source =>
                        source.confidenceGrade ===
                        confidenceFilter
                );

            return (
                bossMatched &&
                classMatched &&
                resultMatched &&
                confidenceMatched
            );
        });

    }, [
        attempts,
        bossFilter,
        classFilter,
        resultFilter,
        confidenceFilter,
    ]);

    const formatClearTime = seconds => {

        if (
            seconds === null ||
            seconds === undefined
        ) {
            return "-";
        }

        const minute =
            Math.floor(seconds / 60);

        const second =
            seconds % 60;

        return (
            `${minute}:` +
            String(second)
                .padStart(2, "0")
        );
    };

    const handleUpdated = async attemptId => {

        await fetchAttempts();

        const refreshed =
            await getBossAttempts();

        const target =
            (refreshed || []).find(
                item =>
                    item.attemptId ===
                    attemptId
            );

        setAttempts(
            refreshed || []
        );

        setSelectedAttempt(
            target || null
        );
    };

    return (

        <div className="boss-list-page">

            <div className="boss-list-header">

                <div>

                    <span className="boss-list-eyebrow">
                        BOSS DATASET
                    </span>

                    <h1>
                        보스컷 데이터 검수
                    </h1>

                    <p>
                        수집된 실전 기록을 필터링하고
                        원본 데이터와 스펙을 검수합니다.
                    </p>

                </div>

                <div className="boss-list-count">

                    {filteredAttempts.length}

                    <span>
                        {" / "}
                        {attempts.length}
                        건
                    </span>

                </div>

            </div>

            <section className="boss-filter-card">

                <select
                    value={bossFilter}
                    onChange={e =>
                        setBossFilter(
                            e.target.value
                        )
                    }
                >

                    <option value="">
                        전체 보스
                    </option>

                    {bossOptions.map(
                        boss => (

                            <option
                                key={boss.bossId}
                                value={boss.bossId}
                            >
                                {boss.label}
                            </option>

                        )
                    )}

                </select>

                <select
                    value={classFilter}
                    onChange={e =>
                        setClassFilter(
                            e.target.value
                        )
                    }
                >

                    <option value="">
                        전체 직업
                    </option>

                    {classOptions.map(
                        job => (

                            <option
                                key={job}
                                value={job}
                            >
                                {job}
                            </option>

                        )
                    )}

                </select>

                <select
                    value={resultFilter}
                    onChange={e =>
                        setResultFilter(
                            e.target.value
                        )
                    }
                >

                    <option value="">
                        전체 결과
                    </option>

                    <option value="CLEAR">
                        클리어
                    </option>

                    <option value="TIME_OUT">
                        시간 초과
                    </option>

                    <option value="DEATH_OUT">
                        데스카운트 아웃
                    </option>

                    <option value="UNKNOWN">
                        결과 불명
                    </option>

                </select>

                <select
                    value={confidenceFilter}
                    onChange={e =>
                        setConfidenceFilter(
                            e.target.value
                        )
                    }
                >

                    <option value="">
                        전체 신뢰도
                    </option>

                    {CONFIDENCE_GRADES.map(
                        grade => (

                            <option
                                key={grade}
                                value={grade}
                            >
                                {grade}
                            </option>

                        )
                    )}

                </select>

                <button
                    type="button"
                    onClick={() => {

                        setBossFilter("");
                        setClassFilter("");
                        setResultFilter("");
                        setConfidenceFilter("");

                    }}
                >
                    필터 초기화
                </button>

            </section>

            <section className="boss-table-card">

                {loading ? (

                    <div className="boss-empty">
                        데이터를 불러오는 중입니다...
                    </div>

                ) : filteredAttempts.length === 0 ? (

                    <div className="boss-empty">
                        조건에 맞는 데이터가 없습니다.
                    </div>

                ) : (

                    <div className="boss-table-scroll">

                        <table className="boss-data-table">

                            <thead>

                            <tr>
                                <th>ID</th>
                                <th>보스</th>
                                <th>직업</th>
                                <th>배율</th>
                                <th>시간</th>
                                <th>결과</th>
                                <th>전투력</th>
                                <th>신뢰도</th>
                                <th>검수</th>
                            </tr>

                            </thead>

                            <tbody>

                            {filteredAttempts.map(
                                item => {

                                    const primarySource =
                                        item.sources?.[0];

                                    return (

                                        <tr
                                            key={item.attemptId}
                                            onClick={() =>
                                                setSelectedAttempt(
                                                    item
                                                )
                                            }
                                        >

                                            <td>
                                                #{item.attemptId}
                                            </td>

                                            <td>

                                                <strong>
                                                    {item.bossName}
                                                </strong>

                                                <span className="difficulty-text">
                                                        {item.difficulty}
                                                    </span>

                                            </td>

                                            <td>
                                                {item.characterClass}
                                            </td>

                                            <td>

                                                {item.observedBossRatio !== null &&
                                                item.observedBossRatio !== undefined
                                                    ? `${item.observedBossRatio}%`
                                                    : "-"
                                                }

                                            </td>

                                            <td>
                                                {formatClearTime(
                                                    item.clearTimeSeconds
                                                )}
                                            </td>

                                            <td>

                                                    <span
                                                        className={
                                                            `result-badge ${item.result}`
                                                        }
                                                    >
                                                        {
                                                            RESULT_LABEL[
                                                                item.result
                                                                ]
                                                        }
                                                    </span>

                                            </td>

                                            <td>

                                                {item.combatPower
                                                    ? Number(
                                                        item.combatPower
                                                    ).toLocaleString()
                                                    : "-"
                                                }

                                            </td>

                                            <td>
                                                {primarySource
                                                        ?.confidenceGrade ||
                                                    "-"
                                                }
                                            </td>

                                            <td>

                                                {primarySource?.verified
                                                    ? (
                                                        <span className="verified-badge">
                                                                완료
                                                            </span>
                                                    )
                                                    : (
                                                        <span className="unverified-badge">
                                                                미검수
                                                            </span>
                                                    )
                                                }

                                            </td>

                                        </tr>

                                    );
                                }
                            )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

            {selectedAttempt && (

                <AttemptDetailModal

                    attempt={selectedAttempt}

                    bossOptions={bossOptions}

                    onClose={() =>
                        setSelectedAttempt(null)
                    }

                    onUpdated={() =>
                        handleUpdated(
                            selectedAttempt.attemptId
                        )
                    }

                    onDeleted={async () => {

                        setSelectedAttempt(null);

                        await fetchAttempts();
                    }}

                />

            )}

        </div>
    );
}

function AttemptDetailModal({
                                attempt,
                                bossOptions,
                                onClose,
                                onUpdated,
                                onDeleted,
                            }) {

    const [editMode, setEditMode] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [editForm, setEditForm] =
        useState(() =>
            createEditForm(attempt)
        );

    useEffect(() => {

        setEditForm(
            createEditForm(attempt)
        );

    }, [attempt]);

    const primarySource =
        attempt.sources?.[0];

    const formatValue = (
        value,
        suffix = ""
    ) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "-";
        }

        return `${value}${suffix}`;
    };

    const handleEditChange = e => {

        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setEditForm(prev => ({
            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    const nullableNumber = value => {

        if (
            value === "" ||
            value === null ||
            value === undefined
        ) {
            return null;
        }

        return Number(value);
    };

    const nullableDate = value => {

        if (!value) {
            return null;
        }

        return value.length === 16
            ? `${value}:00`
            : value;
    };

    const handleSave = async () => {

        if (!editForm.bossId) {

            alert(
                "보스를 선택해주세요."
            );

            return;
        }

        if (
            !editForm.characterClass
                .trim()
        ) {

            alert(
                "직업을 입력해주세요."
            );

            return;
        }

        if (
            !editForm.sourceUrl
                .trim()
        ) {

            alert(
                "출처 URL을 입력해주세요."
            );

            return;
        }

        const clearTimeSeconds =
            editForm.result === "CLEAR" &&
            (
                editForm.clearMinute !== "" ||
                editForm.clearSecond !== ""
            )
                ? Number(
                    editForm.clearMinute || 0
                ) * 60
                + Number(
                    editForm.clearSecond || 0
                )
                : null;

        const payload = {

            bossId:
                Number(editForm.bossId),

            characterName:
                editForm.characterName
                    .trim() || null,

            characterClass:
                editForm.characterClass
                    .trim(),

            result:
            editForm.result,

            partySize:
                Number(
                    editForm.partySize || 1
                ),

            clearTimeSeconds,

            observedBossRatio:
                nullableNumber(
                    editForm.observedBossRatio
                ),

            playerSkillLevel:
            editForm.playerSkillLevel,

            gameVersion:
                editForm.gameVersion
                    .trim() || null,

            recordedAt:
                nullableDate(
                    editForm.recordedAt
                ),

            characterLevel:
                nullableNumber(
                    editForm.characterLevel
                ),

            combatPower:
                nullableNumber(
                    editForm.combatPower
                ),

            convertedStat:
                nullableNumber(
                    editForm.convertedStat
                ),

            bossDamage:
                nullableNumber(
                    editForm.bossDamage
                ),

            ignoreDefense:
                nullableNumber(
                    editForm.ignoreDefense
                ),

            criticalDamage:
                nullableNumber(
                    editForm.criticalDamage
                ),

            mainStat:
                nullableNumber(
                    editForm.mainStat
                ),

            attackPower:
                nullableNumber(
                    editForm.attackPower
                ),

            hexaProgress:
                nullableNumber(
                    editForm.hexaProgress
                ),

            seedRing:
                editForm.seedRing
                    .trim() || null,

            buffDescription:
                editForm.buffDescription
                    .trim() || null,

            sourceId:
                primarySource?.sourceId ||
                null,

            sourceType:
            editForm.sourceType,

            sourceUrl:
                editForm.sourceUrl
                    .trim(),

            publishedAt:
                nullableDate(
                    editForm.publishedAt
                ),

            confidenceGrade:
            editForm.confidenceGrade,

            verified:
            editForm.verified,

            sourceNote:
                editForm.sourceNote
                    .trim() || null,
        };

        setSaving(true);

        try {

            await updateBossAttempt(
                attempt.attemptId,
                payload
            );

            alert(
                "수정되었습니다."
            );

            setEditMode(false);

            await onUpdated();

        } catch (error) {

            console.error(
                "보스컷 데이터 수정 실패:",
                error
            );

            alert(
                error.response?.data?.message ||
                "수정에 실패했습니다."
            );

        } finally {

            setSaving(false);
        }
    };

    const handleDelete = async () => {

        const confirmed =
            window.confirm(
                `#${attempt.attemptId} 데이터를 삭제하시겠습니까?\n삭제 후 복구할 수 없습니다.`
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteBossAttempt(
                attempt.attemptId
            );

            alert(
                "삭제되었습니다."
            );

            await onDeleted();

        } catch (error) {

            console.error(
                "보스컷 데이터 삭제 실패:",
                error
            );

            alert(
                error.response?.data?.message ||
                "삭제에 실패했습니다."
            );
        }
    };

    return (

        <div
            className="boss-modal-backdrop"
            onClick={onClose}
        >

            <div
                className="boss-detail-modal"
                onClick={e =>
                    e.stopPropagation()
                }
            >

                <div className="boss-detail-header">

                    <div>

                        <span>
                            #{attempt.attemptId}
                        </span>

                        <h2>

                            {attempt.bossName}

                            {" · "}

                            {attempt.difficulty}

                        </h2>

                        <p>

                            {attempt.characterClass}

                            {attempt.characterName
                                ? ` · ${attempt.characterName}`
                                : ""
                            }

                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>

                {!editMode ? (

                    <>

                        <DetailSection title="도전 기록">

                            <DetailItem
                                label="결과"
                                value={
                                    RESULT_LABEL[
                                        attempt.result
                                        ]
                                }
                            />

                            <DetailItem
                                label="보스 배율"
                                value={
                                    formatValue(
                                        attempt.observedBossRatio,
                                        "%"
                                    )
                                }
                            />

                            <DetailItem
                                label="파티"
                                value={
                                    `${attempt.partySize}인`
                                }
                            />

                            <DetailItem
                                label="클리어 시간"
                                value={
                                    attempt.clearTimeSeconds !== null &&
                                    attempt.clearTimeSeconds !== undefined
                                        ? `${Math.floor(
                                            attempt.clearTimeSeconds / 60
                                        )}분 ${
                                            attempt.clearTimeSeconds % 60
                                        }초`
                                        : "-"
                                }
                            />

                            <DetailItem
                                label="숙련도"
                                value={
                                    attempt.playerSkillLevel ||
                                    "-"
                                }
                            />

                            <DetailItem
                                label="패치 구간"
                                value={
                                    attempt.gameVersion ||
                                    "-"
                                }
                            />

                        </DetailSection>

                        <DetailSection title="당시 스펙">

                            <DetailItem
                                label="레벨"
                                value={
                                    attempt.characterLevel ||
                                    "-"
                                }
                            />

                            <DetailItem
                                label="전투력"
                                value={
                                    attempt.combatPower
                                        ? Number(
                                            attempt.combatPower
                                        ).toLocaleString()
                                        : "-"
                                }
                            />

                            <DetailItem
                                label="환산"
                                value={
                                    attempt.convertedStat ||
                                    "-"
                                }
                            />

                            <DetailItem
                                label="보공"
                                value={
                                    formatValue(
                                        attempt.bossDamage,
                                        "%"
                                    )
                                }
                            />

                            <DetailItem
                                label="방무"
                                value={
                                    formatValue(
                                        attempt.ignoreDefense,
                                        "%"
                                    )
                                }
                            />

                            <DetailItem
                                label="크뎀"
                                value={
                                    formatValue(
                                        attempt.criticalDamage,
                                        "%"
                                    )
                                }
                            />

                            <DetailItem
                                label="주스탯"
                                value={
                                    attempt.mainStat
                                        ? Number(
                                            attempt.mainStat
                                        ).toLocaleString()
                                        : "-"
                                }
                            />

                            <DetailItem
                                label="공격력 / 마력"
                                value={
                                    attempt.attackPower
                                        ? Number(
                                            attempt.attackPower
                                        ).toLocaleString()
                                        : "-"
                                }
                            />

                            <DetailItem
                                label="HEXA"
                                value={
                                    formatValue(
                                        attempt.hexaProgress,
                                        "%"
                                    )
                                }
                            />

                            <DetailItem
                                label="시드링"
                                value={
                                    attempt.seedRing ||
                                    "-"
                                }
                            />

                        </DetailSection>

                        <DetailSection title="출처">

                            <div className="source-list">

                                {(attempt.sources || [])
                                    .map(
                                        source => (

                                            <div
                                                key={source.sourceId}
                                                className="source-card"
                                            >

                                                <div>

                                                    <div>

                                                        <strong>
                                                            {
                                                                SOURCE_LABEL[
                                                                    source.sourceType
                                                                    ] ||
                                                                source.sourceType
                                                            }
                                                        </strong>

                                                        <span>
                                                            신뢰도{" "}
                                                            {
                                                                source.confidenceGrade
                                                            }
                                                        </span>

                                                    </div>

                                                    <div className="source-actions">

                                                        <span
                                                            className={
                                                                source.verified
                                                                    ? "verified-badge"
                                                                    : "unverified-badge"
                                                            }
                                                        >

                                                            {source.verified
                                                                ? "검수 완료"
                                                                : "미검수"
                                                            }

                                                        </span>

                                                        <a
                                                            href={source.sourceUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            원본 보기
                                                        </a>

                                                    </div>

                                                </div>

                                                {source.note && (
                                                    <p>
                                                        {source.note}
                                                    </p>
                                                )}

                                            </div>

                                        )
                                    )}

                            </div>

                        </DetailSection>

                        {attempt.buffDescription && (

                            <DetailSection title="도핑 / 버프">

                                <p className="detail-description">
                                    {attempt.buffDescription}
                                </p>

                            </DetailSection>

                        )}

                    </>

                ) : (

                    <EditAttemptForm

                        form={editForm}

                        onChange={handleEditChange}

                        bossOptions={bossOptions}

                    />

                )}

                <div className="boss-detail-actions">

                    {!editMode ? (

                        <>

                            <button
                                type="button"
                                className="detail-edit-button"
                                onClick={() =>
                                    setEditMode(true)
                                }
                            >
                                수정
                            </button>

                            <button
                                type="button"
                                className="detail-delete-button"
                                onClick={handleDelete}
                            >
                                데이터 삭제
                            </button>

                        </>

                    ) : (

                        <>

                            <button
                                type="button"
                                className="detail-cancel-button"
                                disabled={saving}
                                onClick={() => {

                                    setEditForm(
                                        createEditForm(
                                            attempt
                                        )
                                    );

                                    setEditMode(false);

                                }}
                            >
                                취소
                            </button>

                            <button
                                type="button"
                                className="detail-save-button"
                                disabled={saving}
                                onClick={handleSave}
                            >

                                {saving
                                    ? "저장 중..."
                                    : "수정 저장"
                                }

                            </button>

                        </>

                    )}

                </div>

            </div>

        </div>
    );
}

function EditAttemptForm({
                             form,
                             onChange,
                             bossOptions,
                         }) {

    return (

        <div className="boss-edit-form">

            <h3>
                도전 정보 수정
            </h3>

            <div className="boss-edit-grid">

                <EditField label="보스">

                    <select
                        name="bossId"
                        value={form.bossId}
                        onChange={onChange}
                    >

                        {bossOptions.map(
                            boss => (

                                <option
                                    key={boss.bossId}
                                    value={boss.bossId}
                                >
                                    {boss.label}
                                </option>

                            )
                        )}

                    </select>

                </EditField>

                <EditField label="직업">

                    <input
                        name="characterClass"
                        value={form.characterClass}
                        onChange={onChange}
                    />

                </EditField>

                <EditField label="캐릭터명">

                    <input
                        name="characterName"
                        value={form.characterName}
                        onChange={onChange}
                    />

                </EditField>

                <EditField label="결과">

                    <select
                        name="result"
                        value={form.result}
                        onChange={onChange}
                    >

                        <option value="CLEAR">
                            클리어
                        </option>

                        <option value="TIME_OUT">
                            시간 초과
                        </option>

                        <option value="DEATH_OUT">
                            데스카운트 아웃
                        </option>

                        <option value="UNKNOWN">
                            결과 불명
                        </option>

                    </select>

                </EditField>

                <EditField label="파티 인원">

                    <select
                        name="partySize"
                        value={form.partySize}
                        onChange={onChange}
                    >

                        {[1, 2, 3, 4, 5, 6]
                            .map(
                                count => (

                                    <option
                                        key={count}
                                        value={count}
                                    >
                                        {count}인
                                    </option>

                                )
                            )}

                    </select>

                </EditField>

                <EditField label="숙련도">

                    <select
                        name="playerSkillLevel"
                        value={form.playerSkillLevel}
                        onChange={onChange}
                    >

                        {PLAYER_SKILL_LEVELS.map(
                            ([value, label]) => (

                                <option
                                    key={value}
                                    value={value}
                                >
                                    {label}
                                </option>

                            )
                        )}

                    </select>

                </EditField>

                <EditField label="보스 배율">

                    <input
                        type="number"
                        step="0.001"
                        name="observedBossRatio"
                        value={form.observedBossRatio}
                        onChange={onChange}
                    />

                </EditField>

                <EditField label="패치 구간">

                    <input
                        name="gameVersion"
                        value={form.gameVersion}
                        onChange={onChange}
                    />

                </EditField>

                <EditField label="클리어 분">

                    <input
                        type="number"
                        min="0"
                        name="clearMinute"
                        value={form.clearMinute}
                        onChange={onChange}
                    />

                </EditField>

                <EditField label="클리어 초">

                    <input
                        type="number"
                        min="0"
                        max="59"
                        name="clearSecond"
                        value={form.clearSecond}
                        onChange={onChange}
                    />

                </EditField>

                <EditField label="레벨">

                    <input
                        type="number"
                        name="characterLevel"
                        value={form.characterLevel}
                        onChange={onChange}
                    />

                </EditField>

                <EditField label="전투력">

                    <input
                        type="number"
                        name="combatPower"
                        value={form.combatPower}
                        onChange={onChange}
                    />

                </EditField>

                <EditField label="환산">

                    <input
                        type="number"
                        step="0.001"
                        name="convertedStat"
                        value={form.convertedStat}
                        onChange={onChange}
                    />

                </EditField>

                <EditField label="보공">

                    <input
                        type="number"
                        step="0.001"
                        name="bossDamage"
                        value={form.bossDamage}
                        onChange={onChange}
                    />

                </EditField>

                <EditField label="방무">

                    <input
                        type="number"
                        step="0.001"
                        name="ignoreDefense"
                        value={form.ignoreDefense}
                        onChange={onChange}
                    />

                </EditField>

                <EditField label="크뎀">

                    <input
                        type="number"
                        step="0.001"
                        name="criticalDamage"
                        value={form.criticalDamage}
                        onChange={onChange}
                    />

                </EditField>

                <EditField label="주스탯">

                    <input
                        type="number"
                        name="mainStat"
                        value={form.mainStat}
                        onChange={onChange}
                    />

                </EditField>

                <EditField label="공격력 / 마력">

                    <input
                        type="number"
                        name="attackPower"
                        value={form.attackPower}
                        onChange={onChange}
                    />

                </EditField>

                <EditField label="HEXA">

                    <input
                        type="number"
                        step="0.001"
                        name="hexaProgress"
                        value={form.hexaProgress}
                        onChange={onChange}
                    />

                </EditField>

                <EditField label="시드링">

                    <input
                        name="seedRing"
                        value={form.seedRing}
                        onChange={onChange}
                    />

                </EditField>

                <EditField label="출처">

                    <select
                        name="sourceType"
                        value={form.sourceType}
                        onChange={onChange}
                    >

                        {SOURCE_TYPES.map(
                            ([value, label]) => (

                                <option
                                    key={value}
                                    value={value}
                                >
                                    {label}
                                </option>

                            )
                        )}

                    </select>

                </EditField>

                <EditField label="신뢰도">

                    <select
                        name="confidenceGrade"
                        value={form.confidenceGrade}
                        onChange={onChange}
                    >

                        {CONFIDENCE_GRADES.map(
                            grade => (

                                <option
                                    key={grade}
                                    value={grade}
                                >
                                    {grade}
                                </option>

                            )
                        )}

                    </select>

                </EditField>

                <EditField
                    label="출처 URL"
                    full
                >

                    <input
                        name="sourceUrl"
                        value={form.sourceUrl}
                        onChange={onChange}
                    />

                </EditField>

                <EditField
                    label="버프 / 도핑"
                    full
                >

                    <textarea
                        name="buffDescription"
                        value={form.buffDescription}
                        onChange={onChange}
                    />

                </EditField>

                <EditField
                    label="검수 메모"
                    full
                >

                    <textarea
                        name="sourceNote"
                        value={form.sourceNote}
                        onChange={onChange}
                    />

                </EditField>

                <div className="boss-edit-check">

                    <label>

                        <input
                            type="checkbox"
                            name="verified"
                            checked={form.verified}
                            onChange={onChange}
                        />

                        원본 검수 완료

                    </label>

                </div>

            </div>

        </div>
    );
}

function EditField({
                       label,
                       children,
                       full = false,
                   }) {

    return (

        <div
            className={
                `boss-edit-field ${
                    full
                        ? "full"
                        : ""
                }`
            }
        >

            <label>
                {label}
            </label>

            {children}

        </div>
    );
}

function createEditForm(
    attempt
) {

    const clearTime =
        attempt.clearTimeSeconds;

    const source =
        attempt.sources?.[0];

    return {

        bossId:
            attempt.bossId ?? "",

        characterName:
            attempt.characterName ?? "",

        characterClass:
            attempt.characterClass ?? "",

        result:
            attempt.result ?? "UNKNOWN",

        partySize:
            attempt.partySize ?? 1,

        clearMinute:
            clearTime !== null &&
            clearTime !== undefined
                ? Math.floor(
                    clearTime / 60
                )
                : "",

        clearSecond:
            clearTime !== null &&
            clearTime !== undefined
                ? clearTime % 60
                : "",

        observedBossRatio:
            attempt.observedBossRatio ?? "",

        playerSkillLevel:
            attempt.playerSkillLevel ??
            "UNKNOWN",

        gameVersion:
            attempt.gameVersion ?? "",

        recordedAt:
            toDateTimeInput(
                attempt.recordedAt
            ),

        characterLevel:
            attempt.characterLevel ?? "",

        combatPower:
            attempt.combatPower ?? "",

        convertedStat:
            attempt.convertedStat ?? "",

        bossDamage:
            attempt.bossDamage ?? "",

        ignoreDefense:
            attempt.ignoreDefense ?? "",

        criticalDamage:
            attempt.criticalDamage ?? "",

        mainStat:
            attempt.mainStat ?? "",

        attackPower:
            attempt.attackPower ?? "",

        hexaProgress:
            attempt.hexaProgress ?? "",

        seedRing:
            attempt.seedRing ?? "",

        buffDescription:
            attempt.buffDescription ?? "",

        sourceType:
            source?.sourceType ??
            "OTHER",

        sourceUrl:
            source?.sourceUrl ??
            "",

        publishedAt:
            toDateTimeInput(
                source?.publishedAt
            ),

        confidenceGrade:
            source?.confidenceGrade ??
            "D",

        verified:
            source?.verified ??
            false,

        sourceNote:
            source?.note ??
            "",
    };
}

function toDateTimeInput(
    value
) {

    if (!value) {
        return "";
    }

    return value.substring(
        0,
        16
    );
}

function DetailSection({
                           title,
                           children,
                       }) {

    return (

        <section className="boss-detail-section">

            <h3>
                {title}
            </h3>

            <div className="boss-detail-grid">
                {children}
            </div>

        </section>
    );
}

function DetailItem({
                        label,
                        value,
                    }) {

    return (

        <div className="boss-detail-item">

            <span>
                {label}
            </span>

            <strong>
                {value}
            </strong>

        </div>
    );
}