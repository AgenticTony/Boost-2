import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useArticles } from '../hooks/useArticles';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function ArticleDetail() {
  const { slug } = useParams();
  const { data: articles, isLoading, error } = useArticles();
  
  const article = articles?.find((a: any) => a.slug === slug);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12 pt-24">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="py-8 pt-24">
        <ErrorMessage message="Kunde inte ladda artikeln." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.title} | Boost by FCR</title>
      </Helmet>
      
      <article className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <div className="flex gap-4 text-gray-600 mb-8">
          {article.readTime && <span>{article.readTime} min läsning</span>}
          {article.category && <span className="text-boost-gold">{article.category}</span>}
        </div>
        {article.summary && (
          <div className="text-xl text-gray-700 mb-8 border-l-4 border-boost-gold pl-4">
            {article.summary}
          </div>
        )}
        {article.content?.html && (
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content.html }} />
        )}
      </article>
    </>
  );
}
