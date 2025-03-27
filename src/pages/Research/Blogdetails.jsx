import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBlogs, setAPILanguage } from '../../services/api';
import { useTranslation } from 'react-i18next';
import CardArticles from '../Markets&Resources/components/CardArticles';

const BlogDetails = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        setAPILanguage(i18n.language);
        const blogs = await getBlogs();
        const foundBlog = blogs.find(b => b.slug === slug);
        if (foundBlog) {
          setBlog(foundBlog);
        } else {
          setError(t('blog.notFound'));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [slug, t, i18n.language]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB2632]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
        <p className="text-gray-600">{t('blog.notFound')}</p>
      </div>
    );
  }

  const imageGroups = [];
  if (blog.images && blog.images.length > 0) {
    for (let i = 0; i < blog.images.length; i += 3) {
      imageGroups.push(blog.images.slice(i, i + 3));
    }
  }

  return (
    <div className="container mx-auto px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <article className="max-w-full mx-5 bg-white overflow-hidden my-12 px-5">
        <div className="p-6 md:p-8">
          {/* التصنيفات */}
          {blog.categories && blog.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.categories.map((category, index) => (
                <span
                  key={index}
                        className="bg-white text-[#BB2632] border border-[#BB2632] px-4 py-1 rounded-full text-sm font-medium hover:bg-[#BB2632] hover:text-white "
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          {/* العنوان */}
          <h1 className="text-4xl font-bold text-gray-900 mb-8">{blog.title}</h1>

          {/* معلومات الكاتب */}
          <div className="mb-8 pb-6  border-gray-200">
            <h3 className="font-semibold text-gray-900 text-xl">{blog.author_name}</h3>
            {blog.author_position && (
              <p className="text-gray-600 mt-2">{blog.author_position}</p>
            )}
          </div>

          {/* الوصف الأول */}
          {blog.first_description && (
            <div className="mb-12 text-lg text-gray-700 leading-relaxed">
              <p>{blog.first_description}</p>
            </div>
          )}

          {/* صورة الغلاف */}
          <div className="mb-12">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
              <img
                src={blog.cover_image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* الوصف الثاني */}
          {blog.second_description && (
            <div className="mb-12 text-lg text-gray-700 leading-relaxed">
              <p>{blog.second_description}</p>
            </div>
          )}

          {/* الصور الإضافية */}
          {imageGroups.length > 0 && (
            <div className="mb-12 space-y-8">
              {imageGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {group.map((image, index) => (
                    <div key={index} className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={image.image}
                        alt={image.alt_text || blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* الوصف الثالث */}
          {blog.third_description && (
            <div className="text-lg text-gray-700 leading-relaxed">
              <p>{blog.third_description}</p>
            </div>
          )}
        </div>
      </article>
      <CardArticles />
    </div>
  );
};

export default BlogDetails;  