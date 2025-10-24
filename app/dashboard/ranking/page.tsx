import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RoleBadge } from "@/components/role-badge"
import { Button } from "@/components/ui/button"
import { Trophy, Medal, Award, TrendingUp, Activity } from "lucide-react"
import Link from "next/link"

export default async function RankingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: currentUser } = await supabase
    .from("profiles")
    .select(`
      *,
      member_institute_areas (
        area
      )
    `)
    .eq("id", user.id)
    .single()

  const { data: allMembers } = await supabase
    .from("profiles")
    .select(`
      *,
      member_institute_areas (
        area
      )
    `)
    .order("total_points", { ascending: false })

  const userRank = allMembers?.findIndex((member) => member.id === user.id) ?? -1

  const topThree = allMembers?.slice(0, 3) || []
  const restOfMembers = allMembers?.slice(3) || []

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0:
        return <Trophy className="h-8 w-8 text-[#FFD700]" />
      case 1:
        return <Medal className="h-8 w-8 text-gray-400" />
      case 2:
        return <Award className="h-8 w-8 text-amber-700" />
      default:
        return null
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 0:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black"
      case 1:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-black"
      case 2:
        return "bg-gradient-to-r from-amber-600 to-amber-800 text-white"
      default:
        return "bg-white/10 text-white"
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Ranking</h1>
            <p className="text-white/60">Classificação por participação e engajamento</p>
          </div>
          <Button asChild className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
            <Link href="/dashboard/ranking/activities">
              <Activity className="mr-2 h-4 w-4" />
              Minhas Atividades
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-white/5 border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Sua Posição</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#FFD700]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#FFD700]">#{userRank + 1}</div>
            <p className="text-xs text-white/60 mt-1">de {allMembers?.length || 0} membros</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Seus Pontos</CardTitle>
            <Trophy className="h-4 w-4 text-[#FFD700]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{currentUser?.total_points || 0}</div>
            <p className="text-xs text-white/60 mt-1">pontos totais</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Diferença para o 1º</CardTitle>
            <Award className="h-4 w-4 text-[#FFD700]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {topThree[0] ? Math.max(0, (topThree[0].total_points || 0) - (currentUser?.total_points || 0)) : 0}
            </div>
            <p className="text-xs text-white/60 mt-1">pontos de diferença</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Top 3</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {topThree.map((member, index) => (
              <Card
                key={member.id}
                className={`${getRankBadgeColor(index)} border-2 ${
                  index === 0 ? "border-[#FFD700]" : "border-white/20"
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-4 border-white/20">
                        <AvatarImage src={member.avatar_url || ""} alt={member.full_name} className="object-cover" />
                        <AvatarFallback className="bg-white/20 text-2xl">
                          {member.full_name
                            .split(" ")
                            .map((n: any) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2">{getRankIcon(index)}</div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">{member.full_name}</h3>
                      <RoleBadge 
                        boardRole={member.board_role}
                        developmentLevel={member.development_level}
                        instituteAreas={member.member_institute_areas}
                      />
                    </div>

                    <div className="w-full pt-4 border-t border-white/20">
                      <p className="text-3xl font-bold">{member.total_points}</p>
                      <p className="text-sm opacity-80">pontos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Classificação Geral</h2>
          <Card className="bg-white/5 border-[#FFD700]/20">
            <CardContent className="p-0">
              <div className="divide-y divide-white/10">
                {restOfMembers.map((member, index) => {
                  const actualRank = index + 4
                  const isCurrentUser = member.id === user.id
                  return (
                    <div
                      key={member.id}
                      className={`flex items-center justify-between p-4 hover:bg-white/5 transition-colors ${
                        isCurrentUser ? "bg-[#FFD700]/10" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <span className="text-2xl font-bold text-white/60 w-12 text-center">#{actualRank}</span>

                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar_url || ""} alt={member.full_name} className="object-cover" />
                          <AvatarFallback className="bg-[#FFD700] text-black">
                            {member.full_name
                              .split(" ")
                              .map((n: any) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <p className="font-semibold text-white">
                            {member.full_name}
                            {isCurrentUser && <span className="ml-2 text-[#FFD700] text-sm">(Você)</span>}
                          </p>
                          <RoleBadge 
                        boardRole={member.board_role}
                        developmentLevel={member.development_level}
                        instituteAreas={member.member_institute_areas}
                      />
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#FFD700]">{member.total_points}</p>
                        <p className="text-xs text-white/60">pontos</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
