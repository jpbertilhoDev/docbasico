"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Calendar, ArrowRight, Filter, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import SearchBar from "@/components/SearchBar";
import { PostSkeleton } from "@/components/LoadingSkeleton";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  categories: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function NoticiasPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Buscar categorias
  useEffect(() => {
    async function fetchCategories() {
      try {
        const baseUrl = window.location.origin;
        const res = await fetch(`${baseUrl}/api/categories`);
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  // Buscar posts com debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const baseUrl = window.location.origin;
        const params = new URLSearchParams();

        if (selectedCategory) {
          params.append('category', selectedCategory);
        }

        if (searchQuery.trim()) {
          params.append('search', searchQuery.trim());
        }

        const res = await fetch(`${baseUrl}/api/posts?${params.toString()}`, {
          cache: 'no-store'
        });
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCategoryChange = useCallback((categorySlug: string) => {
    setSelectedCategory(categorySlug === selectedCategory ? "" : categorySlug);
  }, [selectedCategory]);

  const clearFilters = useCallback(() => {
    setSelectedCategory("");
    setSearchQuery("");
  }, []);

  const hasActiveFilters = selectedCategory || searchQuery.trim();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Profissional */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 text-gray-900 tracking-tight">
            Notícias e <span className="text-primary-600">Atualizações</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Mantenha-se informado sobre mudanças nas leis, processos e regulamentações
            que afetam imigrantes em Portugal.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-10 space-y-6">
          {/* Search Bar */}
          <div className="w-full max-w-xl mx-auto">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Pesquisar notícias..."
              isLoading={loading}
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                {showFilters ? "Ocultar filtros" : "Filtrar por categoria"}
              </button>

              {hasActiveFilters && (
                <>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    Limpar tudo
                  </button>
                </>
              )}
            </div>

            {/* Category Buttons - Minimalista */}
            {showFilters && (
              <div className="flex flex-wrap justify-center gap-2 animate-fade-in">
                <button
                  onClick={() => handleCategoryChange("")}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${!selectedCategory
                      ? "bg-primary-600 text-white shadow-md shadow-primary-600/20 translate-y-[-1px]"
                      : "bg-white text-gray-600 hover:bg-gray-50 hover:text-primary-600 border border-gray-200 hover:border-primary-200"
                    }`}
                >
                  Todas
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.slug)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${selectedCategory === category.slug
                        ? "bg-primary-600 text-white shadow-md shadow-primary-600/20 translate-y-[-1px]"
                        : "bg-white text-gray-600 hover:bg-gray-50 hover:text-primary-600 border border-gray-200 hover:border-primary-200"
                      }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-gray-500">Filtros:</span>
              {searchQuery.trim() && (
                <span className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded">
                  "{searchQuery}"
                </span>
              )}
              {selectedCategory && (
                <span className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded">
                  {categories.find(c => c.slug === selectedCategory)?.name}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">A carregar...</p>
          </div>
        )}

        {/* Posts List */}
        {!loading && posts.length === 0 ? (
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-12 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold mb-3 text-gray-900">
              {hasActiveFilters
                ? "Nenhuma notícia encontrada"
                : "Nenhuma notícia publicada ainda"}
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {hasActiveFilters
                ? "Não encontramos resultados para sua busca. Tente palavras-chave diferentes ou remova os filtros."
                : "Estamos a preparar conteúdo relevante para você. Volte em breve!"}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-primary-600 font-bold hover:text-primary-700 hover:underline"
              >
                Limpar todos os filtros
              </button>
            )}
          </div>
        ) : !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/noticias/${post.slug}`}
                className="group flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-primary-600 hover:shadow-xl transition-all duration-300 h-full"
              >
                {post.featured_image_url && (
                  <div className="aspect-[16/9] bg-gray-100 overflow-hidden relative">
                    <img
                      src={post.featured_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                    {post.categories && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-white/95 backdrop-blur-sm text-primary-700 text-xs font-bold rounded-lg shadow-sm">
                        {post.categories.name}
                      </span>
                    )}
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  {!post.featured_image_url && post.categories && (
                    <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-lg mb-4 self-start">
                      {post.categories.name}
                    </span>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{post.published_at && formatDate(post.published_at)}</span>
                  </div>

                  <h2 className="text-lg font-bold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed flex-grow">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex items-center text-primary-600 font-bold text-sm mt-auto pt-4 border-t border-gray-100 group-hover:border-primary-100 transition-colors">
                    Ler artigo completo
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && posts.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-600">
            {posts.length} {posts.length === 1 ? "notícia encontrada" : "notícias encontradas"}
          </div>
        )}
      </div>
    </div>
  );
}
