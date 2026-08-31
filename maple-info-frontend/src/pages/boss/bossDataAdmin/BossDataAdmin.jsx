import { useEffect, useMemo, useState } from "react";
import {
    createBossAttempt,
    getBossData,
} from "../../../api/bossAttemptApi.js";

import "./BossDataAdmin.css";

const INITIAL_FORM = {
    bossId: "",

    characterName: "",
    characterClass: "",

    result: "CLEAR",

    partySize: 1,

    clearMinute: "",
    clearSecond: "",

    observedBossRatio: "",

    playerSkillLevel: "UNKNOWN",

    gameVersion: "",
    recordedAt: "",

    characterLevel: "",
    combatPower: "",

    convertedStat: "",

    bossDamage: "",
    ignoreDefense: "",
    criticalDamage: "",

    mainStat: "",
    attackPower: "",

    hexaProgress: "",

    seedRing: "",
    buffDescription: "",

    sourceType: "YOUTUBE",
    sourceUrl: "",

    publishedAt: "",

    confidenceGrade: "B",

    verified: false,

    sourceNote: "",
};

const JOBS = [
    "히어로",
    "팔라딘",
    "다크나이트",
    "아크메이지(불,독)",
    "아크메이지(썬,콜)",
    "비숍",
    "보우마스터",
    "신궁",
    "패스파인더",
    "나이트로드",
    "섀도어",
    "듀얼블레이드",
    "바이퍼",
    "캡틴",
    "캐논슈터",

    "소울마스터",
    "미하일",
    "플레임위자드",
    "윈드브레이커",
    "나이트워커",
    "스트라이커",

    "아란",
    "에반",
    "루미너스",
    "메르세데스",
    "팬텀",
    "은월",

    "데몬슬레이어",
    "데몬어벤져",
    "블래스터",
    "배틀메이지",
    "와일드헌터",
    "메카닉",
    "제논",

    "카이저",
    "카인",
    "카데나",
    "엔젤릭버스터",

    "아델",
    "일리움",
    "칼리",
    "아크",

    "라라",
    "호영",

    "제로",
    "키네시스",

    "렌",
];

const SOURCE_TYPES = [
    ["YOUTUBE", "YouTube"],
    ["INVEN", "메이플 인벤"],
    ["MAPLE_COMMUNITY", "메이플 공식 커뮤니티"],
    ["MAPLE_SCOUTER", "환산주스탯"],
    ["USER_SUBMISSION", "사용자 제보"],
    ["OTHER", "기타"],
];

const CONFIDENCE = [
    ["S", "S - 영상 + 스펙 + 시간 직접 확인"],
    ["A", "A - 주요 스펙과 시간 확인"],
    ["B", "B - 일부 스펙 확인"],
    ["C", "C - 사용자 작성 기록"],
    ["D", "D - 간접 정보 / 참고용"],
];

