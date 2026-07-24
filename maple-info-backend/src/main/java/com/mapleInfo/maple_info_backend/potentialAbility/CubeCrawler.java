package com.mapleInfo.maple_info_backend.potentialAbility;

import com.mapleInfo.maple_info_backend.potentialAbility.dto.CubeProbabilityDto;
import com.mapleInfo.maple_info_backend.potentialAbility.repository.CubeProbabilityRepository;
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

        try {
            // [LOOP 1] 큐브 종류(URL) 순회
            for (Map.Entry<CubeType, String> entry : targetUrls.entrySet()) {
                CubeType currentCubeType = entry.getKey();
                driver.get(entry.getValue());
                Thread.sleep(3000);

                // 1. [등급] 드롭다운 열기
                WebElement tierDropdownBtn = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("#selectGrade .cus_sel_a")));
                tierDropdownBtn.click();
                Thread.sleep(1000);

                List<WebElement> tierOptions = driver.findElements(By.cssSelector("#selectGrade ul li a"));
                int tierCount = tierOptions.size();

                // 💡 [핵심 예외 처리] 수상한 큐브 계열은 튕김 방지를 위해 레어, 에픽(앞의 2개)만 순회
                if (currentCubeType.name().contains("STRANGE")) {
                    tierCount = Math.min(2, tierCount);
                    System.out.println("⚠️ [" + currentCubeType.name() + "] 감지: 레어, 에픽 등급까지만 수집합니다.");
                }

                // [LOOP 2] 등급 순회
                for (int t = 0; t < tierCount; t++) {
                    tierOptions = driver.findElements(By.cssSelector("#selectGrade ul li a"));
                    WebElement currentTier = tierOptions.get(t);
                    String tierName = currentTier.getText(); // 예: "에픽"

                    System.out.println("\n==================================");
                    System.out.println("💎 [" + currentCubeType.name() + "] - [" + tierName + "] 등급 스크래핑 시작");
                    currentTier.click();
                    Thread.sleep(1500);

                    // 2. [장비 부위] 드롭다운 열기
                    WebElement partDropdownBtn = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("#selectPartsType .cus_sel_a")));
                    partDropdownBtn.click();
                    Thread.sleep(1000);

                    List<WebElement> partOptions = driver.findElements(By.cssSelector("#selectPartsType ul li a"));
                    int partCount = partOptions.size();

                    // [LOOP 3] 부위별 순회
                    for (int i = 0; i < partCount; i++) {
                        partOptions = driver.findElements(By.cssSelector("#selectPartsType ul li a"));
                        WebElement currentPart = partOptions.get(i);
                        String partName = currentPart.getText();

                        System.out.println("▶ [" + partName + "] 카테고리 클릭!");
                        currentPart.click();
                        Thread.sleep(1500);

                        // [LOOP 4] 10레벨부터 250레벨까지 10단위로 순회
                        for (int level = 10; level <= 250; level += 10) {
                            System.out.println("   ㄴ [레벨 " + level + "] 검색 중...");

                            WebElement levelInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("lv")));
                            levelInput.clear();
                            levelInput.sendKeys(String.valueOf(level));

                            WebElement searchBtn = driver.findElement(By.cssSelector(".btn_sc"));
                            js.executeScript("arguments[0].click();", searchBtn);

                            Thread.sleep(2000);

                            // 표 데이터 파싱
                            List<WebElement> rows = driver.findElements(By.cssSelector("table tr"));
                            for (int r = 1; r < rows.size(); r++) {
                                List<WebElement> cells = rows.get(r).findElements(By.cssSelector("td, th"));
                                if (cells.size() < 2) continue;

                                int lastIndex = cells.size() - 1;
                                String optionName = cells.get(lastIndex - 1).getText();
                                String probStr = cells.get(lastIndex).getText().replace("%", "").trim();

                                double probability = 0.0;
                                try {
                                    probability = Double.parseDouble(probStr);
                                } catch (NumberFormatException e) {
                                    continue;
                                }

                                CubeProbabilityDto dto = new CubeProbabilityDto(
                                        currentCubeType,
                                        partName + " (" + level + "레벨)",
                                        tierName, // 하드코딩 제거: 실제 선택된 등급 삽입
                                        optionName,
                                        probability
                                );
                                groupedDataMap.computeIfAbsent(partName, k -> new ArrayList<>()).add(dto);
                            }
                        }

                        // 다음 부위 클릭을 위해 부위 드롭다운 다시 열기
                        if (i < partCount - 1) {
                            partDropdownBtn = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("#selectPartsType .cus_sel_a")));
                            partDropdownBtn.click();
                            Thread.sleep(1000);
                        }
                    }

                    // 다음 등급 클릭을 위해 등급 드롭다운 다시 열기
                    if (t < tierCount - 1) {
                        tierDropdownBtn = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("#selectGrade .cus_sel_a")));
                        tierDropdownBtn.click();
                        Thread.sleep(1000);
                    }
                }
            }

            // 데이터 일괄 저장
            List<CubeProbabilityDto> finalListToSave = new ArrayList<>();
            for (List<CubeProbabilityDto> partList : groupedDataMap.values()) {
                finalListToSave.addAll(partList);
            }

            System.out.println("\n💾 총 " + finalListToSave.size() + "개의 데이터를 PostgreSQL에 저장합니다...");
            CubeProbabilityRepository repository = new CubeProbabilityRepository();
            repository.saveAll(finalListToSave);

        } catch (Exception e) {
            System.out.println("❌ 크롤링 에러 발생: " + e.getMessage());
            e.printStackTrace();
        } finally {
            driver.quit();
        }
    }
}