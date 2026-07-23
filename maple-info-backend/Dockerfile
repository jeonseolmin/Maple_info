# 1. 빌드 단계
FROM gradle:8.10-jdk21 AS builder

WORKDIR /app

COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

RUN chmod +x gradlew

# 의존성 캐시 활용
RUN ./gradlew dependencies --no-daemon || true

COPY src src

RUN ./gradlew clean bootJar -x test --no-daemon


# 2. 실행 단계
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]