import { readFile } from "fs/promises"
import path from "path"
import { MarkdownContent } from "@/components/docs/markdown-content"

export default async function EscopoPage() {
  const filePath = path.join(process.cwd(), "docs", "Declaracao-de-Escopo.md")
  const content = await readFile(filePath, "utf-8")

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-6 sm:p-8">
      <MarkdownContent content={content} />
    </div>
  )
}
