from parser import parse_candidate
from spring_client import send_candidate


sample_text = """
렌 하드스우 솔격

전투력 2120만
보스 배율 137.4%

8분 12초 클리어
"""


parsed = parse_candidate(
    sample_text
)

candidate = {
    **parsed,

    "characterName": None,

    "sourceType": "OTHER",

    "sourceUrl":
        "https://example.com/test-boss-data-1",

    "sourceTitle":
        "렌 하드스우 테스트 데이터",

    "rawText":
        sample_text,

    "publishedAt":
        None,
}


print(
    "파싱 결과:",
    candidate
)


send_candidate(
    candidate
)