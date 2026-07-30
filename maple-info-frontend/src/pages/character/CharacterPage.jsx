import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCharacter } from "../../api/characterApi";
import CharacterProfile from "../../components/character/CharacterProfile";
import CharacterContentTabs from "../../components/character/CharacterContentTabs.jsx";
import "./CharacterPage.css";
import LoadingIcon from "../../components/loading/LoadingIcon.jsx";

export default function CharacterPage() {
    const { characterName } = useParams();

    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCharacter = async () => {
            setLoading(true);
            setError("");

            try {
                const data = await getCharacter(characterName);
                setCharacter(data);
            } catch (error) {
                if (error.response?.status === 404) {
                    setError("캐릭터를 찾을 수 없습니다.");
                } else {
                    setError(
                        "캐릭터 정보를 불러오지 못했습니다."
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCharacter();
    }, [characterName]);

    if (loading) {
        return <div>캐릭터 정보를 불러오는 중입니다.</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }
    if (loading) {
        return (
            <LoadingIcon
                text="캐릭터 정보를 불러오는 중..."
                fullScreen
            />
        );
    }
    return (
        <main className="character-page">
            <CharacterProfile character={character} />
            <CharacterContentTabs character={character} />
        </main>
    );
}