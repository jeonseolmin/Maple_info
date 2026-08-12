package com.mapleInfo.maple_info_backend.bossinfo.config;

import com.mapleInfo.maple_info_backend.bossinfo.entity.BossInfo;
import com.mapleInfo.maple_info_backend.bossinfo.repository.BossInfoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class BossInfoDataInitializer implements CommandLineRunner {

    private final BossInfoRepository bossInfoRepository;

    public BossInfoDataInitializer(BossInfoRepository bossInfoRepository) {
        this.bossInfoRepository = bossInfoRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (bossInfoRepository.count() == 0) {

            List<BossInfo> bossInfoData = Arrays.asList(
                    // 1. 발록
                    BossInfo.builder().name("발록").difficulty("이지 / 노멀")
                            .description("빅토리아 아일랜드 지하 신전에 봉인된 마왕입니다. 1분 30초간 피해 제한 패턴이 존재합니다.")
                            .entryLevel(65).defenseRate(50).mainDropItem("발록의 가죽 조각").imageUrl("boss_balrog.png").build(),

                    // 2. 자쿰
                    BossInfo.builder().name("자쿰").difficulty("이지 · 노멀 · 카오스")
                            .description("폐광 깊은 곳의 고대 나무 악령입니다. 카오스 난이도는 팔 떼기와 원사이드 내려찍기 패턴이 강력합니다.")
                            .entryLevel(50).defenseRate(100).mainDropItem("응축된 힘의 결정석, 아쿠아틱 레터, 카오스 자쿰의 투구").imageUrl("boss_zakum.png").build(),

                    // 3. 매그너스
                    BossInfo.builder().name("매그너스").difficulty("이지 · 노멀 · 하드")
                            .description("노바족을 배신한 폭군입니다. 매그너스 존(Zone) 밖에서는 데미지가 감쇄되며 운석 패턴이 쏟아집니다.")
                            .entryLevel(175).defenseRate(120).mainDropItem("저주받은 카이세리움, 폭군의 위상 (타일런트 망토)").imageUrl("boss_magnus.png").build(),

                    // 4. 힐라
                    BossInfo.builder().name("힐라").difficulty("노멀 · 하드")
                            .description("아스완을 멸망시킨 군단장입니다. 하드 난이도에서는 흡혈(데들리 알타) 패턴 파훼가 핵심입니다.")
                            .entryLevel(120).defenseRate(100).mainDropItem("영생의 돌, 지옥의 불꽃, 네크로 장비 세트").imageUrl("boss_hilla.png").build(),

                    // 5. 카웅
                    BossInfo.builder().name("카웅").difficulty("노멀")
                            .description("지구방위본부의 거대 청소 로봇입니다. 카웅 부품을 모아 상점에 판매할 수 있습니다.")
                            .entryLevel(165).defenseRate(100).mainDropItem("카웅 부품").imageUrl("boss_kaung.png").build(),

                    // 6. 파풀라투스
                    BossInfo.builder().name("파풀라투스").difficulty("이지 · 노멀 · 카오스")
                            .description("루디브리엄 시계탑의 시간 침입자입니다. 시계 알람 및 레이저 교차 기믹을 파훼해야 합니다.")
                            .entryLevel(190).defenseRate(250).mainDropItem("파풀라투스 마크").imageUrl("boss_papulatus.png").build(),

                    // 7. 반반
                    BossInfo.builder().name("반반").difficulty("노멀 · 카오스")
                            .description("루타비스의 시간의 술사입니다. 시계 장판을 이용한 시간 조절 및 내면 세계 파훼가 필수적입니다.")
                            .entryLevel(180).defenseRate(100).mainDropItem("시간의 조각 (이글아이 상의)").imageUrl("boss_vonbon.png").build(),

                    // 8. 피에르
                    BossInfo.builder().name("피에르").difficulty("노멀 · 카오스")
                            .description("루타비스의 광대 보스입니다. 모자 색상(빨강/파랑)에 따른 흡수/반사 기믹과 분열 패턴이 존재합니다.")
                            .entryLevel(180).defenseRate(80).mainDropItem("조롱의 조각 (트릭스터 하의)").imageUrl("boss_pierre.png").build(),

                    // 9. 블러디 퀸
                    BossInfo.builder().name("블러디 퀸").difficulty("노멀 · 카오스")
                            .description("루타비스의 피의 여왕입니다. 희로애락 4가지 얼굴 변형 및 특수 언데드화 상태이상을 시전합니다.")
                            .entryLevel(180).defenseRate(120).mainDropItem("절규의 조각 (하이네스 모자)").imageUrl("boss_bloodyqueen.png").build(),

                    // 10. 벨룸
                    BossInfo.builder().name("벨룸").difficulty("노멀 · 카오스")
                            .description("루타비스의 심연 수호자입니다. 꼬리 찌르기, 종유석, 깊은 숨결(불뿜기) 회피 컨트롤이 핵심입니다.")
                            .entryLevel(180).defenseRate(200).mainDropItem("파멸의 조각 (파프니르 무기)").imageUrl("boss_vellum.png").build(),

                    // 11. 반 레온
                    BossInfo.builder().name("반 레온").difficulty("이지 · 노멀 · 하드")
                            .description("사자왕의 성 주인 군단장입니다. 공격 반사 및 몬스터 소환을 주의해야 합니다.")
                            .entryLevel(130).defenseRate(100).mainDropItem("로얄 반 레온 세트, 이피아의 장신구").imageUrl("boss_vonleon.png").build(),

                    // 12. 혼테일
                    BossInfo.builder().name("혼테일").difficulty("이지 · 노멀 · 카오스")
                            .description("생명의 동굴 세 머리 용입니다. 왼쪽/오른쪽 머리 파괴 후 본체 전투로 진입합니다.")
                            .entryLevel(130).defenseRate(50).mainDropItem("카오스 혼테일의 목걸이, 데아 시두스 이어링").imageUrl("boss_horntail.png").build(),

                    // 13. 아카이럼
                    BossInfo.builder().name("아카이럼").difficulty("이지 · 노멀")
                            .description("뱀의 혓바닥 군단장입니다. 륀느의 왜곡 공간을 활용해 즉사기 모니터 브레이크를 회피해야 합니다.")
                            .entryLevel(140).defenseRate(120).mainDropItem("매커네이터 펜던트, 도미네이터 펜던트, 태초의 정수").imageUrl("boss_arkarium.png").build(),

                    // 14. 핑크빈
                    BossInfo.builder().name("핑크빈").difficulty("노멀 · 카오스")
                            .description("이계에서 넘어온 악마입니다. 석상 5개를 먼저 파괴한 후 본체와 전투를 진행합니다.")
                            .entryLevel(160).defenseRate(150).mainDropItem("블랙빈 마크, 핑크빛 성배, 골든 클로버 벨트").imageUrl("boss_pinkbean.png").build(),

                    // 15. 시그너스
                    BossInfo.builder().name("시그너스").difficulty("노멀")
                            .description("타락한 여제 시그너스입니다. 각성한 기사단장들을 소환하며 회오리 봉인 패턴을 사용합니다.")
                            .entryLevel(170).defenseRate(100).mainDropItem("검은 파괴/수호의 조각, 여제 견장").imageUrl("boss_cygnus.png").build(),

                    // 16. 스우
                    BossInfo.builder().name("스우").difficulty("노멀 · 하드 · 익스트림")
                            .description("블랙윙 군단장 스우입니다. 낙하물 회피 및 레이저, 중력 구속, 대형 기계팔 돌진을 조심해야 합니다.")
                            .entryLevel(210).defenseRate(300).mainDropItem("루즈 컨트롤 머신 마크, 컴플리트 언더컨트롤 (칠흑)").imageUrl("boss_suu.png").build(),

                    // 17. 데미안
                    BossInfo.builder().name("데미안").difficulty("노멀 · 하드")
                            .description("세계수 꼭대기의 마족 군단장입니다. 체공 패턴과 낙인 스택 관리가 핵심 공략 요소입니다.")
                            .entryLevel(210).defenseRate(300).mainDropItem("마력이 깃든 안대 (칠흑), 루인 포스실드").imageUrl("boss_demian.png").build(),

                    // 18. 가디언 엔젤 슬라임
                    BossInfo.builder().name("가디언 엔젤 슬라임").difficulty("노멀 · 카오스")
                            .description("슬라임 유적의 수호자입니다. 마정석으로 문을 막아 슬라임 웨이브를 파훼하는 퍼즐 기믹이 존재합니다.")
                            .entryLevel(220).defenseRate(300).mainDropItem("가디언 엔젤 링 (여명 세트)").imageUrl("boss_slime.png").build(),

                    // 19. 루시드
                    BossInfo.builder().name("루시드").difficulty("이지 · 노멀 · 하드")
                            .description("꿈의 도시 레헬른의 군단장입니다. 강력한 탄막 회피 및 나비 떼, 레이저 폭격을 주의해야 합니다.")
                            .entryLevel(220).reqArcaneForce(360).defenseRate(300).mainDropItem("몽환의 벨트 (칠흑), 트와일라이트 마크 (여명)").imageUrl("boss_lucid.png").build(),

                    // 20. 윌
                    BossInfo.builder().name("윌").difficulty("이지 · 노멀 · 하드")
                            .description("거울 세계의 군단장입니다. 달빛 게이지를 사용해 거울을 오가는 기믹 파훼가 필수적입니다.")
                            .entryLevel(235).reqArcaneForce(760).defenseRate(300).mainDropItem("저주받은 마도서 (칠흑), 거울세계 코어 젬스톤").imageUrl("boss_will.png").build(),

                    // 21. 더스크
                    BossInfo.builder().name("더스크").difficulty("노멀 · 카오스")
                            .description("문브릿지의 거대 괴수입니다. 공포 게이지 관리와 촉수 찍기, 레이저 타겟팅을 회피해야 합니다.")
                            .entryLevel(255).reqArcaneForce(730).defenseRate(300).mainDropItem("거대한 공포 (칠흑), 에스텔라 이어링 (여명)").imageUrl("boss_dusk.png").build(),

                    // 22. 진 힐라
                    BossInfo.builder().name("진 힐라").difficulty("노멀 · 하드")
                            .description("고통의 미궁 최심부의 힐라입니다. 붉은 실 피격으로 촛대에 불을 붙여 낫 베기 전에 제단을 파훼해야 합니다.")
                            .entryLevel(250).reqArcaneForce(900).defenseRate(300).mainDropItem("고통의 근원 (칠흑), 데이브레이크 펜던트 (여명)").imageUrl("boss_hilla_verus.png").build(),

                    // 23. 듄켈
                    BossInfo.builder().name("듄켈").difficulty("노멀 · 하드")
                            .description("고통의 미궁 친위대장입니다. 타락한 엘리트 보스들의 검기 및 칼날 탄막 연타를 피해야 합니다.")
                            .entryLevel(265).reqArcaneForce(850).defenseRate(300).mainDropItem("커맨더 포스 이어링 (칠흑)").imageUrl("boss_dunkel.png").build(),

                    // 24. 검은 마법사
                    BossInfo.builder().name("검은 마법사").difficulty("하드 · 익스트림")
                            .description("메이플 월드 궁극의 존재입니다. 창세/파괴 저주 중첩 회피 및 4페이즈 파티원 분리 대응이 관건입니다.")
                            .entryLevel(255).reqArcaneForce(1320).defenseRate(300).mainDropItem("창세의 뱃지 (칠흑), 익셉셔널 해머(벨트)").imageUrl("boss_blackmage.png").build(),

                    // 25. 선택받은 세렌
                    BossInfo.builder().name("선택받은 세렌").difficulty("노멀 · 하드 · 익스트림")
                            .description("태양의 신 미트라의 수호자입니다. 정오, 석양, 자정, 여명 시간대 게이지 변화를 관리해야 합니다.")
                            .entryLevel(270).reqAuthenticForce(200).defenseRate(380).mainDropItem("미트라의 분노 (칠흑), 익셉셔널 해머(얼굴장식)").imageUrl("boss_seren.png").build(),

                    // 26. 감시자 칼로스
                    BossInfo.builder().name("감시자 칼로스").difficulty("이지 · 노멀 · 카오스 · 익스트림")
                            .description("카로테 탑의 고대병기입니다. T보이 드론 간섭 차단 및 간섭 폭주 게이지 브리핑이 핵심입니다.")
                            .entryLevel(270).reqAuthenticForce(300).defenseRate(380).mainDropItem("마력이 깃든 안대 (칠흑), 에테르넬 방어구 상자").imageUrl("boss_kalos.png").build(),

                    // 27. 최초의 대적자
                    BossInfo.builder().name("최초의 대적자").difficulty("이지 · 노멀 · 하드 · 익스트림")
                            .description("대적의 의지를 시험하는 최초의 존재입니다. 공간참과 그림자 휩쓸기 세트 패턴 파훼가 관건입니다.")
                            .entryLevel(270).reqAuthenticForce(320).defenseRate(380).mainDropItem("불멸의 유산 (광휘 세트)").imageUrl("boss_adversary.png").build(),

                    // 28. 카링
                    BossInfo.builder().name("카링").difficulty("이지 · 노멀 · 하드 · 익스트림")
                            .description("도원경에서 사흉을 다루는 연구자입니다. 3개 공간 분리 격파 및 공유 정신력 수치 관리가 필수입니다.")
                            .entryLevel(275).reqAuthenticForce(330).defenseRate(380).mainDropItem("혼돈의 칠흑 장신구 상자, 에테르넬 방어구 상자").imageUrl("boss_karing.png").build(),

                    // 29. 찬란한 흉성
                    BossInfo.builder().name("찬란한 흉성").difficulty("노멀 · 하드")
                            .description("검은 바다의 현혹을 다루는 보스입니다. 미혹의 심연 및 환영 투영/현실 자각 기믹을 활용해야 합니다.")
                            .entryLevel(280).reqAuthenticForce(400).defenseRate(380).mainDropItem("황홀한 악몽 (광휘 세트), 신념의 연마석").imageUrl("boss_shining_star.png").build(),

                    // 30. 벨로나
                    BossInfo.builder().name("벨로나").difficulty("이지 · 노멀 · 하드")
                            .description("그란디스 신규 지역의 강력한 보스입니다. 정교한 연계 패턴 회피와 딜 타이밍 확보가 중요합니다.")
                            .entryLevel(280).reqAuthenticForce(450).defenseRate(380).mainDropItem("신규 장신구 및 고급 재화").imageUrl("boss_vellona.png").build(),

                    // 31. 림보
                    BossInfo.builder().name("림보").difficulty("노멀 · 하드")
                            .description("근원의 지식을 다루는 하이레프 사도입니다. 침식 수치 관리 및 3페이즈 흑/백 패턴 파훼가 핵심입니다.")
                            .entryLevel(285).reqAuthenticForce(550).defenseRate(380).mainDropItem("근원의 속삭임 (광휘 세트), 왜곡된 욕망의 결정").imageUrl("boss_limbo.png").build(),

                    // 32. 발드릭스
                    BossInfo.builder().name("발드릭스").difficulty("노멀 · 하드")
                            .description("마력을 다루는 고대신의 사념 보스입니다. 마력 잠식 수치 관리 및 영혼 처형 상태 파훼가 필수적입니다.")
                            .entryLevel(290).reqAuthenticForce(700).defenseRate(380).mainDropItem("죽음의 맹세 (광휘 세트), 영원한 충성의 흔적").imageUrl("boss_baldrix.png").build(),

                    // 33. 유피테르
                    BossInfo.builder().name("유피테르").difficulty("노멀 · 하드")
                            .description("뇌전과 연성체의 힘을 다루는 그란디스 최상위 보스입니다. 파열 수치 관리 및 3초 공통 재사용 대기시간 패턴 대응이 필요합니다.")
                            .entryLevel(295).reqAuthenticForce(800).defenseRate(380).mainDropItem("오만의 원죄 (광휘 세트), 뒤틀린 갈망의 편린").imageUrl("boss_jupiter.png").build(),

                    // 34. 카이 (시즌 보스)
                    BossInfo.builder().name("카이").difficulty("시즌 (노멀 · 하드)")
                            .description("특정 기간에만 입장 가능한 시즌 한정 스페셜 보스입니다. 다이나믹한 격투 스타일의 패턴을 보여줍니다.")
                            .entryLevel(200).defenseRate(300).mainDropItem("시즌 한정 치장 아이템, 시즌 보스 코인").imageUrl("boss_kai.png").build(),

                    // 35. 메이린 (시즌 보스)
                    BossInfo.builder().name("메이린").difficulty("시즌 (노멀 · 하드)")
                            .description("특정 기간에만 입장 가능한 시즌 한정 스페셜 보스입니다. 빠른 기동성과 환영 패턴이 특징입니다.")
                            .entryLevel(200).defenseRate(300).mainDropItem("시즌 한정 치장 아이템, 시즌 보스 코인").imageUrl("boss_meirin.png").build()
            );

            bossInfoRepository.saveAll(bossInfoData);
            System.out.println("✅ [시스템] 총 35개 전체 보스 도감(BossInfo) DB 데이터 초기 세팅 완료!");
        }
    }
}