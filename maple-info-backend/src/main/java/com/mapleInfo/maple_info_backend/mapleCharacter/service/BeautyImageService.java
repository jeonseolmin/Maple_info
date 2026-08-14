package com.mapleInfo.maple_info_backend.mapleCharacter.service;

import com.mapleInfo.maple_info_backend.mapleCharacter.client.MapleStoryIoClient;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.mapleStoryIo.MapleStoryIoBeautyImage;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.mapleStoryIo.MapleStoryIoItemResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class BeautyImageService {

    private static final Map<String, List<String>>
            COLOR_KEYWORDS = Map.ofEntries(
            Map.entry(
                    "검은색",
                    List.of("검은색", "검정", "Black")
            ),
            Map.entry(
                    "빨간색",
                    List.of("빨간색", "빨강", "Red")
            ),
            Map.entry(
                    "주황색",
                    List.of("주황색", "주황", "Orange")
            ),
            Map.entry(
                    "노란색",
                    List.of("노란색", "노랑", "Yellow")
            ),
            Map.entry(
                    "초록색",
                    List.of("초록색", "초록", "Green")
            ),
            Map.entry(
                    "파란색",
                    List.of(
                            "파란색",
                            "파랑",
                            "Blue",
                            "Sapphire"
                    )
            ),
            Map.entry(
                    "보라색",
                    List.of("보라색", "보라", "Purple")
            ),
            Map.entry(
                    "갈색",
                    List.of("갈색", "Brown", "Hazel")
            ),
            Map.entry(
                    "자수정",
                    List.of("자수정", "Amethyst", "Violet")
            ),
            Map.entry(
                    "에메랄드",
                    List.of("에메랄드", "Emerald")
            )
    );

    private final MapleStoryIoClient mapleStoryIoClient;

    public MapleStoryIoBeautyImage findHairImage(
            String hairName,
            String baseColor
    ) {
        return findImage(
                mapleStoryIoClient.getHairList(),
                hairName,
                baseColor
        );
    }

    public MapleStoryIoBeautyImage findFaceImage(
            String faceName,
            String baseColor
    ) {
        return findImage(
                mapleStoryIoClient.getFaceList(),
                faceName,
                baseColor
        );
    }

    private MapleStoryIoBeautyImage findImage(
            List<MapleStoryIoItemResponse> items,
            String nexonName,
            String baseColor
    ) {
        if (nexonName == null || nexonName.isBlank()) {
            return MapleStoryIoBeautyImage.empty();
        }

        String normalizedTarget =
                normalizeName(nexonName);

        if (normalizedTarget.isBlank()) {
            return MapleStoryIoBeautyImage.empty();
        }

        /*
         * 1순위:
         * 이름과 기본 색상이 모두 일치하는 항목
         */
        MapleStoryIoItemResponse matched =
                items.stream()
                        .filter(Objects::nonNull)
                        .filter(item ->
                                item.id() != null &&
                                        item.name() != null
                        )
                        .filter(item ->
                                normalizeName(item.name())
                                        .equals(normalizedTarget)
                        )
                        .filter(item ->
                                matchesColor(
                                        item.name(),
                                        baseColor
                                )
                        )
                        .findFirst()
                        /*
                         * 2순위:
                         * 색상은 다르더라도 외형 이름이 같은 항목
                         */
                        .orElseGet(() ->
                                items.stream()
                                        .filter(Objects::nonNull)
                                        .filter(item ->
                                                item.id() != null &&
                                                        item.name() != null
                                        )
                                        .filter(item -> {
                                            String normalizedItem =
                                                    normalizeName(item.name());

                                            return normalizedItem.equals(
                                                    normalizedTarget
                                            )
                                                    || normalizedItem.contains(
                                                    normalizedTarget
                                            )
                                                    || normalizedTarget.contains(
                                                    normalizedItem
                                            );
                                        })
                                        .findFirst()
                                        .orElse(null)
                        );

        if (matched == null) {
            log.debug(
                    "MapleStory.IO 외형 매칭 실패 - name={}, color={}",
                    nexonName,
                    baseColor
            );

            return MapleStoryIoBeautyImage.empty();
        }

        return new MapleStoryIoBeautyImage(
                matched.id(),
                mapleStoryIoClient.createIconUrl(
                        matched.id()
                )
        );
    }

    private boolean matchesColor(
            String itemName,
            String baseColor
    ) {
        if (
                itemName == null ||
                        baseColor == null ||
                        baseColor.isBlank()
        ) {
            return true;
        }

        String lowerItemName =
                itemName.toLowerCase(Locale.ROOT);

        return COLOR_KEYWORDS
                .getOrDefault(
                        baseColor,
                        List.of(baseColor)
                )
                .stream()
                .map(keyword ->
                        keyword.toLowerCase(Locale.ROOT)
                )
                .anyMatch(lowerItemName::contains);
    }

    private String normalizeName(String name) {
        if (name == null) {
            return "";
        }

        return name
                /*
                 * 한글 색상명
                 */
                .replaceAll(
                        "(검은색|검정색|검정|"
                                + "빨간색|빨강|"
                                + "주황색|주황|"
                                + "노란색|노랑|"
                                + "초록색|초록|"
                                + "파란색|파랑|"
                                + "보라색|보라|"
                                + "갈색|"
                                + "자수정|에메랄드|"
                                + "빨간빛|파란빛)",
                        ""
                )

                /*
                 * 헤어 이름에 부가적으로 붙는 표현
                 */
                .replaceAll(
                        "(흑발|백발|금발|"
                                + "적발|녹발|청발|갈발)",
                        ""
                )

                /*
                 * 영문 색상명
                 */
                .replaceAll(
                        "(?i)(black|white|red|orange|yellow|"
                                + "green|blue|purple|brown|"
                                + "hazel|sapphire|violet|"
                                + "amethyst|emerald)",
                        ""
                )

                /*
                 * 괄호 안의 성별·색상 설명 제거
                 */
                .replaceAll("\\([^)]*\\)", "")

                /*
                 * API마다 다르게 붙는 분류 표현 제거
                 */
                .replace("헤어", "")
                .replace("얼굴", "")
                .replace("페이스", "")

                /*
                 * 공백 및 특수문자 제거
                 */
                .replaceAll("[\\s_\\-]+", "")
                .trim()
                .toLowerCase(Locale.ROOT);
    }
}