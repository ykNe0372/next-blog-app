import { marked } from "marked";

export const markdownToHtml = (markdown: string): string => {
  return marked(markdown);
};
