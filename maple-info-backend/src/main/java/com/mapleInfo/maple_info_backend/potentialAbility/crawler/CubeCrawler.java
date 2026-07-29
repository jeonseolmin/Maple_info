package com.mapleInfo.maple_info_backend.potentialAbility.crawler;

import com.mapleInfo.maple_info_backend.potentialAbility.dto.CubeProbabilityDto;
import com.mapleInfo.maple_info_backend.potentialAbility.entity.CubeType;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

public class CubeCrawler {

    public static void main(String[] args) {
        ChromeOptions options = new ChromeOptions();
        WebDriver driver = new ChromeDriver(options);
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        JavascriptExecutor js = (JavascriptExecutor) driver;

        Map<String, List<CubeProbabilityDto>> groupedDataMap = new HashMap<>();

        Map<CubeType, String> targetUrls = new LinkedHashMap<>();
        targetUrls.put(CubeType.RED, "https://maplestory.nexon.com/Guide/OtherProbability/Cube/red");
        targetUrls.put(CubeType.BLACK, "https://maplestory.nexon.com/Guide/OtherProbability/Cube/black");
        targetUrls.put(CubeType.ADDITIONAL, "https://maplestory.nexon.com/Guide/OtherProbability/Cube/addi");
        targetUrls.put(CubeType.STRANGE, "https://maplestory.nexon.com/Guide/OtherProbability/Cube/strange");
        targetUrls.put(CubeType.SILVER, "https://maplestory.nexon.com/Guide/OtherProbability/Cube/master");
        targetUrls.put(CubeType.ARTISAN, "https://maplestory.nexon.com/Guide/OtherProbability/Cube/artisan");
        targetUrls.put(CubeType.STRANGEADDI, "https://maplestory.nexon.com/Guide/OtherProbability/Cube/strangeAddi");

        //  [복구 모드 설정] 레드 큐브 / 에픽 / 어깨장식부터 수집을 재개합니다.
        boolean isResumeMode = true;

        try {
            for (Map.Entry<CubeType, String> entry : targetUrls.entrySet()) {
                CubeType currentCubeType = entry.getKey();
                driver.get(entry.getValue());
                Thread.sleep(3000);

                WebElement tierDropdownBtn = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("#selectGrade .cus_sel_a")));
                js.executeScript("arguments[0].click();", tierDropdownBtn);
                Thread.sleep(1000);

                List<WebElement> tierOptions = driver.findElements(By.cssSelector("#selectGrade ul li a"));
                int tierCount = tierOptions.size();

                if (currentCubeType.name().contains("STRANGE")) {
                    tierCount = Math.min(2, tierCount);
                }

                for (int t = 0; t < tierCount; t++) {
                    tierOptions = driver.findElements(By.cssSelector("#selectGrade ul li a"));
                    WebElement currentTier = tierOptions.get(t);
                    String tierName = currentTier.getText();

                    System.out.println("\n==================================");
                    System.out.println("💎 [" + currentCubeType.name() + "] - [" + tierName + "] 등급 스크래핑 시작");
                    js.executeScript("arguments[0].click();", currentTier);
                    Thread.sleep(1500);

                    WebElement partDropdownBtn = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("#selectPartsType .cus_sel_a")));
                    js.executeScript("arguments[0].click();", partDropdownBtn);
                    Thread.sleep(1000);

                    List<WebElement> partOptions = driver.findElements(By.cssSelector("#selectPartsType ul li a"));
                    int partCount = partOptions.size();

