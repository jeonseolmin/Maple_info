import { useState } from "react";
import CharacterEquipment from "./equipment/CharacterEquipment";
import CharacterCash from "./cash/CharacterCash";
import CharacterSymbol from "./symbol/CharacterSymbol.jsx";
import "./CharacterContentTabs.css";

const TABS = [
    { id: "equipment", label: "장착 장비" },
    { id: "cashPet", label: "캐시 · 펫" },
    { id: "symbol", label: "심볼" },
    { id: "skill", label: "6차" },
];

export default function CharacterContentTabs({ character }) {
    const [activeTab, setActiveTab] = useState("equipment");

    return (
        <section className="character-content">
            <div
                className="character-content__tabs"
                role="tablist"
                aria-label="캐릭터 상세 정보"
            >
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        className={`character-content__tab ${
                            activeTab === tab.id ? "is-active" : ""
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div
                className="character-content__panel"
                role="tabpanel"
            >
                {activeTab === "equipment" && (
                    <CharacterEquipment character={character} />
                )}

                {activeTab === "cashPet" && (
                    <CharacterCash character={character} />
                )}

                {activeTab === "symbol" && (
                    <CharacterSymbol character={character} />
                )}
            </div>
        </section>
    );
}