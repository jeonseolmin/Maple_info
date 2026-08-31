import requests

SPRING_API_URL = (
    "http://localhost:8080/api/boss-candidates"
)


def send_candidate(candidate: dict):
    response = requests.post(
        SPRING_API_URL,
        json=candidate,
        timeout=10
    )

    if response.status_code == 200:
        print(
            "[SUCCESS]",
            response.json()
        )

        return response.json()

    if response.status_code == 400:
        print(
            "[SKIP / BAD REQUEST]",
            response.text
        )

        return None

    response.raise_for_status()