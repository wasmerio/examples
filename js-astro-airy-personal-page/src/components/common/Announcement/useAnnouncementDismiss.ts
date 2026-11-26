import { useState, useEffect } from 'preact/hooks';
import type { AnnouncementItem } from '@appTypes/common';

interface UseAnnouncementDismissResult {
    /** 当前可见的公告列表 */
    visibleAnnouncements: AnnouncementItem[];
    /** 正在消除动画中的公告 ID 列表 */
    dismissingIds: string[];
    /** 消除指定公告 */
    handleDismiss: (id: string) => void;
}

/**
 * useAnnouncementDismiss - 公告消除状态管理 Hook
 * 
 * 负责：
 * - 过滤已消除和过期的公告
 * - 管理消除动画状态
 * - localStorage 持久化已读状态
 * 
 * @param announcements - 原始公告列表
 * @returns 可见公告、消除中ID、消除处理函数
 */
export function useAnnouncementDismiss(
    announcements: AnnouncementItem[] = []
): UseAnnouncementDismissResult {
    const [visibleAnnouncements, setVisibleAnnouncements] = useState<AnnouncementItem[]>([]);
    const [dismissingIds, setDismissingIds] = useState<string[]>([]);

    // 初始化时过滤公告
    useEffect(() => {
        if (!announcements || announcements.length === 0) return;

        const now = new Date();
        let dismissedIds: string[] = [];

        try {
            dismissedIds = JSON.parse(localStorage.getItem('dismissed_announcements') || '[]');
        } catch (e) {
            console.error('Failed to parse dismissed_announcements from localStorage', e);
        }

        const active = announcements
            .filter(item => {
                // 1. 检查是否已被消除 (使用 id + publishDate 作为唯一键，允许更新后重新显示)
                const storageKey = `${item.id}_${item.publishDate || ''}`;
                if (dismissedIds.includes(storageKey)) return false;

                // 2. 检查时间范围
                const start = item.startDate ? new Date(item.startDate) : null;
                const end = item.endDate ? new Date(item.endDate) : null;

                if (start && now < start) return false;
                if (end && now > end) return false;

                return true;
            })
            .sort((a, b) => (b.priority || 0) - (a.priority || 0));

        setVisibleAnnouncements(active);
    }, [announcements]);

    // 消除公告处理函数
    const handleDismiss = (id: string): void => {
        const itemToDismiss = visibleAnnouncements.find(item => item.id === id);
        if (!itemToDismiss) return;

        // 触发退出动画
        setDismissingIds(prev => [...prev, id]);

        // 动画结束后执行清理
        setTimeout(() => {
            // 如果配置了持久化，则存入 localStorage
            if (itemToDismiss.persistent) {
                try {
                    const dismissedIds: string[] = JSON.parse(
                        localStorage.getItem('dismissed_announcements') || '[]'
                    );
                    const storageKey = `${itemToDismiss.id}_${itemToDismiss.publishDate || ''}`;
                    if (!dismissedIds.includes(storageKey)) {
                        dismissedIds.push(storageKey);
                        localStorage.setItem('dismissed_announcements', JSON.stringify(dismissedIds));
                    }
                } catch (e) {
                    console.error('Failed to save dismissal to localStorage', e);
                }
            }

            setVisibleAnnouncements(prev => prev.filter(item => item.id !== id));
            setDismissingIds(prev => prev.filter(mid => mid !== id));
        }, 500); // 与 CSS 动画时长匹配
    };

    return {
        visibleAnnouncements,
        dismissingIds,
        handleDismiss,
    };
}
