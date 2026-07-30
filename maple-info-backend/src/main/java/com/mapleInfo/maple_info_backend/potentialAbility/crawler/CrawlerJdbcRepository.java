package com.mapleInfo.maple_info_backend.potentialAbility.crawler;

import com.mapleInfo.maple_info_backend.potentialAbility.dto.CubeProbabilityDto;
import java.sql.*;
import java.util.List;

public class CrawlerJdbcRepository {

    private static final String DB_URL = "jdbc:postgresql://127.0.0.1:5433/maple_info_db";
    private static final String DB_USER = "postgres";
    private static final String DB_PASSWORD = "1234";

    public void saveAll(List<CubeProbabilityDto> dtoList) {
        String sql = "INSERT INTO cube_probabilities (cube_type, item_part, potential_tier, option_name, probability) VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            for (CubeProbabilityDto dto : dtoList) {
                pstmt.setString(1, dto.getCubeType().name());
                pstmt.setString(2, dto.getItemPart());
                pstmt.setString(3, dto.getPotentialTier());
                pstmt.setString(4, dto.getOptionName());
                pstmt.setDouble(5, dto.getProbability());

                pstmt.addBatch();
            }
            pstmt.executeBatch();

        } catch (SQLException e) {
            System.out.println("❌ DB 저장 중 오류 발생: " + e.getMessage());
        }
    }
}