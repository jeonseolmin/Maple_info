// CharacterContentTabs.jsx
import { useState } from "react";
import CharacterEquipment from "./equipment/CharacterEquipment.jsx";
import CharacterCash from "./cash/CharcterCash.jsx";
import CharacterSymbol from "./symbol/CharcterSymbol.jsx";
import "./CharacterContentTabs.css";

export default function CharacterContentTabs({ character }) {
    const [activeTab, setActiveTab] = useState("equipment");

    const tabs = [
        { id: "equipment", label: "장착 장비" },
        { id: "cashPet", label: "캐시 · 펫" },
        { id: "symbol", label: "심볼" },
    ];

    return (
        <section className="character-content">
            <div
                className="character-content__tabs"
                role="tablist"
                aria-label="캐릭터 상세 정보"
            >
                {tabs.map((tab) => (
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

            <div className="character-content__panel" role="tabpanel">
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