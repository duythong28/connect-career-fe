import { ExternalLink } from "lucide-react";

const ShareButton = ({ pathname }: { pathname: string }) => {
  const baseUrl = import.meta.env?.VITE_BASE_URL || "";

  const fullUrl = `${baseUrl.replace(/\/$/, "")}/${pathname.replace(
    /^\//,
    ""
  )}`;

  return (
    <a
      href={fullUrl}
      className="inline-flex items-center justify-center p-1.5 hover:bg-accent transition-colors h-8 w-8 rounded-xl border border-1"
    >
      <ExternalLink
        size={14}
        className="text-foreground group-hover:text-black transition-colors"
      />
    </a>
  );
};

export default ShareButton;
