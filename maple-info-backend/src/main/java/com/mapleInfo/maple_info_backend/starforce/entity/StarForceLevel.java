package com.mapleInfo.maple_info_backend.starforce.entity;

public enum StarForceLevel {
    // 세팅값: 현재 별, 성공확률, 실패확률, 파괴확률, 비용공식 분모
    STAR_0(0, 0.9975, 0.0025, 0.0, 36.0),
    STAR_1(1, 0.9450, 0.0550, 0.0, 36.0),
    STAR_2(2, 0.8925, 0.1075, 0.0, 36.0),
    STAR_3(3, 0.8925, 0.1075, 0.0, 36.0),
    STAR_4(4, 0.8400, 0.1600, 0.0, 36.0),
    STAR_5(5, 0.7875, 0.2125, 0.0, 36.0),
    STAR_6(6, 0.7350, 0.2650, 0.0, 36.0),
    STAR_7(7, 0.6825, 0.3175, 0.0, 36.0),
    STAR_8(8, 0.6300, 0.3700, 0.0, 36.0),
    STAR_9(9, 0.5775, 0.4225, 0.0, 36.0),
    STAR_10(10, 0.5250, 0.4750, 0.0, 571.0),
    STAR_11(11, 0.4725, 0.5275, 0.0, 314.0),
    STAR_12(12, 0.4200, 0.5800, 0.0, 214.0),
    STAR_13(13, 0.3675, 0.6325, 0.0, 157.0),
    STAR_14(14, 0.3150, 0.6850, 0.0, 107.0),
    STAR_15(15, 0.3150, 0.66445, 0.02055, 200.0),
    STAR_16(16, 0.3150, 0.66445, 0.02055, 200.0),
    STAR_17(17, 0.1575, 0.77510, 0.06740, 150.0),
    STAR_18(18, 0.1575, 0.77510, 0.08425, 70.0),
    STAR_19(19, 0.1575, 0.75825, 0.10275, 45.0),
    STAR_20(20, 0.3150, 0.58225, 0.126375, 200.0),
    STAR_21(21, 0.1575, 0.716125, 0.1685, 125.0),
    STAR_22(22, 0.1575, 0.6740, 0.1790, 200.0),
    STAR_23(23, 0.1050, 0.7160, 0.1790, 200.0),
    STAR_24(24, 0.1050, 0.7160, 0.1790, 200.0),
    STAR_25(25, 0.1050, 0.7160, 0.1790, 200.0),
    STAR_26(26, 0.0735, 0.7416, 0.1853, 200.0),
    STAR_27(27, 0.0525, 0.7580, 0.1895, 200.0),
    STAR_28(28, 0.0315, 0.7748, 0.1937, 200.0),
    STAR_29(29, 0.0105, 0.7916, 0.1979, 200.0)
    ;

    private final int level;
    private final double successRate;
    private final double failRate;
    private final double destroyRate;
    private final double costDenominator;

    StarForceLevel(int level, double successRate, double failRate, double destroyRate, double costDenominator) {
        this.level = level;
        this.successRate = successRate;
        this.failRate = failRate;
        this.destroyRate = destroyRate;
        this.costDenominator = costDenominator;
    }

    public double getSuccessRate() { return successRate; }
    public double getDestroyRate() { return destroyRate; }

    // 비용 계산 로직
    public long calculateCost(int itemLevel) {
        if (this.level <= 9) {
            // 0~9성: 1000 + L^3 * (S+1) / 36
            double base = Math.pow(itemLevel, 3) * (this.level + 1);
            return 1000 + (long) (base / this.costDenominator);
        } else {
            // 10성 이상: 1000 + L^3 * (S+1)^2.7 / 분모
            double base = Math.pow(itemLevel, 3) * Math.pow(this.level + 1, 2.7);
            return 1000 + (long) (base / this.costDenominator);
        }
    }
}