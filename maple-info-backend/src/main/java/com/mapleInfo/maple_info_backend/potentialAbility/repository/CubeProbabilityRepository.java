package com.mapleInfo.maple_info_backend.potentialAbility.repository;

import com.mapleInfo.maple_info_backend.potentialAbility.dto.CubeProbabilityDto;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

public class CubeProbabilityRepository {

    private static final String DB_URL = "jdbc:postgresql://localhost:5432/maple_info_db";
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

            pstmt.executeBatch(); // DB에 일괄 Insert
            System.out.println("✅ PostgreSQL DB 저장 완료! 총 " + dtoList.size() + "개의 데이터가 삽입되었습니다.");

        } catch (SQLException e) {
            System.out.println("❌ PostgreSQL DB 저장 중 오류 발생: " + e.getMessage());
        }
    }
}