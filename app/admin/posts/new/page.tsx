"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Save, Eye } from "lucide-react";
import Editor from "@/components/Editor";
import { slugify } from "@/lib/utils";

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category_id: "",
    featured_image_url: "",
    published: false,
    published_at: "",
    scheduled_at: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.title) {
      const generatedSlug = slugify(formData.title);
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const postData = {
        ...formData,
        category_id: formData.category_id || null,
        published_at: formData.published && !formData.published_at
          ? new Date().toISOString()
          : formData.published_at || null,
        scheduled_at: formData.scheduled_at || null,
      };

      const insertData: any = [postData];
      const { data, error } = await supabase
        .from("posts")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      router.push("/admin/posts");
    } catch (error: any) {
      console.error("Error creating post:", error);
      alert(error.message || "Erro ao criar post");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Posts
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Novo Post</h1>
        <p className="text-gray-600 mt-2">Crie uma nova notícia ou artigo</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Título *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ex: Nova Lei AIMA 2025"
            />
          </div>

          {/* Slug */}
          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Slug (URL) *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="nova-lei-aima-2025"
            />
            <p className="mt-1 text-sm text-gray-500">
              URL amigável para o post (gerado automaticamente a partir do título)
            </p>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category_id"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Categoria
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Excerpt */}
          <div>
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Resumo (Excerpt)
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              value={formData.excerpt}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Breve descrição do post que aparecerá na listagem..."
            />
          </div>

          {/* Featured Image */}
          <div>
            <label
              htmlFor="featured_image_url"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              URL da Imagem Destacada
            </label>
            <input
              type="url"
              id="featured_image_url"
              name="featured_image_url"
              value={formData.featured_image_url}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="https://exemplo.com/imagem.jpg"
            />
            <p className="mt-1 text-sm text-gray-500">
              URL completa da imagem que aparecerá como destaque
            </p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conteúdo *
            </label>
            <Editor
              value={formData.content}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, content: value }))
              }
            />
          </div>

          {/* Publishing Options */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Opções de Publicação
            </h3>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    published: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label
                htmlFor="published"
                className="ml-2 text-sm font-medium text-gray-700"
              >
                Publicar imediatamente
              </label>
            </div>

            {!formData.published && (
              <div>
                <label
                  htmlFor="scheduled_at"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Agendar Publicação
                </label>
                <input
                  type="datetime-local"
                  id="scheduled_at"
                  name="scheduled_at"
                  value={formData.scheduled_at}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="mt-1 text-sm text-gray-500">
                  O post será publicado automaticamente nesta data
                </p>
              </div>
            )}

            {formData.published && (
              <div>
                <label
                  htmlFor="published_at"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Data de Publicação
                </label>
                <input
                  type="datetime-local"
                  id="published_at"
                  name="published_at"
                  value={formData.published_at}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/posts"
            className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {loading ? "Salvando..." : "Salvar Post"}
          </button>
        </div>
      </form>
    </div>
  );
}

