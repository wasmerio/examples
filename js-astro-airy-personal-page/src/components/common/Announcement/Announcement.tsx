import { ANNOUNCEMENT_TYPE_MAP } from '@constants/ui';
import { useAnnouncementDismiss } from './useAnnouncementDismiss';
import AnnouncementIcon from './AnnouncementIcon';
import type { AnnouncementProps } from '@appTypes/common';

import './announcement.css';

/**
 * Announcement - 全局公告组件
 * 
 * 功能：
 * - 读取 site.yaml 配置并展示多条公告
 * - 支持语义化颜色（Info/Success/Warning/Error）
 * - 基于 localStorage 的用户消除状态持久化
 * - 支持定时显示（startDate/endDate）
 * 
 * @example
 * <Announcement announcements={[{ id: 'test', title: 'Hello', type: 'info' }]} client:idle />
 */
export default function Announcement({ announcements = [] }: AnnouncementProps) {
    const { visibleAnnouncements, dismissingIds, handleDismiss } = useAnnouncementDismiss(announcements);

    if (visibleAnnouncements.length === 0) return null;

    return (
        <div className="announcement-container">
            {visibleAnnouncements.map((item) => (
                <div
                    key={item.id}
                    className={`announcement-item ${dismissingIds.includes(item.id) ? 'is-dismissing' : ''}`}
                    data-type={item.type || ANNOUNCEMENT_TYPE_MAP.INFO}
                    /* 自定义颜色支持 */
                    style={item.color ? {
                        '--accent-color': item.color,
                        '--accent-bg': `color-mix(in srgb, ${item.color}, transparent 90%)`
                    } as preact.CSSProperties : undefined}
                >
                    <div className="announcement-content">
                        <div className="announcement-icon">
                            <AnnouncementIcon type={item.type} />
                        </div>
                        <div className="announcement-text">
                            <span className="announcement-title">{item.title}</span>
                            {(item.content || item.publishDate) && (
                                <div className="announcement-details">
                                    {item.content && (
                                        <span className="announcement-description">{item.content}</span>
                                    )}
                                    {item.publishDate && (
                                        <span className="announcement-date">{item.publishDate}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="announcement-actions">
                        {item.link && (
                            <a
                                href={item.link.url}
                                className="announcement-link"
                                target={item.link.external ? "_blank" : "_self"}
                                rel={item.link.external ? "noopener noreferrer" : undefined}
                            >
                                {item.link.text || '了解更多'}
                            </a>
                        )}
                        <button
                            className="announcement-close"
                            onClick={() => handleDismiss(item.id)}
                            aria-label="关闭详情"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
