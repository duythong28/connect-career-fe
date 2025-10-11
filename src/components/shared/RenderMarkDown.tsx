export default function RenderMarkDown({ content }: { content: string }) {
  const formatJobDescription = (html: string) => {
    // Create a temporary DOM element to parse HTML properly
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Extract only the main content div
    const mainContent = tempDiv.querySelector(".show-more-less-html__markup");

    if (!mainContent) {
      // Fallback if structure is different
      return html
        .replace(/<button[^>]*>.*?<\/button>/gs, "")
        .replace(/<icon[^>]*>.*?<\/icon>/gs, "")
        .replace(/class="[^"]*"/g, "")
        .replace(/<section[^>]*>/g, "<div>")
        .replace(/<\/section>/g, "</div>");
    }

    return (
      mainContent.innerHTML
        // Remove LinkedIn specific classes
        .replace(/class="[^"]*"/g, "")
        // Clean up HTML entities
        .replace(/&apos;/g, "'")
        .replace(/&#x2019;/g, "'")
        // Ensure proper list formatting
        .replace(/<li>\s*/g, "<li>")
        .replace(/\s*<\/li>/g, "</li>")
        // Fix spacing issues
        .replace(/<br><br>/g, "</p><p>")
        .trim()
    );
  };

  if (!content) return null;

  return (
    <div
      className="prose prose-sm max-w-none text-gray-700 
               [&>h1]:text-xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:mt-6
               [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:mb-3 [&>h2]:mt-5
               [&>h3]:text-base [&>h3]:font-medium [&>h3]:mb-2 [&>h3]:mt-4
               [&>p]:mb-4 [&>p]:leading-relaxed
               [&>ul]:mb-4 [&>ul]:pl-6 [&>ul]:list-disc [&>ul]:space-y-2
               [&>ol]:mb-4 [&>ol]:pl-6 [&>ol]:list-decimal [&>ol]:space-y-2
               [&>li]:mb-1 [&>li]:leading-relaxed
               [&>strong]:font-semibold [&>strong]:text-gray-900
               [&>br]:mb-2
               [&>a]:text-blue-600 [&>a]:underline [&>a]:hover:text-blue-800
               [&_div]:mb-3
               [&_.show-more-less-html__markup]:space-y-3
               [&_section]:space-y-4"
      dangerouslySetInnerHTML={{
        __html: formatJobDescription(content),
      }}
    />
  );
}
