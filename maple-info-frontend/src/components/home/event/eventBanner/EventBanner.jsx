import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "../../../../api/axiosInstance";
import "./EventBanner.css";

const SLIDE_INTERVAL = 5000;

export default function EventBanner() {
    const [events, setEvents] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axiosInstance.get("/events");

                setEvents(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );
            } catch (fetchError) {
                console.error("이벤트 조회에 실패했습니다.", fetchError);

                setEvents([]);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const moveBanner = useCallback(
        (direction) => {
            if (events.length === 0) {
                return;
            }

            setCurrentIndex((previousIndex) => {
                return (
                    previousIndex + direction + events.length
                ) % events.length;
            });
        },
        [events.length]
    );

    useEffect(() => {
        if (events.length <= 1) {
            return undefined;
        }

        const timer = window.setInterval(() => {
            moveBanner(1);
        }, SLIDE_INTERVAL);

        return () => {
            window.clearInterval(timer);
        };
    }, [events.length, moveBanner]);



    const formatDate = (dateTime) => {
        if (!dateTime) {
            return null;
        }

        return new Intl.DateTimeFormat("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(new Date(dateTime));
    };

    if (loading) {
        return (
            <article
                className="event-banner event-banner--loading"
                aria-busy="true"
            >
                <p>이벤트를 불러오는 중입니다.</p>
            </article>
        );
    }

    if (error) {
        return (
            <article className="event-banner event-banner--empty">
                <p>이벤트를 불러오지 못했습니다.</p>
            </article>
        );
    }

    if (events.length === 0) {
        return (
            <article className="event-banner event-banner--empty">
                <p>현재 진행 중인 이벤트가 없습니다.</p>
            </article>
        );
    }

    const safeIndex = currentIndex % events.length;
    const currentEvent = events[safeIndex];
    const startDate = formatDate(currentEvent.startAt);
    const endDate = formatDate(currentEvent.endAt);

    return (
        <article className="event-banner">
            <a
                href={currentEvent.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="event-banner-link"
            >
                {currentEvent.imageUrl ? (
                    <img
                        src={currentEvent.imageUrl}
                        alt={`${currentEvent.title} 이벤트 배너`}
                        className="event-banner-image"
                    />
                ) : (
                    <div className="event-banner-image event-banner-image--fallback" />
                )}

                <div
                    className="event-banner-overlay"
                    aria-hidden="true"
                />

                <div className="event-banner-content">
                    <span className="event-banner-label">
                        MAPLESTORY EVENT
                    </span>

                    <h2>{currentEvent.title}</h2>

                    {(startDate || endDate) && (
                        <p className="event-banner-period">
                            {startDate ?? "시작일 미정"}
                            {" ~ "}
                            {endDate ?? "종료일 미정"}
                        </p>
                    )}
                </div>
            </a>

            {events.length > 1 && (
                <>
                    <button
                        type="button"
                        className="
                            event-banner-arrow
                            event-banner-arrow--left
                        "
                        onClick={() => moveBanner(-1)}
                        aria-label="이전 이벤트 보기"
                    >
                        <ChevronLeft aria-hidden="true" />
                    </button>

                    <button
                        type="button"
                        className="
                            event-banner-arrow
                            event-banner-arrow--right
                        "
                        onClick={() => moveBanner(1)}
                        aria-label="다음 이벤트 보기"
                    >
                        <ChevronRight aria-hidden="true" />
                    </button>

                    <div className="event-banner-pagination">
                        {events.map((event, index) => (
                            <button
                                key={event.noticeId}
                                type="button"
                                className={index === safeIndex ? "is-active" : ""}
                                onClick={() => setCurrentIndex(index)}
                                aria-label={`${index + 1}번째 이벤트 보기`}
                                aria-current={
                                    index === safeIndex ? "true" : undefined
                                }
                            />
                        ))}
                    </div>
                </>
            )}
        </article>
    );
}