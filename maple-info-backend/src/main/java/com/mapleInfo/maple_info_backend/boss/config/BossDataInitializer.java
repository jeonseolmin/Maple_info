package com.mapleInfo.maple_info_backend.boss.config;

import com.mapleInfo.maple_info_backend.boss.entity.Boss;
import com.mapleInfo.maple_info_backend.boss.repository.BossRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class BossDataInitializer implements CommandLineRunner {

    private final BossRepository bossRepository;

    public BossDataInitializer(BossRepository bossRepository) {
        this.bossRepository = bossRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // DB에 보스 데이터가 하나도 없을 때만 최초 1회 실행
        if (bossRepository.count() == 0) {

            List<Boss> bossData = Arrays.asList(
                    // === 주간 보스 ===
                    new Boss(null, "자쿰", "카오스", 8080000L),
                    new Boss(null, "블러디 퀸", "카오스", 8140000L),
                    new Boss(null, "반반", "카오스", 8150000L),
                    new Boss(null, "피에르", "카오스", 8170000L),
                    new Boss(null, "매그너스", "하드", 8560000L),
                    new Boss(null, "벨룸", "카오스", 9280000L),
                    new Boss(null, "파풀라투스", "카오스", 13100000L),
                    new Boss(null, "스우", "노멀", 16700000L),
                    new Boss(null, "데미안", "노멀", 17500000L),
                    new Boss(null, "가디언 엔젤 슬라임", "노멀", 25500000L),
                    new Boss(null, "루시드", "이지", 29800000L),
                    new Boss(null, "윌", "이지", 32300000L),
                    new Boss(null, "루시드", "노멀", 35600000L),
                    new Boss(null, "윌", "노멀", 41100000L),
                    new Boss(null, "더스크", "노멀", 44000000L),
                    new Boss(null, "듄켈", "노멀", 47500000L),
                    new Boss(null, "데미안", "하드", 48900000L),
                    new Boss(null, "스우", "하드", 51500000L),
                    new Boss(null, "루시드", "하드", 62900000L),
                    new Boss(null, "더스크", "카오스", 69800000L),
                    new Boss(null, "진 힐라", "노멀", 71200000L),
                    new Boss(null, "가디언 엔젤 슬라임", "카오스", 75100000L),
                    new Boss(null, "윌", "하드", 77100000L),
                    new Boss(null, "듄켈", "하드", 94400000L),
                    new Boss(null, "진 힐라", "하드", 106000000L),
                    new Boss(null, "선택받은 세렌", "노멀", 239000000L),
                    new Boss(null, "감시자 칼로스", "이지", 280000000L),
                    new Boss(null, "최초의 대적자", "이지", 308000000L),
                    new Boss(null, "선택받은 세렌", "하드", 356000000L),
                    new Boss(null, "카링", "이지", 377000000L),
                    new Boss(null, "감시자 칼로스", "노멀", 505000000L),
                    new Boss(null, "최초의 대적자", "노멀", 560000000L),
                    new Boss(null, "스우", "익스트림", 574000000L),
                    new Boss(null, "찬란한 흉성", "노멀", 625000000L),
                    new Boss(null, "카링", "노멀", 678000000L),
                    new Boss(null, "림보", "노멀", 1026000000L),
                    new Boss(null, "감시자 칼로스", "카오스", 1273000000L),
                    new Boss(null, "발드릭스", "노멀", 1368000000L),
                    new Boss(null, "최초의 대적자", "하드", 1435000000L),
                    new Boss(null, "유피테르", "노멀", 1615000000L),
                    new Boss(null, "카링", "하드", 1739000000L),
                    new Boss(null, "림보", "하드", 2385000000L),
                    new Boss(null, "찬란한 흉성", "하드", 2678000000L),
                    new Boss(null, "선택받은 세렌", "익스트림", 2835000000L),
                    new Boss(null, "발드릭스", "하드", 3078000000L),
                    new Boss(null, "감시자 칼로스", "익스트림", 4104000000L),
                    new Boss(null, "최초의 대적자", "익스트림", 4712000000L),
                    new Boss(null, "유피테르", "하드", 4845000000L),
                    new Boss(null, "카링", "익스트림", 5387000000L),

                    // === 월간 보스 ===
                    new Boss(null, "검은 마법사", "하드", 665000000L),
                    new Boss(null, "검은 마법사", "익스트림", 8740000000L)
            );

            bossRepository.saveAll(bossData);
            System.out.println("✅ [시스템] 최신 주간/월간 보스 결정석 가격 DB 저장 완료!");
        } else {
            System.out.println("✅ [시스템] 보스 DB가 이미 존재하여 초기화를 건너뜁니다.");
        }
    }
}