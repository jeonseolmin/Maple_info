package com.mapleInfo.maple_info_backend.boss.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BossAttemptResponse {

    private Long attemptId;

    private Long specSnapshotId;

    private Long sourceEvidenceId;
}