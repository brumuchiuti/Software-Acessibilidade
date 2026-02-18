import { Sparkles, Target, Scale } from "lucide-react"

const values = [
  "Liberdade",
  "Responsabilidade individual",
  "Estado democrático de direito",
  "Iniciativa privada",
  "Livre mercado",
  "Direito de propriedade",
  "Princípio da subsidiariedade",
]

export function AboutSection() {
  return (
    <section
      id="sobre"
      className="relative overflow-hidden bg-white py-24 px-4 dark:bg-[#0a1628]"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#FFD700]/5 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-[#001f3f]/10 blur-3xl dark:bg-[#FFD700]/5" />
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-[#FFD700]" />
            <span className="text-sm font-medium text-[#001f3f] dark:text-[#FFD700]">
              Instituto de Formação de Líderes (IFL)
            </span>
          </div>
          <h2 className="mb-4 font-[family-name:var(--font-serif)] text-3xl font-bold text-[#001f3f] dark:text-white sm:text-4xl md:text-5xl">
            Sobre o IFL Jovem SP
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            A referência na formação de jovens líderes comprometidos com um Brasil próspero e livre
          </p>
        </div>

        {/* Mission block */}
        <div className="relative mb-20 rounded-2xl border border-[#FFD700]/20 bg-white p-8 shadow-xl shadow-[#001f3f]/5 dark:border-[#FFD700]/20 dark:bg-[#001f3f]/40 dark:shadow-none md:p-12">
          <div className="absolute -top-4 left-8 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFD700] text-[#001f3f]">
            <Target className="h-6 w-6" />
          </div>
          <p className="mb-8 pt-6 text-xl leading-relaxed text-foreground md:text-2xl md:leading-relaxed">
            No IFL, acreditamos que{" "}
            <span className="font-semibold text-[#001f3f] dark:text-[#FFD700]">
              a verdadeira mudança começa com a liderança
            </span>
            . Somos referência na capacitação de líderes comprometidos com a construção de um Brasil
            próspero e livre.
          </p>
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-12">
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-[#001f3f] dark:text-[#FFD700]">
                <Scale className="h-5 w-5" />
                Nosso objetivo
              </h3>
              <p className="text-foreground/90">
                Formar lideranças que sejam não apenas éticas, mas também defensores incansáveis dos
                valores fundamentais para o progresso.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="text-center">
          <h3 className="mb-6 font-[family-name:var(--font-serif)] text-2xl font-semibold text-[#001f3f] dark:text-white">
            Valores que defendemos
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {values.map((value) => (
              <span
                key={value}
                className="group inline-flex items-center gap-2 rounded-full border border-[#FFD700]/30 bg-white px-5 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all hover:border-[#FFD700] hover:bg-[#FFD700]/10 hover:shadow-md dark:border-[#FFD700]/30 dark:bg-[#001f3f]/50 dark:hover:bg-[#FFD700]/10"
              >
                <span className="h-2 w-2 rounded-full bg-[#FFD700] transition-transform group-hover:scale-125" />
                {value}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
