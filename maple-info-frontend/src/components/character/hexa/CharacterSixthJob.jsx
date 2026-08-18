import { useEffect, useMemo, useState } from "react";
import { getCharacterSixthJob } from "../../../api/characterApi";
import LoadingIcon from "../../loading/LoadingIcon.jsx";
import HexaCores from "./HexaCores.jsx";
import HexaStats from "./HexaStats.jsx";
import { groupHexaCores } from "./hexaUtils.js";
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
                if (!cancelled) setSixthJobData(data);
            } catch (requestError) {
                if (!cancelled) {
                    console.error("6차·HEXA 정보 조회 실패:", requestError);
                    setSixthJobData(null);
                    setError("6차와 HEXA 정보를 불러오지 못했습니다.");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchSixthJob();
        return () => { cancelled = true; };
    }, [character?.ocid]);

    const skills = useMemo(() => sixthJobData?.skills ?? [], [sixthJobData?.skills]);
    const cores = useMemo(() => sixthJobData?.cores ?? [], [sixthJobData?.cores]);
    const groupedCores = useMemo(() => groupHexaCores(cores, skills), [cores, skills]);

    if (loading) {
        return (
            <div className="sixth-job-loading">
                <LoadingIcon text="6차와 HEXA 정보를 불러오는 중..." />
            </div>
        );
    }

    if (error) return <p className="character-content__empty">{error}</p>;
    if (!hasSixthJobData(sixthJobData)) {
        return <p className="character-content__empty">6차 전직 또는 HEXA 정보가 없습니다.</p>;
    }

    return (
        <section className="sixth-job-panel">
            <header className="sixth-job-panel__header">
                <div>
                    <h2>6차 · HEXA</h2>
                    <p>코어를 선택하면 강화되는 6차 스킬을 확인할 수 있습니다.</p>
                </div>
                <span>코어 {cores.length}개</span>
            </header>

            <div className="sixth-job-content">
                <HexaCores groupedCores={groupedCores} skills={skills} />
                <HexaStats
                    activeCores1={sixthJobData.activeStatCores1 ?? []}
                    activeCores2={sixthJobData.activeStatCores2 ?? []}
                    activeCores3={sixthJobData.activeStatCores3 ?? []}
                    presetCores1={sixthJobData.presetStatCores1 ?? []}
                    presetCores2={sixthJobData.presetStatCores2 ?? []}
                    presetCores3={sixthJobData.presetStatCores3 ?? []}
                />
            </div>
        </section>
    );
}

function hasSixthJobData(data) {
    if (!data) return false;

    return (
        (data.skills?.length ?? 0) > 0 ||
        (data.cores?.length ?? 0) > 0 ||
        [
            ...(data.activeStatCores1 ?? []),
            ...(data.activeStatCores2 ?? []),
            ...(data.activeStatCores3 ?? []),
            ...(data.presetStatCores1 ?? []),
            ...(data.presetStatCores2 ?? []),
            ...(data.presetStatCores3 ?? []),
        ].length > 0
    );
}
