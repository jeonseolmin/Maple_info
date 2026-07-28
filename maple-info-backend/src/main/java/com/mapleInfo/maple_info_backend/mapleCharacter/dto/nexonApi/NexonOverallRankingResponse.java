package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi;

import java.util.List;

public record NexonOverallRankingResponse (
        List<NexonOverallRankingItemResponse> ranking
){

}
