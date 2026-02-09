"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { FileText, Calendar, Eye, Clock, Users } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    scheduledPosts: 0,
    draftPosts: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    thisMonthAppointments: 0,
  });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Total posts
      const { count: totalCount } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true });

      // Published posts
      const { count: publishedCount } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("published", true);

      // Scheduled posts
      const { count: scheduledCount } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("published", false)
        .not("scheduled_at", "is", null);

      // Draft posts
      const { count: draftCount } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("published", false)
        .is("scheduled_at", null);

      // Appointments stats
      const { count: totalAppointments } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true });

      const { count: pendingAppointments } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      const { count: confirmedAppointments } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("status", "confirmed");

      // This month appointments
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const { count: thisMonthAppointments } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .gte("appointment_date", startOfMonth.toISOString());

      setStats({
        totalPosts: totalCount || 0,
        publishedPosts: publishedCount || 0,
        scheduledPosts: scheduledCount || 0,
        draftPosts: draftCount || 0,
        totalAppointments: totalAppointments || 0,
        pendingAppointments: pendingAppointments || 0,
        confirmedAppointments: confirmedAppointments || 0,
        thisMonthAppointments: thisMonthAppointments || 0,
      });

      // Recent posts
      const { data: posts } = await supabase
        .from("posts")
        .select(`
          *,
          categories (
            id,
            name,
            slug
          )
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      setRecentPosts(posts || []);

      // Recent appointments
      const { data: appointments } = await supabase
        .from("appointments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      setRecentAppointments(appointments || []);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total de Posts",
      value: stats.totalPosts,
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      title: "Publicados",
      value: stats.publishedPosts,
      icon: Eye,
      color: "bg-green-500",
    },
    {
      title: "Agendamentos",
      value: stats.totalAppointments,
      icon: Calendar,
      color: "bg-purple-500",
      link: "/admin/appointments",
    },
    {
      title: "Este Mês",
      value: stats.thisMonthAppointments,
      icon: Users,
      color: "bg-primary-500",
      link: "/admin/appointments?dateFilter=month",
    },
    {
      title: "Pendentes",
      value: stats.pendingAppointments,
      icon: Clock,
      color: "bg-yellow-500",
      link: "/admin/appointments?filter=pending",
    },
    {
      title: "Confirmados",
      value: stats.confirmedAppointments,
      icon: Eye,
      color: "bg-green-500",
      link: "/admin/appointments?filter=confirmed",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Visão geral do seu conteúdo e estatísticas
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const CardContent = (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          );

          if (stat.link) {
            return (
              <Link
                key={stat.title}
                href={stat.link}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow block"
              >
                {CardContent}
              </Link>
            );
          }

          return (
            <div
              key={stat.title}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              {CardContent}
            </div>
          );
        })}
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Posts Recentes</h2>
          <Link
            href="/admin/posts"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Ver todos →
          </Link>
        </div>
        <div className="divide-y divide-gray-200">
          {recentPosts.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Nenhum post ainda. Crie seu primeiro post!</p>
              <Link
                href="/admin/posts/new"
                className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-medium"
              >
                Criar Post →
              </Link>
            </div>
          ) : (
            recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/admin/posts/${post.id}`}
                className="block px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {post.categories && (
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                          {post.categories.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.created_at && formatDate(post.created_at)}
                      </span>
                      {post.published ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          Publicado
                        </span>
                      ) : post.scheduled_at ? (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                          Agendado
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          Rascunho
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Recent Appointments */}
      {recentAppointments.length > 0 && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 mt-8">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Agendamentos Recentes</h2>
            <Link
              href="/admin/appointments"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Ver todos →
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentAppointments.map((appointment) => {
              const appointmentDate = new Date(appointment.appointment_date);
              return (
                <div
                  key={appointment.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {appointment.service_name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{appointment.name}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {appointmentDate.toLocaleDateString("pt-PT")} às {appointment.appointment_time}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          appointment.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                          appointment.status === "confirmed" ? "bg-green-100 text-green-700" :
                          appointment.status === "cancelled" ? "bg-red-100 text-red-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {appointment.status === "pending" ? "Pendente" :
                           appointment.status === "confirmed" ? "Confirmado" :
                           appointment.status === "cancelled" ? "Cancelado" : "Concluído"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 flex gap-4">
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          <FileText className="w-5 h-5" />
          Criar Novo Post
        </Link>
        <Link
          href="/admin/appointments"
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          <Calendar className="w-5 h-5" />
          Ver Agendamentos
        </Link>
      </div>
    </div>
  );
}