                    for (int i = 0; i < partCount; i++) {
                        partOptions = driver.findElements(By.cssSelector("#selectPartsType ul li a"));
                        WebElement currentPart = partOptions.get(i);
                        String partName = currentPart.getText();

                        System.out.println("▶ [" + partName + "] 카테고리 클릭!");
                        js.executeScript("arguments[0].click();", currentPart);
                        Thread.sleep(1000);

                        // 💡 복구 지점(어깨장식) 도착 확인 로직
                        boolean skipThisPart = false;
                        if (isResumeMode) {
                            if (currentCubeType.name().equals("RED") && tierName.equals("레전드리") && partName.equals("반지")) {
                                isResumeMode = false;
                                System.out.println("🚀 [복구 지점 도착] 여기서부터 실제 데이터 수집 및 DB 저장을 재개합니다!");
                            } else {
                                skipThisPart = true;
                                System.out.println("⏭️ (스킵) 이미 저장된 부위입니다.");
                            }
                        }

                        // 복구 지점 이전이면 레벨별 검색을 통째로 스킵
                        if (!skipThisPart) {
                            for (int level = 10; level <= 250; level += 10) {
                                System.out.println("   ㄴ [레벨 " + level + "] 검색 중...");

                                WebElement levelInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("lv")));
                                levelInput.clear();
                                levelInput.sendKeys(String.valueOf(level));

                                WebElement searchBtn = driver.findElement(By.cssSelector(".btn_sc"));
                                WebElement oldTable = driver.findElement(By.cssSelector("table")); // 이전 표 기억하기

                                js.executeScript("arguments[0].click();", searchBtn);

                                // 화면 갱신 대기 (StaleElement 방지)
                                try {
                                    wait.until(ExpectedConditions.stalenessOf(oldTable));
                                } catch (Exception e) {}

                                // 🚀 속도 개선: 자바스크립트로 표 데이터를 순식간에 긁어오기
                                String jsScript =
                                        "var result = [];" +
                                                "var rows = document.querySelectorAll('table tr');" +
                                                "for(var i=1; i<rows.length; i++) {" +
                                                "  var cells = rows[i].querySelectorAll('td, th');" +
                                                "  if(cells.length < 2) continue;" +
                                                "  var opt = cells[cells.length - 2].innerText.trim();" +
                                                "  var prob = cells[cells.length - 1].innerText.replace('%', '').trim();" +
                                                "  result.push(opt + '|||' + prob);" +
                                                "}" +
                                                "return result;";

                                int maxRetries = 3;
                                for (int attempt = 0; attempt < maxRetries; attempt++) {
                                    try {
                                        @SuppressWarnings("unchecked")
                                        List<String> rawData = (List<String>) js.executeScript(jsScript);

                                        for (String data : rawData) {
                                            String[] splitData = data.split("\\|\\|\\|");
                                            if (splitData.length < 2) continue;

                                            String optionName = splitData[0];

                                            // 🚀 등급 상승 행(예: 레어 → 에픽 등)은 필터링하여 제외
                                            if (optionName.contains("→")) {
                                                continue;
                                            }

                                            double probability = 0.0;
                                            try {
                                                probability = Double.parseDouble(splitData[1]);
                                            } catch (NumberFormatException e) {
                                                continue;
                                            }

                                            CubeProbabilityDto dto = new CubeProbabilityDto(
                                                    currentCubeType, partName + " (" + level + "레벨)", tierName, optionName, probability
                                            );
                                            groupedDataMap.computeIfAbsent(partName, k -> new ArrayList<>()).add(dto);
                                        }
                                        break;
                                    } catch (Exception e) {
                                        System.out.println("      ⚠️ 렌더링 지연 감지. 재시도 중... (" + (attempt + 1) + "/3)");
                                        Thread.sleep(500);
                                    }
                                }
                            }

                            // 부위별 수집 완료 시 즉시 DB 중간 저장
                            if (groupedDataMap.containsKey(partName)) {
                                List<CubeProbabilityDto> chunkToSave = groupedDataMap.get(partName);

                                CrawlerJdbcRepository jdbcRepository = new CrawlerJdbcRepository();
                                jdbcRepository.saveAll(chunkToSave);

                                System.out.println("💾 [" + currentCubeType.name() + " - " + tierName + " - " + partName + "] 데이터 " + chunkToSave.size() + "건 DB 중간 저장 완료!");
                                groupedDataMap.remove(partName);
                            }
                        }

                        // 다음 부위 클릭을 위해 드롭다운 다시 열기
                        if (i < partCount - 1) {
                            partDropdownBtn = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("#selectPartsType .cus_sel_a")));
                            js.executeScript("arguments[0].click();", partDropdownBtn);
                            Thread.sleep(1000);
                        }
                    }

                    if (t < tierCount - 1) {
                        tierDropdownBtn = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("#selectGrade .cus_sel_a")));
                        js.executeScript("arguments[0].click();", tierDropdownBtn);
                        Thread.sleep(1000);
                    }
                }
            }
            System.out.println("🎉 모든 크롤링 및 DB 저장이 완벽하게 종료되었습니다!");

        } catch (Exception e) {
            System.out.println("❌ 크롤링 에러 발생: " + e.getMessage());
            e.printStackTrace();
            System.out.println("💡 시스템 메시지: 에러가 발생하여 중단되었으나, 직전 부위까지의 데이터는 DB에 안전하게 보존되었습니다.");
        } finally {
            driver.quit();
        }
    }
}
