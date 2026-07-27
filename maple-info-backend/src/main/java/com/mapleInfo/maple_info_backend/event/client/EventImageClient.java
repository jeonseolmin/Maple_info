package com.mapleInfo.maple_info_backend.event.client;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;

@Component
public class EventImageClient {

    private static final String EVENT_LIST_URL =
            "https://maplestory.nexon.com/News/Event";

    public Map<Long, String> getEventImages() {
        try {
            Document document = Jsoup.connect(EVENT_LIST_URL)
                    .userAgent("Mozilla/5.0")
                    .timeout(10_000)
                    .get();

            Map<Long, String> images = new HashMap<>();

            for (Element link : document.select(
                    "a[href*='/News/Event/Ongoing/']:has(img)"
            )) {
                String href = link.attr("href");
                Element image = link.selectFirst("img[src]");

                if (image == null) {
                    continue;
                }

                Long noticeId = extractNoticeId(href);

                if (noticeId != null) {
                    images.putIfAbsent(
                            noticeId,
                            image.absUrl("src")
                    );
                }
            }

            return images;
        } catch (IOException e) {
            return Map.of();
        }
    }

    private Long extractNoticeId(String href) {
        Matcher matcher = Pattern.compile(
                "/News/Event/Ongoing/(\\d+)"
        ).matcher(href);

        if (!matcher.find()) {
            return null;
        }

        return Long.valueOf(matcher.group(1));
    }
}