const BossDataAdmin = () => {

    const [form, setForm] = useState(INITIAL_FORM);

    const [bosses, setBosses] = useState([]);

    const [loading, setLoading] = useState(false);
    const [bossLoading, setBossLoading] = useState(true);

    const [message, setMessage] = useState(null);

    useEffect(() => {
        loadBosses();
    }, []);

    const loadBosses = async () => {

        setBossLoading(true);

        try {

            const data = await getBossData();

            const bossList = data.bosses || [];

            const sorted = [...bossList].sort((a, b) => {

                if (a.name === b.name) {
                    return a.difficulty.localeCompare(b.difficulty, "ko");
                }

                return a.name.localeCompare(b.name, "ko");
            });

            setBosses(sorted);

        } catch (error) {

            console.error("보스 데이터 조회 실패:", error);

            setMessage({
                type: "error",
                text: "보스 목록을 불러오지 못했습니다.",
            });

        } finally {

            setBossLoading(false);
        }
    };

    const selectedBoss = useMemo(() => {

        return bosses.find(
            boss => String(boss.id) === String(form.bossId)
        );

    }, [bosses, form.bossId]);

    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked
        } = event.target;

        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox"
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

    const nullableDateTime = value => {

        if (!value) {
            return null;
        }

        return value.length === 16
            ? `${value}:00`
            : value;
    };

    const getClearTimeSeconds = () => {

        if (form.result !== "CLEAR") {
            return null;
        }

        if (
            form.clearMinute === "" &&
            form.clearSecond === ""
        ) {
            return null;
        }

        const minute = Number(form.clearMinute || 0);
        const second = Number(form.clearSecond || 0);

        return minute * 60 + second;
    };

    const validate = () => {

        if (!form.bossId) {
            return "보스를 선택해주세요.";
        }

        if (!form.characterClass.trim()) {
            return "직업을 선택해주세요.";
        }

        if (!form.result) {
            return "도전 결과를 선택해주세요.";
        }

        if (Number(form.partySize) < 1) {
            return "파티 인원은 최소 1명입니다.";
        }

        if (
            form.result === "CLEAR" &&
            form.clearSecond !== "" &&
            Number(form.clearSecond) >= 60
        ) {
            return "초는 0~59 사이로 입력해주세요.";
        }

        if (
            form.observedBossRatio !== "" &&
            Number(form.observedBossRatio) <= 0
        ) {
            return "보스 배율은 0보다 커야 합니다.";
        }

        if (!form.sourceUrl.trim()) {
            return "출처 URL을 입력해주세요.";
        }

        return null;
    };

    const handleSubmit = async event => {

        event.preventDefault();

        setMessage(null);

        const validationMessage = validate();

        if (validationMessage) {

            setMessage({
                type: "error",
                text: validationMessage,
            });

            return;
        }

        const payload = {

            bossId: Number(form.bossId),

            characterName:
                form.characterName.trim() || null,

            characterClass:
                form.characterClass.trim(),

            result: form.result,

            partySize: Number(form.partySize),

            clearTimeSeconds: getClearTimeSeconds(),

            observedBossRatio:
                nullableNumber(form.observedBossRatio),

            /*
             * 자체 배율 계산식은 아직 없으므로 null 유지
             */
            normalizedBossRatio: null,
            normalizationVersion: null,

            playerSkillLevel:
            form.playerSkillLevel,

            gameVersion:
                form.gameVersion.trim() || null,

            recordedAt:
                nullableDateTime(form.recordedAt),

            characterLevel:
                nullableNumber(form.characterLevel),

            combatPower:
                nullableNumber(form.combatPower),

            convertedStat:
                nullableNumber(form.convertedStat),

            bossDamage:
                nullableNumber(form.bossDamage),

            ignoreDefense:
                nullableNumber(form.ignoreDefense),

            criticalDamage:
                nullableNumber(form.criticalDamage),

            mainStat:
                nullableNumber(form.mainStat),

            attackPower:
                nullableNumber(form.attackPower),

            hexaProgress:
                nullableNumber(form.hexaProgress),

            seedRing:
                form.seedRing.trim() || null,

            buffDescription:
                form.buffDescription.trim() || null,

            sourceType:
            form.sourceType,

            sourceUrl:
                form.sourceUrl.trim(),

            publishedAt:
                nullableDateTime(form.publishedAt),

            confidenceGrade:
            form.confidenceGrade,

            verified:
            form.verified,

            sourceNote:
                form.sourceNote.trim() || null,
        };

        setLoading(true);

        try {

            const response =
                await createBossAttempt(payload);

            setMessage({
                type: "success",
                text:
                    `데이터가 등록되었습니다. ` +
                    `Attempt ID: ${response.attemptId}`,
            });

            /*
             * 반복 입력할 때
             * 출처 유형/직업 등의 값은 유지하지 않고
             * 완전히 초기화합니다.
             */
            setForm(INITIAL_FORM);

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

        } catch (error) {

            console.error(
                "보스컷 데이터 등록 실패:",
                error
            );

            const serverMessage =
                error.response?.data?.message;

            setMessage({
                type: "error",
                text:
                    serverMessage ||
                    "데이터 등록에 실패했습니다.",
            });

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="boss-data-page">

            <div className="boss-data-header">

                <div>

                    <span className="boss-data-eyebrow">
                        BOSS DATASET
                    </span>

                    <h1>
                        보스컷 데이터 등록
                    </h1>

                    <p>
                        실제 보스 도전 기록과 당시 스펙을
                        데이터셋으로 저장합니다.
                    </p>

                </div>

                <div className="boss-data-status">

                    <span className="status-dot" />

                    수동 데이터 수집

                </div>

            </div>

            {message && (

                <div
                    className={
                        `boss-data-message ${message.type}`
                    }
                >
                    {message.text}
                </div>

            )}

            <form
                onSubmit={handleSubmit}
                className="boss-data-form"
            >

                {/* =========================
                    보스 도전 정보
                ========================= */}

                <section className="boss-data-card">

                    <div className="boss-card-heading">

                        <div>

                            <span className="section-number">
                                01
                            </span>

                            <h2>
                                보스 도전 정보
                            </h2>

                        </div>

                        <span className="required-guide">
                            * 핵심 데이터
                        </span>

                    </div>

                    <div className="boss-form-grid">

                        <Field
                            label="보스"
                            required
                        >

                            <select
                                name="bossId"
                                value={form.bossId}
                                onChange={handleChange}
                                disabled={bossLoading}
                            >

                                <option value="">
                                    {bossLoading
                                        ? "불러오는 중..."
                                        : "보스를 선택하세요"}
                                </option>

                                {bosses.map(boss => (

                                    <option
                                        key={boss.id}
                                        value={boss.id}
                                    >
                                        {boss.name}
                                        {" · "}
                                        {boss.difficulty}
                                    </option>

                                ))}

                            </select>

                        </Field>

                        <Field
                            label="직업"
                            required
                        >

                            <select
                                name="characterClass"
                                value={form.characterClass}
                                onChange={handleChange}
                            >

                                <option value="">
                                    직업 선택
                                </option>

                                {JOBS.map(job => (

                                    <option
                                        key={job}
                                        value={job}
                                    >
                                        {job}
                                    </option>

                                ))}

                            </select>

                        </Field>

                        <Field label="캐릭터명">

                            <input
                                name="characterName"
                                value={form.characterName}
                                onChange={handleChange}
                                placeholder="확인 가능한 경우 입력"
                            />

                        </Field>

                        <Field label="도전 결과" required>

                            <select
                                name="result"
                                value={form.result}
                                onChange={handleChange}
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

                        </Field>

                        <Field label="파티 인원">

                            <select
                                name="partySize"
                                value={form.partySize}
                                onChange={handleChange}
                            >

                                {[1, 2, 3, 4, 5, 6].map(
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

                        </Field>

                        <Field label="플레이 숙련도">

                            <select
                                name="playerSkillLevel"
                                value={form.playerSkillLevel}
                                onChange={handleChange}
                            >
                                <option value="UNKNOWN">
                                    확인 불가
                                </option>

                                <option value="BEGINNER">
                                    초보
                                </option>

                                <option value="NORMAL">
                                    일반
                                </option>

                                <option value="EXPERIENCED">
                                    숙련
                                </option>
                            </select>

                        </Field>

                    </div>

                    {form.result === "CLEAR" && (

                        <div className="boss-time-area">

                            <span className="boss-time-label">
                                실제 클리어 시간
                            </span>

                            <div className="boss-time-input">

                                <input
                                    type="number"
                                    min="0"
                                    name="clearMinute"
                                    value={form.clearMinute}
                                    onChange={handleChange}
                                    placeholder="00"
                                />

                                <span>분</span>

                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    name="clearSecond"
                                    value={form.clearSecond}
                                    onChange={handleChange}
                                    placeholder="00"
                                />

                                <span>초</span>

                            </div>

                        </div>

                    )}

                    {selectedBoss && (

                        <div className="selected-boss">

                            현재 선택

                            <strong>
                                {selectedBoss.name}
                                {" · "}
                                {selectedBoss.difficulty}
                            </strong>

                        </div>

                    )}

                </section>

                {/* =========================
                    배율
                ========================= */}

                <section className="boss-data-card ratio-card">

                    <div className="boss-card-heading">

                        <div>

                            <span className="section-number">
                                02
                            </span>

                            <h2>
                                보스 배율
                            </h2>

                        </div>

                    </div>

                    <div className="ratio-main">

                        <div>

                            <label>
                                자료에서 확인한 배율
                            </label>

                            <p>
                                원본 자료에 표시된 값을 그대로
                                기록합니다.
                            </p>

                        </div>

                        <div className="ratio-input-wrap">

                            <input
                                type="number"
                                step="0.001"
                                min="0"
                                name="observedBossRatio"
                                value={form.observedBossRatio}
                                onChange={handleChange}
                                placeholder="137.4"
                            />

                            <span>%</span>

                        </div>

                    </div>

                    <div className="ratio-notice">

                        이 값은 원본 데이터입니다.
                        추후 Maple_info 자체 계산식이 만들어져도
                        수정하지 않습니다.

                    </div>

                </section>

                {/* =========================
                    캐릭터 스펙
                ========================= */}

                <section className="boss-data-card">

                    <div className="boss-card-heading">

                        <div>

                            <span className="section-number">
                                03
                            </span>

                            <h2>
                                당시 캐릭터 스펙
                            </h2>

                        </div>

                        <span className="optional-guide">
                            모르는 값은 비워두세요
                        </span>

                    </div>

                    <div className="boss-form-grid three">

                        <NumberField
                            label="레벨"
                            name="characterLevel"
                            value={form.characterLevel}
                            onChange={handleChange}
                            placeholder="285"
                        />

                        <NumberField
                            label="전투력"
                            name="combatPower"
                            value={form.combatPower}
                            onChange={handleChange}
                            placeholder="31200000"
                        />

                        <NumberField
                            label="환산"
                            name="convertedStat"
                            value={form.convertedStat}
                            onChange={handleChange}
                            step="0.001"
                            placeholder="5.62"
                        />

                        <NumberField
                            label="보스 데미지"
                            name="bossDamage"
                            value={form.bossDamage}
                            onChange={handleChange}
                            step="0.001"
                            suffix="%"
                            placeholder="391"
                        />

                        <NumberField
                            label="방어율 무시"
                            name="ignoreDefense"
                            value={form.ignoreDefense}
                            onChange={handleChange}
                            step="0.001"
                            suffix="%"
                            placeholder="96.8"
                        />

                        <NumberField
                            label="크리티컬 데미지"
                            name="criticalDamage"
                            value={form.criticalDamage}
                            onChange={handleChange}
                            step="0.001"
                            suffix="%"
                            placeholder="88.5"
                        />

                        <NumberField
                            label="주스탯"
                            name="mainStat"
                            value={form.mainStat}
                            onChange={handleChange}
                            placeholder="52000"
                        />

                        <NumberField
                            label="공격력 / 마력"
                            name="attackPower"
                            value={form.attackPower}
                            onChange={handleChange}
                            placeholder="4200"
                        />

                        <NumberField
                            label="HEXA 진행도"
                            name="hexaProgress"
                            value={form.hexaProgress}
                            onChange={handleChange}
                            step="0.001"
                            suffix="%"
                            placeholder="48.3"
                        />

                        <Field label="시드링">

                            <input
                                name="seedRing"
                                value={form.seedRing}
                                onChange={handleChange}
                                placeholder="예: 리스트레인트 링 4레벨"
                            />

                        </Field>

                        <Field label="게임 버전 / 패치 구간">

                            <input
                                name="gameVersion"
                                value={form.gameVersion}
                                onChange={handleChange}
                                placeholder="예: 2026-08"
                            />

                        </Field>

                        <Field label="실제 도전일">

                            <input
                                type="datetime-local"
                                name="recordedAt"
                                value={form.recordedAt}
                                onChange={handleChange}
                            />

                        </Field>

                    </div>

                    <Field
                        label="도핑 / 버프 정보"
                        full
                    >

                        <textarea
                            name="buffDescription"
                            value={form.buffDescription}
                            onChange={handleChange}
                            placeholder="영상이나 게시글에서 확인한 도핑, 버프 등의 정보를 기록하세요."
                        />

                    </Field>

                </section>

                {/* =========================
                    출처
                ========================= */}

                <section className="boss-data-card">

                    <div className="boss-card-heading">

                        <div>

                            <span className="section-number">
                                04
                            </span>

                            <h2>
                                출처 및 검수
                            </h2>

                        </div>

                    </div>

                    <div className="boss-form-grid">

                        <Field label="출처 종류">

                            <select
                                name="sourceType"
                                value={form.sourceType}
                                onChange={handleChange}
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

                        </Field>

                        <Field label="신뢰 등급">

                            <select
                                name="confidenceGrade"
                                value={form.confidenceGrade}
                                onChange={handleChange}
                            >

                                {CONFIDENCE.map(
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

                        </Field>

                        <Field
                            label="출처 URL"
                            required
                            full
                        >

                            <input
                                type="url"
                                name="sourceUrl"
                                value={form.sourceUrl}
                                onChange={handleChange}
                                placeholder="https://..."
                            />

                        </Field>

                        <Field label="게시 / 업로드 날짜">

                            <input
                                type="datetime-local"
                                name="publishedAt"
                                value={form.publishedAt}
                                onChange={handleChange}
                            />

                        </Field>

                        <div className="verified-field">

                            <label className="check-label">

                                <input
                                    type="checkbox"
                                    name="verified"
                                    checked={form.verified}
                                    onChange={handleChange}
                                />

                                <span className="custom-check">
                                    ✓
                                </span>

                                원본 직접 검수 완료

                            </label>

                        </div>

                    </div>

                    <Field
                        label="검수 메모"
                        full
                    >

                        <textarea
                            name="sourceNote"
                            value={form.sourceNote}
                            onChange={handleChange}
                            placeholder="예: 03:42에서 스펙창 확인 / 클리어 시간은 영상 전체 재생시간 기준"
                        />

                    </Field>

                </section>

                <div className="boss-submit-area">

                    <div className="submit-summary">

                        <strong>
                            데이터 등록 전 확인
                        </strong>

                        <span>
                            확인되지 않은 값을 추정해서
                            입력하지 마세요.
                        </span>

                    </div>

                    <button
                        type="submit"
                        className="boss-submit-button"
                        disabled={loading}
                    >

                        {loading
                            ? "등록 중..."
                            : "보스 기록 등록"}
                    </button>

                </div>

            </form>

        </div>
    );
};

function Field({
                   label,
                   children,
                   required = false,
                   full = false,
               }) {

    return (

        <div
            className={
                `boss-field ${full ? "full" : ""}`
            }
        >

            <label>

                {label}

                {required && (
                    <span className="required">
                        *
                    </span>
                )}

            </label>

            {children}

        </div>
    );
}

function NumberField({
                         label,
                         name,
                         value,
                         onChange,
                         placeholder,
                         suffix,
                         step = "1",
                     }) {

    return (

        <Field label={label}>

            <div className="number-input-wrap">

                <input
                    type="number"
                    min="0"
                    step={step}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                />

                {suffix && (
                    <span>
                        {suffix}
                    </span>
                )}

            </div>

        </Field>
    );
}

export default BossDataAdmin;