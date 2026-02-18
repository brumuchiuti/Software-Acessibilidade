export function AboutSection() {
  const values = [
    "Liberdade",
    "Responsabilidade individual",
    "Estado democrático de direito",
    "Iniciativa privada",
    "Livre mercado",
    "Direito de propriedade",
    "Princípio da subsidiariedade",
  ]

  return (
    <section id="sobre" className="bg-white py-20 px-4 dark:bg-[#0a1628]">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 text-center text-3xl font-bold text-[#001f3f] dark:text-white sm:text-4xl">
          Sobre o IFL Jovem SP
        </h2>
        <p className="mb-8 text-center text-lg text-muted-foreground">
          Instituto de Formação de Líderes (IFL)
        </p>
        <div className="space-y-6 text-lg leading-relaxed text-foreground">
          <p>
            No IFL, acreditamos que a verdadeira mudança começa com a liderança. 
            Somos referência na capacitação de líderes comprometidos com a construção 
            de um Brasil próspero e livre.
          </p>
          <p className="font-medium text-[#001f3f] dark:text-[#FFD700]">
            Nosso objetivo?
          </p>
          <p>
            Formar lideranças que sejam não apenas éticas, mas também defensores 
            incansáveis dos valores que acreditamos serem fundamentais para o progresso:
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {values.map((value) => (
              <li key={value} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFD700]" />
                {value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
