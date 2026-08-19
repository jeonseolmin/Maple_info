import { useEffect, useMemo, useState } from "react";
import { getCharacterSixthJob } from "../../../api/characterApi";
import LoadingIcon from "../../loading/LoadingIcon.jsx";

import HexaCores from "./core/HexaCores.jsx";
import HexaStats from "./stat/HexaStats.jsx";
import HexaMaterialSummary from "./material/HexaMaterialSummary.jsx";

import { groupHexaCores } from "./utils/hexaUtils.js";

import "./CharacterSixthJob.css";

export default function CharacterSixthJob({ character }) {
    const [sixthJobData, setSixthJobData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const ocid = character?.ocid;

        if (!ocid) {
            setSixthJobData(null);
            setLoading(false);
            setError("캐릭터 식별 정보를 찾을 수 없습니다.");
            return undefined;
        }

        let cancelled = false;

        const fetchSixthJob = async () => {
            setLoading(true);
            setError("");

            try {
                const data = await getCharacterSixthJob(ocid);

                if (!cancelled) {
                    setSixthJobData(data);
                }
            } catch (requestError) {
                if (!cancelled) {
                    console.error(
                        "6차·HEXA 정보 조회 실패:",
                        requestError,
                    );

                    setSixthJobData(null);
                    setError(
                        "6차와 HEXA 정보를 불러오지 못했습니다.",
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchSixthJob();

        return () => {
            cancelled = true;
        };
    }, [character?.ocid]);

    const skills = useMemo(
        () => sixthJobData?.skills ?? [],
        [sixthJobData?.skills],
    );

    const cores = useMemo(
        () => sixthJobData?.cores ?? [],
        [sixthJobData?.cores],
    );

    const groupedCores = useMemo(
        () => groupHexaCores(cores, skills),
        [cores, skills],
    );

    const activeCores1 =
        sixthJobData?.activeStatCores1 ?? [];

    const activeCores2 =
        sixthJobData?.activeStatCores2 ?? [];

    const activeCores3 =
        sixthJobData?.activeStatCores3 ?? [];

    if (loading) {
        return (
            <div className="sixth-job-loading">
                <LoadingIcon text="6차와 HEXA 정보를 불러오는 중..." />
            </div>
        );
    }

    if (error) {
        return (
            <p className="character-content__empty">
                {error}
            </p>
        );
    }

    if (!hasSixthJobData(sixthJobData)) {
        return (
            <p className="character-content__empty">
                6차 전직 또는 HEXA 정보가 없습니다.
            </p>
        );
    }

    return (
        <section className="sixth-job-panel">
            <header className="sixth-job-panel__header">
                <div>
                    <span className="sixth-job-panel__eyebrow">
                        SIXTH JOB
                    </span>

                    <h2 className="sixth-job-panel__title">
                        HEXA 매트릭스
                    </h2>
                </div>

                <p className="sixth-job-panel__description">
                    코어를 선택하면 스킬과 강화 정보를 확인할 수 있습니다.
                </p>
            </header>

            <div className="hexa-dashboard">
                <div className="hexa-dashboard__matrix">
                    <HexaCores
                        groupedCores={groupedCores}
                        skills={skills}
                    />
                </div>

                <aside
                    className="hexa-dashboard__summary"
                    aria-label="HEXA 요약 정보"
                >
                    <HexaMaterialSummary cores={cores} />

                    <HexaStats
                        activeCores1={activeCores1}
                        activeCores2={activeCores2}
                        activeCores3={activeCores3}
                    />
                </aside>
            </div>
        </section>
    );
}

function hasSixthJobData(data) {
    if (!data) {
        return false;
    }

    return Boolean(
        data.skills?.length ||
        data.cores?.length ||
        data.activeStatCores1?.length ||
        data.activeStatCores2?.length ||
        data.activeStatCores3?.length
    );
}