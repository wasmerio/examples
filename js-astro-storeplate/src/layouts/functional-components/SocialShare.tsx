import React, { useEffect, useState } from "react";
import DynamicIcon from "@/helpers/DynamicIcon";

const SocialShare: React.FC<{ socialName: string; className: string; pathname: string }> = ({
  socialName,
  className,
  pathname,
}) => {
  const [baseUrl, setBaseUrl] = useState("");
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const handleCopyLink = async () => {
    const fullLink = `${baseUrl}${window.location.pathname}`;

    try {
      await navigator.clipboard.writeText(fullLink);
      // Show the tooltip
      setIsTooltipVisible(true);
      setTimeout(() => {
        setIsTooltipVisible(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <ul className={className}>
      <li>
        <a
          aria-label={socialName}
          href={`https://www.facebook.com/sharer/sharer.php?u=${baseUrl}${pathname}`}
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          <span className="sr-only">{socialName}</span>
          <DynamicIcon className="inline-block" icon={"FaFacebookF"} />
        </a>
      </li>

      <li>
        <a
          aria-label={socialName}
          href={`https://twitter.com/intent/tweet?text=${baseUrl}${pathname}`}
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          <span className="sr-only">{socialName}</span>
          <DynamicIcon className="inline-block" icon={"FaXTwitter"} />
        </a>
      </li>

      <li>
        <a
          aria-label={socialName}
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${baseUrl}${pathname}`}
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          <span className="sr-only">{socialName}</span>
          <DynamicIcon className="inline-block" icon={"FaLinkedinIn"} />
        </a>
      </li>

      <li>
        <a
          className="cursor-pointer relative"
          onClick={handleCopyLink}
          aria-label="Copy Link"
        >
          <span className="sr-only">Copy Link</span>
          {isTooltipVisible && (
            <span className="text-xs absolute -right-16 text-text dark:text-darkmode-text whitespace-nowrap">
              <DynamicIcon
                className="inline-block text-green-500"
                icon={"FaLink"}
              />{" "}
              copied!
            </span>
          )}
          <DynamicIcon className="inline-block" icon={"FaRegCopy"} />
        </a>
      </li>
    </ul>
  );
};

export default SocialShare;
