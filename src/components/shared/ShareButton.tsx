import { ExternalLink } from "lucide-react";

interface ShareButtonProps {
  pathname?: string;
  minimal?: boolean;
  text?: string;
  url?: string;
  className?: string;
}

const ShareButton = ({
  pathname,
  minimal = false,
  text,
  url,
  className,
}: ShareButtonProps) => {
  const baseUrl = import.meta.env?.VITE_BASE_URL || "";

  const fullUrl = pathname
    ? `${baseUrl.replace(/\/$/, "")}/${pathname.replace(/^\//, "")}`
    : url || baseUrl;

  return (
    <a
      href={fullUrl}
      className={`inline-flex text-xs font-bold flex-row gap-1 items-center justify-center hover:text-primary text-foreground transition-colors ${
        !minimal ? "p-2 rounded-xl border border-1" : ""
      } ${text ? "px-3" : ""} ${className || ""}`}
    >
      {text && <span className="mr-1">{text}</span>}
      <ExternalLink size={14} />
    </a>
  );
};

export default ShareButton;
