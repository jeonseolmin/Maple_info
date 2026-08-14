package com.mapleInfo.maple_info_backend.bossinfo.service;

import com.mapleInfo.maple_info_backend.bossinfo.entity.BossInfo;
import com.mapleInfo.maple_info_backend.bossinfo.repository.BossInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BossInfoService {

    private final BossInfoRepository bossInfoRepository;

    // 도감용 보스 전체 목록 조회
    @Transactional(readOnly = true)
    public List<BossInfo> getAllBossInfo() {
        return bossInfoRepository.findAll();
    }
}