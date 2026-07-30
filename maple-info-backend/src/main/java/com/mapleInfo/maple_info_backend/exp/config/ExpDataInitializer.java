package com.mapleInfo.maple_info_backend.exp.config;

import com.mapleInfo.maple_info_backend.exp.entity.LevelExp;
import com.mapleInfo.maple_info_backend.exp.repository.LevelExpRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class ExpDataInitializer implements CommandLineRunner {

    private final LevelExpRepository repository;

    public ExpDataInitializer(LevelExpRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) throws Exception {
        // DB에 데이터가 하나도 없을 때만(최초 1회) 삽입 로직을 실행합니다.
        if (repository.count() == 0) {
            List<LevelExp> expData = Arrays.asList(
                    // 레벨, 필요 경험치, 상급 EXP 1포인트당 경험치
                    new LevelExp(260, 1731919984062L, 388229000L),
                    new LevelExp(261, 1749239183902L, 393816000L),
                    new LevelExp(262, 1766731575741L, 399411000L),
                    new LevelExp(263, 1784398891498L, 405046000L),
                    new LevelExp(264, 1802242880412L, 411393000L),
                    new LevelExp(265, 2342915744535L, 462820000L),
                    new LevelExp(266, 2366344901980L, 469175000L),
                    new LevelExp(267, 2390008350999L, 475554000L),
                    new LevelExp(268, 2413908434508L, 482760000L),
                    new LevelExp(269, 2438047518853L, 489212000L),
                    new LevelExp(270, 5412465491853L, 550174000L),
                    new LevelExp(271, 5466590146771L, 558301000L),
                    new LevelExp(272, 5521256048238L, 565568000L),
                    new LevelExp(273, 5576468608720L, 572884000L),
                    new LevelExp(274, 5632233294807L, 581154000L),
                    new LevelExp(275, 11377111255510L, 653181000L),
                    new LevelExp(276, 12514822381061L, 661414000L),
                    new LevelExp(277, 13766304619167L, 670728000L),
                    new LevelExp(278, 15142935081083L, 679048000L),
                    new LevelExp(279, 16657228589191L, 688437000L),
                    new LevelExp(280, 33647601750165L, 773107000L),
                    new LevelExp(281, 37012361925181L, 783656000L),
                    new LevelExp(282, 40713598117699L, 793073000L),
                    new LevelExp(283, 44784957929468L, 803703000L),
                    new LevelExp(284, 49263453722414L, 813213000L),
                    new LevelExp(285, 99512176519276L, 914168000L),
                    new LevelExp(286, 109463394171203L, 924819000L),
                    new LevelExp(287, 120409733588323L, 936844000L),
                    new LevelExp(288, 132450706947155L, 948944000L),
                    new LevelExp(289, 145695777641870L, 959736000L),
                    new LevelExp(290, 294305470836577L, 1078497000L),
                    new LevelExp(291, 323736017920234L, 1078497000L),
                    new LevelExp(292, 356109619712257L, 1078497000L),
                    new LevelExp(293, 391720581683482L, 1078497000L),
                    new LevelExp(294, 430892639851830L, 1078497000L),
                    new LevelExp(295, 870403132500696L, 1078497000L),
                    new LevelExp(296, 957443445750765L, 1078497000L),
                    new LevelExp(297, 1053187790325841L, 1078497000L),
                    new LevelExp(298, 1158506569358425L, 1078497000L),
                    new LevelExp(299, 1737759854037637L, 1078497000L)
            );

            repository.saveAll(expData);
            System.out.println("✅ [시스템] 260~299 구간 필요 경험치 DB 저장 완료!");
        } else {
            System.out.println("✅ [시스템] 경험치 DB가 이미 존재하여 초기화를 건너뜁니다.");
        }
    }
}