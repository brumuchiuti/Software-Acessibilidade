"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote: "O IFL é a melhor escola que eu já tive na minha vida. Ali a gente estuda conteúdos mais próximos da prática do nosso dia a dia que não são facilmente acessíveis em outros lugares, que abre a nossa cabeça além das importantíssimas e fundamentais conexões e pessoas que conhecemos no decorrer do processo.",
    author: "Evandro Negrão",
    role: "Honorário do IFL Belo Horizonte",
    company: "Presidente da Sancruza e da MyMall",
  },
  {
    quote: "Ser IFL é ser uma liderança diferenciada. É saber que você tem acesso a um conhecimento único que permite com que você se prepare e entenda verdadeiramente a importância da liberdade. Entender a responsabilidade individual que você tem na defesa e propagação desta liberdade.",
    author: "Tatiana Mattar",
    role: "Ex-presidente do IFL Belo Horizonte",
    company: "Diretora de Massificados na Pottencial Seguradora S.A",
  },
  {
    quote: "Ser IFL é se melhorar pessoalmente, para impactar positivamente a sociedade, com o objetivo de possibilitar ao cidadão ser protagonista da sua própria vida e evitar que ele seja diariamente atrapalhado e roubado por políticos e burocratas estatais.",
    author: "Thiago Campos",
    role: "Ex-presidente do IFL Belo Horizonte",
    company: "Advogado na Magalhães & Zettel | Advogados",
  },
  {
    quote: "Ser IFL é desenvolver um novo olhar para enxergar o mundo, a partir de uma lente que tem o valor fundamental da Liberdade como princípio máximo. É enxergar as intrincadas dinâmicas políticas, econômicas e sociais; e refletir sobre como o ser humano pode prevalecer sobre a tirania.",
    author: "Guto Belchior",
    role: "Ex-presidente do IFL São Paulo e atual conselheiro do IFL Brasil",
    company: "Sócio da empresa Tarpon",
  },
  {
    quote: "O IFL é referência na formação de líderes engajados em promover um país próspero e livre. Sendo assim, nossa missão é contribuir para a construção de figuras de lideranças independentes que buscam obter conhecimento e, sobretudo, colocar em prática liderança, empreendedorismo e gestão de excelência.",
    author: "Laura Rabello",
    role: "Ex-presidente do IFL Belo Horizonte",
    company: "Fundadora da empresa LR Business Connections",
  },
  {
    quote: "O IFL me ajudou a compreender questões humanas, econômicas e políticas de forma única. Além de fazer amigos e ter tido a oportunidade de conhecer os maiores nomes acadêmicos, políticos e empresariais do Brasil e do mundo.",
    author: "Daniel Katz",
    role: "Ex-presidente do IFL Belo Horizonte",
    company: "CEO da Katz Construções e co-fundador da Cosmos3D",
  },
]

export function TestimonialsSection() {
  return (
    <section id="depoimentos" className="bg-gradient-to-b from-[#001f3f] to-[#003366] py-20 px-4">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-center font-[family-name:var(--font-serif)] text-3xl font-bold text-white sm:text-4xl">
          O que é ser IFL Jovem São Paulo
        </h2>
        <p className="mb-16 text-center text-lg text-white/80">
          Depoimentos de quem já vive essa experiência
        </p>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.author} className="md:basis-2/3 lg:basis-1/2">
                <Card className="border-[#FFD700]/20 bg-white/5">
                  <CardContent className="pt-8">
                    <Quote className="mb-4 h-10 w-10 text-[#FFD700]/50" />
                    <p className="mb-6 text-lg italic text-white/90">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="border-t border-white/10 pt-4">
                      <p className="font-semibold text-[#FFD700]">{testimonial.author}</p>
                      <p className="text-sm text-white/70">{testimonial.role}</p>
                      <p className="text-sm text-white/60">{testimonial.company}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="border-[#FFD700]/30 bg-[#001f3f] text-[#FFD700] hover:bg-[#001f3f]/80 hover:text-[#FFD700]" />
          <CarouselNext className="border-[#FFD700]/30 bg-[#001f3f] text-[#FFD700] hover:bg-[#001f3f]/80 hover:text-[#FFD700]" />
        </Carousel>
      </div>
    </section>
  )
}
